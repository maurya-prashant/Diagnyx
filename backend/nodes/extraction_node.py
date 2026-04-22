from services.llm_provider import call_llm

def extraction_node(state):
    text = state["raw_text"][:2000]

    prompt = f"""
Extract ALL medical data.

Return JSON with:
- all lab values
- abnormal flags
- diagnosis (if present)
- medications

DO NOT skip anything.

{text}
"""

    res = call_llm(prompt)

    result = res

    return {
        "extraction_result": result
    }