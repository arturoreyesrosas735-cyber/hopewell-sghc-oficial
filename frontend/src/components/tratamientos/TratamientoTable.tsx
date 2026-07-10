import { Link } from "react-router-dom";
import type { Tratamiento } from "../../types/tratamiento.types";

interface TratamientoTableProps {
  tratamientos: Tratamiento[];
}

const TratamientoTable = ({ tratamientos }: TratamientoTableProps) => {
  if (tratamientos.length === 0) {
    return <div className="empty-state">Este paciente no tiene tratamientos registrados.</div>;
  }

  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Inicio</th>
            <th>Termino</th>
            <th>Diagnostico</th>
            <th>Medicamento</th>
            <th>Estatus</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {tratamientos.map((tratamiento) => (
            <tr key={tratamiento.id_tratamiento}>
              <td>{nombrePaciente(tratamiento)}</td>
              <td>{tratamiento.inicio_tratamiento}</td>
              <td>{tratamiento.termino_tratamiento}</td>
              <td>{tratamiento.diagnostico?.nombre_diagnostico ?? "Sin diagnostico"}</td>
              <td>{tratamiento.medicamento?.uk_nombre_medicamento ?? "Sin medicamento"}</td>
              <td><span className="status-pill">{tratamiento.estatus}</span></td>
              <td><Link to={"/tratamientos/" + tratamiento.id_tratamiento}>Ver detalles</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const nombrePaciente = (tratamiento: Tratamiento) => {
  const paciente = tratamiento.paciente;

  if (!paciente) return "Paciente no especificado";

  return [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno]
    .filter(Boolean)
    .join(" ");
};

export default TratamientoTable;
