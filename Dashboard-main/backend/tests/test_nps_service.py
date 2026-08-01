from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.nps import compute_nps_from_scores


def test_nps_basic_case() -> None:
    scores = [10, 9, 8, 7, 6, 5, 0, 11, -1, None, "abc"]
    result = compute_nps_from_scores(scores)

    assert result["total_validas"] == 7
    assert result["percent_promotores"] == 28.57
    assert result["percent_detractores"] == 42.86
    assert result["percent_neutros"] == 28.57
    assert result["nps_score"] == -14.29


def test_nps_empty_case() -> None:
    result = compute_nps_from_scores([None, "x", -2, 12])

    assert result["total_validas"] == 0
    assert result["nps_score"] == 0.0


if __name__ == "__main__":
    test_nps_basic_case()
    test_nps_empty_case()
    print("OK: test_nps_service")
