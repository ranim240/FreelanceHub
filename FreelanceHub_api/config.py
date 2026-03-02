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
