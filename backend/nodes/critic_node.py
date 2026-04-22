from services.llm_provider import call_llm
import json

def critic_node(state):

    extraction = state["extraction_result"][:1000]
    explanation = state["explanation_result"][:500]
    rootcause = state["rootcause_result"][:500]
    diet = state["diet_result"][:500]

    prompt = f"""
Check for issues.

Return JSON:
{{
 "issues": [],
 "needs_revision": true/false
}}

Extraction: {extraction}
Explanation: {explanation}
Rootcause: {rootcause}
Diet: {diet}
"""

    res = call_llm(prompt)

    try:
        result = json.loads(res)   #parsed JSON
    except:
        result = {"needs_revision": False}

    return {
        "critic_result": result
    }