
from services.llm_provider import call_llm

def explanation_node(state):
    data = state["extraction_result"][:1500]

    prompt = f"""
Explain this medical report in simple terms:

{data}
"""

    res = call_llm(prompt)   
    result = res            

    return {
        "explanation_result": result
    }