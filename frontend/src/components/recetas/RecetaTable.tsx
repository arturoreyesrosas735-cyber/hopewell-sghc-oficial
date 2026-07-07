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

export default RecetaTable;
