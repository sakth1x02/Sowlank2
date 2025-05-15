from datetime import datetime, timedelta
from typing import List, Optional


def generate_recurrent_tasks(tasks: List[dict], days_ahead: int = 14):
    all_generated = []

    for task in tasks:
        recurrence = task.get("recurrence")  # e.g. "daily", "weekly", etc.
        if not recurrence:
            continue

        start_date = datetime.strptime(task["start_date"], "%Y-%m-%d")
        end_date = datetime.now() + timedelta(days=days_ahead)
        current = start_date

        while current <= end_date:
            new_task = task.copy()
            new_task["title"] = f"{task['title']} ({current.strftime('%Y-%m-%d')})"
            new_task["due_date"] = current.strftime('%Y-%m-%d')
            all_generated.append(new_task)

            if recurrence == "daily":
                current += timedelta(days=1)
            elif recurrence == "weekly":
                current += timedelta(weeks=1)
            elif recurrence == "monthly":
                current += timedelta(days=30)  # basic monthly approx
            else:
                break

    return all_generated
