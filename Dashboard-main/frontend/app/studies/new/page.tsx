"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import AppTopBar from "../../../components/AppTopBar";
import { createStudy } from "../../../lib/api";
import { useAuthGuard } from "../../../lib/useAuthGuard";

const DEFAULT_QUOTAS = '{"genero":{"Masculino":50,"Femenino":50}}';

export default function CreateStudyPage() {
  const router = useRouter();
  const { ready, username } = useAuthGuard();

  const [titulo, setTitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [muestra, setMuestra] = useState("100");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tecnica, setTecnica] = useState("CATI (Call Center)");
  const [linkCuestionario, setLinkCuestionario] = useState("");
  const [cuotasJson, setCuotasJson] = useState(DEFAULT_QUOTAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const parsedQuotas = JSON.parse(cuotasJson);
      const created = await createStudy({
        titulo,
        empresa: empresa || undefined,
        muestra: Number(muestra),
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
        tecnica,
        cuotas_json: parsedQuotas,
        link_cuestionario: linkCuestionario || undefined,
      });

      router.push(`/studies/${created.id}/monitor`);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "No se pudo crear el estudio.");
    } finally {
      setLoading(false);
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
        <h1>Crear Estudio [+]</h1>
        <p>Ingresa los datos principales para crear un estudio conectado al backend.</p>

        <form className="form-grid two-cols" onSubmit={onSubmit}>
          <label>
            Titulo del estudio
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </label>

          <label>
            Empresa o institucion
            <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
          </label>

          <label>
            Fecha inicio
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </label>

          <label>
            Fecha final
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </label>

          <label>
            Muestra requerida
            <input type="number" min={0} value={muestra} onChange={(e) => setMuestra(e.target.value)} required />
          </label>

          <label>
            Tecnica
            <select value={tecnica} onChange={(e) => setTecnica(e.target.value)}>
              <option>CATI (Call Center)</option>
              <option>CAWI (Link Web)</option>
              <option>IVR (Llamada Automatica)</option>
              <option>TAWI (Presencial en dispositivo)</option>
            </select>
          </label>

          <label className="full-row">
            Link cuestionario
            <input value={linkCuestionario} onChange={(e) => setLinkCuestionario(e.target.value)} placeholder="https://..." />
          </label>

          <label className="full-row">
            Cuotas (JSON)
            <textarea
              rows={6}
              value={cuotasJson}
              onChange={(e) => setCuotasJson(e.target.value)}
              placeholder='{"genero":{"Masculino":50,"Femenino":50}}'
            />
          </label>

          {error ? <p className="error-box full-row">{error}</p> : null}

          <div className="form-actions full-row">
            <button type="button" className="btn-secondary" onClick={() => router.push("/home")}>
              Volver
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Estudio"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
