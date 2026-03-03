# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import smtplib
# import random
# import string
# from dotenv import load_dotenv
# import os
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart

# from flask_mail import Mail

# load_dotenv()

# app = Flask(__name__)
# CORS(app)

# # ── Configuration Mail depuis .env ────────────────────────────
# app.config['MAIL_SERVER']         = 'smtp.gmail.com'
# app.config['MAIL_PORT']           = 587
# app.config['MAIL_USE_TLS']        = True
# app.config['MAIL_USERNAME']       = os.getenv('MAIL_USERNAME')
# app.config['MAIL_PASSWORD']       = os.getenv('MAIL_PASSWORD')
# app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

# mail = Mail(app)
# # Base de données temporaire (en mémoire)
# USERS = [
#     {"email": "test@test.com", "password": "123", "firstName": "Admin"},
#     {"email": "khairallahranim@gmail.com", "password": "password123", "firstName": "Ranim"}
# ]

# def send_verification_email(email, code):
#     """Send verification code via email"""
#     try:
#         # Create message
#         msg = MIMEMultipart()
#         msg['From'] = FROM_EMAIL
#         msg['To'] = email
#         msg['Subject'] = 'Code de vérification - FreelanceHub'
        
#         # Email body
#         body = f"""
# Bonjour,

# Voici votre code de vérification: {code}

# Ce code expire dans 10 minutes.

# Si vous n'avez pas demandé ce code, ignorez cet email.

# Cordialement,
# L'équipe FreelanceHub
#         """
        
#         msg.attach(MIMEText(body, 'plain'))
        
#         print(f"Connexion au serveur SMTP: {SMTP_SERVER}:{SMTP_PORT}")
#         print(f"Utilisation de l'email: {SMTP_USERNAME}")
        
#         # Connect to server and send
#         server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
#         server.ehlo()
#         server.starttls()
#         server.ehlo()
#         server.login(SMTP_USERNAME, SMTP_PASSWORD)
#         print("Connecté au Serveur SMTP!")
#         server.sendmail(FROM_EMAIL, email, msg.as_string())
#         server.quit()
        
#         print(f"✅ Email envoyé avec succès à {email}")
#         return True
#     except smtplib.SMTPAuthenticationError as e:
#         print(f"❌ Erreur d'authentification SMTP: {e}")
#         return False
#     except smtplib.SMTPException as e:
#         print(f"❌ Erreur SMTP: {e}")
#         return False
#     except Exception as e:
#         print(f"❌ Erreur lors de l'envoi de l'email: {e}")
#         return False

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')
#     user = next((u for u in USERS if u['email'] == email and u['password'] == password), None)
    
#     if user:
#         return jsonify({"message": "Connexion réussie !", "user": user['firstName']}), 200
#     return jsonify({"error": "Identifiants incorrects"}), 401

# # --- REGISTER ---
# @app.route('/register', methods=['POST'])
# def register():
#     data = request.get_json()
    
#     email = data.get('email')
#     password = data.get('password')
#     first_name = data.get('firstName')

#     if any(user['email'] == email for user in USERS):
#         return jsonify({"error": "Cet email est déjà utilisé par un autre compte"}), 400

#     if not email or not password:
#         return jsonify({"error": "L'email et le mot de passe sont obligatoires"}), 400

#     USERS.append(data)
    
#     print(f"✅ Nouvel utilisateur inscrit : {email} ({data.get('role')})")
    
#     return jsonify({
#         "message": f"Félicitations {first_name}, votre compte a été créé avec succès !"
#     }), 201

# # --- FORGOT PASSWORD ---
# @app.route('/api/auth/forgot-password', methods=['POST'])
# def forgot_password():
#     data = request.get_json()
    
#     email = data.get('email')
    
#     if not email:
#         return jsonify({"error": "L'email est obligatoire"}), 400
    
#     user = next((u for u in USERS if u.get('email') == email), None)
    
#     if not user:
#         return jsonify({
#             "message": "Si cet email existe dans notre système, un code de vérification sera envoyé"
#         }), 200
    
#     # Generate 6-digit verification code
#     verification_code = ''.join(random.choices(string.digits, k=6))
    
#     # Store the code in user with expiry time
#     for u in USERS:
#         if u.get('email') == email:
#             u['reset_code'] = verification_code
#             u['reset_code_expiry'] = str(int(__import__('time').time()) + 600)  # 10 minutes
#             break
    
#     print(f"📧 Envoi du code {verification_code} à {email}")
    
#     # Send email with verification code
#     email_sent = send_verification_email(email, verification_code)
    
#     if not email_sent:
#         # Fallback: show code in console if email fails
#         print(f"📧 Code de vérification pour {email}: {verification_code}")
    
#     return jsonify({
#         "message": "Un code de vérification a été envoyé à votre adresse email"
#     }), 200


# # --- VERIFY CODE ---
# @app.route('/api/auth/verify-code', methods=['POST'])
# def verify_code():
#     data = request.get_json()
    
#     email = data.get('email')
#     code = data.get('code')
#     new_password = data.get('newPassword')
    
#     if not email or not code:
#         return jsonify({"error": "L'email et le code sont obligatoires"}), 400
    
#     user = next((u for u in USERS if u.get('email') == email), None)
    
