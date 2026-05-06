from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from config import Config
from app.extensions import init_db, db,socketio

# Initialize Flask-Mail
mail = Mail()

def create_app():
    """Application Factory — crée et configure l'app Flask."""

    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS — autorise le frontend Ionic à appeler l'API
    CORS(app, resources={r"/api/*": {
        "origins": [
            "http://localhost:8100",   # Ionic dev server
            "http://localhost:4200",   # Angular dev server (just in case)
            "capacitor://localhost",   # Capacitor on device
            "ionic://localhost",       # Ionic on device
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    # Initialize Flask-Mail with debug logging
    mail.init_app(app)

    # ← Initialiser SocketIO
    socketio.init_app(app,
        cors_allowed_origins=[
            "http://localhost:8100",
            "http://localhost:4200",
        ],
        async_mode="eventlet",
        logger=True,
        engineio_logger=False
    )
    print('✅ Flask-Mail initialized')
    print(f'   MAIL_SERVER: {app.config.get("MAIL_SERVER")}')
    print(f'   MAIL_PORT: {app.config.get("MAIL_PORT")}')
    print(f'   MAIL_USERNAME: {app.config.get("MAIL_USERNAME")}')
    print(f'   MAIL_USE_TLS: {app.config.get("MAIL_USE_TLS")}')

    # Initialiser mongo_db
    init_db(app)

    # Enregistre les blueprints (routes)
    from app.routes.products import products_bp
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.admin import admin_bp
    from app.routes.reports import reports_bp
    from app.routes.cart import cart_bp
    from app.routes.contracts import contracts_bp
    from app.routes.client import client_bp
    from app.routes.profile import profile_bp
    from app.routes.messages import messages_bp

    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(home_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(reports_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    app.register_blueprint(contracts_bp, url_prefix='/api')
    app.register_blueprint(client_bp, url_prefix='/api/client')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(messages_bp, url_prefix='/api/client')

    from app.routes import socket_events  

    return app

