from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db
import os
import stripe

cart_bp = Blueprint("cart", __name__)

# Configurer la clé secrète Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")

def serialize_product(product):
    if product is None:
        return None
    product["_id"] = str(product["_id"])
    return product

# GET /api/cart/<user_id>
@cart_bp.route("/cart/<user_id>", methods=["GET"])
def get_cart(user_id):
    """Retourne les produits dans le panier de l'utilisateur."""
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "ID utilisateur invalide"}), 400
        
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
        
    cart_ids = user.get("cart", [])
    if not cart_ids:
        return jsonify([]), 200
        
    # Convertir les strings en ObjectIds
    obj_ids = []
    for pid in cart_ids:
        try:
            obj_ids.append(ObjectId(pid))
        except:
            pass
            
    products = list(db.products.find({"_id": {"$in": obj_ids}}))
    return jsonify([serialize_product(p) for p in products]), 200

# POST /api/cart/<user_id>
@cart_bp.route("/cart/<user_id>", methods=["POST"])
def add_to_cart(user_id):
    """Ajoute un produit au panier."""
    data = request.get_json()
    product_id = data.get("productId")
    
    if not product_id:
        return jsonify({"error": "ID du produit manquant"}), 400
        
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "ID utilisateur invalide"}), 400
        
    # Vérifier que le produit existe
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"error": "Produit non trouvé"}), 404
    except:
         return jsonify({"error": "ID produit invalide"}), 400

    # Ajouter au panier
    db.users.update_one(
        {"_id": user_obj_id},
        {"$addToSet": {"cart": product_id}} # $addToSet évite les doublons
    )
    
    return jsonify({"message": "Produit ajouté au panier"}), 200

# DELETE /api/cart/<user_id>/<product_id>
@cart_bp.route("/cart/<user_id>/<product_id>", methods=["DELETE"])
def remove_from_cart(user_id, product_id):
    """Retire un produit du panier."""
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "ID utilisateur invalide"}), 400
        
    db.users.update_one(
        {"_id": user_obj_id},
        {"$pull": {"cart": product_id}}
    )
    
    return jsonify({"message": "Produit retiré du panier"}), 200

# DELETE /api/cart/<user_id>/clear
@cart_bp.route("/cart/<user_id>/clear", methods=["DELETE"])
def clear_cart(user_id):
    """Vide complètement le panier."""
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "ID utilisateur invalide"}), 400
        
    db.users.update_one(
        {"_id": user_obj_id},
        {"$set": {"cart": []}}
    )
    return jsonify({"message": "Panier vidé"}), 200

# POST /api/cart/<user_id>/checkout
@cart_bp.route("/cart/<user_id>/checkout", methods=["POST"])
def checkout(user_id):
    """Crée une session de paiement Stripe."""
    if stripe.api_key == "sk_test_dummy":
        print("⚠️ AVERTISSEMENT : STRIPE_SECRET_KEY non configurée. Le paiement échouera.")
        
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"error": "ID utilisateur invalide"}), 400
        
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
        
    cart_ids = user.get("cart", [])
    if not cart_ids:
        return jsonify({"error": "Le panier est vide"}), 400
        
    obj_ids = [ObjectId(pid) for pid in cart_ids if ObjectId.is_valid(pid)]
    products = list(db.products.find({"_id": {"$in": obj_ids}}))
    
    line_items = []
    for p in products:
        try:
            unit_amount = int(float(p.get("price", 0)) * 100)
        except ValueError:
            unit_amount = 0
            
        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": p.get("title", "Produit sans nom"),
                    "description": p.get("description", "")[:250],
                },
                "unit_amount": unit_amount,
            },
            "quantity": 1,
        })
        
    try:
        frontend_url = "http://localhost:8100"
        
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{frontend_url}/client/dashboard?payment=success",
            cancel_url=f"{frontend_url}/client/dashboard?payment=cancelled",
        )
        
        return jsonify({"id": session.id, "url": session.url}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
