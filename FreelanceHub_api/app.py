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
    role       = data.get('role', 'freelancer')
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
        "role": role,
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