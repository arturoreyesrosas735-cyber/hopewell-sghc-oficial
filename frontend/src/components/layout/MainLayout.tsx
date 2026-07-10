import type { ReactNode } from "react";
import ReportesMenu from "../reportes/ReportesMenu";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  current?: string;
  breadcrumb?: string;
}

const MainLayout = ({
  children,
  title = "REPORTES",
  current = "Reporte clinico",
  breadcrumb,
}: MainLayoutProps) => {
  const trail = breadcrumb
    ? breadcrumb.split(">").map((item) => item.trim()).filter(Boolean)
    : ["Inicio", "Reportes", current];

  return (
    <div className="report-shell">
      <ReportesMenu />

      <main className="report-main">
        <header className="report-topbar">
          <div>
            <h1>{title}</h1>
            <div className="report-breadcrumbs">
              {trail.map((item, index) => (
                <span key={`${item}-${index}`} className={index === trail.length - 1 ? "last" : ""}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="report-top-actions">
            <span className="admin-pill">ADMINISTRADOR</span>
            <button type="button" aria-label="Notificaciones">
              <BellIcon />
              <small>2</small>
            </button>
            <button type="button" aria-label="Calendario">
              <CalendarIcon />
            </button>
            <button type="button" aria-label="Menu">
              <MenuIcon />
            </button>
          </div>
        </header>

        <section className="report-content">{children}</section>
      </main>
    </div>
  );
};

const BellIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 5h14v15H5z" />
    <path d="M8 3v4M16 3v4M5 10h14" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export default MainLayout;
