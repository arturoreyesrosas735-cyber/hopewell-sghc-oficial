import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarResumenClinico,
  getResumenClinico,
} from "../../services/reportesService";

const ResumenClinicoPage = () => (
  <ReporteWorkspace
    titulo="Generar reporte clinico"
    current="Generar reporte clinico"
    kind="resumen"
    idLabel="Paciente"
    requiereId
    generar={({ id }) => getResumenClinico(Number(id))}
    exportar={({ id }, formato) => exportarResumenClinico(Number(id), formato)}
  />
);

export default ResumenClinicoPage;
