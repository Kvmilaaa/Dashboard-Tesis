"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AppTopBar from "../../../../components/AppTopBar";
import { getStudy, updateStudyState, Study } from "../../../../lib/api";
import { useAuthGuard } from "../../../../lib/useAuthGuard";

type Props = {
  params: {
    id: string;
  };
};

const STATE_OPTIONS = [
  "Creacion de Estudio",
  "Campo Activo",
  "Campo Finalizado",
  "Cerrado/Analizado",
];

export default function MonitorPage({ params }: Props) {
  const studyId = Number(params.id);
  const { ready, username } = useAuthGuard();
  const [study, setStudy] = useState<Study | null>(null);
  const [estado, setEstado] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
        setEstado(data.estado);
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

  const progress = useMemo(() => {
    if (!study || !study.muestra || study.muestra <= 0) {
      return 0;
    }
    return 0;
  }, [study]);

  const saveState = async () => {
    if (!study) {
      return;
    }

    setSaving(true);
    setNotice(null);
    setError(null);

    try {
      const updated = await updateStudyState(study.id, estado);
      setStudy(updated);
      setNotice("Estado actualizado correctamente.");
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "No se pudo actualizar el estado.");
    } finally {
      setSaving(false);
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
          <h1>Monitorear Avance</h1>
          <Link href={`/studies/${studyId}/analysis`} className="btn-primary inline-btn">
            Ir a Analisis
          </Link>
        </div>

        {loading ? <p>Cargando estudio...</p> : null}
        {error ? <p className="error-box">{error}</p> : null}

        {study ? (
          <div className="monitor-grid">
            <article className="monitor-card">
              <h3>Datos del estudio</h3>
              <p>
                <strong>Titulo:</strong> {study.titulo}
              </p>
              <p>
                <strong>Empresa:</strong> {study.empresa ?? "N/A"}
              </p>
              <p>
                <strong>Muestra requerida:</strong> {study.muestra ?? "N/A"}
              </p>
              <p>
                <strong>Tecnica:</strong> {study.tecnica ?? "N/A"}
              </p>
            </article>

            <article className="monitor-card">
              <h3>Estado de campo</h3>
              <label>
                Estado
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                  {STATE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <div className="progress-row" aria-label="Avance de muestra">
                <span>Avance muestra</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>

              <button type="button" className="btn-primary" onClick={saveState} disabled={saving}>
                {saving ? "Actualizando..." : "Actualizar Estado"}
              </button>
              {notice ? <p className="notice-box">{notice}</p> : null}
              <p className="muted-note">
                Nota: el avance de muestra quedara conectado cuando agreguemos el modulo de carga de respuestas de campo.
              </p>
            </article>

            <article className="monitor-card full-width">
              <h3>Cuotas del estudio</h3>
              <pre className="json-box">{JSON.stringify(study.cuotas_json ?? {}, null, 2)}</pre>
            </article>
          </div>
        ) : null}
      </section>
    </main>
  );
}
