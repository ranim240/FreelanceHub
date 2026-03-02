from flask import Blueprint, jsonify
from app.extensions import db
from bson.objectid import ObjectId

home_bp = Blueprint('home_bp', __name__)

def serialize_doc(doc):
    """Convertit ObjectId pour être JSON serialisable."""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

@home_bp.route('/announcements', methods=['GET'])
def get_announcements():
    """Récupère toutes les annonces."""
    announcements = list(db.announcements.find())
    return jsonify([serialize_doc(a) for a in announcements]), 200

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
