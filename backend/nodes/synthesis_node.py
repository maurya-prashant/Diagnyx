from services.llm_provider import call_llm
import json
import re


def clean_llm_json(text: str) -> str:
    # remove markdown fences
    text = re.sub(r"```json|```", "", text).strip()
    return text


def synthesis_node(state):

    prompt = f"""
You are a medical report synthesis engine.

Return ONLY valid JSON. No markdown. No explanation. No extra text.

JSON FORMAT:
{{
  "patient_info": {{
    "name": "",
    "age": "",
    "gender": ""
  }},
  "symptoms": [],
  "lab_results": {{}},
  "root_causes": [],
  "diet": [],
  "summary": ""
}}

DATA:
Extraction:
{state["extraction_result"][:1000]}

Explanation:
{state["explanation_result"][:500]}

Rootcause:
{state["rootcause_result"][:500]}

Diet:
{state["diet_result"][:500]}
"""

    res = call_llm(prompt)

    cleaned = clean_llm_json(res)

    try:
        result = json.loads(cleaned)
    except Exception as e:
        # STRICT fallback (don’t break schema)
        result = {
            "patient_info": {"name": "", "age": "", "gender": ""},
            "symptoms": [],
            "lab_results": {},
            "root_causes": [],
            "diet": [],
            "summary": cleaned[:500]
        }

    return {
        "final_report": result
    }