from app import create_app
from app.extensions import socketio   # ← importer socketio

app = create_app()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)  # ← PAS app.run()