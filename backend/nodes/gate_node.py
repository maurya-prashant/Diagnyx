from services.llm_provider import call_llm

def gate_node(state):
    text = state["raw_text"][:1500]

    prompt = f"""
Is this a medical report?

Answer ONLY: YES or NO

{text}
"""

    res = call_llm(prompt).strip().lower()

    if res == "no":
        return {
            "rejected": True,
            "rejection_reason": "Not a medical report"
        }
        
        # fallback keyword check
    medical_keywords = [
    "blood", "glucose", "cholesterol",
    "hemoglobin", "test", "report"
    ]

    if any(k in text.lower() for k in medical_keywords):
        return {
            "rejected": False,
            "rejection_reason": ""
        }
        
    return {
        "rejected": False,
        "rejection_reason": ""
    }