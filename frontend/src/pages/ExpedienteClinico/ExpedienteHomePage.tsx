import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertMessage, LoadingSpinner } from '../../components/expedientes/common';
import { buscarPacientes, getExpedientes, getResumenDia } from '../../services/expedienteService';
import type { ExpedienteClinico, PacienteResumen, ResumenDia } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

const fallbackResumen: ResumenDia = {
  pacientes: [
    { tiempo: '9:00', nombre: 'Laura Lopez', edad: 25, razon: 'Consulta', doctor: 'Dr. Alan' },
    { tiempo: '13:00', nombre: 'Jose Garcia', edad: 21, razon: 'Control', doctor: 'Dr. Samuel' },
  ],
  ultimas_consultas: [
    { modulo: 'Expediente clinico', fecha: '14-04-26', estatus: 'Ver / Editar' },
    { modulo: 'Tratamientos y recetas', fecha: '13-04-26', estatus: 'Ver / Editar' },
    { modulo: 'Diagnosticos', fecha: '10-04-26', estatus: 'Ver / Editar' },
  ],
  busqueda_rapida: ['Paciente activo', 'Expediente abierto', 'Documento reciente', 'Consulta pendiente'],
  mensajes: ['Nueva alerta de documento', 'Revision de historial pendiente'],
};

export default function ExpedienteHomePage() {
  const [resumen, setResumen] = useState<ResumenDia>(fallbackResumen);
  const [expedientes, setExpedientes] = useState<ExpedienteClinico[]>([]);
  const [pacientes, setPacientes] = useState<PacienteResumen[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.all([getResumenDia(), getExpedientes(), buscarPacientes()])
      .then(([resumenResponse, expedientesResponse, pacientesResponse]) => {
        if (!mounted) return;
        if (resumenResponse.success && resumenResponse.data) setResumen(resumenResponse.data);
        if (expedientesResponse.success && expedientesResponse.data) setExpedientes(expedientesResponse.data);
        if (pacientesResponse.success && pacientesResponse.data) setPacientes(pacientesResponse.data);
      })
      .catch(() => {
        if (mounted) {
          setNotice('Mostrando datos de ejemplo mientras el backend responde.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const todayRows = useMemo(() => resumen.pacientes.slice(0, 4), [resumen.pacientes]);
  const pacientesConExpediente = useMemo(
    () => new Set(expedientes.map((expediente) => expediente.fk_paciente_expediente_clinico)),
    [expedientes],
  );
  const pacientesSinExpediente = useMemo(
    () => pacientes.filter((paciente) => !pacientesConExpediente.has(paciente.id_paciente)).slice(0, 8),
    [pacientes, pacientesConExpediente],
  );

  function handleSearch(value: string) {
    setSearch(value);
    Promise.all([getExpedientes(value), buscarPacientes(value)])
      .then(([expedientesResponse, pacientesResponse]) => {
        if (expedientesResponse.success && expedientesResponse.data) setExpedientes(expedientesResponse.data);
        if (pacientesResponse.success && pacientesResponse.data) setPacientes(pacientesResponse.data);
      })
      .catch(() => setNotice('No fue posible completar la busqueda.'));
  }

  return (
    <ExpedienteLayout>
      <section className="exp-dashboard">
        <div className="diagnosis-title-row">
          <div>
            <h2 className="screen-title">Expedientes clinicos</h2>
            <p>Buscar paciente</p>
          </div>
          <Link className="success-action" to="/expedientes/nuevo">+ Abrir expediente</Link>
        </div>

        <div className="diagnosis-search-panel exp-search-panel">
          <label>
            Buscar paciente
            <input
              aria-label="Buscar paciente"
              placeholder="Buscar paciente, nombre, ID, CURP"
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>
          <label>
            Estado
            <select defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
            </select>
          </label>
          <label>
            Orden
            <select defaultValue="recientes">
              <option value="recientes">Recientes</option>
              <option value="paciente">Paciente</option>
            </select>
          </label>
        </div>

        {notice ? <AlertMessage>{notice}</AlertMessage> : null}
        {loading ? <LoadingSpinner label="Preparando resumen del dia..." /> : null}

        <div className="exp-dashboard-grid">
          <section className="exp-summary">
            <div className="exp-patient-card">
              <h3>Expedientes clinicos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Expediente</th>
                    <th>Paciente</th>
                    <th>CURP</th>
                    <th>Apertura</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.map((expediente) => (
                    <tr key={expediente.id_expediente}>
                      <td>EXP-{String(expediente.id_expediente).padStart(5, '0')}</td>
                      <td>
                        {expediente.paciente
                          ? `${expediente.paciente.nombres} ${expediente.paciente.apellido_paterno}`
                          : `Paciente #${expediente.fk_paciente_expediente_clinico}`}
                      </td>
                      <td>{expediente.paciente?.uk_curp ?? 'Sin CURP'}</td>
                      <td>{new Date(expediente.fecha_apertura).toLocaleDateString()}</td>
                      <td><Link to={`/expedientes/${expediente.id_expediente}`}>Ingresar</Link></td>
                    </tr>
                  ))}
                  {!expedientes.length ? (
                    <tr>
                      <td colSpan={5}>No se encontraron expedientes con ese criterio.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className="exp-last-card">
              <h3>Pacientes sin expediente</h3>
              {pacientesSinExpediente.map((paciente) => (
                <Link className="exp-last-row" key={paciente.id_paciente} to="/expedientes/nuevo">
                  <span>{paciente.nombres} {paciente.apellido_paterno}</span>
                  <strong>{paciente.uk_curp}</strong>
                  <em>Abrir</em>
                </Link>
              ))}
              {!pacientesSinExpediente.length ? <span className="exp-muted">Todos los pacientes listados tienen expediente.</span> : null}
            </div>
          </section>

          <aside className="exp-side-widgets">
            <section className="exp-quick-card">
              <h2>Busqueda rapida</h2>
              <div className="exp-mini-search">
                <span className="exp-search-icon" />
              </div>
              {resumen.busqueda_rapida.map((item) => (
                <Link className="exp-quick-pill" key={item} to="/expedientes/nuevo">
                  {item}
                </Link>
              ))}
            </section>

            <section className="exp-message-card">
              <h2>Mensajes</h2>
              {resumen.mensajes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </section>
          </aside>
        </div>
      </section>
    </ExpedienteLayout>
  );
}
