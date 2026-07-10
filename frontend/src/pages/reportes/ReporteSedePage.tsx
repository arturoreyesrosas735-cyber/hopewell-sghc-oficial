import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarReportePorSede,
  getReportePorSede,
} from "../../services/reportesService";

const ReporteSedePage = () => (
  <ReporteWorkspace
    titulo="Reporte por sede"
    current="Reporte por sede"
    kind="sede"
    idLabel="Sede"
    requiereId
    fechasOpcionales
    generar={({ id }) => getReportePorSede(Number(id))}
    exportar={({ id }, formato) => exportarReportePorSede(Number(id), formato)}
  />
);

export default ReporteSedePage;
