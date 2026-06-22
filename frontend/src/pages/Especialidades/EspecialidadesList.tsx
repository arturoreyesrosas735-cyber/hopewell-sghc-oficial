import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout, { useDoctorBreakpoints } from '../Doctores/DoctorLayout';

type Especialidad = {
  id_especialidad: number;
  uk_nombre: string;
  vv_descripcion?: string | null;
  estatus: string;
  doctores_asignados: number;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const styles = {
  panel: {
    background: '#FFFFFF',
    borderRadius: '10px 10px 0 0',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.12)',
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '399px',
    overflow: 'hidden',
  },
  panelHeader: {
    alignItems: 'center',
    borderBottom: '1px solid #DFE1E6',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '59px',
    padding: '0 12px',
  },
  h1: {
    color: '#0F172A',
    fontSize: 'clamp(23px, 3vw, 26px)',
    fontWeight: 500,
    margin: '0 0 4px',
  },
  subtitle: {
    color: '#52647A',
    fontSize: '12px',
    margin: 0,
  },
  button: {
    alignItems: 'center',
    border: 0,
    borderRadius: '7px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '13px',
    fontWeight: 700,
    gap: '9px',
    height: '37px',
    justifyContent: 'center',
    padding: '0 13px',
    whiteSpace: 'nowrap' as const,
  },
  filters: {
    alignItems: 'end',
    background: '#F7F8FA',
    borderBottom: '1px solid #E5E7EB',
    display: 'grid',
    gap: '18px',
    padding: '10px clamp(14px, 3vw, 24px) 12px',
  },
  label: {
    color: '#52647A',
    display: 'grid',
    fontSize: '10px',
    fontWeight: 800,
    gap: '4px',
  },
  inputWrap: {
    alignItems: 'center',
    background: '#F8FAFC',
    border: '1px solid #CDD5DF',
    borderRadius: '6px',
    display: 'flex',
    height: '34px',
    padding: '0 10px',
  },
  input: {
    background: 'transparent',
    border: 0,
    color: '#172B4D',
    fontSize: '12px',
    height: '32px',
    outline: 'none',
    width: '100%',
  },
  select: {
    background: '#F8FAFC',
    border: '1px solid #CDD5DF',
    borderRadius: '6px',
    color: '#172B4D',
    fontSize: '12px',
    height: '36px',
    outline: 'none',
    padding: '0 12px',
  },
  tableWrap: {
    flex: 1,
    overflowX: 'auto' as const,
  },
  table: {
    borderCollapse: 'collapse' as const,
    width: '100%',
  },
  th: {
    background: '#F1F4F7',
    borderBottom: '1px solid #CBD5E1',
    color: '#52647A',
    fontSize: '9px',
    fontWeight: 900,
    height: '33px',
    padding: '0 16px',
    textAlign: 'left' as const,
  },
  td: {
    borderBottom: '1px solid #E5E7EB',
    color: '#253858',
    fontSize: '12px',
    height: '58px',
    padding: '0 16px',
  },
  pager: {
    alignItems: 'center',
    display: 'flex',
    gap: '4px',
    justifyContent: 'flex-end',
    padding: '13px 12px 11px',
  },
  pageButton: {
    alignItems: 'center',
    background: '#FFFFFF',
    border: '1px solid #DDE3EA',
    borderRadius: '4px',
    color: '#64748B',
    display: 'inline-flex',
    fontSize: '12px',
    height: '26px',
    justifyContent: 'center',
    minWidth: '26px',
    padding: '0 8px',
  },
  modalBackdrop: {
    alignItems: 'center',
    background: 'rgba(244, 239, 239, 0.78)',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    padding: '20px',
    position: 'fixed' as const,
    zIndex: 90,
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 10px 26px rgba(15, 23, 42, 0.18)',
    maxWidth: '480px',
    padding: '24px',
    width: 'min(480px, 100%)',
  },
};

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return debouncedValue;
}

