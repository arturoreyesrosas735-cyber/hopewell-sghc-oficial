import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

const pacientes = [
  ["Andres Fabian Ramirez", "33 anos", "M", "Fiebre viral demo"],
  ["Arely Rivera Guillen", "27 anos", "F", "Control de migrana"],
  ["Sofia Hernandez Luna", "39 anos", "F", "Rinitis alergica"],
  ["Miguel Torres Salinas", "46 anos", "M", "Dolor lumbar"],
  ["Valeria Mendoza Cruz", "25 anos", "F", "Gastritis leve"],
  ["Daniel Ortega Santos", "31 anos", "M", "Faringitis aguda"],
];

const historial = [
  ["Baja de usuario", "14-04-26", "Administrador", "El usuario fue dado de baja"],
  ["Edicion de reporte", "13-04-26", "Administrador", "Reporte clinico actualizado"],
  ["Nuevo reporte", "12-04-26", "Administrador", "Nuevo reporte clinico creado"],
  ["Eliminacion de reporte", "11-04-26", "Administrador", "Reporte clinico eliminado"],
];

const accesos = [
  {
    path: "/reportes/por-medico",
    title: "Reporte por medico",
    text: "Generar reporte filtrado por medico",
    tone: "green",
    icon: "M",
  },
  {
    path: "/reportes/por-sede",
    title: "Reporte por sede",
    text: "Generar reporte filtrado por sede",
    tone: "blue",
    icon: "S",
  },
  {
    path: "/reportes/por-periodo",
    title: "Reporte por periodo",
    text: "Generar reporte filtrado por periodo",
    tone: "violet",
    icon: "P",
  },
];

const ReportesIndexPage = () => {
  return (
    <MainLayout title="REPORTES" current="Reporte clinico">
      <section className="report-dashboard">
        <div className="dashboard-main-card">
          <div className="dashboard-card-title">
            <span className="card-icon green">R</span>
            <div>
              <h2>Generar reporte clinico</h2>
              <strong>Pacientes</strong>
            </div>
          </div>

          <div className="report-search">Buscar paciente...</div>

          <div className="patient-list">
            {pacientes.map((paciente, index) => (
              <div key={paciente[0]} className="patient-row">
                <span className={index === 0 ? "radio-dot active" : "radio-dot"} />
                <span className="mini-avatar">{paciente[0].charAt(0)}</span>
                <strong>{paciente[0]}</strong>
                <span>{paciente[1]}</span>
                <span>{paciente[2]}</span>
                <span>{paciente[3]}</span>
                <Link to="/reportes/resumen-clinico">Ver / Editar</Link>
              </div>
            ))}
          </div>

          <Link className="generate-report-button" to="/reportes/resumen-clinico">
            Generar reporte clinico
          </Link>
        </div>

        <div className="dashboard-visual-card">
          <h2>Visualizacion de reportes</h2>
          <div className="donut-area">
            <div className="donut-chart">
              <strong>256</strong>
              <span>Reportes</span>
            </div>
            <ul>
              <li><span className="dot green-dot" />Consultas medicas <strong>40%</strong></li>
              <li><span className="dot blue-dot" />Toma de signos <strong>25%</strong></li>
              <li><span className="dot violet-dot" />Laboratorios <strong>20%</strong></li>
              <li><span className="dot orange-dot" />Hospitalizacion <strong>10%</strong></li>
              <li><span className="dot gray-dot" />Otros <strong>5%</strong></li>
            </ul>
          </div>

          <div className="visual-actions">
            <Link to="/reportes/resumen-clinico">Visualizar</Link>
            <Link to="/reportes/por-periodo">Exportar</Link>
            <button type="button">Imprimir</button>
          </div>
        </div>

        <div className="dashboard-history-card">
          <h2>Historial de consulta</h2>
          <table>
            <thead>
              <tr>
                <th>Accion</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/reportes/historial-consultas" className="history-more">
            Ver mas historial
          </Link>
        </div>

        <div className="dashboard-quick-card">
          <h2>Reportes rapidos</h2>
          <div className="quick-list">
            {accesos.map((acceso) => (
              <Link key={acceso.path} to={acceso.path} className="quick-report">
                <span className={`card-icon ${acceso.tone}`}>{acceso.icon}</span>
                <div>
                  <strong>{acceso.title}</strong>
                  <small>{acceso.text}</small>
                </div>
                <span>›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ReportesIndexPage;
