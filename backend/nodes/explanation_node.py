
from services.llm_provider import call_llm

def explanation_node(state):
    # Get the object
    extraction = state.get("extraction_result")

    # Convert to string
    if extraction:
        data_text = str(extraction.dict())
    else:
        data_text = "No medical data extracted."

    prompt = f"""
Explain this medical data in simple, human-friendly terms for a patient. 
Avoid overly complex jargon and make it easy to understand.

DATA:
{data_text}
"""

    res = call_llm(prompt)            
    return {"explanation_result": res}