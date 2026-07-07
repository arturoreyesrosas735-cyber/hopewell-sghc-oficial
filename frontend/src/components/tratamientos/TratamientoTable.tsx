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
            <th>Inicio</th>
            <th>Termino</th>
            <th>Medicamento</th>
            <th>Estatus</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {tratamientos.map((tratamiento) => (
            <tr key={tratamiento.id_tratamiento}>
              <td>{tratamiento.inicio_tratamiento}</td>
              <td>{tratamiento.termino_tratamiento}</td>
              <td>#{tratamiento.fk_medicamento_tratamiento}</td>
              <td><span className="status-pill">{tratamiento.estatus}</span></td>
              <td><Link to={"/tratamientos/" + tratamiento.id_tratamiento}>Ver detalles</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TratamientoTable;
