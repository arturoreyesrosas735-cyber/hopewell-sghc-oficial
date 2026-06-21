import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type DoctorLayoutProps = {
  children: ReactNode;
  breadcrumbCurrent?: string;
};

const navItems = [
  ['⌘', 'USUARIOS Y ACCESO', '/usuarios'],
  ['⚕', 'DOCTORES', '/doctores'],
  ['▦', 'HOSPITALES Y CLÍNICAS', '/hospitales-clinicas'],
  ['▥', 'CONSULTORIOS', '/consultorios'],
  ['☷', 'REPORTES', '/reportes'],
  ['▣', 'AUDITORÍAS', '/auditorias'],
] as const;

export function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export function useDoctorBreakpoints() {
  const width = useViewportWidth();

  return {
    isDesktop: width >= 900,
    isTablet: width >= 680 && width < 900,
    isMobile: width < 680,
    width,
  };
}

const styles = {
  shell: {
    background: '#F1ECEC',
    color: '#172B4D',
    display: 'grid',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    overflowX: 'hidden' as const,
    position: 'relative' as const,
    textAlign: 'left' as const,
    width: '100%',
  },
  sidebar: {
    background: '#FFFFFF',
    boxShadow: '0 4px 14px rgba(9, 30, 66, 0.18)',
    display: 'flex',
    overflow: 'hidden',
  },
  brand: {
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    gap: '7px',
  },
  brandMark: {
    color: '#1FAD72',
    fontWeight: 900,
    lineHeight: 1,
    textShadow: '0 0 0 2px #60A5FA',
  },
  brandText: {
    color: '#1E3356',
    fontWeight: 900,
    letterSpacing: '0',
    lineHeight: 1,
  },
  brandSub: {
    color: '#707784',
    fontWeight: 800,
    letterSpacing: '0',
  },
  nav: {
    boxSizing: 'border-box' as const,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    borderRadius: '8px',
    color: '#111827',
    cursor: 'pointer',
    display: 'grid',
    fontSize: '8px',
    fontWeight: 800,
    gap: '12px',
    height: '34px',
    margin: '0 4px',
    whiteSpace: 'nowrap' as const,
  },
  navIcon: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '30px',
    justifyContent: 'center',
    width: '30px',
  },
  activeNav: {
    background: '#BDFCB7',
    boxShadow: '0 5px 10px rgba(0, 135, 90, 0.16)',
    color: '#006644',
  },
  content: {
    boxSizing: 'border-box' as const,
    display: 'grid',
  },
  topbar: {
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0 3px 7px rgba(9, 30, 66, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
  },
  stickyTop: {
    zIndex: 35,
  },
  pageTitle: {
    color: '#000000',
    fontSize: '18px',
    fontWeight: 900,
    letterSpacing: '0',
    margin: 0,
  },
  eyebrow: {
    color: '#6B7280',
    fontSize: '9px',
    fontWeight: 700,
    margin: 0,
  },
  topActions: {
    alignItems: 'center',
    display: 'flex',
  },
  pill: {
    background: '#C7D2FE',
    borderRadius: '999px',
    color: '#111827',
    fontSize: '9px',
    fontWeight: 900,
    letterSpacing: '0',
    padding: '4px 10px',
  },
  hamburger: {
    alignItems: 'center',
    background: 'transparent',
    border: 0,
    color: '#172B4D',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '20px',
    fontWeight: 900,
    height: '34px',
    justifyContent: 'center',
    lineHeight: 1,
    width: '34px',
  },
  breadcrumb: {
    alignItems: 'center',
    color: '#A3A3A3',
    display: 'flex',
    fontWeight: 800,
    gap: '12px',
    overflowX: 'auto' as const,
    paddingLeft: '8px',
    whiteSpace: 'nowrap' as const,
  },
  footer: {
    alignItems: 'center',
    background: 'rgba(241, 236, 236, 0.92)',
    color: '#8B9AAB',
    display: 'flex',
    fontSize: '14px',
    fontWeight: 800,
    height: '31px',
    justifyContent: 'center',
  },
};

