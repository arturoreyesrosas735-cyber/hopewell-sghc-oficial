import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createDiagnostico,
  createDiagnosticoByExpediente,
  getDiagnosticosByConsulta,
  getDiagnosticosResumen,
  getPadecimientosCatalogo,
  updateDiagnostico,
} from '../../services/diagnosticoService';
import { getExpedientes } from '../../services/expedienteService';
import type { Diagnostico, DiagnosticoPayload, PadecimientoOption } from '../../types/diagnostico.types';
import type { ExpedienteClinico } from '../../types/expediente.types';

const emptyForm: DiagnosticoPayload = {
  nombre_diagnostico: '',
  descripcion_diagnostico: '',
  observaciones: '',
};

export function DiagnosticosPage() {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [selected, setSelected] = useState<Diagnostico | null>(null);
  const [consultaId, setConsultaId] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');
  const [foundExpediente, setFoundExpediente] = useState<ExpedienteClinico | null>(null);
  const [padecimientos, setPadecimientos] = useState<PadecimientoOption[]>([]);
  const [form, setForm] = useState<DiagnosticoPayload>(emptyForm);
  const [status, setStatus] = useState('Cargando diagnosticos...');
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    const pendientes = diagnosticos.filter((item) => !item.observaciones).length;
    const revisados = diagnosticos.length - pendientes;
    return { total: diagnosticos.length, pendientes, revisados };
  }, [diagnosticos]);

  const selectedDetail = selected ?? diagnosticos[0] ?? null;
  const activeExpedienteId = selectedDetail?.id_expediente ?? foundExpediente?.id_expediente ?? 1;
  const activeConsultaLabel = selectedDetail?.fk_consulta_medica_diagnostico
    ? `CONS-${String(selectedDetail.fk_consulta_medica_diagnostico).padStart(6, '0')}`
    : foundExpediente
      ? 'CONS-NUEVA'
      : `CONS-${String(consultaId).padStart(6, '0')}`;
  const activePatientName = selectedDetail
    ? `${selectedDetail.paciente_nombre ?? 'Paciente'} ${selectedDetail.paciente_apellido ?? ''}`.trim()
    : foundExpediente?.paciente
      ? `${foundExpediente.paciente.nombres} ${foundExpediente.paciente.apellido_paterno}`.trim()
      : 'Ana Lopez';
  const activePatientAge = foundExpediente?.paciente?.fecha_nacimiento
    ? `${calculateAge(foundExpediente.paciente.fecha_nacimiento)} anos`
    : '25 anos';

  useEffect(() => {
    Promise.all([getDiagnosticosResumen(), getPadecimientosCatalogo()])
      .then((response) => {
        setDiagnosticos(response[0].data);
        setPadecimientos(response[1].data);
        setStatus('Datos cargados');
      })
      .catch((error: Error) => setStatus(error.message));
  }, []);

  function loadByConsulta() {
    setStatus('Consultando registros...');
    getDiagnosticosByConsulta(consultaId)
      .then((response) => {
        setDiagnosticos(response.data);
        setSelected(null);
        setForm(emptyForm);
        setStatus(`Consulta ${consultaId} cargada`);
      })
      .catch((error: Error) => setStatus(error.message));
  }

  function searchByPaciente() {
    setStatus('Buscando paciente...');
    Promise.all([getDiagnosticosResumen(patientSearch), getExpedientes(patientSearch)])
      .then(([diagnosticosResponse, expedientesResponse]) => {
        const expediente = patientSearch.trim() && expedientesResponse.success && expedientesResponse.data?.length
          ? expedientesResponse.data[0]
          : null;

        setDiagnosticos(diagnosticosResponse.data);
        setFoundExpediente(expediente);
        setSelected(null);
        setStatus(getSearchStatus(patientSearch, diagnosticosResponse.data.length, expediente));
      })
      .catch((error: Error) => setStatus(error.message));
  }

  function startEdit(item: Diagnostico) {
    setSelected(item);
    setForm({
      nombre_diagnostico: item.nombre_diagnostico,
      descripcion_diagnostico: item.descripcion_diagnostico,
      observaciones: item.observaciones ?? '',
    });
  }

  function handlePadecimientoChange(value: string) {
    const padecimiento = padecimientos.find((item) => item.uk_nombre_padecimiento === value);

    setForm((current) => ({
      ...current,
      nombre_diagnostico: value,
      descripcion_diagnostico: current.descripcion_diagnostico || padecimiento?.vv_descripcion || '',
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(selected ? 'Actualizando diagnostico...' : 'Registrando diagnostico...');

    try {
      const response = selected
        ? await updateDiagnostico(selected.id_diagnostico, form)
        : foundExpediente
          ? await createDiagnosticoByExpediente(foundExpediente.id_expediente, form)
          : await createDiagnostico(consultaId, form);

      const savedDiagnostico = !selected && foundExpediente?.paciente
        ? {
            ...response.data,
            paciente_nombre: foundExpediente.paciente.nombres,
            paciente_apellido: foundExpediente.paciente.apellido_paterno,
            paciente_curp: foundExpediente.paciente.uk_curp,
            id_expediente: foundExpediente.id_expediente,
          }
        : response.data;

      setDiagnosticos((current) => {
        const exists = current.some((item) => item.id_diagnostico === savedDiagnostico.id_diagnostico);
        return exists
          ? current.map((item) => (item.id_diagnostico === savedDiagnostico.id_diagnostico ? savedDiagnostico : item))
          : [savedDiagnostico, ...current];
      });
      setSelected(null);
      setForm(emptyForm);
      setFoundExpediente(null);
      setStatus(selected ? 'Diagnostico actualizado' : 'Diagnostico registrado');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo guardar.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="hopewell-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/icons/logo.png" alt="Hopewell Historiales Clinicos" />
        </div>
        <nav>
          <Link to="/expedientes"><img src="/icons/menu-pacientes.svg" alt="" />Pacientes</Link>
          <Link to="/expedientes"><img src="/icons/menu-expedientes.svg" alt="" />Expedientes clinicos</Link>
          <Link to="/expedientes/1/historial"><img src="/icons/menu-consultas.svg" alt="" />Consultas medicas</Link>
          <strong><img src="/icons/menu-diagnosticos.svg" alt="" />Diagnosticos</strong>
          <Link to="/expedientes/1/historial"><img src="/icons/menu-tratamientos.svg" alt="" />Tratamientos y recetas</Link>
          <Link to="/expedientes/1"><img src="/icons/menu-padecimientos.svg" alt="" />Padecimientos</Link>
        </nav>
      </aside>

      <section className="workspace diagnosis-workspace">
        <header className="topbar">
          <div>
            <h1>Control medico</h1>
            <p>Lunes 13 de abril, 2026</p>
          </div>
          <div className="top-actions">
            <span className="role">Personal medico</span>
            <button aria-label="Notificaciones" type="button"><img src="/icons/accion-notificaciones.png" alt="" /></button>
            <button aria-label="Calendario" type="button"><img src="/icons/accion-ver.png" alt="" /></button>
            <button aria-label="Menu" type="button"><img src="/icons/accion-menu-hamburguesa.png" alt="" /></button>
          </div>
        </header>

        <div className="utility-row">
          <div className="breadcrumb">
            <span className="breadcrumb-home" aria-hidden="true" />
            <span>Inicio</span>
            <span>Diagnosticos</span>
            <strong>Lista de diagnosticos</strong>
          </div>
        </div>

        <div className="diagnosis-title-row">
          <div>
            <h2 className="screen-title">Lista de diagnosticos</h2>
            <p>Buscar paciente</p>
          </div>
          <button className="success-action" type="button" onClick={() => { setSelected(null); setForm(emptyForm); }}>
            + Registrar
          </button>
        </div>

        <section className="diagnosis-search-panel">
          <label>
            Buscar paciente
            <input
              placeholder="Buscar paciente, nombre, ID, CURP"
              value={patientSearch}
              onChange={(event) => setPatientSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  searchByPaciente();
                }
              }}
            />
          </label>
          <label>
            Fecha desde
            <input type="date" />
          </label>
          <label>
            Fecha hasta
            <input type="date" />
          </label>
          <label>
            Medico
            <select defaultValue="todos">
              <option value="todos">Todos</option>
              <option>Dr. Juan Perez</option>
            </select>
          </label>
          <label>
            Estado
            <select defaultValue="todos">
              <option value="todos">Todos</option>
              <option>Activo</option>
            </select>
          </label>
          <button className="success-action" type="button" onClick={searchByPaciente}>Buscar</button>
        </section>

        <section className="diagnosis-stats">
          <article><span>Total</span><strong>{stats.total}</strong></article>
          <article><span>Revisados</span><strong>{stats.revisados}</strong></article>
          <article><span>Pendientes</span><strong>{stats.pendientes}</strong></article>
        </section>

        <section className="diagnosis-table-card">
          <div className="panel-heading">
            <h3>Diagnosticos registrados</h3>
            <span>{status}</span>
          </div>
          <table className="diagnosis-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Paciente</th>
                <th>Diagnostico</th>
                <th>Medico</th>
                <th>Severidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticos.map((item) => (
                <tr key={item.id_diagnostico}>
                  <td>{new Date(item.fecha_crecion).toLocaleDateString('es-MX')}</td>
                  <td>{item.paciente_nombre ?? 'Ana'} {item.paciente_apellido ?? 'Lopez'}</td>
                  <td>{item.nombre_diagnostico}</td>
                  <td>Dr. Juan Perez</td>
                  <td>Media</td>
                  <td><span className="status-pill">Activo</span></td>
                  <td>
                    <button type="button" onClick={() => startEdit(item)}>Editar</button>
                  </td>
                </tr>
              ))}
              {!diagnosticos.length ? (
                <tr>
                  <td colSpan={7}>
                    {foundExpediente?.paciente
                      ? `Paciente encontrado: ${foundExpediente.paciente.nombres} ${foundExpediente.paciente.apellido_paterno}. Aun no tiene diagnosticos registrados.`
                      : 'No se encontraron diagnosticos para ese paciente.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="diagnosis-form-grid">
          <form className="diagnosis-form-card" onSubmit={handleSubmit}>
            <div className="panel-heading">
              <h3>{selected ? 'Actualizar diagnostico' : 'Registrar diagnostico'}</h3>
              {selected && <button type="button" onClick={() => { setSelected(null); setForm(emptyForm); }}>Nuevo</button>}
            </div>

            <div className="diagnosis-section-title">Informacion de la consulta</div>
            <div className="diagnosis-info-grid">
              <label>ID Consulta<input readOnly value={activeConsultaLabel} /></label>
              <label>Paciente<input readOnly value={activePatientName} /></label>
              <label>Edad<input readOnly value={activePatientAge} /></label>
              <label>Fecha<input readOnly value="13/04/2026  9:30" /></label>
              <label>Medico<input readOnly value="Dr. Juan Perez" /></label>
              <label>Expediente<input readOnly value={`EXP-${String(activeExpedienteId).padStart(5, '0')}`} /></label>
            </div>

            <div className="diagnosis-section-title">Informacion del diagnostico</div>
            <div className="diagnosis-form-fields">
              <label className="span-2">
                Diagnostico principal *
                <textarea
                  required
                  maxLength={1000}
                  placeholder="Ingrese el diagnostico principal del paciente"
                  value={form.descripcion_diagnostico}
                  onChange={(event) => setForm((current) => ({ ...current, descripcion_diagnostico: event.target.value }))}
                />
                <small>{form.descripcion_diagnostico.length}/1000</small>
              </label>
              <label>
                Severidad *
                <select defaultValue="">
                  <option value="" disabled>Seleccione severidad</option>
                  <option>Leve</option>
                  <option>Media</option>
                  <option>Severa</option>
                </select>
              </label>
              <label className="span-2">
                Observaciones
                <textarea
                  maxLength={1000}
                  placeholder="Observaciones adicionales"
                  value={form.observaciones}
                  onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))}
                />
                <small>{form.observaciones?.length ?? 0}/1000</small>
              </label>
              <label>
                Estado
                <select defaultValue="activo">
                  <option value="activo">Activo</option>
                  <option>Resuelto</option>
                </select>
              </label>
              <label className="span-2">
                Nombre del diagnostico *
                <select
                  required
                  value={form.nombre_diagnostico}
                  onChange={(event) => handlePadecimientoChange(event.target.value)}
                >
                  <option value="" disabled>Seleccione un padecimiento</option>
                  {padecimientos.map((padecimiento) => (
                    <option key={padecimiento.id_padecimiento} value={padecimiento.uk_nombre_padecimiento}>
                      {padecimiento.uk_nombre_padecimiento} ({padecimiento.uk_codigo_cie})
                    </option>
                  ))}
                  {form.nombre_diagnostico && !padecimientos.some((item) => item.uk_nombre_padecimiento === form.nombre_diagnostico) ? (
                    <option value={form.nombre_diagnostico}>{form.nombre_diagnostico}</option>
                  ) : null}
                </select>
              </label>
              <div className="diagnosis-actions">
                <button type="button" onClick={() => { setSelected(null); setForm(emptyForm); }}>Cancelar</button>
                <button className="success-action" disabled={isSaving} type="submit">
                  {isSaving ? 'Guardando...' : selected ? 'Actualizar diagnostico' : 'Guardar'}
                </button>
              </div>
            </div>
          </form>

          <aside className="diagnosis-detail-card">
            <h3>Detalle del diagnostico</h3>
            {selectedDetail ? (
              <>
                <div className="diagnosis-section-title">Informacion clinica</div>
                <dl>
                  <dt>Paciente</dt>
                  <dd>{selectedDetail.paciente_nombre ?? 'Ana'} {selectedDetail.paciente_apellido ?? 'Lopez'}</dd>
                  <dt>Diagnostico</dt>
                  <dd>{selectedDetail.nombre_diagnostico}</dd>
                  <dt>Descripcion</dt>
                  <dd>{selectedDetail.descripcion_diagnostico}</dd>
                  <dt>Estado</dt>
                  <dd>Activo</dd>
                </dl>
              </>
            ) : (
              <p>Selecciona un diagnostico para consultar su detalle.</p>
            )}
            <section className="diagnosis-history">
              <h4>Historial de cambios</h4>
              <p>13-04-26 9:30 - Diagnostico registrado</p>
              <p>11-04-26 9:25 - Sin actualizaciones pendientes</p>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

function calculateAge(dateValue: string): number {
  const birthDate = new Date(dateValue);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function getSearchStatus(search: string, diagnosticosCount: number, expediente: ExpedienteClinico | null): string {
  if (!search.trim()) {
    return 'Datos cargados';
  }

  if (diagnosticosCount > 0) {
    return `Resultados para "${search}"`;
  }

  if (expediente?.paciente) {
    return `Paciente encontrado: ${expediente.paciente.nombres} ${expediente.paciente.apellido_paterno}. Sin diagnosticos registrados.`;
  }

  return `Sin resultados para "${search}"`;
}
