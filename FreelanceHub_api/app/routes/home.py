from flask import Blueprint, jsonify
from app.extensions import db
from app.utils.helpers import serialize_doc
from bson import ObjectId

home_bp = Blueprint('home_bp', __name__)

@home_bp.route('/announcements', methods=['GET'])
def get_announcements():
    """Récupère toutes les annonces."""
    announcements = list(db.announcements.find())
    return jsonify([serialize_doc(a) for a in announcements]), 200

@home_bp.route('/announcements/<id>', methods=['GET'])
def get_announcement(id):
    """Récupère une annonce par son ID."""
    try:
        announcement = db.announcements.find_one({"_id": ObjectId(id)})
        if not announcement:
            return jsonify({"message": "Annonce introuvable"}), 404
        return jsonify(serialize_doc(announcement)), 200
    except Exception as e:
        return jsonify({"message": "ID invalide"}), 400

@home_bp.route('/categories', methods=['GET'])
def get_categories():
    """Récupère toutes les catégories."""
    categories = list(db.categories.find())
    return jsonify([serialize_doc(c) for c in categories]), 200

@home_bp.route('/faqs', methods=['GET'])
def get_faqs():
    """Récupère toutes les FAQs."""
    faqs = list(db.faqs.find())
    return jsonify([serialize_doc(f) for f in faqs]), 200
