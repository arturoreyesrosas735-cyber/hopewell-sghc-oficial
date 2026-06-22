import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ActivationModal, { type ActivationPayload } from './ActivationModal';
import ActivationSuccessModal from './ActivationSuccessModal';
import DoctorLayout, { useDoctorBreakpoints } from './DoctorLayout';
import InactivationModal, { type InactivationPayload } from './InactivationModal';
import InactivationSuccessModal from './InactivationSuccessModal';

type DoctorDetalleData = {
  pk_fk_usuario: number;
  id_personal: number;
  uk_numero_empleado?: string | null;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  correo_electronico?: string | null;
  telefono?: string | null;
  uk_curp?: string | null;
  genero?: string | null;
  sede_nombre?: string | null;
  direccion?: string | null;
  asentamiento?: string | null;
  codigo_postal?: string | null;
  municipio?: string | null;
  estado?: string | null;
  uk_rfc_personal: string;
  uk_cedula_profesional: string;
  nombre_consultorio?: string | null;
  numero_consultorio?: string | null;
  dia_semana?: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  especialidades?: Array<{ id_especialidad: number; uk_nombre: string }>;
  documentos?: Array<{
    id_documento_doctor: number;
    tipo_documento: string;
    nombre_documento: string;
    extension_archivo: string;
    tamano_archivo: string | number;
    url: string;
  }>;
  estatus?: string | null;
};

const styles = {
  page: {
    display: 'grid',
    gap: '12px',
    padding: '0 0 18px',
  },
  topPanel: {
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '58px',
    padding: '0 16px',
  },
  title: {
    color: '#172B4D',
    fontSize: '21px',
    fontWeight: 700,
    margin: 0,
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
  },
  button: {
    alignItems: 'center',
    borderRadius: '7px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    fontWeight: 800,
    height: '34px',
    justifyContent: 'center',
    minWidth: '92px',
    padding: '0 12px',
  },
  dashboard: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'minmax(0, 1fr) 174px',
  },
  profileCard: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    display: 'grid',
    gap: '10px',
    padding: '12px',
  },
  profileHead: {
    alignItems: 'center',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '78px minmax(0, 1fr)',
  },
  avatar: {
    alignItems: 'center',
    background: '#F8FAFC',
    border: '2px solid #D6E5FF',
    borderRadius: '999px',
    color: '#52647A',
    display: 'flex',
    fontSize: '11px',
    fontWeight: 800,
    height: '70px',
    justifyContent: 'center',
    position: 'relative' as const,
    width: '70px',
  },
  onlineDot: {
    background: '#00875A',
    border: '3px solid #FFFFFF',
    borderRadius: '999px',
    bottom: '3px',
    height: '12px',
    position: 'absolute' as const,
    right: '7px',
    width: '12px',
  },
  doctorName: {
    color: '#172B4D',
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: 1.05,
    margin: 0,
  },
  specialty: {
    color: '#00875A',
    fontSize: '12px',
    fontWeight: 700,
    margin: '5px 0',
  },
  status: {
    alignItems: 'center',
    borderRadius: '999px',
    display: 'inline-flex',
    fontSize: '10px',
    fontWeight: 900,
    height: '18px',
    padding: '0 9px',
    width: 'fit-content',
  },
  infoGrid: {
    display: 'grid',
    gap: '6px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  infoBox: {
    background: '#F8FAFC',
    border: '1px solid #9BB7CB',
    borderRadius: '2px',
    minHeight: '40px',
    padding: '5px 7px',
  },
  label: {
    color: '#52647A',
    display: 'block',
    fontSize: '8px',
    fontWeight: 900,
    marginBottom: '3px',
    textTransform: 'uppercase' as const,
  },
  value: {
    color: '#172B4D',
    fontSize: '11px',
    lineHeight: 1.25,
    margin: 0,
    overflowWrap: 'anywhere' as const,
  },
  sideRail: {
    display: 'grid',
    gap: '12px',
  },
  metricCard: {
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: '34px minmax(0, 1fr)',
    minHeight: '55px',
    padding: '0 12px',
  },
  metricIcon: {
    alignItems: 'center',
    background: '#EEF2F7',
    borderRadius: '6px',
    color: '#52647A',
    display: 'flex',
    fontSize: '18px',
    fontWeight: 900,
    height: '32px',
    justifyContent: 'center',
    width: '32px',
  },
  metricLabel: {
    color: '#52647A',
    fontSize: '8px',
    fontWeight: 900,
    margin: 0,
    textTransform: 'uppercase' as const,
  },
  metricValue: {
    color: '#172B4D',
    fontSize: '18px',
    fontWeight: 800,
    lineHeight: 1,
    margin: '2px 0 0',
  },
  nextSurgery: {
    background: '#00875A',
    borderRadius: '8px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    color: '#FFFFFF',
    minHeight: '58px',
    padding: '9px 12px',
  },
  lowerGrid: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '138px minmax(0, 1fr)',
  },
  smallStack: {
    display: 'grid',
    gap: '8px',
  },
  miniStat: {
    background: '#FFFFFF',
    borderRadius: '7px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    minHeight: '48px',
    padding: '8px 10px',
  },
  miniValue: {
    color: '#00875A',
    fontSize: '20px',
    fontWeight: 800,
    lineHeight: 1,
    margin: '2px 0 0',
  },
  historyCard: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    overflow: 'hidden',
  },
  historyHeader: {
    alignItems: 'center',
    borderBottom: '1px solid #DFE1E6',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '48px',
    padding: '0 14px',
  },
  sectionTitle: {
    color: '#172B4D',
    fontSize: '16px',
    fontWeight: 700,
    margin: 0,
  },
  tableWrap: {
    overflowX: 'auto' as const,
  },
  table: {
    borderCollapse: 'collapse' as const,
    width: '100%',
  },
  th: {
    background: '#F1F4F7',
    color: '#52647A',
    fontSize: '8px',
    fontWeight: 900,
    height: '30px',
    padding: '0 12px',
    textAlign: 'left' as const,
  },
  td: {
    borderBottom: '1px solid #E5E7EB',
    color: '#253858',
    fontSize: '11px',
    height: '44px',
    padding: '0 12px',
  },
  empty: {
    color: '#64748B',
    fontSize: '12px',
    height: '96px',
    textAlign: 'center' as const,
  },
  chips: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    padding: '12px',
  },
  chip: {
    alignItems: 'center',
    background: '#DCEAFF',
    border: 0,
    borderRadius: '6px',
    color: '#52647A',
    display: 'inline-flex',
    fontSize: '11px',
    fontWeight: 700,
    gap: '7px',
    minHeight: '42px',
    padding: '0 14px',
  },
  documentLinks: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginTop: '8px',
  },
  documentLink: {
    background: '#F0F6FF',
    border: '1px dashed #9BB7CB',
    borderRadius: '6px',
    color: '#172B4D',
    fontSize: '10px',
    fontWeight: 800,
    padding: '6px 8px',
    textDecoration: 'none',
  },
};

