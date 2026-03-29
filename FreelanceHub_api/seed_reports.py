import os
import pymongo
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    print("❌ MONGO_URI not found in .env")
    exit(1)

client = pymongo.MongoClient(mongo_uri)
# The URI already contains the database name, but let's be explicit
# ... (keep imports)
db = client.get_default_database()

print(f"📡 Connected to: {db.name}")

# Nettoyage des anciens signalements pour éviter les doublons et le mélange des langues
db.reports.delete_many({})
print("🧹 Cleaned up existing reports.")

# Get some IDs from the database to make realistic reports
def get_ids():
    user = db.users.find_one({"role": "freelancer"})
    client_user = db.users.find_one({"role": "client"})
    product = db.products.find_one({})
    announcement = db.announcements.find_one({})
    return user, client_user, product, announcement

user, client_user, product, announcement = get_ids()

if not user or not client_user:
    print("⚠️ Warning: No freelancer or client found to create realistic reports. Using default IDs.")

reports = [
    {
        "reportedBy": {
            "userId": client_user["_id"] if client_user else ObjectId(),
            "name": (client_user["firstName"] + " " + client_user["lastName"]) if client_user else "John Doe",
            "role": "client"
        },
        "targetType": "user",
        "targetId": user["_id"] if user else ObjectId(),
        "targetName": (user["firstName"] + " " + user["lastName"]) if user else "Alice Freelancer",
        "reason": "arnaque", # Keep the keys if they are enums, translate only descriptions
        "description": "This user is asking for payment outside the platform before starting the work.",
        "status": "pending",
        "createdAt": datetime.utcnow()
    },
    {
        "reportedBy": {
            "userId": user["_id"] if user else ObjectId(),
            "name": (user["firstName"] + " " + user["lastName"]) if user else "Alice Freelancer",
            "role": "freelancer"
        },
        "targetType": "product",
        "targetId": product["_id"] if product else ObjectId(),
        "targetName": product["title"] if product else "Suspicious Python Script",
        "reason": "contenu_inapproprie",
        "description": "This product contains links to phishing sites.",
        "status": "pending",
        "createdAt": datetime.utcnow()
    },
    {
        "reportedBy": {
            "userId": client_user["_id"] if client_user else ObjectId(),
            "name": (client_user["firstName"] + " " + client_user["lastName"]) if client_user else "John Doe",
            "role": "client"
        },
        "targetType": "announcement",
        "targetId": announcement["_id"] if announcement else ObjectId(),
        "targetName": announcement["title"] if announcement else "Web Development Project",
        "reason": "spam",
        "description": "The announcement is repeated 10 times in the list.",
        "status": "resolved",
        "createdAt": datetime.utcnow(),
        "resolvedAt": datetime.utcnow()
    }
]

db.reports.insert_many(reports)
print(f"✅ Successfully inserted {len(reports)} reports into {db.name}.reports")
