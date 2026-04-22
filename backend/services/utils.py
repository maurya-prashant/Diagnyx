import json
import re

def safe_json_parse(text: str, fallback: dict, log_errors=True):
    """
    Safely parses LLM output into JSON.
    Removes markdown fences and handles broken outputs.
    """

    if not text:
        return fallback

    # remove markdown code blocks
    text = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(text)
    except Exception as e:
        if log_errors:
            print("JSON parse failed:", e)
            print("RAW:", text[:300])
        return fallback