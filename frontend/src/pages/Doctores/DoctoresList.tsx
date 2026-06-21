import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout, { useDoctorBreakpoints } from './DoctorLayout';

type Doctor = {
  pk_fk_usuario: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  uk_rfc_personal: string;
  uk_cedula_profesional: string;
  fk_estado_empleado_doctor: number;
  especialidad?: string | null;
  correo_electronico?: string | null;
  estatus?: string | null;
};

type Especialidad = {
  id_especialidad: number;
  uk_nombre: string;
};

type EstadoEmpleado = {
  id_estado_empleado: number;
  ukTipo_estado: string;
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
    letterSpacing: '0',
    lineHeight: 1,
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
    fontWeight: 600,
    gap: '9px',
    height: '37px',
    justifyContent: 'center',
    padding: '0 13px',
    whiteSpace: 'nowrap' as const,
  },
  filters: {
    alignItems: 'start',
    background: '#F7F8FA',
    borderBottom: '1px solid #E5E7EB',
    boxSizing: 'border-box' as const,
    display: 'grid',
    gap: '18px',
    padding: '10px clamp(14px, 3vw, 24px) 12px',
  },
  filterLabel: {
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
  tableCard: {
    flex: 1,
    maxWidth: '100%',
    overflowX: 'auto' as const,
    padding: '8px 0 0',
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
    height: '54px',
    padding: '0 16px',
  },
  empty: {
    color: '#64748B',
    fontSize: '13px',
    height: '108px',
    padding: '0 16px',
    textAlign: 'center' as const,
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
    background: 'rgba(9, 30, 66, 0.54)',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'fixed' as const,
    zIndex: 50,
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 18px 40px rgba(9, 30, 66, 0.24)',
    maxWidth: '420px',
    padding: '24px',
    width: '100%',
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

function estadoBadge(estatus?: string | null) {
  const normalized = (estatus ?? 'Activo').toLowerCase();
  const active = normalized.includes('activo') && !normalized.includes('inactivo');

  return {
    label: estatus ?? 'Activo',
    style: {
      alignItems: 'center',
      background: active ? '#DFF5E8' : '#FFE4E6',
      borderRadius: '999px',
      color: active ? '#00875A' : '#DE350B',
      display: 'inline-flex',
      fontSize: '11px',
      fontWeight: 700,
      gap: '6px',
      padding: '5px 11px',
    },
  };
}

function initials(doctor: Doctor) {
  return `${doctor.nombres.charAt(0)}${doctor.apellido_paterno.charAt(0)}`.toUpperCase();
}

export default function DoctoresList() {
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile } = useDoctorBreakpoints();
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [especialidad, setEspecialidad] = useState('Todas');
  const [estado, setEstado] = useState('Todos');
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [estadosEmpleado, setEstadosEmpleado] = useState<EstadoEmpleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctorToDisable, setDoctorToDisable] = useState<Doctor | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    async function loadCatalogos() {
      const [especialidadesResponse, estadosResponse] = await Promise.all([
        fetch('/api/especialidades'),
        fetch('/api/estados-empleado'),
      ]);

      if (especialidadesResponse.ok) {
        const data = await especialidadesResponse.json();
        setEspecialidades(Array.isArray(data) ? data : data.data ?? []);
      }

      if (estadosResponse.ok) {
        const data = await estadosResponse.json();
        setEstadosEmpleado(Array.isArray(data) ? data : data.data ?? []);
      }
    }

    void loadCatalogos().catch(() => {
      setEspecialidades([]);
      setEstadosEmpleado([]);
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDoctores() {
      setLoading(true);
      setError('');

      try {
        const query = debouncedSearch.trim()
          ? `?search=${encodeURIComponent(debouncedSearch.trim())}`
          : '';
        const response = await fetch(`/api/doctores${query}`, { signal: controller.signal });

        if (!response.ok || !(response.headers.get('content-type') ?? '').includes('application/json')) {
          setDoctores([]);
          return;
        }

        const data = await response.json();
        setDoctores(Array.isArray(data) ? data : data.data ?? []);
      } catch (currentError) {
        if ((currentError as DOMException).name !== 'AbortError') {
          setDoctores([]);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadDoctores();
    return () => controller.abort();
  }, [debouncedSearch]);

  const filteredRows = useMemo(() => {
    return doctores.filter((doctor) => {
      const specialtyMatch = especialidad === 'Todas' || doctor.especialidad === especialidad;
      const statusMatch = estado === 'Todos' || (doctor.estatus ?? 'Activo') === estado;
      return specialtyMatch && statusMatch;
    });
  }, [doctores, especialidad, estado]);

  async function inactivarDoctor() {
    if (!doctorToDisable) {
      return;
    }

    try {
      const response = await fetch(`/api/doctores/${doctorToDisable.pk_fk_usuario}/inactivar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('No fue posible inactivar el doctor.');
      }

      setDoctores((current) =>
        current.map((doctor) =>
          doctor.pk_fk_usuario === doctorToDisable.pk_fk_usuario
            ? { ...doctor, estatus: 'Inactivo' }
            : doctor,
        ),
      );
    } catch {
      setError('No fue posible inactivar el doctor.');
    } finally {
      setDoctorToDisable(null);
    }
  }

  return (
    <DoctorLayout>
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
            <h2 style={{ ...styles.h1, fontSize: isMobile ? '22px' : 'clamp(23px, 3vw, 26px)' }}>
              Gestión de Doctores
            </h2>
            <p style={styles.subtitle}>Administra los perfiles y estados de los médicos registrados.</p>
          </div>
          <button
            style={{
              ...styles.button,
              alignSelf: isMobile ? 'stretch' : 'center',
              background: '#00875A',
              color: '#FFFFFF',
            }}
            type="button"
            onClick={() => navigate('/doctores/nuevo')}
          >
            <span style={{ fontSize: '21px', lineHeight: 1 }}>＋</span>
            Registrar Nuevo Doctor
          </button>
        </div>

        <div
          style={{
            ...styles.filters,
            gridTemplateColumns: isDesktop
              ? 'minmax(220px, 1.8fr) minmax(130px, 1fr) minmax(130px, 1fr) 80px'
              : isTablet
                ? 'minmax(220px, 1fr) minmax(140px, 0.7fr) minmax(140px, 0.7fr)'
                : '1fr',
            padding: isMobile ? '12px' : '10px clamp(14px, 3vw, 24px) 12px',
          }}
        >
          <label style={styles.filterLabel}>
            BÚSQUEDA RÁPIDA
            <span style={styles.inputWrap}>
              <span style={{ color: '#52647A', fontSize: '18px', marginRight: '8px' }}>⌕</span>
              <input
                aria-label="Búsqueda rápida"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre, Cédula o Especialidad..."
                style={styles.input}
                type="search"
                value={search}
              />
            </span>
          </label>
          <label style={styles.filterLabel}>
            ESPECIALIDAD
            <select style={styles.select} value={especialidad} onChange={(event) => setEspecialidad(event.target.value)}>
              <option>Todas</option>
              {especialidades.map((item) => (
                <option key={item.id_especialidad}>{item.uk_nombre}</option>
              ))}
            </select>
          </label>
          <label style={styles.filterLabel}>
            ESTADO
            <select style={styles.select} value={estado} onChange={(event) => setEstado(event.target.value)}>
              <option>Todos</option>
              {estadosEmpleado.map((item) => (
                <option key={item.id_estado_empleado}>{item.ukTipo_estado}</option>
              ))}
            </select>
          </label>
          <button
            style={{
              ...styles.button,
              background: '#ECFDF5',
              border: '1px solid #B7D7D4',
              color: '#00875A',
              height: '36px',
              width: isMobile ? '100%' : 'auto',
            }}
            type="button"
          >
            ≡ Filtrar
          </button>
        </div>

        {error ? (
          <div style={{ background: '#FFEBE6', color: '#DE350B', fontSize: '12px', padding: '10px 16px' }}>
            {error}
          </div>
        ) : null}

        <div style={styles.tableCard}>
          <table style={{ ...styles.table, minWidth: isMobile ? '720px' : '100%' }}>
            <thead>
              <tr>
                <th style={styles.th}>NOMBRE DEL DOCTOR</th>
                <th style={styles.th}>ESPECIALIDAD</th>
                <th style={styles.th}>CÉDULA / RFC</th>
                <th style={styles.th}>ESTADO</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((item) => {
                const badge = estadoBadge(item.estatus);

                return (
                  <tr key={item.pk_fk_usuario}>
                    <td style={styles.td}>
                      <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
                        <span
                          style={{
                            alignItems: 'center',
                            background: '#DBEAFE',
                            borderRadius: '999px',
                            color: '#64748B',
                            display: 'flex',
                            flex: '0 0 auto',
                            fontSize: '13px',
                            fontWeight: 700,
                            height: '30px',
                            justifyContent: 'center',
                            width: '30px',
                          }}
                        >
                          {initials(item)}
                        </span>
                        <div>
                          <div>
                            Dr. {item.nombres} {item.apellido_paterno}
                          </div>
                          <div style={{ color: '#8B9AAB', fontSize: '11px' }}>
                            {item.correo_electronico ?? 'correo.no.registrado@hopewell.com'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{item.especialidad ?? 'Sin especialidad'}</td>
                    <td style={styles.td}>
                      <div>{item.uk_cedula_profesional}</div>
                      <div>{item.uk_rfc_personal}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={badge.style}>● {badge.label}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        title="Ver"
                        style={{ background: 'transparent', border: 0, color: '#00875A', cursor: 'pointer', fontSize: '15px' }}
                        type="button"
                        onClick={() => navigate(`/doctores/${item.pk_fk_usuario}`)}
                      >
                        ⊙
                      </button>
                      <button
                        title="Editar"
                        style={{ background: 'transparent', border: 0, color: '#A58B00', cursor: 'pointer', fontSize: '15px' }}
                        type="button"
                        onClick={() => navigate(`/doctores/${item.pk_fk_usuario}/editar`)}
                      >
                        ∕
                      </button>
                      <button
                        title="Inactivar"
                        style={{ background: 'transparent', border: 0, color: '#DE350B', cursor: 'pointer', fontSize: '15px' }}
                        type="button"
                        onClick={() => setDoctorToDisable(item)}
                      >
                        ⊘
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    No hay doctores registrados todavía.
                  </td>
                </tr>
              ) : null}
              {loading ? (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    Cargando doctores...
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div style={styles.pager}>
          <span style={styles.pageButton}>Anterior</span>
          <span style={{ ...styles.pageButton, background: '#00875A', color: '#FFFFFF' }}>1</span>
          <span style={styles.pageButton}>2</span>
          <span style={styles.pageButton}>3</span>
          <span style={styles.pageButton}>Siguiente</span>
        </div>
      </section>

      {doctorToDisable ? (
        <div role="presentation" style={styles.modalBackdrop}>
          <div aria-modal="true" role="dialog" style={styles.modal}>
            <h2 style={{ color: '#172B4D', fontSize: '20px', marginTop: 0 }}>Confirmar inactivación</h2>
            <p style={{ color: '#44546F' }}>¿Estás seguro de inactivar este expediente médico?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                style={{ ...styles.button, background: '#F4F5F7', color: '#172B4D' }}
                type="button"
                onClick={() => setDoctorToDisable(null)}
              >
                Cancelar
              </button>
              <button
                style={{ ...styles.button, background: '#DE350B', color: '#FFFFFF' }}
                type="button"
                onClick={() => void inactivarDoctor()}
              >
                Inactivar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DoctorLayout>
  );
}
