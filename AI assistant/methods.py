# from fastapi import APIRouter, Depends
# from bson import ObjectId
# from .auth import get_current_user, TokenData
# from .database import db  # Assuming you have your MongoDB setup here
# from .llama import call_llama3  # Your wrapper around Groq API

# router = APIRouter()

# # --- Step 1: Define 15 Methods ---
# METHODS = [
#     {"name": "Pomodoro Focus", "description": "Split tasks into 25-min focus blocks.", "best_for": ["overwhelmed", "procrastination", "low focus"]},
#     {"name": "Eisenhower Matrix", "description": "Divide tasks by urgency/importance.", "best_for": ["too many tasks", "urgency confusion"]},
#     {"name": "Eat the Frog", "description": "Do the hardest task first thing in the morning.", "best_for": ["important avoided tasks"]},
#     {"name": "Time Blocking", "description": "Assign fixed times to each task.", "best_for": ["busy schedule", "distractions"]},
#     {"name": "Pareto Principle", "description": "Focus on the 20% tasks yielding 80% results.", "best_for": ["too many tasks", "low ROI"]},
#     {"name": "Flowtime Technique", "description": "Flexible focus sessions based on personal rhythm.", "best_for": ["creative work", "need flexibility"]},
#     {"name": "Task Batching", "description": "Group similar tasks together.", "best_for": ["context switching", "low efficiency"]},
#     {"name": "SMART Goals", "description": "Make tasks Specific, Measurable, Achievable, Relevant, and Time-bound.", "best_for": ["unclear goals"]},
#     {"name": "Daily Top 3", "description": "Focus on 3 most impactful tasks.", "best_for": ["overwhelm", "lack of focus"]},
#     {"name": "Timeboxing", "description": "Pre-allocate time for each task strictly.", "best_for": ["procrastination", "poor time estimation"]},
#     {"name": "MIT (Most Important Task)", "description": "Start day with your most important task.", "best_for": ["low impact work"]},
#     {"name": "ABCDE Method", "description": "Prioritize tasks from A (most important) to E (eliminate).", "best_for": ["need prioritization"]},
#     {"name": "Kanban Board", "description": "Visualize tasks as cards across stages.", "best_for": ["visual learners", "task flow"]},
#     {"name": "Energy Management", "description": "Align task difficulty with your energy levels.", "best_for": ["fatigue", "burnout"]},
#     {"name": "2-Minute Rule", "description": "If a task takes less than 2 minutes, do it immediately.", "best_for": ["quick wins"]},
# ]

# #Analyze User Context 
# def analyze_user_context(user_info, tasks):
#     overdue_tasks = [t for t in tasks if t.get("status") != "completed"]
#     context = {
#         "task_overload": len(overdue_tasks) > 5,
#         "focus_issues": user_info.get("negativePoints", 0) > 5,
#         "recent_negative_trend": user_info.get("totalPoints", 0) < 10,
#         "last_active_days_ago": 2,  # Add your own calculation here
#         "user_message": "I'm struggling to stay consistent and productive."
#     }
#     return context

# #Build Prompt 
# def build_prompt(context):
#     method_descriptions = "\n".join(
#         [f"{i+1}. {m['name']} – Best for: {', '.join(m['best_for'])}" for i, m in enumerate(METHODS)]
#     )

#     return f"""
# You are an intelligent assistant. There are 15 productivity methods available to help users manage tasks better.

# Each method has a name, description, and situations where it's most helpful.

# User's current situation:
# - Overwhelmed with tasks: {context['task_overload']}
# - Focus issues: {context['focus_issues']}
# - Recently inconsistent: {context['recent_negative_trend']}
# - Last active: {context['last_active_days_ago']} days ago
# - User message: "{context['user_message']}"

# Methods:
# {method_descriptions}

# Choose the BEST matching method from the list. Respond in this format:
# - Recommended Method: <name>
# - Why: <reason>
# - How to start: <simple suggestion>
# """

# #  Fetch Tasks
# async def fetch_pending_tasks(user_id):
#     daily = await db.daily_tasks.find({"user_id": user_id}).to_list(None)
#     weekly = await db.weekly_tasks.find({"user_id": user_id}).to_list(None)
#     yearly = await db.yearly_tasks.find({"user_id": user_id}).to_list(None)
#     return daily + weekly + yearly

# # --- Step 5: FastAPI Endpoint ---
# @router.get("/ai/recommend-method")
# async def recommend_method(current_user: TokenData = Depends(get_current_user)):
#     user_info = await db.users.find_one({"_id": ObjectId(current_user.user_id)})
#     tasks = await fetch_pending_tasks(current_user.user_id)

#     context = analyze_user_context(user_info, tasks)
#     prompt = build_prompt(context)
#     response = await call_llama3(prompt)

#     return {"recommendation": response}


# from fastapi import APIRouter
# from pydantic import BaseModel
# from typing import Optional, List, Dict
# import os
# import httpx
# from dotenv import load_dotenv

