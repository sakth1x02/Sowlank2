# import httpx
# import os
# from dotenv import load_dotenv

# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# async def get_llama_suggestions(category: str):
#     prompt = f"""
# You are a smart AI assistant inside a task manager app.
# Generate 3 personalized task suggestions for a user who is interested in this category: '{category}'.

# Each suggestion should be friendly, concise, and task-based.

# Example for 'Workout':
# - "Plan a 30-minute run tomorrow?"
# - "Try a 15-minute core workout today?"
# - "Join a virtual yoga class this evening?"

# Now generate for: {category}
# """

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": "llama3-8b-8192",
#         "messages": [
#             {"role": "system", "content": "You are a helpful task assistant."},
#             {"role": "user", "content": prompt}
#         ]
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             "https://api.groq.com/openai/v1/chat/completions",
#             headers=headers,
#             json=payload
#         )
#         data = response.json()
#         return data['choices'][0]['message']['content'].strip().split("\n")


# llama_groq.py

# import httpx
# import os
# from dotenv import load_dotenv

# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# async def get_llama_suggestions(category: str, user_info: dict):
#     # Default values
#     user_goals = user_info.get("goals", "general fitness")
#     activity_frequency = user_info.get("activity_frequency", 3)
#     focus_area = user_info.get("focus_area", "strength")
    
#     # Tailor prompts for different categories
#     if category.lower() == "gym":
#         prompt = f"""
#         You are an AI assistant that provides personalized gym task suggestions.
#         User's goals: {user_goals}
#         User wants to work out {activity_frequency} times per week and focus on {focus_area}.
#         Suggest three tasks related to gym and fitness.
#         """
#     elif category.lower() == "sports":
#         sports_type = user_info.get("sports_type", "soccer")
#         prompt = f"""
#         You are an AI assistant that provides personalized sports task suggestions.
#         User enjoys {sports_type} and wants to improve their endurance.
#         User trains {activity_frequency} times a week.
#         Suggest three tasks related to improving their skills and endurance in {sports_type}.
#         """
#     elif category.lower() == "selfcare":
#         prompt = f"""
#         You are an AI assistant that provides personalized self-care task suggestions.
#         User's goals: {user_goals}
#         User wants to focus on self-care for {activity_frequency} times per week.
#         Suggest three self-care tasks like meditation, journaling, or relaxing activities.
#         """
#     else:
#         prompt = f"""
#         You are an AI assistant that provides personalized task suggestions.
#         The user is interested in {category} and has the following goals: {user_goals}.
#         Suggest three tasks based on the {category} category and user’s goals.
#         """

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "model": "llama3-8b-8192",
#         "messages": [
#             {"role": "system", "content": "You are a helpful task assistant."},
#             {"role": "user", "content": prompt}
#         ]
#     }

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             "https://api.groq.com/openai/v1/chat/completions",
#             headers=headers,
#             json=payload
#         )
#         data = response.json()
#         content = data['choices'][0]['message']['content']
#         return [line.strip("- ").strip() for line in content.split("\n") if line.strip()]


import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

async def get_llama_suggestions(category: str, user_info: dict):
    user_goals = user_info.get("goals", "general fitness")
    activity_frequency = user_info.get("activity_frequency", 3)
    focus_area = user_info.get("focus_area", "strength")
    sports_type = user_info.get("sports_type", "")
    custom_info = user_info.get("custom_info", "")

    # Generate tailored prompt
    if category.lower() == "gym":
        prompt = f"""
You are an AI assistant that provides personalized gym task suggestions.

User goal: {user_goals}
Workout frequency: {activity_frequency} times/week
Focus area: {focus_area}

Give 3 friendly and specific task suggestions to help with their gym routine.
"""
    elif category.lower() == "sports":
        prompt = f"""
You are an AI assistant that provides smart suggestions for improving in sports.

User plays: {sports_type or 'a sport'}
Goal: {user_goals}
Training frequency: {activity_frequency} times/week

Suggest 3 personalized tasks to improve their performance in {sports_type or 'their sport'}.
"""
    elif category.lower() == "selfcare":
        prompt = f"""
You are an AI assistant helping users with self-care routines.

User's goal: {user_goals}
Frequency: {activity_frequency} times/week
Focus: {focus_area or 'mindfulness and relaxation'}

Suggest 3 gentle and actionable self-care tasks.
"""
    else:
        prompt = f"""
You are a smart assistant helping users be more productive and balanced.

Category: {category}
Goal: {user_goals}
Frequency: {activity_frequency} times/week
Focus: {focus_area}
Extra info: {custom_info}

Provide 3 creative and useful task suggestions for the user's interest in '{category}'.
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful and creative task suggestion assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7 
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GROQ_ENDPOINT, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            content = data['choices'][0]['message']['content']
            return [
                line.strip("- ").strip()
                for line in content.split("\n")
                if line.strip() and not line.strip().startswith("Here")
            ]
    except Exception as e:
        return [f"Error fetching suggestions: {str(e)}"]
