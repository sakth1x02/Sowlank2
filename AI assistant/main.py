# from fastapi import FastAPI
# from app.database import Base, engine
# from app.routers import smart_suggestions

# Base.metadata.create_all(bind=engine)

# app = FastAPI()
# app.include_router(smart_suggestions.router)


# from fastapi import FastAPI
# from app.database import engine, Base
# from app.routers import smart_suggestions
# from app import models

# # Create tables in the database (if they do not exist)
# Base.metadata.create_all(bind=engine)

# # Initialize the FastAPI app
# app = FastAPI()

# # Include your routers
# app.include_router(smart_suggestions.router)


# from fastapi import FastAPI, Query
# from .llama import get_llama_suggestions
# import uvicorn

# app = FastAPI()

# @app.get("/ai/suggestions/by-category")
# async def ai_suggestions(category: str = Query(...)):
#     suggestions = await get_llama_suggestions(category)
#     return {"category": category, "suggestions": suggestions}


# main.py
from fastapi import FastAPI, Query
from .llama import get_llama_suggestions
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi import APIRouter, Body
from .llama import get_llama_suggestions
from .prioritizer import get_prioritized_tasks 
from .monetizer import get_monetization_insights
from .summarizations import summarize_notes, suggest_time_blocks
from .smart_reminder import generate_reminders_and_nudges
from .grouper import get_task_groupings
from .time_cost_calculator import estimate_task_time_and_cost
from .template_generator import call_groq_and_generate_template
from .recurrence import generate_recurrent_tasks


app = FastAPI()

# CORS setup (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Smart Suggestions API is running!"}

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
    
class Task(BaseModel):
    title: str
    urgency: str = "medium"
    deadline: str = None  # Optional

class TaskList(BaseModel):
    tasks: List[Task]

@app.post("/prioritize/")
async def prioritize_tasks(task_list: TaskList):
    try:
        result = await get_prioritized_tasks([task.dict() for task in task_list.tasks])
        return {"prioritized_tasks": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

class MonetizationRequest(BaseModel):
    tasks: List[str]

@app.post("/monetize-tasks")
async def monetize_tasks(req: MonetizationRequest):
    insights = await get_monetization_insights(req.tasks)
    return {"monetization_insights": insights} 

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

# app/routes/reminders.py 

router = APIRouter()

class Task(BaseModel):
    title: str
    deadline: Optional[str] = None
    urgency: Optional[str] = "medium"
    completed: Optional[bool] = False
    last_interaction: Optional[str] = None

class ReminderRequest(BaseModel):
    tasks: List[Task]
    
@app.post("/smart-reminders")
async def get_smart_reminders(request: ReminderRequest):
    # Now we can access the tasks from the request
    task_list = [task.dict() for task in request.tasks]
    insights = await generate_reminders_and_nudges(task_list)
    return {"smart_reminders": insights}

class TaskList(BaseModel):
    tasks: List[str]

@app.post("/group_tasks")
async def group_tasks_endpoint(task_list: TaskList):
    tasks = task_list.tasks
    grouped_tasks = await get_task_groupings(tasks)
    return {"grouped_tasks": grouped_tasks} 

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


class Task(BaseModel):
    title: str
    start_date: str  # YYYY-MM-DD
    recurrence: str  # "daily", "weekly", "monthly"
    description: Optional[str] = None


@app.post("/task-recurrence")
async def generate_recurring_tasks(tasks: List[Task]): 
    task_dicts = [task.dict() for task in tasks]
    recurring = generate_recurrent_tasks(task_dicts)
    return {"recurring_tasks": recurring} 