from flask import request 
from flask_socketio import join_room, leave_room, emit
from app.extensions import socketio, db
from bson import ObjectId
from datetime import datetime, timezone


# ─── Utility ──────────────────────────────────────────────────────────────────

def send_notification(user_id: str, notification: dict):
    """Call this from any Flask route to push a notification to a user."""
    socketio.emit("notification", notification, room=user_id)


# ✅ REMPLACER la fonction par :
def _get_user_from_token(token: str):
    """Le token est directement l'_id MongoDB."""
    try:
        user = db.users.find_one({"_id": ObjectId(token)})
        return user
    except Exception:
        return None

# ─── Connection ───────────────────────────────────────────────────────────────

@socketio.on("connect")
def on_connect():
    token = request_args_token()
    if not token:
        return False  # reject connection

    user = _get_user_from_token(token)
    if not user:
        return False  # reject if invalid token

    user_id = str(user["_id"])
    join_room(user_id)          # personal room for notifications
    emit("connected", {"userId": user_id})
    print(f"[Socket] {user_id} connected")


@socketio.on("disconnect")
def on_disconnect():
    print("[Socket] client disconnected")


def request_args_token():
    """Extract token from the socket handshake query string."""
    from flask import request
    return request.args.get("token")


# ─── Conversation Rooms ───────────────────────────────────────────────────────

@socketio.on("join_conversation")
def on_join(data):
    conversation_id = data.get("conversationId")
    if not conversation_id:
        return
    join_room(conversation_id)
    emit("joined_conversation", {"conversationId": conversation_id})
    print(f"[Socket] joined room {conversation_id}")


@socketio.on("leave_conversation")
def on_leave(data):
    conversation_id = data.get("conversationId")
    if not conversation_id:
        return
    leave_room(conversation_id)
    print(f"[Socket] left room {conversation_id}")


# ─── Messaging ────────────────────────────────────────────────────────────────

@socketio.on("send_message")
def on_send_message(data):
    conversation_id = data.get("conversationId")
    text            = data.get("text", "").strip()
    token           = data.get("token")

    if not conversation_id or not text or not token:
        emit("error", {"msg": "Missing fields"})
        return

    sender = _get_user_from_token(token)
    if not sender:
        emit("error", {"msg": "Unauthorized"})
        return

    sender_id = str(sender["_id"])
    now       = datetime.now(timezone.utc)

    # Persist message to MongoDB
    message_doc = {
        "conversationId": conversation_id,
        "senderId":       sender_id,
        "text":           text,
        "createdAt":      now,
        "read":           False,
    }
    result = db.messages.insert_one(message_doc)
    message_id = str(result.inserted_id)

    # Update conversation's lastMessage
    db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {
            "lastMessage": text,
            "updatedAt":   now,
        }, "$inc": {"unreadCount": 1}}
    )

    # Fetch conversation to find the OTHER participant
    conversation = db.conversations.find_one({"_id": ObjectId(conversation_id)})
    if conversation:
        participants = conversation.get("participants", [])
        other_ids = [p for p in participants if p != sender_id]

        # Emit to everyone in the room (sender gets mine=True, receiver mine=False)
        socketio.emit(
        "new_message",
       {
        "_id":      message_id,
        "text":     text,
        "time":     now.strftime("%H:%M"),
        "senderId": sender_id,
        },
           room=conversation_id
    );

        # Push notification to the other participant(s)
        sender_name = f"{sender.get('firstName', '')} {sender.get('lastName', '')}".strip()
        for other_id in other_ids:
            send_notification(other_id, {
                "type":        "message",
                "title":       f"New message from {sender_name}",
                "description": text[:60],
            })


# ─── Typing Indicator ─────────────────────────────────────────────────────────

@socketio.on("typing")
def on_typing(data):
    conversation_id = data.get("conversationId")
    is_typing       = data.get("isTyping", False)

    if not conversation_id:
        return

    # Broadcast to everyone else in the room
    emit(
        "user_typing",
        {"conversationId": conversation_id, "isTyping": is_typing},
        room=conversation_id,
        include_self=False
    )