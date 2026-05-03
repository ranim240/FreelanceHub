from flask import Blueprint, jsonify, request
from bson import ObjectId
from app.extensions import db
from app.utils.helpers import serialize_doc
from datetime import datetime

# Blueprint reports
reports_bp = Blueprint("reports", __name__)

# ─── Helpers ───────────────────────────────────────────────

# ═══════════════════════════════════════════════════════════
#  REPORTS
# ═══════════════════════════════════════════════════════════

@reports_bp.route("/admin/reports", methods=["GET"])
def get_reports():
    """Liste tous les reports avec filtrage optionnel par statut."""
    query = {}
    status = request.args.get("status")
    if status and status != 'all':
        query["status"] = status
    
    reports = list(db.reports.find(query).sort("createdAt", -1))
    return jsonify([serialize_doc(r) for r in reports]), 200

@reports_bp.route("/admin/reports/<report_id>/resolve", methods=["PUT"])
def resolve_report(report_id):
    """Marque un signalement comme résolu."""
    try:
        result = db.reports.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {
                "status": "resolved",
                "resolvedAt": datetime.utcnow()
            }}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Report not found"}), 404
    return jsonify({"message": "Report marked as resolved"}), 200

@reports_bp.route("/admin/reports/<report_id>/ignore", methods=["PUT"])
def ignore_report(report_id):
    """Marque un signalement comme ignoré."""
    try:
        result = db.reports.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {
                "status": "ignored",
                "resolvedAt": datetime.utcnow()
            }}
        )
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Report not found"}), 404
    return jsonify({"message": "Report marked as ignored"}), 200

@reports_bp.route("/admin/reports/<report_id>", methods=["DELETE"])
def delete_report(report_id):
    """Supprime un signalement."""
    try:
        result = db.reports.delete_one({"_id": ObjectId(report_id)})
    except Exception:
        return jsonify({"error": "Invalid ID"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Report not found"}), 404
    return jsonify({"message": "Report deleted"}), 200

@reports_bp.route("/reports", methods=["POST"])
def create_report():
    """Crée un nouveau signalement (report)."""
    data = request.get_json()
    if not data or not data.get("reason"):
        return jsonify({"error": "Reason is required"}), 400

    report = {
        "reportedBy": {
            "userId": ObjectId(data["reportedBy"]["userId"]),
            "name": data["reportedBy"]["name"],
            "role": data["reportedBy"].get("role", "client")
        },
        "targetType": data.get("targetType", "general"), # user, product, announcement
        "targetId": ObjectId(data["targetId"]) if data.get("targetId") else None,
        "targetName": data.get("targetName", "Platform"),
        "reason": data["reason"],
        "description": data.get("description", ""),
        "status": "pending",
        "createdAt": datetime.utcnow()
    }
    
    result = db.reports.insert_one(report)
    report["_id"] = str(result.inserted_id)
    return jsonify(serialize_doc(report)), 201
