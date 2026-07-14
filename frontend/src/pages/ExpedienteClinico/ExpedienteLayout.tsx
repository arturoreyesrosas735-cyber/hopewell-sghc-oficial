import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Props = {
  children: ReactNode;
  crumb?: string;
};

const navItems = [
  ['pacientes', 'Pacientes', '/expedientes'],
  ['folder', 'Expedientes clinicos', '/expedientes'],
  ['stethoscope', 'Consultas medicas', '/expedientes/1/historial'],
  ['diagnosis', 'Diagnosticos', '/diagnosticos'],
  ['rx', 'Tratamientos y recetas', '/expedientes/1/historial'],
  ['medical', 'Padecimientos', '/expedientes/1'],
] as const;

export default function ExpedienteLayout({ children, crumb = 'Expedientes clinicos' }: Props) {
  const location = useLocation();
  const crumbParts = crumb.split('>').map((part) => part.trim()).filter(Boolean);

  return (
    <div className="exp-shell">
      <aside className="exp-sidebar">
        <Link className="exp-brand" to="/expedientes" aria-label="Hopewell inicio">
          <img src="/icons/logo.png" alt="Hopewell Historiales Clinicos" />
        </Link>
        <nav className="exp-nav" aria-label="Menu principal">
          {navItems.map(([icon, label, path]) => {
            const active =
              (label.toLowerCase().includes('expedientes') && location.pathname.startsWith('/expedientes')) ||
              (label.toLowerCase().includes('diagnosticos') && location.pathname.startsWith('/diagnosticos'));
            return (
              <Link className={`exp-nav-item ${active ? 'is-active' : ''}`} key={label} to={path}>
                <img className="exp-nav-img" src={getNavIcon(icon)} alt="" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="exp-main">
        <header className="exp-topbar">
          <div>
            <h1>Control Medico</h1>
            <p>Lunes 13 de abril, 2026</p>
          </div>
          <div className="exp-top-actions" aria-label="Acciones de usuario">
            <span className="exp-role">Personal medico</span>
            <img className="exp-action-img" src="/icons/accion-notificaciones.png" alt="Notificaciones" />
            <img className="exp-action-img" src="/icons/accion-ver.png" alt="" />
            <img className="exp-action-img" src="/icons/accion-menu-hamburguesa.png" alt="" />
          </div>
        </header>

        <div className="exp-breadcrumb">
          <span className="exp-home-icon" aria-hidden="true" />
          <span>Inicio</span>
          {crumbParts.map((part, index) => (
            <span className={index === crumbParts.length - 1 ? 'is-current' : undefined} key={`${part}-${index}`}>
              {part}
            </span>
          ))}
        </div>

        {children}

        <footer className="exp-footer">© 2026 Hopewell | Sistema de Historiales Clinicos</footer>
      </main>
    </div>
  );
}

function getNavIcon(icon: string): string {
  const icons: Record<string, string> = {
    pacientes: '/icons/menu-pacientes.svg',
    folder: '/icons/menu-expedientes.svg',
    stethoscope: '/icons/menu-consultas.svg',
    diagnosis: '/icons/menu-diagnosticos.svg',
    rx: '/icons/menu-tratamientos.svg',
    medical: '/icons/menu-padecimientos.svg',
  };

  return icons[icon] ?? '/icons/accion-ver.png';
}
