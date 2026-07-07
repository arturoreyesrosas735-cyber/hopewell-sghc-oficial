import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarReportePorSede,
  getReportePorSede,
} from "../../services/reportesService";

const ReporteSedePage = () => (
  <ReporteWorkspace
    titulo="Reporte por Sede"
    descripcion="Consulta la atencion registrada por sede activa."
    idLabel="ID de la sede"
    requiereId
    generar={({ id }) => getReportePorSede(Number(id))}
    exportar={({ id }, formato) => exportarReportePorSede(Number(id), formato)}
  />
);

export default ReporteSedePage;
