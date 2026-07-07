import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarResumenClinico,
  getResumenClinico,
} from "../../services/reportesService";

const ResumenClinicoPage = () => (
  <ReporteWorkspace
    titulo="Resumen Clinico"
    descripcion="Consulta diagnosticos y tratamientos consolidados por paciente activo."
    idLabel="ID del paciente"
    requiereId
    generar={({ id }) => getResumenClinico(Number(id))}
    exportar={({ id }, formato) => exportarResumenClinico(Number(id), formato)}
  />
);

export default ResumenClinicoPage;
