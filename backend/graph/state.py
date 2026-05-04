# # backend/graph/state.py

# from typing import TypedDict, Optional
# from models.medical import ExtractionResult, CriticResult

# class MedifyState(TypedDict, total=False):
#     file_path: str
#     raw_text: str
#     rejected: bool
#     rejection_reason: str
    
#     revision_count: int
#     critic_feedback: str

#     # CHANGED: Now using Pydantic Models instead of strings
#     extraction_result: ExtractionResult  # From medical.py
#     explanation_result: str
#     rootcause_result: str # We can make a model for this too, but let's start here
#     diet_result: str
#     critic_result: CriticResult          # From medical.py

#     final_report: dict




from typing import TypedDict, Optional
from models.medical import ExtractionResult, CriticResult

class MedifyState(TypedDict, total=False):
    # FIX: Rename file_path to file_bytes to match main.py and ingestion_node.py
    file_bytes: bytes  
    file_name: str    
    raw_text: str
    rejected: bool
    rejection_reason: str
    
    revision_count: int
    critic_feedback: str

    # Pydantic Models
    extraction_result: ExtractionResult  
    explanation_result: str
    rootcause_result: str 
    diet_result: str
    critic_result: CriticResult          

    final_report: dict