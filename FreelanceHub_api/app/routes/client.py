from flask import Blueprint, jsonify, request, g
from bson import ObjectId
from datetime import datetime
from app.extensions import db
from app.utils.helpers import serialize_doc, require_login

client_bp = Blueprint("client", __name__, url_prefix="/client")


def _authenticate():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, (jsonify({'error': 'Token required'}), 401)
    token = auth_header.split(' ')[1]
    try:
        user = db.users.find_one({'_id': ObjectId(token)})
        if not user:
            return None, (jsonify({'error': 'Invalid token'}), 401)
        g.current_user = user
        return user, None
    except Exception:
        return None, (jsonify({'error': 'Invalid token'}), 401)


# ── Announcements ──────────────────────────────────────────────────────────
@client_bp.route("/announcements/<client_id>", methods=["GET", "POST", "OPTIONS"])
@client_bp.route("/announcements/<client_id>/<ann_id>", methods=["DELETE", "OPTIONS"])
def announcements_handler(client_id, ann_id=None):
    if request.method == 'OPTIONS':
        return '', 200
    if request.method == 'DELETE' and ann_id:
        user, err = _authenticate()
        if err:
            return err
        if str(g.current_user["_id"]) != client_id:
            return jsonify({"error": "Unauthorized"}), 403
        try:
            client_obj_id = ObjectId(client_id)
            ann_obj_id = ObjectId(ann_id)
            result = db.announcements.delete_one({"_id": ann_obj_id, "clientId": client_obj_id})
            if result.deleted_count:
                return jsonify({"message": "Announcement deleted"}), 200
            else:
                return jsonify({"error": "Announcement not found"}), 404
        except:
            return jsonify({"error": "Invalid ID"}), 400

    if request.method == 'GET':
        user, err = _authenticate()
        if err:
            return err
        if str(g.current_user["_id"]) != client_id:
            return jsonify({"error": "Unauthorized"}), 403

        try:
            client_obj_id = ObjectId(client_id)
            announcements = list(db.announcements.find({"clientId": client_obj_id}).sort("_id", -1))
        except:
            return jsonify({"error": "Invalid client ID"}), 400
        stats = {
            "open":    len([a for a in announcements if a.get("status") == "open"]),
            "urgent":  len([a for a in announcements if a.get("status") == "urgent"]),
            "pending": len([a for a in announcements if a.get("status") == "pending"]),
            "closed":  len([a for a in announcements if a.get("status") == "closed"]),
            "total":   len(announcements)
        }
        return jsonify({
            "announcements": [serialize_doc(a) for a in announcements],
            "stats": stats
        }), 200
    if request.method == 'POST':
        user, err = _authenticate()
        if err:
            return err
        data = request.get_json()
        if not data:
            return jsonify({"error": "Data missing"}), 400
        try:
            client_obj_id = ObjectId(client_id)
        except:
            return jsonify({"error": "Invalid client ID"}), 400
        ann_data = {
            "clientId": client_obj_id,
            "title": data.get("title", ""),
            "category": data.get("category", ""),
            "description": data.get("description", ""),
            "skills": data.get("skills", []),
            "urgency": data.get("urgency", "open"),
            "budgetType": data.get("budgetType", "range"),
            "budgetFixed": data.get("budgetFixed", ""),
            "budgetMin": data.get("budgetMin", ""),
            "budgetMax": data.get("budgetMax", ""),
            "deadline": data.get("deadline", ""),
            "status": "open",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        result = db.announcements.insert_one(ann_data)
        ann_data["_id"] = str(result.inserted_id)
        return jsonify(serialize_doc(ann_data)), 201


# ── Notifications ──────────────────────────────────────────────────────────
@client_bp.route("/notifications/<client_id>", methods=["GET", "OPTIONS"])
def get_client_notifications(client_id):
    if request.method == 'OPTIONS':
        return '', 200
    user, err = _authenticate()
    if err:
        return err
    if str(g.current_user["_id"]) != client_id:
        return jsonify({"error": "Unauthorized"}), 403

    notifications = list(db.notifications.find({"userId": client_id}).sort("_id", -1).limit(50))
    unread_count = len([n for n in notifications if not n.get("read")])
    return jsonify({
        "notifications": [serialize_doc(n) for n in notifications],
        "unreadCount": unread_count
    }), 200


# ── Mark all notifications read ────────────────────────────────────────────
@client_bp.route("/notifications/<client_id>/read-all", methods=["PUT", "OPTIONS"])
def mark_all_notifications_read(client_id):
    if request.method == 'OPTIONS':
        return '', 200
    user, err = _authenticate()
    if err:
        return err
    if str(g.current_user["_id"]) != client_id:
        return jsonify({"error": "Unauthorized"}), 403

    result = db.notifications.update_many(
        {"userId": client_id, "read": {"$ne": True}},
        {"$set": {"read": True, "readAt": datetime.utcnow()}}
    )
    return jsonify({"message": f"{result.modified_count} notifications marked as read"}), 200


# ── Dashboard ──────────────────────────────────────────────────────────────
@client_bp.route("/dashboard/<client_id>", methods=["GET", "OPTIONS"])
def get_client_dashboard(client_id):
    if request.method == 'OPTIONS':
        return '', 200
    user, err = _authenticate()
    if err:
        return err
    if str(g.current_user["_id"]) != client_id:
        return jsonify({"error": "Unauthorized"}), 403

    # ✅ Fix: inclure le vrai count des freelancers dans les stats
    freelancers_count = db.users.count_documents(
        {"role": "freelancer", "status": {"$in": ["active", None]}}
    )

    try:
        client_obj_id = ObjectId(client_id)
        stats = {
            "announcements": db.announcements.count_documents({"clientId": client_obj_id}),
            "freelancers":   freelancers_count,
            "messages":      db.messages.count_documents({"to": client_id, "read": False}),
            "products":      db.products.count_documents({}),
        }
    except:
        stats = {
            "announcements": 0,
            "freelancers":   freelancers_count,
            "messages":      0,
            "products":      0,
        }

    try:
        client_obj_id = ObjectId(client_id)
        my_announcements = list(
            db.announcements.find({"clientId": client_obj_id}).sort("_id", -1).limit(5)
        )
    except:
        my_announcements = []

    # ✅ Fix: $ifNull évite le crash si 'completedProjects' est absent
    top_freelancers_pipeline = [
        {"$match": {"role": "freelancer"}},
        {"$addFields": {
            "totalProjects": {
                "$size": {"$ifNull": ["$completedProjects", []]}
            }
        }},
        {"$sort": {"totalProjects": -1, "rating": -1}},
        {"$limit": 5},
        {"$project": {
            "firstName": 1, "lastName": 1, "avatarUrl": 1, "bio": 1, "location": 1,
            "domain": 1, "rating": 1, "totalProjects": 1
        }}

    ]
    top_freelancers = list(db.users.aggregate(top_freelancers_pipeline))

    return jsonify({
        "stats":           stats,
        "myAnnouncements": [serialize_doc(a) for a in my_announcements],
        "topFreelancers":  [serialize_doc(f) for f in top_freelancers]
    }), 200


# ── Freelancers ────────────────────────────────────────────────────────────
@client_bp.route("/freelancers", methods=["GET", "OPTIONS"])
def get_freelancers():
    if request.method == 'OPTIONS':
        return '', 200

    domain = request.args.get('domain')
    query  = {"role": "freelancer", "status": {"$in": ["active", None]}}
    if domain:
        query["domain"] = {"$regex": domain, "$options": "i"}

    freelancers = list(db.users.find(
        query,
        {"password": 0, "reset_code": 0, "reset_code_expiry": 0}
    ).sort("firstName", 1))

    for f in freelancers:
        f["_id"] = str(f["_id"])

    return jsonify(freelancers), 200