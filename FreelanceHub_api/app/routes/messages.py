"""
app/routes/messages.py
Routes REST pour les conversations et messages.
Enregistré sous /api/client dans __init__.py
"""
from flask import Blueprint, request, jsonify
from app.extensions import db
from bson import ObjectId
from datetime import datetime, timezone

messages_bp = Blueprint('messages', __name__)


def get_current_user():
    """Récupère l'utilisateur depuis le header Authorization: Bearer <user_id>"""
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    user_id = auth.split(' ')[1]
    try:
        return db.users.find_one({'_id': ObjectId(user_id)})
    except Exception:
        return None


def fmt_conv(conv, current_user_id: str):
    """Formate une conversation pour le frontend Angular."""
    # Trouver l'autre participant
    other_id = next(
    (p for p in conv.get('participants', []) if str(p) != str(current_user_id)),
        None
    )
    other_user = None
    if other_id:
        try:
            other_user = db.users.find_one({'_id': ObjectId(other_id)})
        except Exception:
            pass

    name     = 'Unknown'
    initials = '?'
    color    = 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)'

    if other_user:
        first = other_user.get('firstName', '')
        last  = other_user.get('lastName', '')
        name  = f"{first} {last}".strip() or other_user.get('email', 'Unknown')
        initials = (first[:1] + last[:1]).upper() if first or last else '?'

    updated = conv.get('updatedAt', datetime.now(timezone.utc))
    now     = datetime.now(timezone.utc)
    diff    = (now - updated.replace(tzinfo=timezone.utc) if updated.tzinfo is None else now - updated)

    if diff.days == 0:
        time_str = updated.strftime('%H:%M')
    elif diff.days == 1:
        time_str = 'Yesterday'
    elif diff.days < 7:
        time_str = updated.strftime('%a')
    else:
        time_str = updated.strftime('%d/%m')

    return {
        '_id':         str(conv['_id']),
        'name':        name,
        'initials':    initials,
        'avatarColor': color,
        'lastMessage': conv.get('lastMessage', ''),
        'time':        time_str,
        'unread':      conv.get('unreadCount', 0),
        'online':      False,
        'freelancerId': other_id or '',
    }


def fmt_msg(msg, current_user_id: str):
    """Formate un message pour le frontend."""
    created = msg.get('createdAt', datetime.now(timezone.utc))
    return {
        '_id':      str(msg['_id']),
        'text':     msg.get('text', ''),
        'mine':     str(msg.get('senderId', '')) == current_user_id,
        'time':     created.strftime('%H:%M') if created else '',
        'senderId': str(msg.get('senderId', '')),
    }


# ── GET /api/client/messages ─────────────────────────────────────────────────
@messages_bp.route('/messages', methods=['GET'])
def get_conversations():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    uid = str(user['_id'])
    convs = list(db.conversations.find({'participants': uid}).sort('updatedAt', -1))
    return jsonify([fmt_conv(c, uid) for c in convs])


# ── GET /api/client/messages/<id> ────────────────────────────────────────────
@messages_bp.route('/messages/<conversation_id>', methods=['GET'])
def get_messages(conversation_id):
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    uid = str(user['_id'])

    # Vérifier que l'utilisateur est bien dans cette conversation
    try:
        conv = db.conversations.find_one({'_id': ObjectId(conversation_id)})
    except Exception:
        return jsonify({'error': 'Invalid conversation id'}), 400

    if not conv or uid not in conv.get('participants', []):
        return jsonify({'error': 'Forbidden'}), 403

    msgs = list(db.messages.find({'conversationId': conversation_id}).sort('createdAt', 1))

    # Marquer comme lu
    db.conversations.update_one(
        {'_id': ObjectId(conversation_id)},
        {'$set': {'unreadCount': 0}}
    )

    return jsonify([fmt_msg(m, uid) for m in msgs])


# ── POST /api/client/messages/start ──────────────────────────────────────────
@messages_bp.route('/messages/start', methods=['POST'])
def start_conversation():
    """Crée ou retrouve une conversation entre le client et un freelancer."""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401

    uid          = str(user['_id'])
    freelancer_id = request.json.get('freelancerId')
    if not freelancer_id:
        return jsonify({'error': 'freelancerId required'}), 400

    # Vérifier que le freelancer existe
    try:
        freelancer = db.users.find_one({'_id': ObjectId(freelancer_id)})
    except Exception:
        return jsonify({'error': 'Invalid freelancerId'}), 400

    if not freelancer:
        return jsonify({'error': 'Freelancer not found'}), 404

    # Chercher une conversation existante entre ces deux utilisateurs
    existing = db.conversations.find_one({
        'participants': {'$all': [uid, freelancer_id]}
    })

    if existing:
        return jsonify({'conversationId': str(existing['_id'])})

    # Créer une nouvelle conversation
    now = datetime.now(timezone.utc)
    result = db.conversations.insert_one({
        'participants':  [uid, freelancer_id],
        'lastMessage':   '',
        'unreadCount':   0,
        'createdAt':     now,
        'updatedAt':     now,
    })

    return jsonify({'conversationId': str(result.inserted_id)}), 201