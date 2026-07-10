import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarReportePorMedico,
  getReportePorMedico,
} from "../../services/reportesService";
import type { RangoFechas } from "../../types/reportes.types";

const ReporteMedicoPage = () => (
  <ReporteWorkspace
    titulo="Reporte por medico"
    current="Reporte por medico"
    kind="medico"
    idLabel="Medico"
    requiereId
    requiereFechas
    generar={({ id, fechas }) => getReportePorMedico(Number(id), fechas as RangoFechas)}
    exportar={({ id, fechas }, formato) =>
      exportarReportePorMedico(Number(id), fechas as RangoFechas, formato)
    }
  />
);

export default ReporteMedicoPage;