#     if not user:
#         return jsonify({"error": "Utilisateur non trouvé"}), 404
    
#     stored_code = user.get('reset_code')
    
#     if not stored_code:
#         return jsonify({"error": "Aucun code de vérification trouvé. Veuillez demander un nouveau code."}), 400
    
#     if stored_code != code:
#         return jsonify({"error": "Code de vérification incorrect"}), 400
    
#     if new_password:
#         for u in USERS:
#             if u.get('email') == email:
#                 u['password'] = new_password
#                 if 'reset_code' in u:
#                     del u['reset_code']
#                 if 'reset_code_expiry' in u:
#                     del u['reset_code_expiry']
#                 break
        
#         return jsonify({
#             "message": "Mot de passe réinitialisé avec succès!"
#         }), 200
    
#     return jsonify({
#         "message": "Code de vérification valide",
#         "verified": True
#     }), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import random, string, re, os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER']         = 'smtp.gmail.com'
app.config['MAIL_PORT']           = 587
app.config['MAIL_USE_TLS']        = True
app.config['MAIL_USERNAME']       = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD']       = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')

mail = Mail(app)
USERS = []

def is_valid_email(email):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$', email) is not None

def serialize_user(user):
    return {k: v for k, v in user.items()
            if k not in ('password', 'reset_code', 'reset_code_expiry')}

def send_verification_email(email, code):
    try:
        msg = Message(
            subject="Code de vérification — FreelanceHub",
            recipients=[email],
            body=f"Votre code : {code}\nValide 15 minutes.\n\n— FreelanceHub"
        )
        mail.send(msg)
        print(f"✅ Email envoyé à {email}")
        return True
    except Exception as e:
        print(f"❌ Erreur email : {e}")
        return False

# ── /api/auth/register ──
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    email      = data.get('email', '').strip().lower()
    password   = data.get('password', '')
    first_name = data.get('firstName', '').strip()
    last_name  = data.get('lastName', '').strip()
    role       = data.get('role', 'client')
    if not email or not password:
        return jsonify({"error": "Email et mot de passe obligatoires"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Format d'email invalide"}), 400
    if len(password) < 6:
        return jsonify({"error": "Mot de passe trop court (min 6)"}), 400
    if not first_name or not last_name:
        return jsonify({"error": "Prénom et nom obligatoires"}), 400
    if any(u['email'] == email for u in USERS):
        return jsonify({"error": "Cet email est déjà utilisé"}), 400
    user = {
        "email": email, "password": generate_password_hash(password),
        "firstName": first_name, "lastName": last_name,
        "username": data.get('username', '').strip(),
        "role": role, "domain": data.get('domain', ''),
        "createdAt": datetime.utcnow().isoformat(),
    }
    USERS.append(user)
    return jsonify({"message": f"Félicitations {first_name} !", "user": serialize_user(user)}), 201

# ── /api/auth/login ──
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role     = data.get('role', '')
    if not email or not password:
        return jsonify({"error": "Email et mot de passe obligatoires"}), 400
    user = next((u for u in USERS if u['email'] == email), None)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401
    if role and user.get('role') != role:
        return jsonify({"error": f"Ce compte n'est pas un compte {role}"}), 403
    return jsonify({"message": "Connexion réussie !", "user": serialize_user(user)}), 200

# ── /api/auth/forgot-password ──
@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    email = data.get('email', '').strip().lower()
    if not email:
        return jsonify({"error": "Email obligatoire"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Format d'email invalide"}), 400
    user = next((u for u in USERS if u.get('email') == email), None)
    if not user:
        return jsonify({"message": "Si cet email existe, un code sera envoyé"}), 200
    code   = ''.join(random.choices(string.digits, k=6))
    expiry = datetime.utcnow() + timedelta(minutes=15)
    for u in USERS:
        if u.get('email') == email:
            u['reset_code']        = code
            u['reset_code_expiry'] = expiry
            break
    if not send_verification_email(email, code):
        print(f"📧 DEBUG code pour {email} : {code}")
    return jsonify({"message": "Code envoyé à votre adresse email"}), 200

# ── /api/auth/verify-code ──
@app.route('/api/auth/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    email        = data.get('email', '').strip().lower()
    code         = data.get('code', '').strip()
    new_password = data.get('newPassword', '')
    if not email or not code:
        return jsonify({"error": "Email et code obligatoires"}), 400
    user = next((u for u in USERS if u.get('email') == email), None)
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    stored_code = user.get('reset_code')
    expiry      = user.get('reset_code_expiry')
    if not stored_code or not expiry:
        return jsonify({"error": "Aucun code trouvé. Refaites une demande."}), 400
    if datetime.utcnow() > expiry:
        return jsonify({"error": "Code expiré. Refaites une demande."}), 400
    if stored_code != code:
        return jsonify({"error": "Code incorrect"}), 400
    if new_password:
        if len(new_password) < 6:
            return jsonify({"error": "Mot de passe trop court (min 6)"}), 400
        for u in USERS:
            if u.get('email') == email:
                u['password'] = generate_password_hash(new_password)
                u.pop('reset_code', None)
                u.pop('reset_code_expiry', None)
                break
        return jsonify({"message": "Mot de passe réinitialisé avec succès !"}), 200
    return jsonify({"message": "Code valide.", "verified": True}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)