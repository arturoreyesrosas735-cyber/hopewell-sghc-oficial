import { useEffect, useState } from "react";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import { getRecursoCatalogo } from "../../services/catalogoM6Service";

interface RecursoListPageProps {
  recurso: string;
  title: string;
}

const columnsByResource: Record<string, string[]> = {
  pacientes: ["id_paciente", "nombres", "apellido_paterno", "apellido_materno", "uk_correo_electronico", "estatus"],
  expedientes: ["id_expediente", "nombres", "apellido_paterno", "motivo", "fecha_apertura"],
  consultas: ["id_consulta_medica", "nombres", "apellido_paterno", "motivo_consulta", "horario"],
  diagnosticos: ["id_diagnostico", "nombre_diagnostico", "descripcion_diagnostico", "fecha_crecion"],
  padecimientos: ["id_padecimiento", "uk_nombre_padecimiento", "uk_codigo_cie", "vv_descripcion"],
};

const RecursoListPage = ({ recurso, title }: RecursoListPageProps) => {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const columns = columnsByResource[recurso] ?? [];

  useEffect(() => {
    setLoading(true);
    getRecursoCatalogo(recurso)
      .then((response) => setRows(response.data.data))
      .catch(() => setError("No fue posible cargar la informacion."))
      .finally(() => setLoading(false));
  }, [recurso]);

  return (
    <TratamientosLayout title={title}>
      <section className="primary-column wide">
        {loading ? <div className="loading-state">Cargando {title.toLowerCase()}...</div> : null}
        {error ? <div className="error-state">{error}</div> : null}
        {!loading && !error ? (
          <div className="table-card">
            <table>
              <thead>
                <tr>{columns.map((column) => <th key={column}>{label(column)}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={String(row[columns[0]]) || index}>
                    {columns.map((column) => <td key={column}>{format(row[column])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </TratamientosLayout>
  );
};

const label = (value: string) => value.replace(/^(uk_|vv_|fk_)/, "").replaceAll("_", " ").toUpperCase();
const format = (value: unknown) => value == null ? "Sin dato" : String(value);

export default RecursoListPage;
