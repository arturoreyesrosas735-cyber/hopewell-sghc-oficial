import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorLayout, { useDoctorBreakpoints } from '../Doctores/DoctorLayout';

const styles = {
  page: {
    display: 'grid',
    gap: '16px',
    paddingBottom: '18px',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    padding: '18px 22px',
  },
  sectionHeader: {
    alignItems: 'center',
    borderBottom: '1px solid #CBD5E1',
    display: 'flex',
    gap: '9px',
    marginBottom: '18px',
    paddingBottom: '10px',
  },
  iconBox: {
    alignItems: 'center',
    background: '#24B26B',
    borderRadius: '4px',
    color: '#FFFFFF',
    display: 'inline-flex',
    fontSize: '13px',
    fontWeight: 900,
    height: '20px',
    justifyContent: 'center',
    width: '20px',
  },
  sectionTitle: {
    color: '#172B4D',
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
  },
  grid: {
    display: 'grid',
    gap: '18px',
  },
  label: {
    color: '#52647A',
    display: 'grid',
    fontSize: '10px',
    fontWeight: 900,
    gap: '6px',
    textTransform: 'uppercase' as const,
  },
  input: {
    background: '#FFFFFF',
    border: '1px solid #9BB7CB',
    borderRadius: '5px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    fontSize: '13px',
    height: '40px',
    outline: 'none',
    padding: '0 12px',
    width: '100%',
  },
  textarea: {
    background: '#FFFFFF',
    border: '1px solid #9BB7CB',
    borderRadius: '5px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    fontSize: '13px',
    minHeight: '120px',
    outline: 'none',
    padding: '10px 12px',
    resize: 'vertical' as const,
    width: '100%',
  },
  select: {
    background: '#FFFFFF',
    border: '1px solid #9BB7CB',
    borderRadius: '5px',
    color: '#172B4D',
    fontSize: '13px',
    height: '40px',
    outline: 'none',
    padding: '0 12px',
    width: '100%',
  },
  help: {
    color: '#64748B',
    fontSize: '11px',
    margin: '-8px 0 0',
  },
  actions: {
    display: 'flex',
    gap: '28px',
    justifyContent: 'center',
    padding: '10px 0',
  },
  button: {
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 800,
    height: '42px',
    minWidth: '150px',
  },
  alert: {
    borderRadius: '6px',
    fontSize: '12px',
    padding: '10px 12px',
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

type EspecialidadPayload = {
  uk_nombre: string;
  vv_descripcion: string;
  estatus: string;
};

const initialForm: EspecialidadPayload = {
  uk_nombre: '',
  vv_descripcion: '',
  estatus: 'Activo',
};

export default function EspecialidadForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { isMobile } = useDoctorBreakpoints();
  const especialidadId = params.id;
  const editing = Boolean(especialidadId);
  const [form, setForm] = useState<EspecialidadPayload>(initialForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!editing) {
      return;
    }

    async function loadEspecialidad() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/especialidades-catalogo/${especialidadId}`);

        if (!response.ok) {
          throw new Error('No fue posible cargar la especialidad.');
        }

        const data = await response.json();
        setForm({
          uk_nombre: data.uk_nombre ?? '',
          vv_descripcion: data.vv_descripcion ?? '',
          estatus: data.estatus ?? 'Activo',
        });
      } catch {
        setError('No fue posible cargar la especialidad.');
      } finally {
        setLoading(false);
      }
    }

    void loadEspecialidad();
  }, [editing, especialidadId]);

  const formValid = useMemo(() => {
    const validName = /^[\p{L}\p{N}\s.-]+$/u.test(form.uk_nombre.trim());
    return validName && form.uk_nombre.trim().length > 0 && form.vv_descripcion.trim().length > 0;
  }, [form.uk_nombre, form.vv_descripcion]);

  function updateField(field: keyof EspecialidadPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setSuccess('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formValid) {
      setError('Completa nombre y descripción con formato válido antes de guardar.');
      return;
    }

    setConfirmOpen(true);
  }

  async function save() {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        editing ? `/api/especialidades-catalogo/${especialidadId}` : '/api/especialidades-catalogo',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uk_nombre: form.uk_nombre.trim(),
            vv_descripcion: form.vv_descripcion.trim(),
            estatus: form.estatus,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 422) {
        throw new Error(data.message ?? 'El nombre ingresado ya pertenece a otra especialidad.');
      }

      if (response.status === 409) {
        throw new Error('El nombre de la especialidad ya existe.');
      }

      if (!response.ok) {
        throw new Error(data.message ?? 'No fue posible guardar la especialidad.');
      }

      setConfirmOpen(false);
      setSuccess(editing ? 'Los cambios se han guardado correctamente.' : 'Especialidad registrada exitosamente.');

      if (!editing) {
        window.setTimeout(() => navigate('/especialidades'), 700);
      }
    } catch (currentError) {
      setError((currentError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DoctorLayout
      breadcrumbCurrent={editing ? 'Editar Especialidad' : 'Nueva Especialidad'}
      panelTitle="PANEL DE ESPECIALIDADES"
      sectionLabel="ESPECIALIDADES"
    >
      <main style={styles.page}>
        <form onSubmit={submit}>
          <section style={styles.card}>
            <div style={styles.sectionHeader}>
              <span style={styles.iconBox}>✚</span>
              <h2 style={styles.sectionTitle}>{editing ? 'Editar Especialidad' : 'Registro de Especialidad'}</h2>
            </div>

            {loading ? <p style={{ color: '#64748B', fontSize: '13px' }}>Cargando especialidad...</p> : null}

            <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.6fr' }}>
              <label style={styles.label}>
                Nombre de especialidad
                <input
                  disabled={loading || saving}
                  maxLength={100}
                  placeholder="Ej. Cardiología"
                  required
                  style={styles.input}
                  value={form.uk_nombre}
                  onChange={(event) => updateField('uk_nombre', event.target.value)}
                />
              </label>
              <label style={styles.label}>
                Estado inicial
                <select
                  disabled={loading || saving}
                  required
                  style={styles.select}
                  value={form.estatus}
                  onChange={(event) => updateField('estatus', event.target.value)}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              </label>
            </div>

            <p style={styles.help}>Nombre único, sin caracteres especiales como @ o #.</p>

            <div style={{ ...styles.grid, marginTop: '16px' }}>
              <label style={styles.label}>
                Descripción técnica
                <textarea
                  disabled={loading || saving}
                  maxLength={255}
                  placeholder="Describe el alcance clínico y técnico de la especialidad..."
                  required
                  style={styles.textarea}
                  value={form.vv_descripcion}
                  onChange={(event) => updateField('vv_descripcion', event.target.value)}
                />
              </label>
              <p style={{ ...styles.help, textAlign: 'right' }}>{form.vv_descripcion.length}/255</p>
            </div>
          </section>

          {error ? <div style={{ ...styles.alert, background: '#FFEBE6', color: '#DE350B', marginTop: '12px' }}>{error}</div> : null}
          {success ? <div style={{ ...styles.alert, background: '#E3FCEF', color: '#00875A', marginTop: '12px' }}>{success}</div> : null}

          <div style={{ ...styles.actions, flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              disabled={!formValid || saving || loading}
              style={{
                ...styles.button,
                background: formValid && !saving && !loading ? '#00875A' : '#9CA3AF',
                border: 0,
                color: '#FFFFFF',
                cursor: formValid && !saving && !loading ? 'pointer' : 'not-allowed',
              }}
              type="submit"
            >
              {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              disabled={saving}
              style={{ ...styles.button, background: '#FFE2E2', border: '1px solid #EF4444', color: '#EF4444' }}
              type="button"
              onClick={() => navigate('/especialidades')}
            >
              Regresar
            </button>
          </div>
        </form>
      </main>

      {confirmOpen ? (
        <div role="presentation" style={styles.modalBackdrop}>
          <section aria-modal="true" role="dialog" style={styles.modal}>
            <h2 style={{ color: '#172B4D', fontSize: '20px', margin: '0 0 10px', textAlign: 'center' }}>
              Confirmar {editing ? 'actualización' : 'registro'}
            </h2>
            <p style={{ color: '#52647A', fontSize: '13px', lineHeight: 1.4, textAlign: 'center' }}>
              Se guardará la especialidad en el catálogo maestro y se registrará el movimiento en auditoría.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '22px' }}>
              <button
                disabled={saving}
                style={{ ...styles.button, background: '#00875A', border: 0, color: '#FFFFFF' }}
                type="button"
                onClick={() => void save()}
              >
                {saving ? 'Guardando...' : 'Confirmar'}
              </button>
              <button
                disabled={saving}
                style={{ ...styles.button, background: '#FFE2E2', border: '1px solid #EF4444', color: '#EF4444' }}
                type="button"
                onClick={() => setConfirmOpen(false)}
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
