from pymongo import MongoClient
from flask_mail import Mail
from flask_socketio import SocketIO         

#varaible globale - initialisées par init_db()

mongo_client = None
db = None
socketio = SocketIO()   
# Note: mail is now initialized in app/__init__.py

def init_db(app):
    global mongo_client, db

    mongo_uri = app.config["MONGO_URI"]

    if not mongo_uri :
        raise ValueError("MONGO_URI is not configured , verifie votre fichier .env")

    #connexion à MongoDB Atlas 
    mongo_client = MongoClient(mongo_uri)
    
    #recuperer la base définie dans l'URI 
    # db = mongo_client.get_default_database()
    db = mongo_client["freelancehub_db"]

    #test de connexion
    try:
        mongo_client.admin.command("ping")
        print("Connexion à MongoDB Atlas reussie")
    except Exception as e :
        print(f"❌ Erreur de connexion MongoDB : {e}")
        raise
