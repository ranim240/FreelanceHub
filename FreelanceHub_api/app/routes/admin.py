from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db
from datetime import datetime

# Blueprint admin
admin_bp = Blueprint("admin", __name__)

# ─── Helpers ───────────────────────────────────────────────
def serialize_doc(doc):
    """Convertit un document MongoDB en dict JSON-compatible."""
    if doc is None:
        return None
    doc["_id"] = str(doc["_id"])
    if "password" in doc:
        del doc["password"]
    return doc


# ═══════════════════════════════════════════════════════════
#  STATS
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/stats", methods=["GET"])
def get_stats():
    """Statistiques globales du dashboard admin."""
    total_users = db.users.count_documents({})
    total_freelancers = db.users.count_documents({"role": "freelancer"})
    total_clients = db.users.count_documents({"role": "client"})
    pending_freelancers = db.users.count_documents({"role": "freelancer", "status": "pending"})
    blocked_users = db.users.count_documents({"status": "blocked"})
    total_products = db.products.count_documents({})
    total_announcements = db.announcements.count_documents({})
    total_categories = db.categories.count_documents({})
    pending_reports = db.reports.count_documents({"status": "pending"})

    return jsonify({
        "totalUsers": total_users,
        "totalFreelancers": total_freelancers,
        "totalClients": total_clients,
        "pendingFreelancers": pending_freelancers,
        "blockedUsers": blocked_users,
        "totalProducts": total_products,
        "totalAnnouncements": total_announcements,
        "totalCategories": total_categories,
        "pendingReports": pending_reports,
    }), 200


# ═══════════════════════════════════════════════════════════
#  USERS
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/users", methods=["GET"])
def get_users():
    """Liste des utilisateurs avec filtres optionnels."""
    query = {}
    role = request.args.get("role")
    if role:
        query["role"] = role
    status = request.args.get("status")
    if status:
        query["status"] = status
    search = request.args.get("search")
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    users = list(db.users.find(query).sort("createdAt", -1))
    return jsonify([serialize_doc(u) for u in users]), 200


@admin_bp.route("/admin/users/<user_id>/status", methods=["PUT"])
def update_user_status(user_id):
    """Change le statut d'un utilisateur (active / blocked / pending)."""
    data = request.get_json()
    new_status = data.get("status")
    if new_status not in ("active", "blocked", "pending"):
        return jsonify({"error": "Statut invalide"}), 400

    try:
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": new_status, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        return jsonify({"error": "ID invalide"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": f"Status updated: {new_status}"}), 200


@admin_bp.route("/admin/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    """Supprime un utilisateur."""
    try:
        result = db.users.delete_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"}), 200


# ═══════════════════════════════════════════════════════════
#  FREELANCERS — VALIDATION
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/freelancers/pending", methods=["GET"])
def get_pending_freelancers():
    """Freelancers en attente de validation."""
    freelancers = list(db.users.find({"role": "freelancer", "status": "pending"}).sort("createdAt", -1))
    return jsonify([serialize_doc(f) for f in freelancers]), 200


@admin_bp.route("/admin/freelancers/<user_id>/validate", methods=["PUT"])
def validate_freelancer(user_id):
    """Approuver ou refuser un freelancer."""
    data = request.get_json()
    action = data.get("action")  # "approve" ou "reject"
    if action not in ("approve", "reject"):
        return jsonify({"error": "Action invalide (approve / reject)"}), 400

    new_status = "active" if action == "approve" else "rejected"
    try:
        result = db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": new_status, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Freelancer not found"}), 404
    return jsonify({"message": f"Freelancer {action}d"}), 200


# ═══════════════════════════════════════════════════════════
#  PRODUCTS
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/products", methods=["GET"])
def get_products():
    """Tous les produits."""
    products = list(db.products.find().sort("_id", -1))
    return jsonify([serialize_doc(p) for p in products]), 200


@admin_bp.route("/admin/products/<product_id>/status", methods=["PUT"])
def update_product_status(product_id):
    """Approuver ou refuser un produit."""
    data = request.get_json()
    new_status = data.get("status")
    if new_status not in ("approved", "rejected", "pending"):
        return jsonify({"error": "Statut invalide"}), 400

    try:
        result = db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"moderationStatus": new_status}}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": f"Product: {new_status}"}), 200


@admin_bp.route("/admin/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    """Supprime un produit."""
    try:
        result = db.products.delete_one({"_id": ObjectId(product_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted"}), 200


# ═══════════════════════════════════════════════════════════
#  ANNOUNCEMENTS
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/announcements", methods=["GET"])
def get_announcements():
    """Toutes les annonces."""
    announcements = list(db.announcements.find().sort("_id", -1))
    return jsonify([serialize_doc(a) for a in announcements]), 200


@admin_bp.route("/admin/announcements/<ann_id>", methods=["DELETE"])
def delete_announcement(ann_id):
    """Supprime une annonce."""
    try:
        result = db.announcements.delete_one({"_id": ObjectId(ann_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Announcement not found"}), 404
    return jsonify({"message": "Announcement deleted"}), 200


# ═══════════════════════════════════════════════════════════
#  CATEGORIES
# ═══════════════════════════════════════════════════════════

@admin_bp.route("/admin/categories", methods=["GET"])
def get_categories():
    """Toutes les catégories."""
    categories = list(db.categories.find())
    return jsonify([serialize_doc(c) for c in categories]), 200


@admin_bp.route("/admin/categories", methods=["POST"])
def create_category():
    """Crée une nouvelle catégorie."""
    data = request.get_json()
    if not data or not data.get("name"):
        return jsonify({"error": "Name is required"}), 400

    cat = {
        "name": data["name"],
        "icon": data.get("icon", "pricetag-outline"),
        "active": False
    }
    result = db.categories.insert_one(cat)
    cat["_id"] = str(result.inserted_id)
    return jsonify(cat), 201


@admin_bp.route("/admin/categories/<cat_id>", methods=["PUT"])
def update_category(cat_id):
    """Met à jour une catégorie."""
    data = request.get_json()
    update_fields = {}
    if "name" in data:
        update_fields["name"] = data["name"]
    if "icon" in data:
        update_fields["icon"] = data["icon"]

    if not update_fields:
        return jsonify({"error": "Nothing to update"}), 400

    try:
        result = db.categories.update_one(
            {"_id": ObjectId(cat_id)},
            {"$set": update_fields}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Category not found"}), 404
    return jsonify({"message": "Category updated"}), 200


@admin_bp.route("/admin/categories/<cat_id>", methods=["DELETE"])
def delete_category(cat_id):
    """Supprime une catégorie."""
    try:
        result = db.categories.delete_one({"_id": ObjectId(cat_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Category not found"}), 404
    return jsonify({"message": "Category deleted"}), 200
