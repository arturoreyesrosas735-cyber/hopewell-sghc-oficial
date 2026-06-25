import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

interface ModuleLayoutProps {
  children: ReactNode
  active: 'consultas' | 'signos'
  crumb: string
  userRole?: string
  userName?: string
}

const navItems = [
  ['INICIO', '/consultas-medicas'],
  ['USUARIOS Y ACCESO', '/consultas-medicas'],
  ['PACIENTES', '/consultas-medicas'],
  ['CONSULTAS MÉDICAS', '/consultas-medicas'],
  ['SIGNOS VITALES', '/signos-vitales'],
  ['TRATAMIENTOS', '/consultas-medicas'],
  ['REPORTES CLÍNICOS', '/consultas-medicas'],
  ['AUDITORÍA CLÍNICA', '/consultas-medicas'],
  ['CONFIGURACIÓN', '/consultas-medicas'],
]

export function ModuleLayout({
  children,
  active,
  crumb,
  userName = 'Dr. Alexis González Merced',
  userRole = 'MÉDICO GENERAL',
}: ModuleLayoutProps) {
  return (
    <main className="system-shell">
      <aside className="side-panel">
        <Link className="logo" to="/consultas-medicas" aria-label="Hopewell inicio">
          <span className="logo-mark">+</span>
          <span>
            <strong>HOPEWELL</strong>
            <small>HISTORIALES CLÍNICOS</small>
          </span>
        </Link>
        <nav className="side-nav">
          {navItems.map(([label, to]) => {
            const isActive =
              (active === 'consultas' && label === 'CONSULTAS MÉDICAS') ||
              (active === 'signos' && label === 'SIGNOS VITALES')
            return (
              <NavLink className={isActive ? 'side-link active' : 'side-link'} to={to} key={label}>
                <span className="line-icon" />
                {label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <section className="content-shell">
        <header className="app-topbar">
          <div className="crumbs">
            <span>⌂ INICIO</span>
            <span>&gt;</span>
            <span>CONSULTAS MÉDICAS</span>
            {crumb ? <span>&gt;</span> : null}
            {crumb ? <span>{crumb}</span> : null}
            <strong>LUNES 13 DE ABRIL 2026</strong>
          </div>
          <div className="top-actions">
            <span className="bell">●</span>
            <div className="profile-pill">
              <span className="avatar-mini">HC</span>
              <div>
                <strong>{userName}</strong>
                <small>{userRole}</small>
              </div>
              <span>⌄</span>
            </div>
          </div>
        </header>
        {children}
        <footer className="footer-bar">© 2026 Hopewell | Sistema de Historiales Clínicos</footer>
      </section>
    </main>
  )
}
