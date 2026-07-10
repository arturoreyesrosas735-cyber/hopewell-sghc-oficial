import type { Receta } from "../../types/receta.types";

interface RecetaDetailProps {
  receta: Receta;
}

const RecetaDetail = ({ receta }: RecetaDetailProps) => (
  <section className="detail-grid">
    <article className="surface-panel">
      <div className="detail-actions">
        <h2>Datos de receta</h2>
        <div>
          <button type="button" className="secondary-button" onClick={() => window.print()}>Imprimir</button>
          <a className="pdf-button" href={`http://127.0.0.1:8000/api/v1/recetas/${receta.id_receta}/pdf`}>Descargar PDF</a>
        </div>
      </div>
      <dl className="definition-list">
        <div><dt>Paciente</dt><dd>{nombrePaciente(receta)}</dd></div>
        <div><dt>Tratamiento</dt><dd>{receta.tratamiento?.descripcion ?? "Receta directa"}</dd></div>
        <div><dt>Medicamento</dt><dd>{receta.tratamiento?.medicamento?.uk_nombre_medicamento ?? "No especificado"}</dd></div>
        <div><dt>Fecha</dt><dd>{new Date(receta.fecha_receta).toLocaleString("es-MX")}</dd></div>
        <div><dt>Estatus</dt><dd>{receta.estatus}</dd></div>
      </dl>
    </article>
    <article className="surface-panel">
      <h2>Prescripcion</h2>
      <dl className="definition-list compact">
        <div><dt>Dosis</dt><dd>{receta.dosis}</dd></div>
        <div><dt>Frecuencia</dt><dd>{receta.frecuencia}</dd></div>
        <div><dt>Duracion</dt><dd>{receta.duracion_receta}</dd></div>
      </dl>
      <h2>Observaciones</h2>
      <p>{receta.observaciones || "Sin observaciones registradas."}</p>
    </article>
  </section>
);

const nombrePaciente = (receta: Receta) => {
  const paciente = receta.paciente;
  if (!paciente) return "Paciente no especificado";
  return [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(" ");
};

export default RecetaDetail;
