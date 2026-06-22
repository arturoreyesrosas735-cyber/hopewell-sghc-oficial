import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorLayout, { useDoctorBreakpoints } from './DoctorLayout';

type DoctorPayload = {
  id_personal: number | '';
  uk_rfc_personal: string;
  uk_cedula_profesional: string;
  sede_nombre: string;
  especialidades: number[];
};

type Especialidad = {
  id_especialidad: number;
  uk_nombre: string;
};

type Sede = {
  id_sede: number;
  nombre_sede: string;
};

type PersonalDisponible = {
  id_personal: number;
  uk_numero_empleado: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  telefono?: string | null;
  uk_correo_electronico: string;
  uk_curp: string;
  genero?: string | null;
  nombre_sede?: string | null;
  direccion?: string | null;
  doctor_id?: number | null;
  es_doctor?: boolean;
};

type ConflictField = 'uk_rfc_personal' | 'uk_cedula_profesional' | null;
type DoctorDocumentField = 'cedula_documento' | 'rfc_documento';
type DoctorDocument = {
  id_documento_doctor: number;
  tipo_documento: string;
  nombre_documento: string;
  extension_archivo: string;
  tamano_archivo: string | number;
  url: string;
};

const cedulaRegex = /^[0-9]{8}$/;
const rfcRegex = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/i;

const emptyPayload: DoctorPayload = {
  id_personal: '',
  uk_rfc_personal: '',
  uk_cedula_profesional: '',
  sede_nombre: 'Hospital Central Hopewell',
  especialidades: [],
};

const styles = {
  formWrap: {
    alignSelf: 'start',
    display: 'grid',
    gap: '14px',
    justifyItems: 'stretch',
    width: '100%',
  },
  card: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 2px 7px rgba(9, 30, 66, 0.18)',
    boxSizing: 'border-box' as const,
    padding: '0 14px 14px',
    width: '100%',
  },
  sectionHeader: {
    alignItems: 'center',
    borderBottom: '1px solid #C8D2DC',
    display: 'flex',
    gap: '8px',
    height: '39px',
  },
  iconBox: {
    alignItems: 'center',
    background: '#1FAD72',
    borderRadius: '5px',
    color: '#FFFFFF',
    display: 'inline-flex',
    fontSize: '15px',
    fontWeight: 900,
    height: '18px',
    justifyContent: 'center',
    width: '18px',
  },
  sectionTitle: {
    color: '#172B4D',
    fontSize: '20px',
    fontWeight: 500,
    letterSpacing: '0',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gap: '12px 20px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    paddingTop: '12px',
  },
  label: {
    alignContent: 'start',
    color: '#52647A',
    display: 'grid',
    fontSize: '9px',
    fontWeight: 900,
    gap: '4px',
    letterSpacing: '0',
  },
  input: {
    background: '#FFFFFF',
    border: '1px solid #8EA0B3',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    fontSize: '12px',
    height: '40px',
    outline: 'none',
    padding: '0 12px',
    width: '100%',
  },
  select: {
    background: '#FFFFFF',
    border: '1px solid #CDD5DF',
    borderRadius: '6px',
    color: '#172B4D',
    fontSize: '12px',
    height: '40px',
    outline: 'none',
    padding: '0 12px',
    width: '100%',
  },
  hint: {
    color: '#00875A',
    fontSize: '8px',
    marginTop: '3px',
  },
  upload: {
    alignItems: 'center',
    background: '#F0F6FF',
    border: '1px dashed #9BB7CB',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    display: 'grid',
    justifyItems: 'center',
    minHeight: '80px',
    padding: '7px',
    textAlign: 'center' as const,
    width: '100%',
  },
  uploadActions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    justifyContent: 'center',
    marginTop: '6px',
  },
  miniButton: {
    alignItems: 'center',
    border: 0,
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '10px',
    fontWeight: 800,
    height: '26px',
    justifyContent: 'center',
    padding: '0 10px',
    textDecoration: 'none',
  },
  uploadGrid: {
    boxSizing: 'border-box' as const,
    display: 'grid',
    gap: '28px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    padding: '0 2px',
    width: '100%',
  },
  note: {
    background: '#DCEAFF',
    borderRadius: '7px',
    color: '#52647A',
    fontSize: '10px',
    padding: '7px 8px',
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    gap: 'clamp(24px, 24vw, 250px)',
    justifyContent: 'center',
    padding: '12px 0 2px',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    border: 0,
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '11px',
    fontWeight: 800,
    height: '44px',
    justifyContent: 'center',
    minWidth: '176px',
    padding: '0 18px',
  },
  spinner: {
    border: '2px solid rgba(255,255,255,0.44)',
    borderRadius: '999px',
    borderTopColor: '#FFFFFF',
    height: '16px',
    marginRight: '8px',
    width: '16px',
  },
  alert: {
    background: '#FFEBE6',
    borderRadius: '8px',
    color: '#DE350B',
    fontSize: '12px',
    padding: '10px 12px',
    width: '100%',
  },
};

