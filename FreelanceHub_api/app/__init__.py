from flask import Flask 
from flask_cors import CORS
from flask_mail import Mail
from config import Config
from app.extensions import init_db

# Initialize Flask-Mail
mail = Mail()

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

    # Initialize Flask-Mail with debug logging
    mail.init_app(app)
    print(f"✅ Flask-Mail initialized")
    print(f"   MAIL_SERVER: {app.config.get('MAIL_SERVER')}")
    print(f"   MAIL_PORT: {app.config.get('MAIL_PORT')}")
    print(f"   MAIL_USERNAME: {app.config.get('MAIL_USERNAME')}")
    print(f"   MAIL_USE_TLS: {app.config.get('MAIL_USE_TLS')}")

    #initialiser mongo_db
    init_db(app)

    #enrgistre les blueprints (routes)
    from app.routes.products import products_bp
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.admin import admin_bp
    from app.routes.reports import reports_bp
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(home_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(reports_bp, url_prefix="/api")

    return app
