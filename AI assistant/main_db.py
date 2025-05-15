# main.py
from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Body
from fastapi import FastAPI, Depends, Query
from fastapi import HTTPException
from fastapi import Request
from fastapi import FastAPI, HTTPException, Request
from .auth import get_user_id_from_token                       # Import the function to decode JWT
#from .firebase_auth import get_user_id_from_token               # for firebase login 
from .database import fetch_user_tasks
from .prioritizer import get_prioritized_tasks
from .smart_reminder import generate_reminders_and_nudges
from typing import List
# app/routes/reminders.py 
from fastapi import APIRouter, HTTPException
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .database import fetch_user_tasks
from .smart_reminder import generate_reminders_and_nudges
# In app/routes/group_tasks.py
from fastapi import APIRouter
from .database import fetch_user_tasks
from .grouper import get_task_groupings
# In app/routes/monetization.py
from fastapi import APIRouter
from .monetizer import get_monetization_insights
from fastapi import Request, HTTPException, Depends
from .time_cost_calculator import estimate_task_time_and_cost
from .recurrence import generate_recurrent_tasks
from .methods import get_llama_suggestions_methods
from .llama import get_llama_suggestions 
from .summarizations import summarize_notes, suggest_time_blocks
from .time_cost_calculator import estimate_task_time_and_cost
from .template_generator import call_groq_and_generate_template

# Make sure you have this in estimator.py
#from .firebase_auth import get_user_id_from_token  # Keep using your Firebase decode function
#from notification import send_push_notification  # Make sure this import is present


router = APIRouter()

app = FastAPI()

