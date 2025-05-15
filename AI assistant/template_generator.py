# generator.py
import os
import httpx
import json
import re
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def extract_json_block(text: str):
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return None
    except Exception as e:
        print("Regex extraction failed:", str(e))
        return None

async def call_groq_and_generate_template(task_type: str):
    prompt = f"""
You are a helpful assistant that generates detailed task templates based on a task type.

Generate a complete task template for the task type: **{task_type}**.

Return a JSON array with at least 4 detailed task objects. Each object should include:

- "task_name" (e.g., Blog Post Creation),
- "sub_tasks" (5 clear subtasks),
- "estimated_time" (e.g., "2-3 hours"),
- "priority" ("High", "Medium", or "Low").

Respond with **only the JSON array** and nothing else.

Example format:
[
  {{
    "task_name": "Task Title",
    "sub_tasks": ["Subtask 1", "Subtask 2", "Subtask 3", "Subtask 4", "Subtask 5"],
    "estimated_time": "2-3 hours",
    "priority": "High"
  }},
  ...
]
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You generate detailed task templates based on the task type provided."},
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
        assistant_response = data["choices"][0]["message"]["content"]

        parsed_template = extract_json_block(assistant_response)
        if not parsed_template:
            raise ValueError("Failed to parse the assistant's response content as JSON")

        return parsed_template
