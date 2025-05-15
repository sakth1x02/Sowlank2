#grouper.py
import os
import httpx
import json
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def get_task_groupings(tasks: list):
    task_list = "\n".join(f"- {task}" for task in tasks)

    prompt = f"""
You are a helpful assistant that organizes and groups similar tasks.
Group the following tasks into meaningful categories based on similarity or context.
Each group should have a group name and include the list of task titles under it.

Tasks:
{task_list}

Respond in this exact JSON format:
[
  {{
    "group_name": "Name of the group",
    "tasks": ["Task 1", "Task 2"]
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
            {"role": "system", "content": "You are an assistant that groups and organizes tasks into categories."},
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
        content = data["choices"][0]["message"]["content"]

        # Clean the response to extract only the JSON part
        try:
            # The content has extra text, we need to extract the JSON portion
            # Find the part starting with "[" and ending with "]"
            start_idx = content.find("[")
            end_idx = content.rfind("]") + 1  # Ensure we capture the whole JSON array
            json_content = content[start_idx:end_idx]

            # Parse the extracted JSON content
            return json.loads(json_content)

        except json.JSONDecodeError:
            return {"error": "Failed to parse response", "raw": content}
