"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AppTopBar from "../../components/AppTopBar";
import StudyCard from "../../components/StudyCard";
import { getHealth, getStudies, Study } from "../../lib/api";
import { useAuthGuard } from "../../lib/useAuthGuard";

function formatDate(value: string | null) {
  if (!value) {
    return "N/A";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("es-CL");
}

export default function HomePage() {
  const { ready, username } = useAuthGuard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState("offline");
  const [studies, setStudies] = useState<Study[]>([]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [healthData, studiesData] = await Promise.all([getHealth(), getStudies()]);
        if (!mounted) {
          return;
        }

        setHealth(healthData.status);
        setStudies(studiesData);
      } catch (apiError) {
        if (!mounted) {
          return;
        }
        setError(apiError instanceof Error ? apiError.message : "No se pudieron cargar los estudios.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, [ready]);

  const studiesCount = useMemo(() => studies.length, [studies]);

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

      <section className="hero">
        <h1>Home</h1>
        <p>Vista principal conectada al backend para listar, monitorear y analizar estudios.</p>

        <div className="status-row">
          <StudyCard title="Backend" value={health.toUpperCase()} helper="Estado de /health" />
          <StudyCard title="Estudios" value={String(studiesCount)} helper="Total en base de datos" />
          <StudyCard title="Flujo" value="Activo" helper="Login > Home > Crear > Monitorear > Analizar" />
        </div>
      </section>

      <section className="list-section">
        <div className="section-header">
          <h2>Listado de estudios</h2>
          <Link href="/studies/new" className="btn-primary inline-btn">
            Agregar +
          </Link>
        </div>

        {loading ? <p>Cargando estudios...</p> : null}
        {error ? <p className="error-box">{error}</p> : null}

        {!loading && studies.length === 0 ? <p>No hay estudios cargados aun.</p> : null}

        {!loading && studies.length > 0 ? (
          <div className="table-wrap">
            <table className="studies-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titulo</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Monitor</th>
                  <th>Analisis</th>
                </tr>
              </thead>
              <tbody>
                {studies.map((study) => (
                  <tr key={study.id}>
                    <td>{study.id}</td>
                    <td>
                      <strong>{study.titulo}</strong>
                    </td>
                    <td>{formatDate(study.fecha_inicio)}</td>
                    <td>
                      <span className="state-chip">{study.estado}</span>
                    </td>
                    <td>
                      <Link className="btn-link" href={`/studies/${study.id}/monitor`}>
                        Monitorear
                      </Link>
                    </td>
                    <td>
                      <Link className="btn-link" href={`/studies/${study.id}/analysis`}>
                        Analizar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
