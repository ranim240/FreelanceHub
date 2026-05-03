from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime
from app.extensions import db
from app.utils.helpers import serialize_doc

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
  """Charge le profil d'un utilisateur par ID (public)."""
  try:
    user_obj_id = ObjectId(user_id)
  except:
    return jsonify({"error": "ID invalide"}), 400

  user = db.users.find_one({"_id": user_obj_id})
  if not user:
    return jsonify({"error": "Profil non trouvé"}), 404

  profile_data = serialize_doc(user)
  profile_data["completionPercent"] = 0
  return jsonify(profile_data), 200

@profile_bp.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
  """Met à jour le profil (seulement owner)."""
  # Manual auth
  auth_header = request.headers.get('Authorization')
  if not auth_header or not auth_header.startswith('Bearer '):
    return jsonify({'error': 'Token required'}), 401
  token = auth_header.split(' ')[1]
  try:
    user_obj_id = ObjectId(token)
    current_user = db.users.find_one({'_id': user_obj_id})
    if not current_user:
      return jsonify({'error': 'Invalid token'}), 401
  except:
    return jsonify({'error': 'Invalid token'}), 401

  if str(current_user["_id"]) != user_id:
    return jsonify({"error": "Non autorisé"}), 403

  data = request.get_json()
  if not data:
    return jsonify({"error": "Données manquantes"}), 400

  allowed_updates = {
    "firstName", "lastName", "phone", "gender", "location",
    "bio", "domain", "avatarUrl", "linkedin", "portfolio"
  }
  update_data = {k: v for k, v in data.items() if k in allowed_updates}
  if not update_data:
    return jsonify({"error": "Aucun champ valide"}), 400

  update_data["updatedAt"] = datetime.utcnow()

  result = db.users.update_one(
    {"_id": ObjectId(user_id)},
    {"$set": update_data}
  )

  if result.matched_count == 0:
    return jsonify({"error": "Profil non trouvé"}), 404

  user = db.users.find_one({"_id": ObjectId(user_id)})
  return jsonify(serialize_doc(user)), 200
