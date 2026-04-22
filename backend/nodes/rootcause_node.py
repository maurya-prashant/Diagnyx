
from services.llm_provider import call_llm

def rootcause_node(state):
    data = state["extraction_result"][:1500]

    prompt = f"""
Based on ALL abnormal values, list ALL possible conditions.
Do not miss any.

{data}
"""

    res = call_llm(prompt)   
    result = res            

    return {
        "rootcause_result": result
    }
