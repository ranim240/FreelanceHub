# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Indispensable pour que Ionic puisse appeler Flask

# # Simulation d'utilisateur
# USER_DB = {
#     "email": "test@test.com",
#     "password": "123"
# }

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if email == USER_DB['email'] and password == USER_DB['password']:
#         return jsonify({"message": "Connexion réussie !", "user": email}), 200
#     else:
#         return jsonify({"error": "Identifiants incorrects"}), 401

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Base de données temporaire (en mémoire)
USERS = [
    {"email": "test@test.com", "password": "123", "firstName": "Admin"}
]

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = next((u for u in USERS if u['email'] == email and u['password'] == password), None)
    
    if user:
        return jsonify({"message": "Connexion réussie !", "user": user['firstName']}), 200
    return jsonify({"error": "Identifiants incorrects"}), 401

# --- NOUVELLE ROUTE REGISTER ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 1. Extraction des données envoyées par Ionic
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstName')

    # 2. Vérification si l'utilisateur existe déjà
    if any(user['email'] == email for user in USERS):
        return jsonify({"error": "Cet email est déjà utilisé par un autre compte"}), 400

    # 3. Validation minimum (ex: email et mot de passe requis)
    if not email or not password:
        return jsonify({"error": "L'email et le mot de passe sont obligatoires"}), 400

    # 4. Enregistrement des données (on stocke tout l'objet data)
    USERS.append(data)
    
    print(f"✅ Nouvel utilisateur inscrit : {email} ({data.get('role')})")
    
    return jsonify({
        "message": f"Félicitations {first_name}, votre compte a été créé avec succès !"
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
