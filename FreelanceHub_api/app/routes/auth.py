<<<<<<< HEAD
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
=======
from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db
from app import mail
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random
import string
from flask_mail import Message

#creation de blueprint 
auth_bp = Blueprint("auth", __name__)

#----Fontion utilitaires----
def serialize_user(user):
    """Convertit un document MongoDB en dict JSON-compatible."""
    if user is None:
        return None
    user["_id"] = str(user["_id"])
    # Ne pas renvoyer le mot de passe
    if "password" in user:
        del user["password"]
    return user

# POST /api/auth/register
@auth_bp.route("/auth/register", methods=["POST"])
def register():
    """Crée un nouvel utilisateur."""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    
    # Extraction des données
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    first_name = data.get("firstName", "").strip()
    last_name = data.get("lastName", "").strip()
    
    # Validation
    if not email or not password:
        return jsonify({"error": "L'email et le mot de passe sont obligatoires"}), 400
    
    if len(password) < 6:
        return jsonify({"error": "Le mot de passe doit contenir au moins 6 caractères"}), 400
    
    # Vérifier si l'utilisateur existe déjà
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Cet email est déjà utilisé"}), 400
    
    # Créer l'utilisateur avec mot de passe hashé
    user_data = {
        "email": email,
        "password": generate_password_hash(password),  # Hash du mot de passe
        "firstName": first_name,
        "lastName": last_name,
        "username": data.get("username", ""),
        "role": data.get("role", "client"),  # Par défaut client
        "domain": data.get("domain", ""),
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    result = db.users.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    
    # Supprimer le mot de passe de la réponse
    del user_data["password"]
    
    print(f"✅ Nouvel utilisateur inscrit : {email}")
    
    return jsonify({
        "message": f"Félicitations {first_name}, votre compte a été créé avec succès !",
        "user": user_data
    }), 201


# POST /api/auth/login
@auth_bp.route("/auth/login", methods=["POST"])
def login():
    """Authentifie un utilisateur."""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    if not email or not password:
        return jsonify({"error": "L'email et le mot de passe sont obligatoires"}), 400
    
    # Rechercher l'utilisateur
    user = db.users.find_one({"email": email})
    
    if not user:
        # user does not exist
        return jsonify({"error": "Aucun compte trouvé pour cet email."}), 401
    
    # Vérifier le mot de passe
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Mot de passe incorrect."}), 401
    
    # Connexion réussie
    user_data = serialize_user(user)
    
    return jsonify({
        "message": "Connexion réussie !",
        "user": user_data
    }), 200


# GET /api/auth/user/<user_id>
@auth_bp.route("/auth/user/<user_id>", methods=["GET"])
def get_user(user_id):
    """Retourne un utilisateur par son ID."""
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "ID invalide"}), 400
    
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    return jsonify(serialize_user(user)), 200


# POST /api/auth/forgot-password
@auth_bp.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    """Gère la demande de réinitialisation de mot de passe."""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    
    # Extraction de l'email
    email = data.get("email", "").strip().lower()
    
    # Validation de l'email
    if not email:
        return jsonify({"error": "L'email est obligatoire"}), 400
    
    # Vérification si l'utilisateur existe
    user = db.users.find_one({"email": email})
    
    if not user:
        # Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
        return jsonify({
            "message": "Si cet email existe dans notre système, un code de vérification sera envoyé"
        }), 200
    
    # Générer un code de vérification à 6 chiffres
    verification_code = ''.join(random.choices(string.digits, k=6))
    
    # Stocker le code de vérification dans la base de données avec expiration (15 minutes)
    expiry_time = datetime.utcnow() + timedelta(minutes=15)
    db.users.update_one(
        {"email": email},
        {"$set": {"reset_code": verification_code, "reset_code_expiry": expiry_time}}
    )
    
    try:
        # Envoyer l'email avec le code de vérification
        msg = Message(
            subject="Code de vérification - Réinitialisation du mot de passe",
            recipients=[email],
            body=f"""Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe.

Votre code de vérification est : {verification_code}

Ce code est valide pendant 15 minutes.

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Cordialement,
L'équipe FreelanceHub"""
        )
        mail.send(msg)
        print(f"✅ Code de vérification envoyé à {email}: {verification_code}")
    except Exception as e:
        # En cas d'erreur d'envoi d'email, afficher le code dans la console comme fallback
        print(f"❌ Erreur lors de l'envoi de l'email: {str(e)}")
        print(f"📧 CODE DE VÉRIFICATION POUR DÉBOGAGE - {email}: {verification_code}")
        # Retourner quand même le code dans la réponse pour les tests
        return jsonify({
            "message": f"Code de vérification: {verification_code} (Service email temporairement indisponible)",
            "debug_code": verification_code  # À retirer en production
        }), 200
    
    return jsonify({
        "message": "Un code de vérification a été envoyé à votre adresse email"
    }), 200


# POST /api/auth/verify-code
@auth_bp.route("/auth/verify-code", methods=["POST"])
def verify_code():
    """Vérifie le code de vérification et permet la réinitialisation du mot de passe."""
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()
    new_password = data.get("newPassword", "")
    
    if not email or not code:
        return jsonify({"error": "L'email et le code sont obligatoires"}), 400
    
    # Vérifier l'utilisateur
    user = db.users.find_one({"email": email})
    
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    # Vérifier le code et son expiration
    stored_code = user.get("reset_code")
    expiry = user.get("reset_code_expiry")
    
    if not stored_code or not expiry:
        return jsonify({"error": "Aucun code de vérification trouvé. Veuillez refaire une demande."}), 400
    
    if datetime.utcnow() > expiry:
        return jsonify({"error": "Le code a expiré. Veuillez refaire une demande."}), 400
    
    if stored_code != code:
        return jsonify({"error": "Code de vérification incorrect"}), 400
    
    # Si un nouveau mot de passe est fourni, le mettre à jour
    if new_password:
        if len(new_password) < 6:
            return jsonify({"error": "Le mot de passe doit contenir au moins 6 caractères"}), 400
        
        # Mettre à jour le mot de passe
        hashed_password = generate_password_hash(new_password)
        db.users.update_one(
            {"email": email},
            {"$set": {"password": hashed_password}, "$unset": {"reset_code": "", "reset_code_expiry": ""}}
        )
        
        return jsonify({
            "message": "Mot de passe réinitialisé avec succès!"
        }), 200
    
    # Si pas de nouveau mot de passe, simplement confirmer que le code est valide
    return jsonify({
        "message": "Code de vérification valide. Vous pouvez maintenant entrer votre nouveau mot de passe.",
        "verified": True
    }), 200
>>>>>>> origin/test_fusion
