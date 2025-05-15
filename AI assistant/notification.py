from pymongo import MongoClient
from fastapi import HTTPException
from firebase_admin import messaging
from bson import ObjectId
from firebase_auth import firebase_admin  

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")  # 🔁 Update if needed
db = client["your_database_name"]                  # 🔁 Replace with your DB name
users_collection = db["users"]

def send_push_notification(user_id: str, title: str, body: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    if not user or "deviceToken" not in user:
        raise HTTPException(status_code=404, detail="Device token not found for user")

    device_token = user["deviceToken"] 

    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=device_token
    )

    try:
        response = messaging.send(message)
        print("✅ Notification sent:", response)
        return response
    except Exception as e:
        print("❌ Error sending notification:", e)
        return None
