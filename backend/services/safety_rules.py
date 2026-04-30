
# Mapping of Lab Test -> Foods that are dangerous if that test is HIGH
CONTRAINDICATIONS = {
    "Potassium": ["banana", "spinach", "potato", "tomato", "avocado"],
    "Glucose": ["sugar", "white bread", "honey", "soda", "cake", "candy"],
    "Sodium": ["salt", "processed meat", "canned soup", "pickles"],
    "Cholesterol": ["fried food", "butter", "red meat", "trans fat"],
    "Creatinine": ["high protein", "excessive salt"] 
}

def check_for_safety_violations(lab_results, diet_plan):
    """
    Returns a list of violations if a forbidden food is found 
    in the diet plan for a high lab value.
    """
    violations = []
    diet_plan_lower = diet_plan.lower()
    
    for lab in lab_results:
        if lab.status and lab.status.lower() == "high":
            # Check if we have rules for this specific test
            forbidden_foods = CONTRAINDICATIONS.get(lab.test, [])
            for food in forbidden_foods:
                if food in diet_plan_lower:
                    violations.append(f"DANGER: {food} is forbidden because {lab.test} is High.")
    
    return violations