"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import AppTopBar from "../../../../components/AppTopBar";
import { calculateNpsFromCsv, getStudy, NPSResult, Study } from "../../../../lib/api";
import { useAuthGuard } from "../../../../lib/useAuthGuard";

type Props = {
  params: {
    id: string;
  };
};

export default function AnalysisPage({ params }: Props) {
  const studyId = Number(params.id);
  const { ready, username } = useAuthGuard();

  const [study, setStudy] = useState<Study | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [npsColumn, setNpsColumn] = useState("nps_score");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NPSResult | null>(null);

  useEffect(() => {
    if (!ready || Number.isNaN(studyId)) {
      return;
    }

    let mounted = true;

    const loadStudy = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudy(studyId);
        if (!mounted) {
          return;
        }
        setStudy(data);
      } catch (apiError) {
        if (!mounted) {
          return;
        }
        setError(apiError instanceof Error ? apiError.message : "No se pudo cargar el estudio.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadStudy();

    return () => {
      mounted = false;
    };
  }, [ready, studyId]);

  const onAnalyze = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Selecciona un archivo CSV para analizar.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const nps = await calculateNpsFromCsv(file, npsColumn);
      setResult(nps);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "No se pudo calcular el NPS.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!ready) {
    return (
      <main>
        <section className="panel">
          <p>Verificando sesion...</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <AppTopBar username={username} />

      <section className="panel">
        <div className="section-header">
          <h1>Analizar Resultados</h1>
          <Link href={`/studies/${studyId}/monitor`} className="btn-secondary inline-btn">
            Volver a Monitoreo
          </Link>
        </div>

        {loading ? <p>Cargando estudio...</p> : null}
        {error ? <p className="error-box">{error}</p> : null}

        {study ? (
          <>
            <p className="muted-note">
              Estudio: <strong>{study.titulo}</strong> | Usa un CSV con columna <strong>{npsColumn}</strong> para calcular NPS.
            </p>

            <form className="form-grid two-cols" onSubmit={onAnalyze}>
              <label>
                Columna NPS
                <input value={npsColumn} onChange={(e) => setNpsColumn(e.target.value)} required />
              </label>

              <label>
                Archivo CSV
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
              </label>

              <div className="form-actions full-row">
                <button type="submit" className="btn-primary" disabled={analyzing}>
                  {analyzing ? "Analizando..." : "Calcular NPS"}
                </button>
              </div>
            </form>

            {result ? (
              <div className="nps-grid">
                <article className="metric-card">
                  <p className="metric-title">NPS</p>
                  <h3 className="metric-value">{result.nps_score}</h3>
                  <p className="metric-helper">Total validas: {result.total_validas}</p>
                </article>

                <article className="metric-card">
                  <p className="metric-title">Promotores</p>
                  <h3 className="metric-value">{result.percent_promotores}%</h3>
                  <p className="metric-helper">Puntajes 9-10</p>
                </article>

                <article className="metric-card">
                  <p className="metric-title">Neutros</p>
                  <h3 className="metric-value">{result.percent_neutros}%</h3>
                  <p className="metric-helper">Puntajes 7-8</p>
                </article>

                <article className="metric-card">
                  <p className="metric-title">Detractores</p>
                  <h3 className="metric-value">{result.percent_detractores}%</h3>
                  <p className="metric-helper">Puntajes 0-6</p>
                </article>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
