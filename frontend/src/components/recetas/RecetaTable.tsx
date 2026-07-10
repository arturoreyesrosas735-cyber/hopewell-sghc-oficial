import { Link } from "react-router-dom";
import type { Receta } from "../../types/receta.types";

interface RecetaTableProps {
  recetas: Receta[];
}

const RecetaTable = ({ recetas }: RecetaTableProps) => {
  if (recetas.length === 0) {
    return <div className="empty-state">No hay recetas registradas.</div>;
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Paciente</th>
            <th>Medicamento</th>
            <th>Dosis</th>
            <th>Frecuencia</th>
            <th>Duracion</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {recetas.map((receta) => (
            <tr key={receta.id_receta}>
              <td>{new Date(receta.fecha_receta).toLocaleDateString("es-MX")}</td>
              <td>{nombrePaciente(receta)}</td>
              <td>{receta.tratamiento?.medicamento?.uk_nombre_medicamento ?? "Sin medicamento"}</td>
              <td>{receta.dosis}</td>
              <td>{receta.frecuencia}</td>
              <td>{receta.duracion_receta}</td>
              <td><Link to={"/recetas/" + receta.id_receta}>Ver detalles</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const nombrePaciente = (receta: Receta) => {
  const paciente = receta.paciente;

  if (!paciente) return "Paciente no especificado";

  return [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno]
    .filter(Boolean)
    .join(" ");
};

export default RecetaTable;
