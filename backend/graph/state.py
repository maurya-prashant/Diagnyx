from typing import TypedDict, Optional, Dict, Any


class MedifyState(TypedDict, total=False):
    # input
    file_path: str
    raw_text: str

    # pipeline flags
    rejected: bool
    rejection_reason: str

    # agent outputs
    gate_result: dict
    extraction_result: dict
    explanation_result: dict
    rootcause_result: dict
    diet_result: dict
    critic_result: dict

    final_report: dict