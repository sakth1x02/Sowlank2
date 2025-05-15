import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Function to summarize the raw notes
async def summarize_notes(notes: str):
    prompt = f"""
    You are an AI assistant that helps users summarize their meeting notes or unstructured thoughts.
    The user has provided the following notes:
    
    {notes}
    
    Please extract key tasks, ideas, or action items from these notes and present them as a numbered list.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant for summarizing notes."},
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

        # Return the tasks extracted from the notes
        return [line.strip("- ").strip() for line in content.split("\n") if line.strip()]

# Function to assign time blocks to tasks
def suggest_time_blocks(tasks: list):
    time_blocks = []
    for task in tasks:
        if "meeting" in task.lower():
            time_blocks.append((task, "30 minutes"))
        elif "discussion" in task.lower() or "review" in task.lower():
            time_blocks.append((task, "1 hour"))
        elif "strategy" in task.lower() or "planning" in task.lower():
            time_blocks.append((task, "2 hours"))
        elif "email" in task.lower() or "check" in task.lower():
            time_blocks.append((task, "15 minutes"))
        else:
            time_blocks.append((task, "1 hour"))
    
    return time_blocks
