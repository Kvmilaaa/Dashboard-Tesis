from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class StudyBase(BaseModel):
    titulo: str = Field(min_length=1, max_length=255)
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    empresa: str | None = None
    muestra: int | None = Field(default=None, ge=0)
    tecnica: str | None = None
    cuotas_json: dict | None = None
    link_cuestionario: str | None = None


class StudyCreate(StudyBase):
    pass


class StudyUpdateState(BaseModel):
    estado: str = Field(min_length=2, max_length=100)


class StudyOut(StudyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    estado: str
    created_at: datetime | None = None
