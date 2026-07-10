import ReporteWorkspace from "../../components/reportes/ReporteWorkspace";
import {
  exportarHistorialConsultas,
  getHistorialConsultas,
} from "../../services/reportesService";

const HistorialConsultasPage = () => (
  <ReporteWorkspace
    titulo="Historial de consulta"
    current="Historial de consulta"
    kind="historial"
    idLabel="Paciente"
    requiereId
    fechasOpcionales
    generar={({ id, fechas }) => getHistorialConsultas(Number(id), fechas)}
    exportar={({ id, fechas }, formato) =>
      exportarHistorialConsultas(Number(id), formato, fechas)
    }
  />
);

export default HistorialConsultasPage;
