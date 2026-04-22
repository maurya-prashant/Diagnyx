from services.llm_provider import call_llm

def diet_node(state):
    data = state["extraction_result"][:1500]

    prompt = f"""
You are a clinical nutrition recommendation engine.

Your task is to generate STRICT, CONDITION-SPECIFIC dietary recommendations based ONLY on the provided root causes and lab context.

CRITICAL RULES:
- Do NOT give general advice (e.g., "eat healthy", "balanced diet").
- Every recommendation must be medically specific.
- Tie each diet recommendation to ONE condition.
- Use measurable or concrete food examples.
- Do NOT include medication or diagnosis.
- Avoid repetition across conditions.
- Prioritize severity based on lab values if available.
- Keep medically safe and conservative.
"""

    res = call_llm(prompt)   
    result = res            

    return {
        "diet_result": result
    }