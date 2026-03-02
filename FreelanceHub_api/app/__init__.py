from flask import Flask 
from flask_cors import CORS
from config import Config
from app.extensions import init_db

def create_app():
    """Application Factory — crée et configure l'app Flask."""

    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS — autorise le frontend Ionic à appeler l'API
    CORS(app,resources={
        r"/api/*": {
            "origins": ["http://localhost:8100", "http://localhost:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    #initialiser mongo_db
    init_db(app)

    #enrgistre les blueprints (routes)
    from app.routes.products import products_bp
    from app.routes.home import home_bp
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(home_bp, url_prefix="/api")

    return app