import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";

interface TratamientosLayoutProps {
  title: string;
  children: ReactNode;
}

const navItems = [
  { label: "Pacientes", to: "/pacientes" },
  { label: "Expedientes clinicos", to: "/expedientes" },
  { label: "Consultas medicas", to: "/consultas" },
  { label: "Diagnosticos", to: "/diagnosticos" },
  { label: "Tratamientos y recetas", to: "/tratamientos-recetas" },
  { label: "Padecimientos", to: "/padecimientos" },
];

const TratamientosLayout = ({ title, children }: TratamientosLayoutProps) => (
  <div className="sghc-shell">
    <aside className="sghc-sidebar" aria-label="Navegacion principal">
      <Link className="brand" to="/tratamientos-recetas">
        <span>HOPEWELL</span>
        <small>Historiales Clinicos</small>
      </Link>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive || item.to === "/tratamientos-recetas" ? "active" : ""
            }
          >
            <span className="nav-mark" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <main className="sghc-main">
      <header className="topbar">
        <div>
          <p>Tratamientos y Recetas</p>
          <h1>{title}</h1>
          <span>Lunes 13 de abril, 2026</span>
        </div>
        <div className="topbar-actions" aria-label="Acciones de sesion">
          <span>Personal medico</span>
          <button type="button" aria-label="Notificaciones">!</button>
          <button type="button" aria-label="Calendario">[]</button>
          <button type="button" aria-label="Menu">=</button>
        </div>
      </header>
      <div className="breadcrumbs">Inicio &gt; Tratamientos y Recetas</div>
      <section className="content-area">{children}</section>
    </main>
  </div>
);

export default TratamientosLayout;
