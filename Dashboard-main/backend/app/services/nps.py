from collections.abc import Iterable
from typing import Any


def _to_float(value: Any) -> float | None:
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def compute_nps_from_scores(scores: Iterable[Any]) -> dict[str, float | int]:
    valid_scores: list[float] = []

    for raw_value in scores:
        score = _to_float(raw_value)
        if score is None:
            continue
        if 0 <= score <= 10:
            valid_scores.append(score)

    total_validas = len(valid_scores)
    if total_validas == 0:
        return {
            "total_validas": 0,
            "nps_score": 0.0,
            "percent_promotores": 0.0,
            "percent_detractores": 0.0,
            "percent_neutros": 0.0,
        }

    promotores = sum(1 for score in valid_scores if score >= 9)
    detractores = sum(1 for score in valid_scores if score <= 6)
    neutros = total_validas - promotores - detractores

    percent_promotores = (promotores / total_validas) * 100
    percent_detractores = (detractores / total_validas) * 100
    percent_neutros = (neutros / total_validas) * 100
    nps_score = percent_promotores - percent_detractores

    return {
        "total_validas": total_validas,
        "nps_score": round(nps_score, 2),
        "percent_promotores": round(percent_promotores, 2),
        "percent_detractores": round(percent_detractores, 2),
        "percent_neutros": round(percent_neutros, 2),
    }
