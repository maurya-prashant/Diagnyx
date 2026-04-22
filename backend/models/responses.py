from pydantic import BaseModel
from typing import Optional
from models.medical import GateResult, ExtractionResult


class RejectedResponse(BaseModel):
    status: str = "rejected"
    stage: str
    message: str


class AcceptedResponse(BaseModel):
    status: str = "accepted"
    filename: str
    gate: Optional[GateResult]
    structured_data: Optional[ExtractionResult]