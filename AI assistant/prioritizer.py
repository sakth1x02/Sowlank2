# prioritizer.py
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def get_prioritized_tasks(tasks: list):
    formatted_tasks = "\n".join(
        [f"- {task['title']} (Urgency: {task.get('urgency', 'unknown')}, Deadline: {task.get('deadline', 'N/A')})" for task in tasks]
    )

    prompt = f"""
You are an AI productivity assistant. Based on the following tasks, analyze urgency, deadlines, and importance, and suggest the top 3 tasks to prioritize today. Be concise and helpful.

Tasks:
{formatted_tasks}

Respond with the top 3 tasks and a short reason for each.
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a productivity coach AI."},
            {"role": "user", "content": prompt}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        data = response.json()
        return data['choices'][0]['message']['content']