# # Load API key
# load_dotenv()
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# # --- Step 1: Define 15 Productivity Methods ---
# METHODS: List[Dict] = [
#     {"name": "Pomodoro Focus", "description": "Split tasks into 25-min focus blocks.", "best_for": ["overwhelmed", "procrastination", "low focus"]},
#     {"name": "Eisenhower Matrix", "description": "Divide tasks by urgency/importance.", "best_for": ["too many tasks", "urgency confusion"]},
#     {"name": "Eat the Frog", "description": "Do the hardest task first thing in the morning.", "best_for": ["important avoided tasks"]},
#     {"name": "Time Blocking", "description": "Assign fixed times to each task.", "best_for": ["busy schedule", "distractions"]},
#     {"name": "Pareto Principle", "description": "Focus on the 20% tasks yielding 80% results.", "best_for": ["too many tasks", "low ROI"]},
#     {"name": "Flowtime Technique", "description": "Flexible focus sessions based on personal rhythm.", "best_for": ["creative work", "need flexibility"]},
#     {"name": "Task Batching", "description": "Group similar tasks together.", "best_for": ["context switching", "low efficiency"]},
#     {"name": "SMART Goals", "description": "Make tasks Specific, Measurable, Achievable, Relevant, and Time-bound.", "best_for": ["unclear goals"]},
#     {"name": "Daily Top 3", "description": "Focus on 3 most impactful tasks.", "best_for": ["overwhelm", "lack of focus"]},
#     {"name": "Timeboxing", "description": "Pre-allocate time for each task strictly.", "best_for": ["procrastination", "poor time estimation"]},
#     {"name": "MIT (Most Important Task)", "description": "Start day with your most important task.", "best_for": ["low impact work"]},
#     {"name": "ABCDE Method", "description": "Prioritize tasks from A (most important) to E (eliminate).", "best_for": ["need prioritization"]},
#     {"name": "Kanban Board", "description": "Visualize tasks as cards across stages.", "best_for": ["visual learners", "task flow"]},
#     {"name": "Energy Management", "description": "Align task difficulty with your energy levels.", "best_for": ["fatigue", "burnout"]},
#     {"name": "Two-Minute Rule", "description": "If a task takes less than two minutes, do it immediately.", "best_for": ["quick wins"]},
# ]

# # --- Step 2: Define Input Model (all inputs from user) ---
# class RecommendRequest(BaseModel):
#     current_situation: str  # e.g., 'overwhelmed', 'procrastination', 'focus_issues', 'managing_well', 'other'
#     importance: str         # 'high', 'medium', 'low'
#     urgency: str            # 'high', 'medium', 'low'
#     additional_details: Optional[str] = None

# # --- Step 3: Build the LLM prompt ---
# def build_prompt(ctx: RecommendRequest) -> str:
#     method_list = "\n".join(
#         [f"{i+1}. {m['name']} (Best for: {', '.join(m['best_for'])})" for i, m in enumerate(METHODS)]
#     )
#     return f"""
# You are an AI productivity assistant. Based on the user's current situation and task characteristics, select the single best productivity method from the list below.

# User Situation:
# - Feeling: {ctx.current_situation}
# - Task Importance: {ctx.importance}
# - Task Urgency: {ctx.urgency}
# - Additional Details: {ctx.additional_details or 'None'}

# Available Methods:
# {method_list}

# Respond only with:
# - Recommended Method: <name>
# - Why: <one-sentence reason>
# - How to start: <one actionable step>
# """

# # --- Step 4: Endpoint to receive user inputs and call Groq API directly ---
# async def recommend_method(request: RecommendRequest):
#     prompt = build_prompt(request)
#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "model": "llama3-8b-8192",
#         "messages": [
#             {"role": "system", "content": "You are an AI productivity assistant."},
#             {"role": "user", "content": prompt}
#         ]
#     }
#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             "https://api.groq.com/openai/v1/chat/completions",
#             headers=headers,
#             json=payload
#         )
#         response.raise_for_status()
#         data = response.json()
#         content = data.get("choices", [])[0].get("message", {}).get("content", "")
#     return {"recommendation": content}

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

