from pydantic import BaseModel, Field


class NPSRequest(BaseModel):
    scores: list[float] = Field(default_factory=list)


class NPSResult(BaseModel):
    total_validas: int
    nps_score: float
    percent_promotores: float
    percent_detractores: float
    percent_neutros: float