export default function DoctorLayout({ children, breadcrumbCurrent }: DoctorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [activePath, setActivePath] = useState(location.pathname);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { isDesktop, isMobile } = useDoctorBreakpoints();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div
      style={{
        ...styles.shell,
        gridTemplateColumns: '1fr',
      }}
    >
      <aside
        style={{
          ...styles.sidebar,
          borderRadius: isDesktop ? '0 12px 12px 0' : '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          height: isDesktop ? (menuOpen ? 'calc(100vh - 51px)' : '60px') : 'auto',
          margin: isDesktop ? (menuOpen ? '10px 0 41px 17px' : '0 0 0 17px') : '0',
          minHeight: isDesktop ? (menuOpen ? '458px' : '60px') : 'auto',
          position: isDesktop ? 'fixed' : 'static',
          top: isDesktop ? '10px' : undefined,
          left: isDesktop ? '17px' : undefined,
          width: isDesktop ? (menuOpen ? 'clamp(174px, 19vw, 185px)' : '126px') : '100%',
          zIndex: 30,
        }}
      >
        <div
          style={{
            ...styles.brand,
            boxSizing: 'border-box',
            gap: menuOpen ? '7px' : '4px',
            height: isDesktop ? (menuOpen ? '92px' : '60px') : '74px',
            justifyContent: menuOpen && !isMobile ? 'center' : 'center',
            padding: menuOpen ? (isDesktop ? '0 10px' : '0 22px') : '0 7px',
          }}
        >
          <span style={{ ...styles.brandMark, fontSize: menuOpen ? (isMobile ? '32px' : '42px') : '26px' }}>
            ✚
          </span>
          <div>
            <div style={{ ...styles.brandText, fontSize: menuOpen ? (isMobile ? '19px' : '24px') : '16px' }}>
              HOPEWELL
            </div>
            <div style={{ ...styles.brandSub, fontSize: menuOpen ? (isMobile ? '8px' : '10px') : '6px' }}>
              HISTORIALES CLÍNICOS
            </div>
          </div>
        </div>

        <nav
          style={{
            ...styles.nav,
            alignItems: isDesktop ? 'stretch' : 'center',
            display: menuOpen ? (isDesktop ? 'grid' : 'flex') : 'none',
            flexWrap: isDesktop ? 'nowrap' : 'wrap',
            gap: isDesktop ? '18px' : isMobile ? '6px' : '8px',
            justifyContent: isDesktop ? 'normal' : 'space-around',
            overflowX: 'hidden',
            padding: isDesktop ? '27px 0' : '10px',
          }}
        >
          {navItems.map(([icon, label, path]) => {
            const selected = activePath === path || (path === '/doctores' && activePath.startsWith('/doctores'));
            const highlighted = selected || hoveredPath === path;

            return (
              <button
                key={label}
                style={{
                  ...styles.navItem,
                  ...(highlighted ? styles.activeNav : {}),
                  flex: isDesktop ? 'initial' : '0 0 auto',
                  gridTemplateColumns: isMobile ? '1fr' : '32px 1fr',
                  minWidth: isDesktop ? 'auto' : isMobile ? '48px' : '128px',
                  padding: isMobile ? '0 10px' : '0 12px',
                  textAlign: 'left',
                }}
                type="button"
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
                onClick={() => {
                  setActivePath(path);
                  navigate(path);
                }}
              >
                <span style={{ ...styles.navIcon, fontSize: isMobile ? '20px' : '25px' }}>{icon}</span>
                {!isMobile ? <span>{label}</span> : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <main
        style={{
          ...styles.content,
          gridTemplateRows: isMobile ? 'auto 34px minmax(0, 1fr)' : '70px 31px minmax(0, 1fr)',
          marginLeft: isDesktop && menuOpen ? 'clamp(207px, 22vw, 224px)' : 0,
          minHeight: '100vh',
          minWidth: 0,
          padding: isDesktop
            ? menuOpen
              ? '10px 10px 0 16px'
              : '10px 10px 0 16px'
            : isMobile
              ? '10px 10px 0'
              : '12px 12px 0',
        }}
      >
        <div
          style={{
            ...styles.stickyTop,
            height: isMobile ? 'auto' : '60px',
          }}
        >
          <header
            style={{
              ...styles.topbar,
              borderRadius: isDesktop ? '0 0 12px 12px' : '12px',
              flexWrap: 'wrap',
              gap: '10px',
              height: isMobile ? 'auto' : '60px',
              left: isDesktop ? (menuOpen ? 'clamp(223px, calc(22vw + 16px), 224px)' : '172px') : undefined,
              marginLeft: 0,
              minHeight: '60px',
              padding: isMobile ? '12px' : '0 10px',
              position: isDesktop ? 'fixed' : 'sticky',
              right: isDesktop ? '10px' : undefined,
              top: isDesktop ? '10px' : 0,
              zIndex: 35,
            }}
          >
            <div>
              <h1 style={{ ...styles.pageTitle, fontSize: isMobile ? '16px' : '18px' }}>PANEL DE DOCTORES</h1>
              <p style={styles.eyebrow}>LUNES 13 DE ABRIL, 2026</p>
            </div>
            <div style={{ ...styles.topActions, gap: isMobile ? '10px' : '18px', paddingRight: isMobile ? 0 : '20px' }}>
              <span style={styles.pill}>ADMINISTRADOR</span>
              {!isMobile ? <span>♟</span> : null}
              {!isMobile ? <span>▣</span> : null}
              <button
                aria-label={menuOpen ? 'Ocultar menú' : 'Mostrar menú'}
                aria-pressed={menuOpen}
                style={styles.hamburger}
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
              >
                ☰
              </button>
            </div>
          </header>
        </div>

        <div style={{ ...styles.breadcrumb, fontSize: isMobile ? '13px' : '16px' }}>
          <span>⌂</span>
          <span>INICIO</span>
          <span>&gt;</span>
          <span style={{ color: breadcrumbCurrent ? '#A3A3A3' : '#74D66B' }}>DOCTORES</span>
          {breadcrumbCurrent ? (
            <>
              <span>&gt;</span>
              <span style={{ color: '#74D66B' }}>{breadcrumbCurrent}</span>
            </>
          ) : null}
        </div>
        {children}
        <footer style={styles.footer}>© 2026 Hopewell&nbsp;&nbsp;|&nbsp;&nbsp;Sistema de Historiales Clínicos</footer>
      </main>
    </div>
  );
}