async def get_current_user_id(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        user_id = get_user_id_from_token(auth_header)
        return user_id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@app.get("/")
def home():
    return {"message": "Sowalnk AI assistant!"}

@app.get("/ai/suggestions/by-category")
async def ai_suggestions(
    category: str = Query(..., description="Category like Gym, Sports, Selfcare, etc."),
    goals: str = Query("general wellness", description="User's goals related to the category"),
    activity_frequency: int = Query(3, description="How often does the user engage in this activity?"),
    focus_area: str = Query("", description="User's specific focus area (e.g., strength, mindfulness)"),
    custom_info: str = Query("", description="Optional additional info, like sport name or habit")
):
    user_info = {
        "goals": goals,
        "activity_frequency": activity_frequency,
        "focus_area": focus_area,
        "custom_info": custom_info
    }

    suggestions = await get_llama_suggestions(category, user_info)
    return {
        "category": category,
        "suggestions": suggestions
    }

# Define the input data model
class NoteInput(BaseModel):
    notes: str

# Define the API endpoint to summarize notes and suggest time blocks
@app.post("/summarize_notes")
async def summarize_notes_endpoint(note_input: NoteInput):
    # Extract tasks from the raw notes using the summarize function
    notes = note_input.notes
    tasks = await summarize_notes(notes)

    # Suggest time blocks for each extracted task
    time_blocks = suggest_time_blocks(tasks)
    
    return {"tasks": tasks, "time_blocks": time_blocks} 


@app.post("/ai/time-cost-calculator")
async def calculate_time_and_cost(payload: dict = Body(...)):
    tasks: List[str] = payload.get("tasks", [])
    if not tasks:
        return {"error": "No tasks provided"}
    
    result = await estimate_task_time_and_cost(tasks)
    return {"time_cost_estimates": result}


class TaskRequest(BaseModel):
    task_type: str
    
@app.post("/generate-task-template/")
async def generate_template(request: TaskRequest):
    try:
        template = await call_groq_and_generate_template(request.task_type)
        return {"task_template": template}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating task template: {str(e)}")



# Example endpoint to prioritize tasks
@app.post("/prioritize/{user_id}")
#async def prioritize_tasks(user_id: str = Depends(get_current_user_id)):

async def prioritize_tasks(request: Request):    
    # Extract the Authorization header
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    # Get the user ID from the token
    user_id = get_user_id_from_token(authorization_header)
    
    # Fetch user tasks from MongoDB
    tasks = await fetch_user_tasks(user_id)

    try:
        # Now pass the tasks to prioritization logic
        prioritized_tasks = await get_prioritized_tasks(tasks)
        return {"prioritized_tasks": prioritized_tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


scheduler = BackgroundScheduler()

# Create function to send reminders
def send_reminder(task):
    # Logic to send a reminder (could be a push notification, email, etc.)
    print(f"Reminder: {task['title']} is due soon!")

# def send_reminder(task):
#     print(f"Reminder: {task['title']} is due soon!")

#     user_id = task.get("user_id")
#     title = "Task Reminder"
#     body = f"Your task '{task['title']}' is due soon!"

#     if user_id:
#         send_push_notification(user_id, title, body)


# Schedule reminders for tasks
@app.post("/smart-reminders/{user_id}")
async def get_smart_reminders(request: Request):
    # Extract user ID from the Authorization header
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user_id = get_user_id_from_token(authorization_header)
      
    tasks = await fetch_user_tasks(user_id)  # Fetch tasks from the database

    for task in tasks:
        if task.get('deadline'):  # Ensure the task has a deadline
            deadline = datetime.strptime(task['deadline'], "%Y-%m-%d %H:%M:%S")
            scheduler.add_job(send_reminder, 'date', run_date=deadline, args=[task])
    if not scheduler.running:
        scheduler.start()  # Start the scheduler to send reminders
    return {"message": "Reminders set successfully."}

# @app.post("/smart-reminders/{user_id}")
# async def get_smart_reminders(request: Request):
#     authorization_header = request.headers.get("Authorization")
#     if not authorization_header:
#         raise HTTPException(status_code=401, detail="Authorization header missing")
    
#     user_id = get_user_id_from_token(authorization_header)
#     tasks = await fetch_user_tasks(user_id)

#     for task in tasks:
#         if task.get('deadline'):
#             deadline = datetime.strptime(task['deadline'], "%Y-%m-%d %H:%M:%S")
#             task['user_id'] = user_id  # Required for push
#             scheduler.add_job(send_reminder, 'date', run_date=deadline, args=[task])

#     scheduler.start()
#     return {"message": "Reminders set successfully."}




@app.post("/group_tasks/{user_id}")
async def group_tasks(request: Request):
    # Extract user ID from the Authorization header
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user_id = get_user_id_from_token(authorization_header)
      
    tasks = await fetch_user_tasks(user_id)
    grouped_tasks = await get_task_groupings(tasks)  # Group tasks based on your logic
    return {"grouped_tasks": grouped_tasks}



@app.post("/monetize-tasks/{user_id}")
async def monetize_tasks(request: Request):
    # Extract user ID from the Authorization header
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user_id = get_user_id_from_token(authorization_header)
      
    tasks = await fetch_user_tasks(user_id)  # Fetch tasks
    tasks_titles = [task['title'] for task in tasks]  # Assuming each task has a title
    insights = await get_monetization_insights(tasks_titles)  # Pass task titles for monetization insights
    return {"monetization_insights": insights}

@app.post("/estimate-cost-time/{user_id}")
async def estimate_task_cost_time(request: Request):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user_id = get_user_id_from_token(authorization_header)
    tasks = await fetch_user_tasks(user_id)
    estimates = await estimate_task_time_and_cost(tasks)
    return {"task_estimates": estimates}

@app.post("/generate-recurring-tasks/{user_id}")
async def generate_recurring_tasks(request: Request):
    authorization_header = request.headers.get("Authorization")
    if not authorization_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    user_id = get_user_id_from_token(authorization_header)
    tasks = await fetch_user_tasks(user_id)
    
    recurring_tasks =  generate_recurrent_tasks(tasks)
    return {"recurring_tasks": recurring_tasks}


# @app.get("/ai/recommend-method")
# async def recommend_method(current_user: TokenData = Depends(get_current_user)):
#     user_info = await db.users.find_one({"_id": ObjectId(current_user.user_id)})
#     tasks = await fetch_pending_tasks(current_user.user_id)

#     context = analyze_user_context(user_info, tasks)
#     prompt = build_prompt(context)
#     response = await recommend_method(prompt)

#     return {"recommendation": response}

# class MethodInput(BaseModel):
#     situation: str
#     importance: str  # Expected: "high", "medium", "low"

# @app.post("/suggest-method")
# async def suggest_productivity_method(user_input: MethodInput):
#     try:
#         method = recommend_method(user_input.situation, user_input.importance)
#         return {"recommended_method": method}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e)) 
    
    
# @app.post("/recommend", response_model=dict)
# async def recommend_method_endpoint(request: RecommendRequest):
#     try:
#         # Call the function to recommend method based on user input
#         recommendation = await recommend_method(request)
#         return recommendation
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
    
# @app.post("/recommend-productivity-method/{user_id}")
# async def recommend_productivity_method(request: RecommendRequest):
#     try:
#         # Extract the Authorization header from the request
#         authorization_header = request.headers.get("Authorization")
#         if not authorization_header:
#             raise HTTPException(status_code=401, detail="Authorization header missing")
        
#         # Get the user ID from the token (you can replace this with your own logic)
#         user_id = get_user_id_from_token(authorization_header)
        
#         # Call the recommend_method function and get the recommendation
#         recommendation = await recommend_method(request)
#         return recommendation
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
    
# from fastapi import APIRouter, HTTPException, Request
# from .methods import recommend_method, RecommendRequest  # Make sure 'recommend_method' and 'RecommendRequest' are correctly imported
# from typing import Dict,Optional

# from pydantic import BaseModel

# class RecommendRequest(BaseModel):
#     current_situation: str  # e.g., 'overwhelmed', 'procrastination', 'focus_issues', 'managing_well', 'other'
#     importance: str         # 'high', 'medium', 'low'
#     urgency: str            # 'high', 'medium', 'low'
#     additional_details: Optional[str] = None

# # --- Step 2: Define the API endpoint for recommending productivity methods ---
# @app.post("/recommend-productivity-method/{user_id}")
# async def recommend_productivity_method(request: Request, body: RecommendRequest):
#     try:
#         # Extract the Authorization header from the Request object
#         authorization_header = request.headers.get("Authorization")
#         if not authorization_header:
#             raise HTTPException(status_code=401, detail="Authorization header missing")
        
#         # Get the user ID from the token (you can replace this with your own logic)
#         user_id = get_user_id_from_token(authorization_header)
#         tasks = await fetch_user_tasks(user_id)
        
#         # Call the recommend_method function and get the recommendation
#         recommendation = await recommend_method(body)
#         return recommendation
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommend-productivity-method/by-category")
async def ai_suggestions(
    category: str = Query(..., description="Category like productivity methods, fitness, etc."),
    current_situation: str = Query(..., description="User's current situation"),
    importance: str = Query(..., description="Task importance level (e.g., high, medium, low)"),
    urgency: str = Query(..., description="Task urgency level (e.g., high, medium, low)"),
    additional_details: str = Query("", description="Any additional information the user provides")
):
    try:
        # Call the function that fetches the Llama suggestions
        suggestions = await get_llama_suggestions_methods(current_situation, importance, urgency, additional_details)
        return {
            "category": category,
            "suggestions": suggestions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
