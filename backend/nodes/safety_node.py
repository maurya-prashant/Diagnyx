
from services.safety_rules import check_for_safety_violations

def safety_node(state):
    extraction = state.get("extraction_result")
    diet_plan = state.get("diet_result", "")
    
    if not extraction or not diet_plan:
        return {"critic_result": {"needs_revision": False}}

    violations = check_for_safety_violations(extraction.lab_results, diet_plan)
    
    if violations:
        feedback = " | ".join(violations)
        print(f"--- 🚨 SAFETY VIOLATION FOUND: {feedback} ---")
        return {
            "critic_result": {"needs_revision": True},
            "critic_feedback": f"CRITICAL SAFETY ERROR: {feedback}. Remove these foods immediately."
        }
    
    return {"critic_result": {"needs_revision": False}}