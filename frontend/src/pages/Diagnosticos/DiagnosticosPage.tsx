import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createDiagnostico,
  getDiagnosticosByConsulta,
  getDiagnosticosResumen,
  updateDiagnostico,
} from '../../services/diagnosticoService';
import type { Diagnostico, DiagnosticoPayload } from '../../types/diagnostico.types';

const emptyForm: DiagnosticoPayload = {
  nombre_diagnostico: '',
  descripcion_diagnostico: '',
  observaciones: '',
};

export function DiagnosticosPage() {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [selected, setSelected] = useState<Diagnostico | null>(null);
  const [consultaId, setConsultaId] = useState(1);
  const [form, setForm] = useState<DiagnosticoPayload>(emptyForm);
  const [status, setStatus] = useState('Cargando diagnosticos...');
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    const pendientes = diagnosticos.filter((item) => !item.observaciones).length;
    const revisados = diagnosticos.length - pendientes;
    return { total: diagnosticos.length, pendientes, revisados };
  }, [diagnosticos]);

  useEffect(() => {
    getDiagnosticosResumen()
      .then((response) => {
        setDiagnosticos(response.data);
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

  function startEdit(item: Diagnostico) {
    setSelected(item);
    setForm({
      nombre_diagnostico: item.nombre_diagnostico,
      descripcion_diagnostico: item.descripcion_diagnostico,
      observaciones: item.observaciones ?? '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setStatus(selected ? 'Actualizando diagnostico...' : 'Registrando diagnostico...');

    try {
      const response = selected
        ? await updateDiagnostico(selected.id_diagnostico, form)
        : await createDiagnostico(consultaId, form);

      setDiagnosticos((current) => {
        const exists = current.some((item) => item.id_diagnostico === response.data.id_diagnostico);
        return exists
          ? current.map((item) => (item.id_diagnostico === response.data.id_diagnostico ? response.data : item))
          : [response.data, ...current];
      });
      setSelected(null);
      setForm(emptyForm);
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
          <div>
            <strong>Hopewell</strong>
            <small>Historiales clinicos</small>
          </div>
        </div>
        <nav>
          <span><i>PX</i>Pacientes</span>
          <span><i>EX</i>Expedientes clinicos</span>
          <span><i>CM</i>Consultas medicas</span>
          <strong><i>DX</i>Diagnosticos</strong>
          <span><i>TR</i>Tratamientos y recetas</span>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Control medico</h1>
            <p>Lunes 13 de abril, 2026</p>
          </div>
          <div className="top-actions">
            <span className="role">Personal medico</span>
            <button aria-label="Notificaciones" type="button">!</button>
            <button aria-label="Calendario" type="button">[]</button>
            <button aria-label="Menu" type="button">=</button>
          </div>
        </header>

        <div className="utility-row">
          <div className="breadcrumb">
            <span>Inicio</span>
            <span>Menu de usuario</span>
            <strong>Diagnosticos</strong>
          </div>
          <div className="security-alert">! Alertas de seguridad</div>
        </div>

        <div className="global-search">
          <span aria-hidden="true">O</span>
          <input
            min="1"
            type="number"
            value={consultaId}
            onChange={(event) => setConsultaId(Number(event.target.value))}
            aria-label="Buscar consulta"
          />
          <button type="button" onClick={loadByConsulta}>Buscar consulta</button>
        </div>

        <h2 className="screen-title">Resumen de diagnosticos</h2>

        <section className="dashboard-grid">
          <div className="main-stack">
            <section className="patient-panel">
              <div className="panel-title">Indicadores</div>
              <div className="metric-strip">
                <article>
                  <span>Total</span>
                  <strong>{stats.total}</strong>
                </article>
                <article>
                  <span>Revisados</span>
                  <strong>{stats.revisados}</strong>
                </article>
                <article>
                  <span>Pendientes</span>
                  <strong>{stats.pendientes}</strong>
                </article>
              </div>
            </section>

            <div className="panel diagnosis-panel">
              <div className="panel-heading">
                <h3>Ultimos diagnosticos</h3>
                <span>Consulta #{consultaId}</span>
              </div>

              <div className="diagnostico-list">
                {diagnosticos.map((item) => (
                  <button
                    className={selected?.id_diagnostico === item.id_diagnostico ? 'diagnostico-card active' : 'diagnostico-card'}
                    key={item.id_diagnostico}
                    onClick={() => startEdit(item)}
                    type="button"
                  >
                    <span>{item.nombre_diagnostico}</span>
                    <small>Consulta #{item.fk_consulta_medica_diagnostico}</small>
                    <p>{item.descripcion_diagnostico}</p>
                  </button>
                ))}
              </div>
            </div>

            <form className="panel form-panel" onSubmit={handleSubmit}>
              <div className="panel-heading">
                <h3>{selected ? 'Actualizar diagnostico' : 'Registrar diagnostico'}</h3>
                {selected && <button type="button" onClick={() => { setSelected(null); setForm(emptyForm); }}>Nuevo</button>}
              </div>

              <label>
                Nombre del diagnostico
                <input
                  required
                  maxLength={120}
                  value={form.nombre_diagnostico}
                  onChange={(event) => setForm((current) => ({ ...current, nombre_diagnostico: event.target.value }))}
                />
              </label>

              <label>
                Descripcion clinica
                <textarea
                  required
                  value={form.descripcion_diagnostico}
                  onChange={(event) => setForm((current) => ({ ...current, descripcion_diagnostico: event.target.value }))}
                />
              </label>

              <label>
                Observaciones
                <textarea
                  value={form.observaciones}
                  onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))}
                />
              </label>

              <button className="primary-action" disabled={isSaving} type="submit">
                {isSaving ? 'Guardando...' : selected ? 'Guardar cambios' : 'Registrar'}
              </button>
              <p className="status">{status}</p>
            </form>
          </div>

          <aside className="side-stack">
            <section className="quick-panel">
              <h3>Busqueda rapida</h3>
              <div className="quick-search"><span>O</span></div>
              <div className="quick-lines">
                <span />
                <span />
                <span />
                <span />
              </div>
            </section>

            <section className="messages-panel">
              <h3>Mensajes</h3>
              <span />
              <span />
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
