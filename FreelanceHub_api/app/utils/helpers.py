from functools import wraps
from flask import request, jsonify, g
from bson import ObjectId
from datetime import datetime
from app import db

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict recursively."""
    from bson import ObjectId
    if doc is None:
        return None
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, dict):
        result = {}
        for k, v in doc.items():
            if k == 'password':
                continue
            result[k] = serialize_doc(v)
        return result
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    return doc

def require_login(f):
    """Decorator for login required - extracts token from Authorization header."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token required'}), 401
        
        token = auth_header.split(' ')[1]
        # TODO: validate token with JWT or session
        # For now, assume token is user_id (replace with real auth)
        try:
            user_id = token  # In real app: jwt.decode(token)
            user = db.users.find_one({'_id': ObjectId(user_id)})
            if not user:
                return jsonify({'error': 'Invalid token'}), 401
            g.current_user = user
        except:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function
