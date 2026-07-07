import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarReportePorPeriodo,
  getReportePorPeriodo,
} from "../../services/reportesService";
import type { RangoFechas } from "../../types/reportes.types";

const ReportePeriodoPage = () => (
  <ReporteWorkspace
    titulo="Reporte por Periodo"
    descripcion="Filtra la actividad clinica registrada entre dos fechas validas."
    requiereFechas
    generar={({ fechas }) => getReportePorPeriodo(fechas as RangoFechas)}
    exportar={({ fechas }, formato) =>
      exportarReportePorPeriodo(fechas as RangoFechas, formato)
    }
  />
);

export default ReportePeriodoPage;
