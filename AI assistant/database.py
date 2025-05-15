# # app/database.py
# # from sqlalchemy import create_engine
# # from sqlalchemy.ext.declarative import declarative_base
# # from sqlalchemy.orm import sessionmaker

# # # Create a new Base instance
# # Base = declarative_base()

# # # Replace with your MySQL database URL
# # MYSQL_DATABASE_URL = "mysql+pymysql://root:jerome20@localhost:3306/ai_assistant_db"

# # # Create SQLAlchemy engine and session maker
# # engine = create_engine(MYSQL_DATABASE_URL, pool_recycle=3600)
# # SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # # Dependency to get the DB session
# # def get_db():
# #     db = SessionLocal()
# #     try:
# #         yield db
# #     finally:
# #         db.close()


# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker

# # Replace with your real credentials and DB name
# DATABASE_URL = "mysql+pymysql://root:jerome20@localhost/ai_assistant_db"

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine, autoflush=False)
# Base = declarative_base()

# db.py
# from motor.motor_asyncio import AsyncIOMotorClient
# from fastapi import HTTPException
# from typing import List
# class MongoDB:
#     client: AsyncIOMotorClient
#     db: str = 'your_db_name'

#     def __init__(self, uri: str):
#         self.client = AsyncIOMotorClient(uri)
#         self.db = self.client.get_database(self.db)

#     def get_collection(self, collection_name: str):
#         return self.db.get_collection(collection_name)

# db = MongoDB('mongodb://localhost:27017')  # Adjust URI for production

# # async def fetch_user_tasks(user_id: str):
# #     try:
# #         daily_tasks = await db.get_collection("daily_tasks").find({"user_id": user_id}).to_list(length=100)
# #         weekly_tasks = await db.get_collection("weekly_tasks").find({"user_id": user_id}).to_list(length=100)
# #         yearly_tasks = await db.get_collection("yearly_tasks").find({"user_id": user_id}).to_list(length=100)
        
# #         return daily_tasks + weekly_tasks + yearly_tasks  # Combine all tasks
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

# # db.py (add these functions)

# async def fetch_user_tasks(user_id: str) -> List[dict]:
#     try:
#         daily_tasks = await db.get_collection("daily_tasks").find({"user_id": user_id}).to_list(length=100)
#         weekly_tasks = await db.get_collection("weekly_tasks").find({"user_id": user_id}).to_list(length=100)
#         yearly_tasks = await db.get_collection("yearly_tasks").find({"user_id": user_id}).to_list(length=100)
        
#         # Combine all tasks into one list and return
#         return daily_tasks + weekly_tasks + yearly_tasks
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

# async def fetch_user_task_by_id(user_id: str, task_id: str) -> dict:
#     try:
#         task = await db.get_collection("daily_tasks").find_one({"user_id": user_id, "_id": task_id})
#         if task:
#             return task
#         task = await db.get_collection("weekly_tasks").find_one({"user_id": user_id, "_id": task_id})
#         if task:
#             return task
#         task = await db.get_collection("yearly_tasks").find_one({"user_id": user_id, "_id": task_id})
#         return task if task else None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching task: {str(e)}")




# async def fetch_user_tasks(user_id: str):
#     if user_id == "dummy_user_id_123":
#         return [
#     {
#       "title": "Check emails",
#       "start_date": "2025-04-20",
#       "recurrence": "daily",
#       "description": "Daily email cleanup"
#     },
#     {
#       "title": "Write blog post",
#       "start_date": "2025-04-21",
#       "recurrence": "weekly",
#       "description": "Weekly blog content"
#     }
#   ]
#     return []
  
  
async def fetch_user_tasks(user_id: str):
    if user_id == "dummy_user_id_123":
        return [
    {
  "category": "productivity",    
  "current_situation": "overwhelmed",
  "importance": "high",
  "urgency": "medium",
  "additional_details": "I have too many tasks."
      }
  ]
    return []
  



# async def fetch_user_tasks(user_id: str):
#     if user_id == "dummy_user_id_123":
#         return [
#             {"title": "Write blog post"},
#             {"title": "Submit report"}
#         ]
#     return []
