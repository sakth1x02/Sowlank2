# app/reminders.py

import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def generate_reminders_and_nudges(tasks: list):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
You're an AI assistant that sends helpful reminders and motivational nudges.

For each task:
- Suggest a good reminder time based on the urgency and deadline.
- If the task is not completed, suggest a positive, encouraging nudge to help them focus.

Tasks:
{tasks}

Respond in JSON format like this:
[
  {{
    "task": "Task name",
    "reminder_time": "2025-04-18T09:00:00",
    "nudge_message": "Let’s wrap this up today! You’re almost there."
  }},
  ...
]
"""

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a motivational productivity assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        result = response.json()
        content = result["choices"][0]["message"]["content"]

        return content
