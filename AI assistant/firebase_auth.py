# import firebase_admin
# from firebase_admin import credentials, auth

# # Load Firebase Admin credentials (downloaded from Firebase Console)
# cred = credentials.Certificate("path/to/your-firebase-adminsdk.json")
# firebase_admin.initialize_app(cred)


import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException
from pymongo import MongoClient
from fastapi import HTTPException
from firebase_admin import messaging
from bson import ObjectId

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase-adminsdk.json")  # path to your service account key
    firebase_admin.initialize_app(cred)

def get_user_id_from_token(auth_header: str) -> str:
    """
    Extract and verify Firebase ID token from Authorization header.
    Returns Firebase user ID (uid).
    """
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    id_token = auth_header.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except Exception as e:
        print("Token verification failed:", e)
        raise HTTPException(status_code=401, detail="Invalid or expired token")



# # MongoDB setup
# client = MongoClient("mongodb://localhost:27017")  # 🔁 Update if needed
# db = client["your_database_name"]                  # 🔁 Replace with your DB name
# users_collection = db["users"]

# def send_push_notification(user_id: str, title: str, body: str):
#     try:
#         user = users_collection.find_one({"_id": ObjectId(user_id)})
#     except:
#         raise HTTPException(status_code=400, detail="Invalid user ID format")

#     if not user or "deviceToken" not in user:
#         raise HTTPException(status_code=404, detail="Device token not found for user")

#     device_token = user["deviceToken"]

#     message = messaging.Message(
#         notification=messaging.Notification(
#             title=title,
#             body=body
#         ),
#         token=device_token
#     )

#     try:
#         response = messaging.send(message)
#         print("✅ Notification sent:", response)
#         return response
#     except Exception as e:
#         print("❌ Error sending notification:", e)
#         return None


# def get_user_id_from_token(auth_header: str) -> str:
#     # Check if Authorization header exists and starts with "Bearer "
#     if not auth_header or not auth_header.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Invalid token format")

#     # This is for testing only — return dummy user ID
#     return "dummy_user_id_123"
