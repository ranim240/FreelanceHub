from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db

#creation de blueprint 
products_bp = Blueprint("products", __name__)

#----Fontion utilitaires----
def serialize_product(product):
    """Convertit un document MongoDB en dict JSON-compatible."""
    if product is None:
        return None
    product["_id"] = str(product["_id"])
    return product

# GET /api/products 
@products_bp.route("/products", methods=["GET"])
def get_products():
    """Retourne tous les produits. Supporte ?category= et ?search="""
    query = {}
    # Filtre par catégorie
    category = request.args.get("category")
    if category and category != "All":
        query["category"] = category
    # Filtre par recherche
    search = request.args.get("search")
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"techStack": {"$regex": search, "$options": "i"}},
        ]
    products = list(db.products.find(query))
    return jsonify([serialize_product(p) for p in products]), 200



# GET /api/products/featured
@products_bp.route("/products/featured", methods=["GET"])
def get_featured_products():
    """Retourne les produits mis en avant (featured: true)."""
    products = list(db.products.find({"featured": True}))
    return jsonify([serialize_product(p) for p in products]), 200



# GET /api/products/<id>
@products_bp.route("/products/<product_id>", methods=["GET"])
def get_product_by_id(product_id):
    """Retourne un produit par son _id MongoDB."""
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})
    except Exception:
        return jsonify({"error": "ID invalide"}), 400 #requete invalide 
    if not product:
        return jsonify({"error": "Produit non trouvé"}), 404 #non trouvé 
    return jsonify(serialize_product(product)), 200 #ok


# POST /api/products
@products_bp.route("/products", methods=["POST"])
def create_product():
    """Crée un nouveau produit."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Corps de requête vide"}), 400
    # Validation minimale
    required = ["title", "price", "category", "author"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Champs manquants : {missing}"}), 400
    # Valeurs par défaut
    data.setdefault("rating", 0)
    data.setdefault("reviews", 0)
    data.setdefault("featured", False)
    data.setdefault("purchased", False)
    data.setdefault("customerReviews", [])
    data.setdefault("techStack", [])
    data.setdefault("features", [])
    result = db.products.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201 #created