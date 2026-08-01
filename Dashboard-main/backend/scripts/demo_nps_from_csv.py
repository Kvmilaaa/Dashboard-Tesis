from pathlib import Path
import sys

import pandas as pd

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.services.nps import compute_nps_from_scores


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    csv_path = root / "resultados_ejemplo.csv"

    if not csv_path.exists():
        raise FileNotFoundError(f"No existe el archivo: {csv_path}")

    df = pd.read_csv(csv_path)
    if "nps_score" not in df.columns:
        raise ValueError("El CSV debe contener la columna 'nps_score'.")

    result = compute_nps_from_scores(df["nps_score"].tolist())
    print("Resultado NPS:")
    print(result)


if __name__ == "__main__":
    main()