export default function DoctorForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { isMobile } = useDoctorBreakpoints();
  const pkFkUsuario = params.pk_fk_usuario ?? params.id;
  const editing = Boolean(pkFkUsuario);
  const [formData, setFormData] = useState<DoctorPayload>(emptyPayload);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [personalDisponible, setPersonalDisponible] = useState<PersonalDisponible[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [alert, setAlert] = useState('');
  const [conflictField, setConflictField] = useState<ConflictField>(null);
  const [doctorDocuments, setDoctorDocuments] = useState<Record<DoctorDocumentField, File | null>>({
    cedula_documento: null,
    rfc_documento: null,
  });
  const [currentDocuments, setCurrentDocuments] = useState<Record<DoctorDocumentField, DoctorDocument | null>>({
    cedula_documento: null,
    rfc_documento: null,
  });

  useEffect(() => {
    async function loadCatalogos() {
      const [especialidadesResponse, sedesResponse, personalResponse] = await Promise.all([
        fetch('/api/especialidades'),
        fetch('/api/sedes'),
        fetch('/api/personal-disponible'),
      ]);

      if (!especialidadesResponse.ok || !(especialidadesResponse.headers.get('content-type') ?? '').includes('application/json')) {
        setEspecialidades([]);
      } else {
        const data = await especialidadesResponse.json();
        setEspecialidades(Array.isArray(data) ? data : data.data ?? []);
      }

      if (!sedesResponse.ok || !(sedesResponse.headers.get('content-type') ?? '').includes('application/json')) {
        setSedes([]);
      } else {
        const data = await sedesResponse.json();
        const loadedSedes = Array.isArray(data) ? data : data.data ?? [];
        setSedes(loadedSedes);
        setFormData((current) => ({
          ...current,
          sede_nombre: current.sede_nombre || loadedSedes[0]?.nombre_sede || '',
        }));
      }

      if (!personalResponse.ok || !(personalResponse.headers.get('content-type') ?? '').includes('application/json')) {
        setPersonalDisponible([]);
      } else {
        const data = await personalResponse.json();
        setPersonalDisponible(Array.isArray(data) ? data : data.data ?? []);
      }
    }

    void loadCatalogos().catch(() => {
      setEspecialidades([]);
      setPersonalDisponible([]);
      setSedes([]);
    });
  }, []);

  useEffect(() => {
    if (!editing) {
      return;
    }

    async function loadDoctor() {
      setLoading(true);

      try {
        const response = await fetch(`/api/doctores/${pkFkUsuario}`);

        if (!response.ok) {
          throw new Error('No fue posible cargar el doctor.');
        }

        const data = await response.json();
        setFormData({
          id_personal: data.id_personal ?? '',
          uk_rfc_personal: data.uk_rfc_personal ?? '',
          uk_cedula_profesional: data.uk_cedula_profesional ?? '',
          sede_nombre: data.sede_nombre ?? 'Hospital Central Hopewell',
          especialidades: Array.isArray(data.especialidades)
            ? data.especialidades.map((item: number | Especialidad) =>
                typeof item === 'number' ? item : item.id_especialidad,
              )
            : [],
        });
        setCurrentDocuments(mapCurrentDocuments(data.documentos ?? []));
      } catch {
        setAlert('No fue posible cargar el doctor.');
      } finally {
        setLoading(false);
      }
    }

    void loadDoctor();
  }, [editing, pkFkUsuario]);

  const title = useMemo(() => (editing ? 'Editar Doctor' : 'Registrar Doctor'), [editing]);
  const firstEspecialidad = formData.especialidades[0] ? String(formData.especialidades[0]) : '';
  const selectedPersonal = personalDisponible.find((item) => item.id_personal === Number(formData.id_personal));
  const selectedPersonalAlreadyDoctor = Boolean(selectedPersonal?.es_doctor) && !editing;

  function updateField<Key extends keyof DoctorPayload>(key: Key, value: DoctorPayload[Key]) {
    setFormData((current) => ({ ...current, [key]: value }));
    setConflictField(null);
    setAlert('');
  }

  function updateEspecialidad(event: ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.target.value);
    updateField('especialidades', value ? [value] : []);
  }

  function updatePersonal(event: ChangeEvent<HTMLSelectElement>) {
    const value = Number(event.target.value);
    const personal = personalDisponible.find((item) => item.id_personal === value);

    updateField('id_personal', value || '');

    if (personal?.nombre_sede) {
      updateField('sede_nombre', personal.nombre_sede);
    }
  }

  function conflictStyle(field: ConflictField) {
    return conflictField === field ? { borderColor: '#DE350B' } : {};
  }

  function mapCurrentDocuments(documents: DoctorDocument[]) {
    return documents.reduce<Record<DoctorDocumentField, DoctorDocument | null>>(
      (mappedDocuments, document) => {
        if (document.tipo_documento === 'Cedula profesional') {
          mappedDocuments.cedula_documento = document;
        }

        if (document.tipo_documento === 'RFC') {
          mappedDocuments.rfc_documento = document;
        }

        return mappedDocuments;
      },
      {
        cedula_documento: null,
        rfc_documento: null,
      },
    );
  }

  function updateDocument(field: DoctorDocumentField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAlert('');

    if (!file) {
      setDoctorDocuments((current) => ({ ...current, [field]: null }));
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isPdf || !isValidSize) {
      setAlert('El documento debe ser PDF y pesar máximo 5MB.');
      event.target.value = '';
      setDoctorDocuments((current) => ({ ...current, [field]: null }));
      return;
    }

    setDoctorDocuments((current) => ({ ...current, [field]: file }));
  }

  function clearSelectedDocument(field: DoctorDocumentField) {
    setDoctorDocuments((current) => ({ ...current, [field]: null }));
    setAlert('');
  }

  async function deleteCurrentDocument(field: DoctorDocumentField) {
    if (!editing || !pkFkUsuario || saving) {
      return;
    }

    setSaving(true);
    setAlert('');

    try {
      const response = await fetch(`/api/doctores/${pkFkUsuario}/documentos/${field}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('No fue posible eliminar el documento.');
      }

      setCurrentDocuments((current) => ({ ...current, [field]: null }));
      setDoctorDocuments((current) => ({ ...current, [field]: null }));
    } catch {
      setAlert('No fue posible eliminar el documento.');
    } finally {
      setSaving(false);
    }
  }

  function documentHelperText(field: DoctorDocumentField) {
    const selectedDocument = doctorDocuments[field];
    const currentDocument = currentDocuments[field];

    if (selectedDocument) {
      return selectedDocument.name;
    }

    if (currentDocument) {
      return `Actual: ${currentDocument.nombre_documento}`;
    }

    return 'Formatos permitidos: PDF (Máx. 5MB)';
  }

  function buildRequestBody() {
    const body = new FormData();

    if (formData.id_personal !== '') {
      body.append('id_personal', String(formData.id_personal));
    }

    body.append('uk_rfc_personal', formData.uk_rfc_personal);
    body.append('uk_cedula_profesional', formData.uk_cedula_profesional);
    body.append('sede_nombre', formData.sede_nombre);

    formData.especialidades.forEach((especialidadId) => {
      body.append('especialidades[]', String(especialidadId));
    });

    Object.entries(doctorDocuments).forEach(([field, file]) => {
      if (file) {
        body.append(field, file);
      }
    });

    return body;
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setAlert('');
    setConflictField(null);

    if (!editing && !cedulaRegex.test(formData.uk_cedula_profesional)) {
      setConflictField('uk_cedula_profesional');
      setAlert('Formato de cédula incorrecto. Ingrese únicamente 8 números.');
      setSaving(false);
      return;
    }

    if (!rfcRegex.test(formData.uk_rfc_personal)) {
      setConflictField('uk_rfc_personal');
      setAlert('El RFC debe tener 13 caracteres y cumplir la estructura fiscal.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(editing ? `/api/doctores/${pkFkUsuario}` : '/api/doctores', {
        method: 'POST',
        body: buildRequestBody(),
      });

      if (response.status === 409) {
        const data = await response.json().catch(() => ({}));
        setConflictField(data.field === 'uk_rfc_personal' ? 'uk_rfc_personal' : 'uk_cedula_profesional');
        setAlert(data.message ?? 'Este registro ya existe.');
        return;
      }

      if (!response.ok) {
        throw new Error('No fue posible guardar el doctor.');
      }

      navigate('/doctores');
    } catch {
      setAlert('No fue posible guardar el doctor.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <DoctorLayout breadcrumbCurrent={title}>
      <form
        style={{
          ...styles.formWrap,
          padding: '0 0 18px',
        }}
        onSubmit={(event) => void submitForm(event)}
      >
        {loading ? <div style={styles.card}>Cargando...</div> : null}

        {!loading ? (
          <>
            <section style={styles.card}>
              <div style={styles.sectionHeader}>
                <span style={styles.iconBox}>☻</span>
                <h2 style={styles.sectionTitle}>Información Personal</h2>
              </div>
              <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
                <label style={styles.label}>
                  NÚMERO DE EMPLEADO
                  <select
                    required
                    disabled={editing}
                    style={styles.select}
                    value={formData.id_personal}
                    onChange={updatePersonal}
                  >
                    <option value="">
                      {personalDisponible.length > 0 ? 'Selecciona un empleado' : 'No hay empleados disponibles'}
                    </option>
                    {personalDisponible.map((personal) => (
                      <option key={personal.id_personal} value={personal.id_personal}>
                        {personal.uk_numero_empleado}
                        {personal.es_doctor ? ' - ya es doctor' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label style={styles.label}>
                  NOMBRE COMPLETO
                  <input
                    readOnly
                    placeholder="Selecciona un empleado"
                    style={styles.input}
                    value={
                      selectedPersonal
                        ? `${selectedPersonal.nombres} ${selectedPersonal.apellido_paterno} ${selectedPersonal.apellido_materno ?? ''}`.trim()
                        : ''
                    }
                  />
                </label>
                <label style={styles.label}>
                  CORREO ELECTRÓNICO
                  <input
                    readOnly
                    placeholder="correo registrado"
                    style={styles.input}
                    type="email"
                    value={selectedPersonal?.uk_correo_electronico ?? ''}
                  />
                </label>
                <label style={styles.label}>
                  TELÉFONO DE CONTACTO
                  <input
                    readOnly
                    placeholder="teléfono registrado"
                    style={styles.input}
                    value={selectedPersonal?.telefono ?? ''}
                  />
                </label>
                <label style={styles.label}>
                  GÉNERO
                  <input
                    readOnly
                    placeholder="género registrado"
                    style={styles.input}
                    value={selectedPersonal?.genero ?? ''}
                  />
                </label>
                <label style={styles.label}>
                  DIRECCIÓN
                  <input
                    readOnly
                    placeholder="dirección registrada"
                    style={styles.input}
                    value={selectedPersonal?.direccion ?? ''}
                  />
                </label>
              </div>
            </section>

            <section style={styles.card}>
              <div style={styles.sectionHeader}>
                <span style={styles.iconBox}>▣</span>
                <h2 style={styles.sectionTitle}>Credenciales Profesionales</h2>
              </div>
              <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
                <label style={styles.label}>
                  CÉDULA PROFESIONAL
                  <input
                    required
                    readOnly={editing}
                    placeholder="8 dígitos"
                    style={{ ...styles.input, ...conflictStyle('uk_cedula_profesional') }}
                    value={formData.uk_cedula_profesional}
                    onChange={(event) => updateField('uk_cedula_profesional', event.target.value)}
                  />
                  <span style={styles.hint}>Validada ante el Registro Nacional de Profesionistas</span>
                </label>
                <label style={styles.label}>
                  RFC
                  <input
                    required
                    placeholder="MAAR850101XXX"
                    style={{ ...styles.input, ...conflictStyle('uk_rfc_personal') }}
                    value={formData.uk_rfc_personal}
                    onChange={(event) => updateField('uk_rfc_personal', event.target.value)}
                  />
                </label>
              </div>
            </section>

            <div style={{ ...styles.uploadGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
              <label style={styles.upload}>
                <span style={{ color: '#00875A', fontSize: '21px', fontWeight: 900 }}>▣</span>
                <strong>Adjuntar cédula</strong>
                <span>{documentHelperText('cedula_documento')}</span>
                <div style={styles.uploadActions}>
                  {currentDocuments.cedula_documento ? (
                    <a
                      href={currentDocuments.cedula_documento.url}
                      rel="noreferrer"
                      style={{ ...styles.miniButton, background: '#00875A', color: '#FFFFFF' }}
                      target="_blank"
                    >
                      Ver actual
                    </a>
                  ) : null}
                  {doctorDocuments.cedula_documento ? (
                    <button
                      style={{ ...styles.miniButton, background: '#F8D7D7', color: '#DE350B' }}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        clearSelectedDocument('cedula_documento');
                      }}
                    >
                      Quitar selección
                    </button>
                  ) : null}
                  {currentDocuments.cedula_documento ? (
                    <button
                      disabled={saving}
                      style={{ ...styles.miniButton, background: '#FFE3E6', color: '#DE350B' }}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        void deleteCurrentDocument('cedula_documento');
                      }}
                    >
                      Eliminar actual
                    </button>
                  ) : null}
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => updateDocument('cedula_documento', event)}
                />
              </label>
              <label style={styles.upload}>
                <span style={{ color: '#00875A', fontSize: '21px', fontWeight: 900 }}>▣</span>
                <strong>Adjuntar RFC</strong>
                <span>{documentHelperText('rfc_documento')}</span>
                <div style={styles.uploadActions}>
                  {currentDocuments.rfc_documento ? (
                    <a
                      href={currentDocuments.rfc_documento.url}
                      rel="noreferrer"
                      style={{ ...styles.miniButton, background: '#00875A', color: '#FFFFFF' }}
                      target="_blank"
                    >
                      Ver actual
                    </a>
                  ) : null}
                  {doctorDocuments.rfc_documento ? (
                    <button
                      style={{ ...styles.miniButton, background: '#F8D7D7', color: '#DE350B' }}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        clearSelectedDocument('rfc_documento');
                      }}
                    >
                      Quitar selección
                    </button>
                  ) : null}
                  {currentDocuments.rfc_documento ? (
                    <button
                      disabled={saving}
                      style={{ ...styles.miniButton, background: '#FFE3E6', color: '#DE350B' }}
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        void deleteCurrentDocument('rfc_documento');
                      }}
                    >
                      Eliminar actual
                    </button>
                  ) : null}
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => updateDocument('rfc_documento', event)}
                />
              </label>
            </div>

            <section style={styles.card}>
              <div style={styles.sectionHeader}>
                <span style={styles.iconBox}>▣</span>
                <h2 style={styles.sectionTitle}>Especialidad y Asignación</h2>
              </div>
              <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))' }}>
                <label style={styles.label}>
                  ESPECIALIDAD PRIMARIA
                  <select required style={styles.select} value={firstEspecialidad} onChange={updateEspecialidad}>
                    <option value="">Selecciona una especialidad</option>
                    {especialidades.map((especialidad) => (
                      <option key={especialidad.id_especialidad} value={especialidad.id_especialidad}>
                        {especialidad.uk_nombre}
                      </option>
                    ))}
                    {especialidades.length === 0 ? <option value="" disabled>No hay especialidades registradas</option> : null}
                  </select>
                </label>
                <label style={styles.label}>
                  HOSPITAL ASIGNADO
                  <select
                    style={styles.select}
                    value={formData.sede_nombre}
                    onChange={(event) => updateField('sede_nombre', event.target.value)}
                  >
                    {sedes.map((sede) => (
                      <option key={sede.id_sede}>{sede.nombre_sede}</option>
                    ))}
                    {sedes.length === 0 ? <option value="" disabled>No hay sedes registradas</option> : null}
                  </select>
                </label>
              </div>
              <div style={{ ...styles.note, marginTop: '12px' }}>
                <strong>Configuración de Consultorio</strong>
                <br />
                Se asignará automáticamente un consultorio disponible basado en su especialidad.
              </div>
            </section>

            {alert ? <div style={styles.alert}>{alert}</div> : null}
            {selectedPersonalAlreadyDoctor ? (
              <div style={styles.alert}>Este empleado ya tiene un perfil de doctor asignado.</div>
            ) : null}

            <div style={{ ...styles.actions, flexDirection: isMobile ? 'column' : 'row' }}>
              <button
                disabled={saving || selectedPersonalAlreadyDoctor}
                style={{
                  ...styles.button,
                  background: saving ? '#36B37E' : '#00875A',
                  color: '#FFFFFF',
                  cursor: saving || selectedPersonalAlreadyDoctor ? 'not-allowed' : 'pointer',
                  width: isMobile ? '100%' : '176px',
                }}
                type="submit"
              >
                {saving ? <span style={styles.spinner} /> : null}
                Finalizar Registro
              </button>
              <button
                style={{
                  ...styles.button,
                  background: '#F8D7D7',
                  border: '1px solid #C98D8D',
                  color: '#DE350B',
                  width: isMobile ? '100%' : '176px',
                }}
                type="button"
                onClick={() => navigate('/doctores')}
              >
                Cerrar
              </button>
            </div>
          </>
        ) : null}
      </form>
    </DoctorLayout>
  );
}
