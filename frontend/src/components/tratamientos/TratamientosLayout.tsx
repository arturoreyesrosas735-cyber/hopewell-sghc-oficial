import { Link, NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface TratamientosLayoutProps {
  title: string;
  children: ReactNode;
}

type NavIconName =
  | "home"
  | "patients"
  | "file"
  | "consult"
  | "diagnosis"
  | "treatment"
  | "recipe"
  | "medicine"
  | "condition";

const navItems: Array<{ icon: NavIconName; label: string; to: string }> = [
  { icon: "home", label: "Inicio", to: "/" },
  { icon: "patients", label: "Pacientes", to: "/pacientes" },
  { icon: "file", label: "Expedientes clinicos", to: "/expedientes" },
  { icon: "consult", label: "Consultas medicas", to: "/consultas" },
  { icon: "diagnosis", label: "Diagnosticos", to: "/diagnosticos" },
  { icon: "treatment", label: "Tratamientos", to: "/tratamientos" },
  { icon: "recipe", label: "Recetas", to: "/recetas" },
  { icon: "medicine", label: "Medicamentos", to: "/medicamentos" },
  { icon: "condition", label: "Enfermedades", to: "/enfermedades" },
  { icon: "medicine", label: "Padecimientos", to: "/padecimientos" },
];

const TratamientosLayout = ({ title, children }: TratamientosLayoutProps) => {
  const location = useLocation();

  return (
    <div className="sghc-shell">
      <aside className="sghc-sidebar" aria-label="Navegacion principal">
        <Link className="brand brand-logo" to="/tratamientos-recetas">
          <span className="brand-copy">
            <strong>HOPEWELL</strong>
            <small>Historiales Clinicos</small>
          </span>
        </Link>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive || isModuleHome(item.to, location.pathname) ? "active" : "")}
            >
              <span className="nav-icon" aria-hidden="true">
                <MenuIcon name={item.icon} />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="sghc-main">
        <header className="topbar">
          <div>
            <p>Control medico</p>
            <h1>{title}</h1>
            <span>Lunes 13 de abril, 2026</span>
          </div>
          <div className="topbar-actions" aria-label="Acciones de sesion">
            <span>Personal medico</span>
            <button type="button" aria-label="Notificaciones">!</button>
            <button type="button" aria-label="Calendario">Cal</button>
            <button type="button" aria-label="Menu">Menu</button>
          </div>
        </header>
        <div className="breadcrumbs">Inicio &gt; {title}</div>
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
};

const isModuleHome = (itemPath: string, currentPath: string) =>
  itemPath === "/tratamientos" && currentPath === "/tratamientos-recetas";

const MenuIcon = ({ name }: { name: NavIconName }) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  const icons: Record<NavIconName, ReactNode> = {
    home: (
      <>
        <path {...common} d="M3.8 11.2 12 4.4l8.2 6.8" />
        <path {...common} d="M6.4 10.2v9.4h11.2v-9.4" />
        <path {...common} d="M10 19.6v-5.2h4v5.2" />
      </>
    ),
    patients: (
      <>
        <circle {...common} cx="8" cy="8" r="3" />
        <circle {...common} cx="16" cy="8" r="3" />
        <path {...common} d="M3.7 19.4v-1.5A4.3 4.3 0 0 1 8 13.6h0a4.3 4.3 0 0 1 4.3 4.3v1.5" />
        <path {...common} d="M11.7 19.4v-1.5a4.3 4.3 0 0 1 8.6 0v1.5" />
      </>
    ),
    file: (
      <>
        <path {...common} d="M5.2 3.8h9.2l4.4 4.4v12H5.2z" />
        <path {...common} d="M14.4 3.8v4.4h4.4" />
        <path {...common} d="M8 12h8" />
        <path {...common} d="M8 16h6" />
      </>
    ),
    consult: (
      <>
        <rect {...common} x="4" y="6" width="16" height="12" rx="2" />
        <path {...common} d="M12 9v6" />
        <path {...common} d="M9 12h6" />
        <path {...common} d="M8 4v3" />
        <path {...common} d="M16 4v3" />
      </>
    ),
    diagnosis: (
      <>
        <circle {...common} cx="10.5" cy="10.5" r="5.3" />
        <path {...common} d="m15 15 4.7 4.7" />
        <path {...common} d="M10.5 7.7v5.6" />
        <path {...common} d="M7.7 10.5h5.6" />
      </>
    ),
    treatment: (
      <>
        <path {...common} d="M6 5h10l2 3v11H6z" />
        <path {...common} d="M8 5V3.5h6V5" />
        <path {...common} d="M12 10v5" />
        <path {...common} d="M9.5 12.5h5" />
        <path {...common} d="M17.5 16.5h3" />
        <path {...common} d="M19 15v3" />
      </>
    ),
    recipe: (
      <>
        <path {...common} d="M6 4h10l2 2v14H6z" />
        <path {...common} d="M9 9h6" />
        <path {...common} d="M9 13h6" />
        <path {...common} d="M9 17h3" />
        <path {...common} d="M16 16h4v4h-4z" />
        <path {...common} d="M18 15v6" />
      </>
    ),
    medicine: (
      <>
        <rect {...common} x="4.6" y="9" width="14.8" height="8.6" rx="4.3" />
        <path {...common} d="m8.2 16.2 7.6-6.8" />
        <path {...common} d="M8 6h8" />
        <path {...common} d="M12 3.8V8" />
      </>
    ),
    condition: (
      <>
        <path {...common} d="M12 4.3c3 0 5.5 2.4 5.5 5.5 0 4.2-5.5 9.9-5.5 9.9s-5.5-5.7-5.5-9.9c0-3 2.4-5.5 5.5-5.5Z" />
        <path {...common} d="M12 7.6v4.8" />
        <path {...common} d="M9.6 10h4.8" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

export default TratamientosLayout;
