import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarHistorialConsultas,
  getHistorialConsultas,
} from "../../services/reportesService";

const HistorialConsultasPage = () => (
  <ReporteWorkspace
    titulo="Historial de Consultas"
    descripcion="Revisa las consultas medicas de un paciente con filtro opcional por fechas."
    idLabel="ID del paciente"
    requiereId
    fechasOpcionales
    generar={({ id, fechas }) => getHistorialConsultas(Number(id), fechas)}
    exportar={({ id, fechas }, formato) =>
      exportarHistorialConsultas(Number(id), formato, fechas)
    }
  />
);

export default HistorialConsultasPage;
