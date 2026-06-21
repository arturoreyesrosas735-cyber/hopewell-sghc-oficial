import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorLayout, { useDoctorBreakpoints } from './DoctorLayout';

type DoctorDetalleData = {
  pk_fk_usuario: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  uk_rfc_personal: string;
  uk_cedula_profesional: string;
  fk_asentamiento_doctor: number;
  fk_estado_empleado_doctor: number;
  especialidades?: Array<{ id_especialidad: number; uk_nombre: string }>;
  estatus?: string | null;
};

const styles = {
  page: {
    display: 'grid',
    gap: '14px',
    padding: '0 0 18px',
  },
  panel: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    padding: '24px',
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    color: '#172B4D',
    fontSize: '26px',
    fontWeight: 700,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  field: {
    border: '1px solid #DFE1E6',
    borderRadius: '8px',
    padding: '16px',
  },
  label: {
    color: '#626F86',
    display: 'block',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
  },
  value: {
    color: '#172B4D',
    fontSize: '15px',
    margin: 0,
  },
  button: {
    border: 0,
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
    height: '42px',
    padding: '0 16px',
  },
};

function DetailField({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.field}>
      <span style={styles.label}>{label}</span>
      <p style={styles.value}>{value || 'Sin registro'}</p>
    </div>
  );
}

export default function DoctorDetalle() {
  const navigate = useNavigate();
  const params = useParams();
  const { isMobile } = useDoctorBreakpoints();
  const pkFkUsuario = params.pk_fk_usuario ?? params.id;
  const [doctor, setDoctor] = useState<DoctorDetalleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoctor() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/doctores/${pkFkUsuario}`);

        if (!response.ok) {
          throw new Error('No fue posible cargar el expediente médico.');
        }

        setDoctor(await response.json());
      } catch {
        setError('No fue posible cargar el expediente médico.');
      } finally {
        setLoading(false);
      }
    }

    void loadDoctor();
  }, [pkFkUsuario]);

  return (
    <DoctorLayout breadcrumbCurrent="Detalle Doctor">
      <main style={styles.page}>
        <section style={styles.panel}>
          <div
            style={{
              ...styles.header,
              alignItems: isMobile ? 'stretch' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '12px' : '16px',
            }}
          >
            <h1 style={styles.title}>Expediente médico del doctor</h1>
            <button
              style={{
                ...styles.button,
                background: '#00875A',
                color: '#FFFFFF',
                width: isMobile ? '100%' : 'auto',
              }}
              type="button"
              onClick={() => navigate('/doctores')}
            >
              Volver
            </button>
          </div>

          {loading ? <div style={{ color: '#44546F' }}>Cargando...</div> : null}

          {error ? (
            <div style={{ background: '#FFEBE6', borderRadius: '8px', color: '#DE350B', padding: '12px' }}>
              {error}
            </div>
          ) : null}

          {doctor ? (
            <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
              <DetailField label="PK usuario" value={doctor.pk_fk_usuario} />
              <DetailField
                label="Nombre completo"
                value={`${doctor.nombres} ${doctor.apellido_paterno} ${doctor.apellido_materno ?? ''}`}
              />
              <DetailField label="RFC" value={doctor.uk_rfc_personal} />
              <DetailField label="Cédula profesional" value={doctor.uk_cedula_profesional} />
              <DetailField label="Asentamiento" value={doctor.fk_asentamiento_doctor} />
              <DetailField label="Estado empleado" value={doctor.fk_estado_empleado_doctor} />
              <DetailField label="Estatus" value={doctor.estatus ?? 'Activo'} />
              <DetailField
                label="Especialidades"
                value={
                  doctor.especialidades?.map((especialidad) => especialidad.uk_nombre).join(', ') ??
                  'Sin especialidades'
                }
              />
            </div>
          ) : null}
        </section>
      </main>
    </DoctorLayout>
  );
}
