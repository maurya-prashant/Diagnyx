# backend/nodes/critic_node.py

from services.llm_provider import call_llm
import json
from services.utils import safe_json_parse

def critic_node(state):
    # REMOVED the [:500] slicing to avoid missing critical data
    extraction = state.get("extraction_result", "")
    rootcause = state.get("rootcause_result", "")
    diet = state.get("diet_result", "")

    prompt = f"""
You are a Senior Medical Auditor. Your job is to ensure the interpretation is 100% accurate based on the extracted data.

CHECKLIST:
1. Does the Diet Plan contradict any Lab Results? (e.g., suggesting high-potassium foods for a patient with Kidney issues).
2. Did the Root Cause analysis miss any abnormal values found in the Extraction?
3. Is the Diet Plan too generic? (It must be specific to the abnormal values).

Return ONLY JSON:
{{
 "issues": ["List of specific errors found"],
 "needs_revision": true/false,
 "feedback": "Detailed instructions on what the other agents must fix"
}}

EXTRACTION: {extraction}
ROOT CAUSE: {rootcause}
DIET PLAN: {diet}
"""

    res = call_llm(prompt)
    # Use the safe_json_parse helper you already have in utils.py
    result = safe_json_parse(res, fallback={"needs_revision": False, "issues": [], "feedback": ""})

    return {
        "critic_result": result,
        "critic_feedback": result.get("feedback", ""),
        "revision_count": state.get("revision_count", 0) + 1
    }