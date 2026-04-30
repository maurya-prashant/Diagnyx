

from services.llm_provider import call_llm

def diet_node(state):
    extraction = state.get("extraction_result") # This is now an ExtractionResult object
    root_causes = state.get("rootcause_result", "")
    feedback = state.get("critic_feedback", "")

    # Create a condensed summary of ONLY abnormal labs for the prompt
    abnormal_labs = [
        f"{lab.test}: {lab.value} {lab.unit} ({lab.status})" 
        for lab in extraction.lab_results if lab.status and lab.status.lower() != "normal"
    ]
    labs_context = "\n".join(abnormal_labs) if abnormal_labs else "No abnormal labs found."

    if feedback:
        instruction = f"REVISION REQUIRED. Auditor feedback: {feedback}."
    else:
        instruction = "Generate a personalized, strict dietary plan."

    prompt = f"""
    You are a Clinical Dietitian.
    {instruction}

    PATIENT DATA:
    Abnormal Labs:
    {labs_context}

    Root Causes:
    {root_causes}

    RULES:
    1. For every abnormal lab, provide one specific food to avoid and one to include.
    2. Explain WHY based on the lab value.
    3. Be concise and medical.
    """

    res = call_llm(prompt)   
    return {"diet_result": res}