
import json
from services.llm_provider import call_llm

def synthesis_node(state):
    extraction = state.get("extraction_result")
    
    # We can now build the final JSON programmatically for the structured parts
    # and let the LLM handle the natural language summary.
    
    prompt = f"""
    Create a final patient-friendly summary of the following findings:
    
    Labs: {extraction.lab_results}
    Root Causes: {state.get('rootcause_result')}
    Diet: {state.get('diet_result')}
    
    Return ONLY a JSON object with:
    {{
      "summary": "A human-readable explanation of what is happening with the patient's health",
      "key_takeaways": ["list of 3 most important points"]
    }}
    """
    
    res = call_llm(prompt)
    # Clean and parse
    try:
        summary_data = json.loads(res.replace("```json", "").replace("```", "").strip())
    except:
        summary_data = {"summary": "Analysis complete.", "key_takeaways": []}

    # Merge Pydantic data with LLM summary
    final_report = {
        "patient_info": {}, # You can add patient extraction to ExtractionResult model
        "lab_results": [lab.dict() for lab in extraction.lab_results],
        "root_causes": state.get("rootcause_result"),
        "diet": state.get("diet_result"),
        "summary": summary_data.get("summary"),
        "takeaways": summary_data.get("key_takeaways")
    }

    return {"final_report": final_report}