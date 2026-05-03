from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db
from app.utils.helpers import serialize_doc
from datetime import datetime
import os
import stripe

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")

contracts_bp = Blueprint("contracts", __name__)


# ─── Helpers ───────────────────────────────────────────────
def enrich_contract(contract):
    """Add client/freelancer names to a contract."""
    try:
        cl = db.users.find_one({"_id": ObjectId(contract["clientId"])})
        if cl:
            contract["clientName"] = f"{cl.get('firstName', '')} {cl.get('lastName', '')}".strip()
    except Exception:
        contract["clientName"] = "Unknown"
    try:
        fl = db.users.find_one({"_id": ObjectId(contract["freelancerId"])})
        if fl:
            contract["freelancerName"] = f"{fl.get('firstName', '')} {fl.get('lastName', '')}".strip()
    except Exception:
        contract["freelancerName"] = "Unknown"
    return contract


# ═══════════════════════════════════════════════════════════
#  CREATE CONTRACT (Client)
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts", methods=["POST"])
def create_contract():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Empty request body"}), 400

    required = ["clientId", "freelancerId", "title", "amount"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    amount = float(data["amount"])
    commission_rate = 10
    commission = round(amount * commission_rate / 100, 2)
    freelancer_amount = round(amount - commission, 2)

    # Build milestones
    milestones = []
    for i, m in enumerate(data.get("milestones", [])):
        milestones.append({
            "id": f"m{i+1}",
            "title": m.get("title", f"Milestone {i+1}"),
            "description": m.get("description", ""),
            "deadline": m.get("deadline", ""),
            "status": "pending"
        })

    contract = {
        "clientId": data["clientId"],
        "freelancerId": data["freelancerId"],
        "title": data["title"],
        "description": data.get("description", ""),
        "amount": amount,
        "commissionRate": commission_rate,
        "commission": commission,
        "freelancerAmount": freelancer_amount,
        "currency": "DT",
        "status": "pending",
        "milestones": milestones,
        "tasks": [],
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "paidAt": None,
        "deliveredAt": None,
        "validatedAt": None
    }

    result = db.contracts.insert_one(contract)
    contract["_id"] = str(result.inserted_id)

    return jsonify(serialize_doc(contract)), 201


# ═══════════════════════════════════════════════════════════
#  PAY CONTRACT (Client → Stripe Checkout)
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/<contract_id>/pay", methods=["POST"])
def pay_contract(contract_id):
    try:
        contract = db.contracts.find_one({"_id": ObjectId(contract_id)})
    except Exception:
        return jsonify({"error": "Invalid contract ID"}), 400

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    if contract["status"] != "pending":
        return jsonify({"error": "Contract already paid"}), 400

    amount_cents = int(contract["amount"] * 100)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Contract: {contract['title']}",
                        "description": "Escrow payment — funds held until project validated",
                    },
                    "unit_amount": amount_cents,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"http://localhost:8100/client/contract-detail/{contract_id}?payment=success",
            cancel_url=f"http://localhost:8100/client/contract-detail/{contract_id}?payment=cancelled",
            metadata={"contractId": contract_id}
        )
        return jsonify({"id": session.id, "url": session.url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════
#  FUND CONTRACT (after Stripe success)
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/<contract_id>/fund", methods=["PUT"])
def fund_contract(contract_id):
    try:
        result = db.contracts.update_one(
            {"_id": ObjectId(contract_id), "status": "pending"},
            {"$set": {
                "status": "funded",
                "paidAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Contract not found or already funded"}), 404

    return jsonify({"message": "Contract funded — escrow active"}), 200


# ═══════════════════════════════════════════════════════════
#  GET CONTRACTS
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/client/<user_id>", methods=["GET"])
def get_client_contracts(user_id):
    contracts = list(db.contracts.find({"clientId": user_id}).sort("createdAt", -1))
    return jsonify([serialize_doc(enrich_contract(c)) for c in contracts]), 200


@contracts_bp.route("/contracts/freelancer/<user_id>", methods=["GET"])
def get_freelancer_contracts(user_id):
    contracts = list(db.contracts.find({"freelancerId": user_id}).sort("createdAt", -1))
    return jsonify([serialize_doc(enrich_contract(c)) for c in contracts]), 200


@contracts_bp.route("/contracts/<contract_id>", methods=["GET"])
def get_contract(contract_id):
    try:
        contract = db.contracts.find_one({"_id": ObjectId(contract_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    return jsonify(serialize_doc(enrich_contract(contract))), 200


# ═══════════════════════════════════════════════════════════
#  FREELANCER — Tasks (Gantt) & Milestones
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/<contract_id>/tasks", methods=["PUT"])
def update_tasks(contract_id):
    data = request.get_json()
    tasks = data.get("tasks", [])

    try:
        result = db.contracts.update_one(
            {"_id": ObjectId(contract_id)},
            {"$set": {"tasks": tasks, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Contract not found"}), 404

    # Auto-update status to in_progress if currently funded
    db.contracts.update_one(
        {"_id": ObjectId(contract_id), "status": "funded"},
        {"$set": {"status": "in_progress"}}
    )

    return jsonify({"message": "Tasks updated"}), 200


@contracts_bp.route("/contracts/<contract_id>/milestones", methods=["PUT"])
def update_milestones(contract_id):
    data = request.get_json()
    milestones = data.get("milestones", [])

    try:
        result = db.contracts.update_one(
            {"_id": ObjectId(contract_id)},
            {"$set": {"milestones": milestones, "updatedAt": datetime.utcnow()}}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Contract not found"}), 404

    return jsonify({"message": "Milestones updated"}), 200


# ═══════════════════════════════════════════════════════════
#  DELIVER (Freelancer)
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/<contract_id>/deliver", methods=["PUT"])
def deliver_contract(contract_id):
    try:
        result = db.contracts.update_one(
            {"_id": ObjectId(contract_id), "status": {"$in": ["funded", "in_progress"]}},
            {"$set": {
                "status": "delivered",
                "deliveredAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Contract not found or cannot deliver"}), 404

    return jsonify({"message": "Contract marked as delivered"}), 200


# ═══════════════════════════════════════════════════════════
#  VALIDATE (Client) → Release Payment
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/<contract_id>/validate", methods=["PUT"])
def validate_contract(contract_id):
    try:
        contract = db.contracts.find_one({"_id": ObjectId(contract_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if not contract:
        return jsonify({"error": "Contract not found"}), 404

    if contract["status"] != "delivered":
        return jsonify({"error": "Contract must be delivered before validation"}), 400

    # Mark all milestones as completed
    milestones = contract.get("milestones", [])
    for m in milestones:
        m["status"] = "completed"

    db.contracts.update_one(
        {"_id": ObjectId(contract_id)},
        {"$set": {
            "status": "completed",
            "milestones": milestones,
            "validatedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }}
    )

    return jsonify({
        "message": "Project validated! Payment released to freelancer.",
        "amount": contract["amount"],
        "commission": contract["commission"],
        "freelancerAmount": contract["freelancerAmount"]
    }), 200


# ═══════════════════════════════════════════════════════════
#  ADMIN — Escrow Management
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/admin/all", methods=["GET"])
def get_all_contracts():
    status_filter = request.args.get("status")
    query = {}
    if status_filter:
        query["status"] = status_filter

    contracts = list(db.contracts.find(query).sort("createdAt", -1))
    return jsonify([serialize_doc(enrich_contract(c)) for c in contracts]), 200


@contracts_bp.route("/contracts/admin/stats", methods=["GET"])
def get_escrow_stats():
    # Money currently held in escrow
    pipe_held = [
        {"$match": {"status": {"$in": ["funded", "in_progress", "delivered"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    # Money released to freelancers + commissions earned
    pipe_released = [
        {"$match": {"status": "completed"}},
        {"$group": {
            "_id": None,
            "released": {"$sum": "$freelancerAmount"},
            "commissions": {"$sum": "$commission"}
        }}
    ]
    # Total volume
    pipe_volume = [
        {"$match": {"status": {"$ne": "pending"}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]

    held = list(db.contracts.aggregate(pipe_held))
    released = list(db.contracts.aggregate(pipe_released))
    volume = list(db.contracts.aggregate(pipe_volume))

    return jsonify({
        "totalHeld": held[0]["total"] if held else 0,
        "totalReleased": released[0]["released"] if released else 0,
        "totalCommissions": released[0]["commissions"] if released else 0,
        "totalVolume": volume[0]["total"] if volume else 0,
        "counts": {
            "pending": db.contracts.count_documents({"status": "pending"}),
            "funded": db.contracts.count_documents({"status": "funded"}),
            "inProgress": db.contracts.count_documents({"status": "in_progress"}),
            "delivered": db.contracts.count_documents({"status": "delivered"}),
            "completed": db.contracts.count_documents({"status": "completed"}),
            "total": db.contracts.count_documents({})
        }
    }), 200


# ═══════════════════════════════════════════════════════════
#  GET FREELANCERS LIST (for contract creation form)
# ═══════════════════════════════════════════════════════════

@contracts_bp.route("/contracts/freelancers", methods=["GET"])
def get_freelancers_list():
    """Returns active freelancers for the contract creation dropdown."""
    freelancers = list(db.users.find(
        {"role": "freelancer", "status": {"$in": ["active", None]}},
        {"password": 0, "reset_code": 0, "reset_code_expiry": 0}
    ).sort("firstName", 1))

    for f in freelancers:
        f["_id"] = str(f["_id"])

    return jsonify(freelancers), 200
