# backend/nodes/extraction_node.py

from services.llm_provider import call_llm_structured
from models.medical import ExtractionResult

def extraction_node(state):
    text = state.get("raw_text", "")

    prompt = f"""
    You are a medical data extraction specialist. 
    Extract all lab results, medications, and diagnoses from the following report.
    
    If a lab value is abnormal, ensure the 'status' field is marked as 'High', 'Low', or 'Abnormal'.
    
    REPORT TEXT:
    {text}
    """

    # Use the new structured helper
    result = call_llm_structured(prompt, ExtractionResult)

    return {"extraction_result": result}