# Load the API key from the environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# List of productivity methods
# METHODS = [
#     {"name": "Pomodoro Focus", "description": "Split tasks into 25-min focus blocks.", "best_for": ["overwhelmed", "procrastination", "low focus"]},
#     {"name": "Eisenhower Matrix", "description": "Divide tasks by urgency/importance.", "best_for": ["too many tasks", "urgency confusion"]},
#     {"name": "Eat the Frog", "description": "Do the hardest task first thing in the morning.", "best_for": ["important avoided tasks"]},
#     {"name": "Time Blocking", "description": "Assign fixed times to each task.", "best_for": ["busy schedule", "distractions"]},
#     {"name": "Pareto Principle", "description": "Focus on the 20% tasks yielding 80% results.", "best_for": ["too many tasks", "low ROI"]},
#     {"name": "Flowtime Technique", "description": "Flexible focus sessions based on personal rhythm.", "best_for": ["creative work", "need flexibility"]},
#     {"name": "Task Batching", "description": "Group similar tasks together.", "best_for": ["context switching", "low efficiency"]},
#     {"name": "SMART Goals", "description": "Make tasks Specific, Measurable, Achievable, Relevant, and Time-bound.", "best_for": ["unclear goals"]},
#     {"name": "Daily Top 3", "description": "Focus on 3 most impactful tasks.", "best_for": ["overwhelm", "lack of focus"]},
#     {"name": "Timeboxing", "description": "Pre-allocate time for each task strictly.", "best_for": ["procrastination", "poor time estimation"]},
#     {"name": "MIT (Most Important Task)", "description": "Start day with your most important task.", "best_for": ["low impact work"]},
#     {"name": "ABCDE Method", "description": "Prioritize tasks from A (most important) to E (eliminate).", "best_for": ["need prioritization"]},
#     {"name": "Kanban Board", "description": "Visualize tasks as cards across stages.", "best_for": ["visual learners", "task flow"]},
#     {"name": "Energy Management", "description": "Align task difficulty with your energy levels.", "best_for": ["fatigue", "burnout"]},
#     {"name": "Two-Minute Rule", "description": "If a task takes less than two minutes, do it immediately.", "best_for": ["quick wins"]}
# ]

METHODS = [
    {"name": "Pomodoro Technique", "description": "Work in focused 25-minute intervals with short breaks.", "best_for": ["overwhelmed", "procrastination", "low focus"]},
    {"name": "Eisenhower Matrix", "description": "Prioritize tasks based on urgency and importance.", "best_for": ["too many tasks", "urgency confusion"]},
    {"name": "ABCDE Method", "description": "Categorize tasks and prioritize by importance (A-E).", "best_for": ["need prioritization"]},
    {"name": "3-3-3 Method", "description": "Balance deep work, shorter tasks, and maintenance tasks.", "best_for": ["balanced productivity", "planning daily workload"]},
    {"name": "Two-Minute Rule", "description": "Complete quick tasks immediately to avoid procrastination.", "best_for": ["quick wins", "procrastination"]},
    {"name": "Pareto Principle (80/20)", "description": "Focus on the vital 20% that produces 80% of results.", "best_for": ["too many tasks", "low ROI"]},
    {"name": "Eat the Frog", "description": "Do your most important and challenging tasks first.", "best_for": ["important avoided tasks", "low motivation"]},
    {"name": "Getting Things Done", "description": "Capture, clarify, organize, reflect, and engage.", "best_for": ["task overload", "mental clutter"]},
    {"name": "Kanban Board", "description": "Visualize workflow with to-do, in-progress, and completed columns.", "best_for": ["visual learners", "workflow clarity"]},
    {"name": "Task Batching", "description": "Group similar tasks to minimize context switching.", "best_for": ["context switching", "low efficiency"]},
    {"name": "Warren Buffet 5/25 Rule", "description": "Focus only on your top 5 priorities out of 25.", "best_for": ["overcommitment", "lack of focus"]},
    {"name": "MoSCoW Method", "description": "Categorize tasks as Must-Have, Should-Have, Could-Have, or Won’t-Have.", "best_for": ["requirement clarity", "scope management"]},
    {"name": "Time Blocking", "description": "Schedule specific time blocks for different types of work.", "best_for": ["busy schedule", "distractions"]},
    {"name": "1-3-5 Rule", "description": "Plan to accomplish 1 big, 3 medium, and 5 small tasks daily.", "best_for": ["daily planning", "task overwhelm"]},
    {"name": "Pickle Jar Theory", "description": "Prioritize major tasks first, then fit in smaller ones.", "best_for": ["task balance", "time budgeting"]}
]

# Define the function to build the LLM prompt
def build_prompt(current_situation: str, importance: str, urgency: str, additional_details: str) -> str:
    method_list = "\n".join(
        [f"{i+1}. {m['name']} (Best for: {', '.join(m['best_for'])})" for i, m in enumerate(METHODS)]
    )
    return f"""
You are an AI productivity assistant. Based on the user's current situation and task characteristics, select the single best productivity method from the list below.

User Situation:
- Feeling: {current_situation}
- Task Importance: {importance}
- Task Urgency: {urgency}
- Additional Details: {additional_details or 'None'}

Available Methods:
{method_list}

Respond only with:
- Recommended Method: <name>
- Why: <one-sentence reason>
- How to start: <one actionable step>
"""

# Define the function to call Groq API
async def get_llama_suggestions_methods(current_situation: str, importance: str, urgency: str, additional_details: str):
    prompt = build_prompt(current_situation, importance, urgency, additional_details)
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are an AI productivity assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        content = data.get("choices", [])[0].get("message", {}).get("content", "")
    return content