function badge(estatus: string) {
  const active = estatus === 'Activo';

  return {
    background: active ? '#DFF5E8' : '#FFE4E6',
    borderRadius: '999px',
    color: active ? '#00875A' : '#DE350B',
    display: 'inline-flex',
    fontSize: '11px',
    fontWeight: 800,
    padding: '5px 11px',
  };
}

export default function EspecialidadesList() {
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile } = useDoctorBreakpoints();
  const [items, setItems] = useState<Especialidad[]>([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [actionItem, setActionItem] = useState<Especialidad | null>(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, estado]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEspecialidades() {
      setLoading(true);
      setError('');

      try {
        const query = new URLSearchParams({
          page: String(page),
          search: debouncedSearch.trim(),
          estado,
        }).toString();
        const response = await fetch(`/api/especialidades-catalogo?${query}`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error('No fue posible cargar el catálogo de especialidades.');
        }

        const data = await response.json();
        setItems(data.data ?? []);
        setPagination(data.meta ?? {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: data.data?.length ?? 0,
        });
      } catch (currentError) {
        if ((currentError as DOMException).name !== 'AbortError') {
          setError('No fue posible cargar el catálogo de especialidades.');
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadEspecialidades();
    return () => controller.abort();
  }, [debouncedSearch, estado, page]);

  const rows = useMemo(() => items, [items]);

  async function changeStatus() {
    if (!actionItem) {
      return;
    }

    const nextStatus = actionItem.estatus === 'Activo' ? 'Inactivo' : 'Activo';
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/especialidades-catalogo/${actionItem.id_especialidad}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatus: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('No fue posible actualizar el estado de la especialidad.');
      }

      setItems((current) =>
        current.map((item) =>
          item.id_especialidad === actionItem.id_especialidad ? { ...item, estatus: nextStatus } : item,
        ),
      );
      setSuccess('El estado de la especialidad se ha actualizado correctamente.');
      setActionItem(null);
    } catch {
      setError('No fue posible actualizar el estado de la especialidad.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DoctorLayout panelTitle="PANEL DE ESPECIALIDADES" sectionLabel="ESPECIALIDADES">
      <section style={{ ...styles.panel, minHeight: isMobile ? 'auto' : '399px' }}>
        <div
          style={{
            ...styles.panelHeader,
            alignItems: isMobile ? 'stretch' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '16px',
            padding: isMobile ? '14px 12px' : '0 12px',
          }}
        >
          <div>
            <h2 style={styles.h1}>Gestión de Especialidades</h2>
            <p style={styles.subtitle}>Administra el catálogo maestro que alimenta el registro de doctores.</p>
          </div>
          <button
            style={{
              ...styles.button,
              alignSelf: isMobile ? 'stretch' : 'center',
              background: '#00875A',
              color: '#FFFFFF',
            }}
            type="button"
            onClick={() => navigate('/especialidades/nueva')}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>＋</span>
            Nueva Especialidad
          </button>
        </div>

        <div
          style={{
            ...styles.filters,
            gridTemplateColumns: isDesktop
              ? 'minmax(220px, 1.8fr) minmax(130px, 0.7fr) 92px'
              : isTablet
                ? 'minmax(220px, 1fr) minmax(140px, 0.7fr)'
                : '1fr',
          }}
        >
          <label style={styles.label}>
            BÚSQUEDA RÁPIDA
            <span style={styles.inputWrap}>
              <span style={{ color: '#52647A', fontSize: '18px', marginRight: '8px' }}>⌕</span>
              <input
                aria-label="Búsqueda rápida"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre o descripción..."
                style={styles.input}
                type="search"
                value={search}
              />
            </span>
          </label>
          <label style={styles.label}>
            ESTADO
            <select style={styles.select} value={estado} onChange={(event) => setEstado(event.target.value)}>
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </label>
          <button
            style={{
              ...styles.button,
              background: '#ECFDF5',
              border: '1px solid #B7D7D4',
              color: '#00875A',
              height: '36px',
            }}
            type="button"
          >
            ≡ Filtrar
          </button>
        </div>

        {error ? <div style={{ background: '#FFEBE6', color: '#DE350B', fontSize: '12px', padding: '10px 16px' }}>{error}</div> : null}
        {success ? <div style={{ background: '#E3FCEF', color: '#00875A', fontSize: '12px', padding: '10px 16px' }}>{success}</div> : null}

        <div style={styles.tableWrap}>
          <table style={{ ...styles.table, minWidth: isMobile ? '760px' : '100%' }}>
            <thead>
              <tr>
                <th style={styles.th}>NOMBRE</th>
                <th style={styles.th}>DESCRIPCIÓN TÉCNICA</th>
                <th style={styles.th}>DOCTORES</th>
                <th style={styles.th}>ESTADO</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id_especialidad}>
                  <td style={styles.td}>{item.uk_nombre}</td>
                  <td style={styles.td}>{item.vv_descripcion ?? 'Sin descripción'}</td>
                  <td style={styles.td}>{item.doctores_asignados}</td>
                  <td style={styles.td}>
                    <span style={badge(item.estatus)}>● {item.estatus}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button
                      title="Editar"
                      style={{ background: 'transparent', border: 0, color: '#A58B00', cursor: 'pointer', fontSize: '15px' }}
                      type="button"
                      onClick={() => navigate(`/especialidades/${item.id_especialidad}/editar`)}
                    >
                      ∕
                    </button>
                    <button
                      title={item.estatus === 'Activo' ? 'Inactivar' : 'Activar'}
                      style={{
                        background: 'transparent',
                        border: 0,
                        color: item.estatus === 'Activo' ? '#DE350B' : '#00875A',
                        cursor: 'pointer',
                        fontSize: '15px',
                      }}
                      type="button"
                      onClick={() => setActionItem(item)}
                    >
                      {item.estatus === 'Activo' ? '⊘' : '↻'}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, color: '#64748B', height: '108px', textAlign: 'center' }}>
                    No se encontraron especialidades.
                  </td>
                </tr>
              ) : null}
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ ...styles.td, color: '#64748B', height: '108px', textAlign: 'center' }}>
                    Cargando especialidades...
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={styles.pager}>
          <button
            disabled={page <= 1}
            style={styles.pageButton}
            type="button"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Anterior
          </button>
          <span style={{ ...styles.pageButton, background: '#00875A', color: '#FFFFFF' }}>{pagination.current_page}</span>
          <span style={styles.pageButton}>de {pagination.last_page}</span>
          <button
            disabled={page >= pagination.last_page}
            style={styles.pageButton}
            type="button"
            onClick={() => setPage((current) => Math.min(current + 1, pagination.last_page))}
          >
            Siguiente
          </button>
        </div>
      </section>

      {actionItem ? (
        <div role="presentation" style={styles.modalBackdrop}>
          <section aria-modal="true" role="dialog" style={styles.modal}>
            <h2 style={{ color: '#172B4D', fontSize: '20px', margin: '0 0 10px', textAlign: 'center' }}>
              Cambiar estado
            </h2>
            <p style={{ color: '#52647A', fontSize: '13px', lineHeight: 1.4, textAlign: 'center' }}>
              ¿Estás seguro de que deseas cambiar el estado de esta especialidad? Esto afectará su disponibilidad en nuevos
              registros médicos.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '22px' }}>
              <button
                disabled={saving}
                style={{ ...styles.button, background: '#00875A', color: '#FFFFFF', minWidth: '120px' }}
                type="button"
                onClick={() => void changeStatus()}
              >
                {saving ? 'Guardando...' : 'Confirmar'}
              </button>
              <button
                disabled={saving}
                style={{ ...styles.button, background: '#FFE2E2', color: '#DE350B', minWidth: '120px' }}
                type="button"
                onClick={() => setActionItem(null)}
              >
                Cancelar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </DoctorLayout>
  );
}
