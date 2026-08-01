"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { loginUser, registerUser } from "../../lib/api";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("auth_token");
    if (token) {
      router.replace("/home");
    }
  }, [router]);

  useEffect(() => {
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  }, [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const normalizedUsername = username.trim();
      if (mode === "register" && password !== confirmPassword) {
        throw new Error("Las contrasenas no coinciden.");
      }

      if (mode === "register") {
        await registerUser({
          username: normalizedUsername,
          password,
          nombre_completo: nombreCompleto.trim() || undefined,
          correo: correo.trim() || undefined,
        });
        setSuccess("Cuenta creada correctamente. Iniciando sesion...");
      }

      const token = await loginUser({ username: normalizedUsername, password });
      window.localStorage.setItem("auth_token", token.access_token);
      window.localStorage.setItem("auth_username", normalizedUsername);
      router.push("/home");
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-main">
      <section className="auth-shell">
        <article className="auth-card">
          <div className="auth-layout">
            <div className="auth-side">
              <p className="auth-eyebrow">Plataforma de Investigacion</p>
              <h1>Gestiona estudios con control total</h1>
              <p className="auth-description">
                Accede al panel para crear estudios, monitorear campo y analizar resultados con datos reales del backend.
              </p>

              <ul className="auth-benefits">
                <li>Registro e inicio de sesion conectados con FastAPI.</li>
                <li>Flujo operativo: crear, monitorear y analizar.</li>
                <li>Base lista para escalar con Supabase y nuevos modulos.</li>
              </ul>
            </div>

            <div className="auth-form-wrap">
              <h2>{mode === "login" ? "Bienvenido" : "Crea tu cuenta"}</h2>
              <p>{mode === "login" ? "Ingresa con tus credenciales." : "Registra un usuario nuevo en el sistema."}</p>

              <div className="mode-toggle" role="tablist" aria-label="Modo de acceso">
                <button
                  type="button"
                  className={mode === "login" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={mode === "register" ? "tab-btn active" : "tab-btn"}
                  onClick={() => setMode("register")}
                >
                  Registro
                </button>
              </div>

              <form className="form-grid" onSubmit={onSubmit}>
                <label>
                  Usuario
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    autoComplete="username"
                  />
                </label>

                <label>
                  Contrasena
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                </label>

                {mode === "register" ? (
                  <>
                    <label>
                      Confirmar contrasena
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                    </label>

                    <label>
                      Nombre completo
                      <input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} />
                    </label>

                    <label>
                      Correo
                      <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" />
                    </label>
                  </>
                ) : null}

                {error ? <p className="error-box">{error}</p> : null}
                {success ? <p className="success-box">{success}</p> : null}

                <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                  {loading ? "Procesando..." : mode === "login" ? "Entrar al sistema" : "Crear cuenta y entrar"}
                </button>
              </form>

              <p className="auth-footnote">Tus datos viajan al backend local y se almacenan en la base configurada.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
