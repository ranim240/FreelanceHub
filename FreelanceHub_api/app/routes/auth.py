from flask import Blueprint, request, jsonify
from app.extensions import db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400

    email = data.get("email")
    password = data.get("password")
    firstName = data.get("firstName")

    if not email or not password:
        return jsonify({"error": "L'email et le mot de passe sont obligatoires"}), 400

    # Vérifier si l'utilisateur existe déjà
    if db.users.find_one({"email": email}):
        return jsonify({"error": "Cet email est déjà utilisé par un autre compte"}), 400

    # Insertion dans la base de données MongoDB
    result = db.users.insert_one(data)
    
    print(f"✅ Nouvel utilisateur inscrit dans MongoDB : {email}")
    
    return jsonify({
        "message": f"Félicitations {firstName}, votre compte a été créé avec succès !"
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400

    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email, "password": password})
    
    if user:
        # On retourne le prénom pour l'affichage dans le frontend
        return jsonify({
            "message": "Connexion réussie !", 
            "user": user.get("firstName", "Utilisateur")
        }), 200
    
    return jsonify({"error": "Identifiants incorrects"}), 401
