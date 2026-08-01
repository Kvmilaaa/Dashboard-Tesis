from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Study
from app.db.session import get_db
from app.schemas.study import StudyCreate, StudyOut, StudyUpdateState

router = APIRouter(prefix="/studies")


@router.get("/", response_model=list[StudyOut])
def list_studies(db: Session = Depends(get_db)) -> list[StudyOut]:
    statement = select(Study).order_by(Study.id.desc())
    return list(db.scalars(statement).all())


@router.post("/", response_model=StudyOut, status_code=status.HTTP_201_CREATED)
def create_study(payload: StudyCreate, db: Session = Depends(get_db)) -> StudyOut:
    study = Study(
        titulo=payload.titulo,
        fecha_inicio=payload.fecha_inicio,
        fecha_fin=payload.fecha_fin,
        empresa=payload.empresa,
        muestra=payload.muestra,
        tecnica=payload.tecnica,
        cuotas_json=payload.cuotas_json,
        link_cuestionario=payload.link_cuestionario,
        estado="Creacion de Estudio",
    )
    db.add(study)
    db.commit()
    db.refresh(study)
    return study


@router.get("/{study_id}", response_model=StudyOut)
def get_study(study_id: int, db: Session = Depends(get_db)) -> StudyOut:
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estudio no encontrado.")
    return study


@router.patch("/{study_id}/estado", response_model=StudyOut)
def update_study_state(study_id: int, payload: StudyUpdateState, db: Session = Depends(get_db)) -> StudyOut:
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estudio no encontrado.")

    study.estado = payload.estado
    db.commit()
    db.refresh(study)
    return study


@router.delete("/{study_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_study(study_id: int, db: Session = Depends(get_db)) -> None:
    study = db.get(Study, study_id)
    if not study:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estudio no encontrado.")

    db.delete(study)
    db.commit()
