import os 
from dotenv import load_dotenv

#charger les varaibles depuis le fichier .env

load_dotenv() # lire le fichier .env et injecte les varaibles 
              # os.environ (est un dictionnaire des variables d'environnement)

class Config:
    """Configuration centrale de l'application Flask.
            Flask peut charger toute une classe comme configuration
                    avec app.config.from_object(Config)"""

    MONGO_URI = os.getenv("MONGO_URI")
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY","dev-fallback-key") #le 2ᵉ argument est une valeur par défaut si la variable n'existe pas
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() in ("true", "1")
    
    # Email configuration for password reset
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() in ("true", "1")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    # default 'from' address used by Flask-Mail when no sender is given
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", MAIL_USERNAME)