function InfoBox({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div style={styles.infoBox}>
      <span style={styles.label}>{label}</span>
      <p style={styles.value}>{value || 'Sin registro'}</p>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricIcon}>{icon}</span>
      <div>
        <p style={styles.metricLabel}>{label}</p>
        <p style={styles.metricValue}>{value}</p>
      </div>
    </div>
  );
}

export default function DoctorDetalle() {
  const navigate = useNavigate();
  const params = useParams();
  const { isMobile, isTablet } = useDoctorBreakpoints();
  const pkFkUsuario = params.pk_fk_usuario ?? params.id;
  const [doctor, setDoctor] = useState<DoctorDetalleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInactivationModal, setShowInactivationModal] = useState(false);
  const [showInactivationSuccess, setShowInactivationSuccess] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [showActivationSuccess, setShowActivationSuccess] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    async function loadDoctor() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/doctores/${pkFkUsuario}`);

        if (!response.ok) {
          throw new Error('No fue posible cargar el perfil del doctor.');
        }

        setDoctor(await response.json());
      } catch {
        setError('No fue posible cargar el perfil del doctor.');
      } finally {
        setLoading(false);
      }
    }

    void loadDoctor();
  }, [pkFkUsuario]);

  const fullName = doctor
    ? `${doctor.nombres} ${doctor.apellido_paterno} ${doctor.apellido_materno ?? ''}`.trim()
    : '';
  const primarySpecialty = doctor?.especialidades?.[0]?.uk_nombre ?? 'Sin especialidad';
  const status = doctor?.estatus ?? 'Activo';
  const statusActive = status.toLowerCase() === 'activo';
  const consultorio = doctor?.nombre_consultorio
    ? `${doctor.nombre_consultorio}${doctor.numero_consultorio ? ` ${doctor.numero_consultorio}` : ''}`
    : 'Sin consultorio';
  const schedule = doctor?.dia_semana
    ? `${doctor.dia_semana}, ${doctor.hora_inicio ?? ''} - ${doctor.hora_fin ?? ''}`
    : 'Sin horario';
  const additionalSpecialties = useMemo(
    () => doctor?.especialidades?.slice(1).map((especialidad) => especialidad.uk_nombre) ?? [],
    [doctor?.especialidades],
  );

  async function changeStatus(payload?: InactivationPayload | ActivationPayload) {
    if (!doctor) {
      return;
    }

    const action = statusActive ? 'inactivar' : 'reactivar';
    setStatusSaving(true);

    try {
      const response = await fetch(`/api/doctores/${doctor.pk_fk_usuario}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setDoctor((current) => (current ? { ...current, estatus: statusActive ? 'Inactivo' : 'Activo' } : current));
        setShowInactivationModal(false);
        if (action === 'inactivar') {
          setShowInactivationSuccess(true);
        }
        if (action === 'reactivar') {
          setShowActivationModal(false);
          setShowActivationSuccess(true);
        }
        return;
      }

      setError('No fue posible actualizar el estado del doctor.');
    } catch {
      setError('No fue posible actualizar el estado del doctor.');
    } finally {
      setStatusSaving(false);
    }
  }

  function toggleStatus() {
    if (!doctor) {
      return;
    }

    if (statusActive) {
      setShowInactivationModal(true);
      return;
    }

    setShowActivationModal(true);
  }

  return (
    <DoctorLayout breadcrumbCurrent="Detalles del perfil">
      <main style={styles.page}>
        <section
          style={{
            ...styles.topPanel,
            alignItems: isMobile ? 'stretch' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : '12px',
            padding: isMobile ? '12px' : '0 16px',
          }}
        >
          <h1 style={styles.title}>Detalles del perfil</h1>
          {doctor ? (
            <div style={{ ...styles.actions, justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
              <button
                style={{ ...styles.button, background: '#00875A', border: '1px solid #00875A', color: '#FFFFFF' }}
                type="button"
                onClick={() => navigate(`/doctores/${doctor.pk_fk_usuario}/editar`)}
              >
                ✎ Editar
              </button>
              <button
                style={{
                  ...styles.button,
                  background: '#FFFFFF',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                }}
                type="button"
                onClick={toggleStatus}
              >
                ⊘ {statusSaving ? 'Actualizando...' : statusActive ? 'Inactivar' : 'Reactivar'}
              </button>
            </div>
          ) : null}
        </section>

        {loading ? <section style={styles.profileCard}>Cargando...</section> : null}
        {error ? (
          <section style={{ ...styles.profileCard, color: '#DE350B' }}>
            {error}
          </section>
        ) : null}

        {doctor ? (
          <>
            <section
              style={{
                ...styles.dashboard,
                gridTemplateColumns: isMobile || isTablet ? '1fr' : 'minmax(0, 1fr) 174px',
              }}
            >
              <article style={styles.profileCard}>
                <div style={{ ...styles.profileHead, gridTemplateColumns: isMobile ? '1fr' : '78px minmax(0, 1fr)' }}>
                  <div style={styles.avatar}>
                    FOTO
                    <span style={styles.onlineDot} />
                  </div>
                  <div>
                    <h2 style={styles.doctorName}>{fullName}</h2>
                    <p style={styles.specialty}>{primarySpecialty}</p>
                    <span
                      style={{
                        ...styles.status,
                        background: statusActive ? '#D7F5E5' : '#FFE3E6',
                        color: statusActive ? '#00875A' : '#DE350B',
                      }}
                    >
                      • {status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ ...styles.infoGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
                  <InfoBox label="Professional ID (Cédula)" value={doctor.uk_cedula_profesional} />
                  <InfoBox label="RFC" value={doctor.uk_rfc_personal} />
                  <InfoBox label="Teléfono" value={doctor.telefono} />
                  <InfoBox label="Correo electrónico" value={doctor.correo_electronico} />
                  <InfoBox label="Número de empleado" value={doctor.uk_numero_empleado} />
                  <InfoBox label="CURP" value={doctor.uk_curp} />
                  <InfoBox label="Sede / Hospital" value={doctor.sede_nombre} />
                  <InfoBox label="Consultorio" value={`${consultorio} · ${schedule}`} />
                  <InfoBox label="Dirección" value={doctor.direccion} />
                  <InfoBox label="Género" value={doctor.genero} />
                </div>

                {doctor.documentos?.length ? (
                  <div style={styles.documentLinks}>
                    {doctor.documentos.map((documento) => (
                      <a
                        key={documento.id_documento_doctor}
                        href={documento.url}
                        rel="noreferrer"
                        style={styles.documentLink}
                        target="_blank"
                      >
                        Abrir {documento.tipo_documento}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>

              <aside style={styles.sideRail}>
                <MetricCard icon="♙" label="Pacientes totales" value={0} />
                <MetricCard icon="▣" label="Consultas este mes" value={0} />
                <div style={styles.nextSurgery}>
                  <p style={{ ...styles.metricLabel, color: '#D7F5E5' }}>Próxima cirugía</p>
                  <p style={{ fontSize: '13px', fontWeight: 900, margin: '4px 0 0' }}>Sin programación</p>
                  <p style={{ fontSize: '10px', margin: '3px 0 0' }}>{doctor.sede_nombre ?? 'Sin hospital'}</p>
                </div>
              </aside>
            </section>

            <section
              style={{
                ...styles.lowerGrid,
                gridTemplateColumns: isMobile || isTablet ? '1fr' : '138px minmax(0, 1fr)',
              }}
            >
              <aside style={styles.smallStack}>
                <div style={styles.miniStat}>
                  <p style={styles.metricLabel}>Citas completadas</p>
                  <p style={styles.miniValue}>0</p>
                </div>
                <div style={styles.miniStat}>
                  <p style={styles.metricLabel}>Pendientes</p>
                  <p style={{ ...styles.miniValue, color: '#97A400' }}>0</p>
                </div>
                <div style={styles.miniStat}>
                  <p style={styles.metricLabel}>Canceladas</p>
                  <p style={{ ...styles.miniValue, color: '#DE350B' }}>0</p>
                </div>
                <div style={{ ...styles.miniStat, minHeight: '86px' }}>
                  <p style={styles.metricLabel}>Historial de cambios</p>
                  <p style={{ ...styles.value, marginTop: '6px' }}>Última modificación registrada en auditoría.</p>
                </div>
              </aside>

              <article style={styles.historyCard}>
                <div style={styles.historyHeader}>
                  <h2 style={styles.sectionTitle}>Historial de Consultas</h2>
                  <span style={{ color: '#52647A', fontSize: '15px' }}>≡ ↓</span>
                </div>
                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>FECHA</th>
                        <th style={styles.th}>PACIENTE</th>
                        <th style={styles.th}>MOTIVO</th>
                        <th style={styles.th}>HOSPITAL</th>
                        <th style={styles.th}>ESTADO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={5} style={{ ...styles.td, ...styles.empty }}>
                          No hay consultas registradas para este doctor.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ borderTop: '1px solid #DFE1E6', paddingTop: '10px' }}>
                  <h2 style={{ ...styles.sectionTitle, padding: '0 12px' }}>Especialidades Adicionales</h2>
                  <div style={{ ...styles.chips, gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, minmax(0, 1fr))' }}>
                    {(additionalSpecialties.length ? additionalSpecialties : ['Sin especialidades adicionales']).map(
                      (especialidad) => (
                        <span key={especialidad} style={styles.chip}>
                          ⊕ {especialidad}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </article>
            </section>
          </>
        ) : null}
      </main>

      {doctor && showInactivationModal ? (
        <InactivationModal
          doctorName={fullName}
          submitting={statusSaving}
          onCancel={() => setShowInactivationModal(false)}
          onConfirm={(payload) => void changeStatus(payload)}
        />
      ) : null}

      {doctor && showInactivationSuccess ? (
        <InactivationSuccessModal
          doctorName={fullName}
          onBackToPanel={() => navigate('/doctores')}
          onViewProfile={() => setShowInactivationSuccess(false)}
        />
      ) : null}

      {doctor && showActivationModal ? (
        <ActivationModal
          doctorName={fullName}
          submitting={statusSaving}
          onCancel={() => setShowActivationModal(false)}
          onConfirm={(payload) => void changeStatus(payload)}
        />
      ) : null}

      {doctor && showActivationSuccess ? (
        <ActivationSuccessModal
          doctorName={fullName}
          onBackToPanel={() => navigate('/doctores')}
          onViewProfile={() => setShowActivationSuccess(false)}
        />
      ) : null}
    </DoctorLayout>
  );
}
