from io import BytesIO

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.analytics import NPSRequest, NPSResult
from app.services.nps import compute_nps_from_scores

router = APIRouter(prefix="/analytics")


@router.post("/nps", response_model=NPSResult)
def calculate_nps(payload: NPSRequest) -> NPSResult:
    result = compute_nps_from_scores(payload.scores)
    return NPSResult(**result)


@router.post("/nps/csv", response_model=NPSResult)
async def calculate_nps_from_csv(
    file: UploadFile = File(...),
    nps_column: str = Form("nps_score"),
) -> NPSResult:
    try:
        content = await file.read()
        df = pd.read_csv(BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"No se pudo leer el CSV: {exc}") from exc

    if nps_column not in df.columns:
        raise HTTPException(status_code=400, detail=f"La columna '{nps_column}' no existe en el CSV.")

    result = compute_nps_from_scores(df[nps_column].tolist())
    return NPSResult(**result)
