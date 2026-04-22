from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel
from typing import List

class LabResult(BaseModel):
    test: str
    value: float
    unit: Optional[str] = None
    status: Optional[str] = None


class Medication(BaseModel):
    name: str
    dose: Optional[str] = None
    frequency: Optional[str] = None


class GateResult(BaseModel):
    result: str
    confidence: float
    reason: str


class ExtractionResult(BaseModel):
    lab_results: list[LabResult] = []
    medications: list[Medication] = []
    diagnosis: list[str] = []
    is_structured: bool = False
    
class CriticResult(BaseModel):
    issues_found: List[str] = []
    severity: str = "LOW"
    needs_revision: bool = False