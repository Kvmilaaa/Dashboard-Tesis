"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  username: string;
};

export default function AppTopBar({ username }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    window.localStorage.removeItem("auth_token");
    window.localStorage.removeItem("auth_username");
    router.replace("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <p className="topbar-kicker">Panel Operativo</p>
        <h2>Gestion de Estudios</h2>
      </div>

      <nav className="topbar-nav" aria-label="Navegacion principal">
        <Link className={pathname === "/home" ? "nav-link active" : "nav-link"} href="/home">
          Home
        </Link>
        <Link className={pathname === "/studies/new" ? "nav-link active" : "nav-link"} href="/studies/new">
          Crear Estudio
        </Link>
      </nav>

      <div className="topbar-user">
        <span>{username || "Usuario"}</span>
        <button type="button" className="btn-secondary" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}
