import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import logo from "../../assets/icons/logo.png";

const menuItems = [
  { icon: "home", label: "Inicio", path: "/inicio" },
  { icon: "users", label: "Usuarios y acceso", path: "/usuarios" },
  { icon: "doctor", label: "Doctores", path: "/doctores" },
  { icon: "building", label: "Hospitales y clinicas", path: "/hospitales" },
  { icon: "stethoscope", label: "Consultorios", path: "/consultorios" },
  { icon: "treatment", label: "Tratamientos y recetas", path: "/tratamientos-recetas" },
  { icon: "chart", label: "Reportes", path: "/reportes" },
  { icon: "audit", label: "Auditorias", path: "/auditoria" },
];

const ReportesMenu = () => {
  const location = useLocation();

  return (
    <aside className="report-sidebar">
      <Link className="report-brand" to="/inicio" aria-label="Hopewell inicio">
        <img src={logo} alt="Hopewell Historiales Clinicos" />
      </Link>

      <nav className="report-nav" aria-label="Menu principal">
        {menuItems.map((item) => {
          const isActive = isActiveMenuItem(item.path, location.pathname);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={isActive ? "report-nav-item active" : "report-nav-item"}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="report-user-card">
        <span className="report-user-avatar" aria-hidden="true">
          <span />
        </span>
        <div>
          <strong>Administrador</strong>
          <small>admin@hopewell.com</small>
        </div>
        <span className="report-user-caret">⌄</span>
      </div>
    </aside>
  );
};

const treatmentRoutes = [
  "/tratamientos-recetas",
  "/tratamientos",
  "/recetas",
  "/pacientes",
  "/expedientes",
  "/consultas",
  "/diagnosticos",
  "/padecimientos",
  "/medicamentos",
  "/enfermedades",
];

const isActiveMenuItem = (itemPath: string, currentPath: string) => {
  if (itemPath === "/tratamientos-recetas") {
    return treatmentRoutes.some((path) => currentPath === path || currentPath.startsWith(path + "/"));
  }

  return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
};

const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, ReactNode> = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20c.8-3.6 2.7-5.4 5.5-5.4s4.7 1.8 5.5 5.4" />
        <path d="M13.8 15.2c2.6.2 4.2 1.8 4.7 4.8" />
      </>
    ),
    home: (
      <>
        <path d="M4 11.5 12 4l8 7.5" />
        <path d="M6.5 10.5V20h11v-9.5" />
        <path d="M10 20v-5h4v5" />
      </>
    ),
    doctor: (
      <>
        <circle cx="12" cy="7" r="3.2" />
        <path d="M5.5 20c.8-4.4 3-6.6 6.5-6.6s5.7 2.2 6.5 6.6" />
        <path d="M12 14.2v4" />
        <path d="M10 16.2h4" />
      </>
    ),
    building: (
      <>
        <path d="M5 21V5.8L13 3v18" />
        <path d="M13 9h6v12" />
        <path d="M8 8h2M8 12h2M8 16h2M16 12h1M16 16h1" />
      </>
    ),
    stethoscope: (
      <>
        <path d="M6 4v5a4 4 0 0 0 8 0V4" />
        <path d="M14 9v5a4 4 0 0 0 8 0v-1" />
        <circle cx="22" cy="11" r="1.6" />
      </>
    ),
    treatment: (
      <>
        <path d="M7 4h10v16H7z" />
        <path d="M10 8h4M12 6v4" />
        <path d="M10 14h4M10 17h4" />
      </>
    ),
    chart: (
      <>
        <path d="M5 20V10" />
        <path d="M11 20V5" />
        <path d="M17 20v-8" />
        <path d="M3 20h17" />
      </>
    ),
    audit: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h4" />
        <path d="M9 11h6M9 15h4" />
        <circle cx="17" cy="18" r="3" />
      </>
    ),
  };

  return (
    <svg className="report-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
};

export default ReportesMenu;
