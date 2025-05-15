# monetizer.py

import os
import httpx
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Helper function to generate social media tips
def get_social_tip(task: str) -> str:
    task_lower = task.lower()

    if "design" in task_lower or "banner" in task_lower:
        return "Post your design on Instagram or LinkedIn using #GraphicDesign or #CreativeProcess."

    elif "blog" in task_lower or "write" in task_lower:
        return "Post your blog on LinkedIn or X (Twitter) with hashtags like #AI, #TechBlog, #ContentCreation."

    elif "video" in task_lower or "edit" in task_lower:
        return "Post a teaser on YouTube Shorts, Instagram Reels, or TikTok to boost visibility."

    elif "app" in task_lower or "build" in task_lower or "code" in task_lower:
        return "Share a demo on LinkedIn or Twitter with #IndieDev, #BuildInPublic, or #TechShowcase."

    else:
        return "Share your progress or insight on LinkedIn or X to engage with a professional audience."

# Main AI function
async def get_monetization_insights(tasks: list):
    task_list = "\n".join(f"- {task}" for task in tasks)

    prompt = f"""
You are an AI assistant helping users find monetization opportunities.
Given the following tasks, suggest how each one could be monetized.
If a task has no clear path to monetization, say so politely.

Tasks:
{task_list}

Return only monetization suggestions in this format:
Task: <task title>
Monetization: <one-sentence idea>
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that analyzes monetization opportunities."},
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

    # Parse the response and attach social tips
    suggestions = []
    current_task = None
    current_monetization = None

    for line in content.splitlines():
        line = line.strip()
        if line.lower().startswith("task:"):
            current_task = line[5:].strip()
        elif line.lower().startswith("monetization:") and current_task:
            current_monetization = line[13:].strip()
            social_tip = get_social_tip(current_task)
            suggestions.append({
                "task": current_task,
                "monetization": current_monetization,
                "social_tip": social_tip
            })
            current_task = None
            current_monetization = None

    return {"monetization_insights": suggestions}

