# backend/nodes/rootcause_node.py

from services.llm_provider import call_llm

def rootcause_node(state):
    # 1. Get the extraction object from state
    extraction = state.get("extraction_result")

    # 2. Check if it exists and convert it to a string/dict so the LLM can read it
    # We use .dict() because it's a Pydantic model
    if extraction:
        data_text = str(extraction.dict()) 
    else:
        data_text = "No medical data extracted."

    # 3. Create the prompt (NO SLICING [:1500] here!)
    prompt = f"""
Based on the following structured medical data, list all possible medical root causes and conditions. 
Be thorough and explain the reasoning for each condition based on the lab values.


DATA:
{data_text}
"""

    res = call_llm(prompt)            
    return {"rootcause_result": res}