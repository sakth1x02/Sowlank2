# time_cost_calculator.py
import os
import httpx
import re
import json
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

async def get_live_usd_to_inr_rate():
    url = "https://open.er-api.com/v6/latest/USD"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            data =  response.json() 
            #print("Exchange API Response:", data)
            return data.get("rates", {}).get("INR", 83.0)  # safe access
    except Exception as e:
        print("Error fetching exchange rate:", e)
        return 83.0  # fallback




def extract_json_from_response(content: str):
    """
    Extract the JSON array from the response text using regex.
    """
    try:
        match = re.search(r"\[\s*{.*?}\s*\]", content, re.DOTALL)
        if match:
            json_str = match.group(0)
            return json.loads(json_str)
        else:
            return {"error": "JSON block not found", "raw": content}
    except json.JSONDecodeError:
        return {"error": "Failed to parse response", "raw": content}


def convert_usd_to_inr_range(cost_string: str, exchange_rate: float = 83.0) -> str:
    """Convert USD cost range string to INR format."""
    dollar_values = re.findall(r"\$([\d,]+)", cost_string)
    if not dollar_values:
        return cost_string  # fallback

    rupee_values = []
    for val in dollar_values:
        try:
            rupees = round(float(val.replace(",", "")) * exchange_rate)
            rupee_values.append(f"₹{rupees}")
        except ValueError:
            continue

    if len(rupee_values) == 1:
        return rupee_values[0]
    elif len(rupee_values) == 2:
        return f"{rupee_values[0]} - {rupee_values[1]}"
    return cost_string


async def estimate_task_time_and_cost(tasks: list):
    task_list = "\n".join(f"- {task}" for task in tasks)

    prompt = f"""
You are a helpful assistant that estimates time and cost for tasks.
For each task, estimate how much time (in hours/days) and any cost involved (tools, services).
Also provide one quick tip to reduce time or cost.

Tasks:
{task_list}

Return in JSON list format like:
[
  {{
    "task": "Task name",
    "estimated_time": "2-3 hours",
    "estimated_cost": "$10",
    "estimated_cost_inr": "₹830",  # Add INR after USD cost
    "tips": "Use free alternatives like Canva instead of Adobe Illustrator."
  }}
]
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a smart assistant that estimates time and monetary cost for each task."},
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

        result = extract_json_from_response(content)
        
        # Apply INR conversion using live rate
        if isinstance(result, list):
            #rate = await fetch_usd_to_inr_rate()  # 🔄 fetch latest rate
            rate = await get_live_usd_to_inr_rate()
            for task in result:
                if "estimated_cost" in task:
                    task["estimated_cost_inr"] = convert_usd_to_inr_range(task["estimated_cost"], exchange_rate=rate)

        
        return result
