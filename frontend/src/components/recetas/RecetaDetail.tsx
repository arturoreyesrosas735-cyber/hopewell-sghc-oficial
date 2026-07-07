import type { Receta } from "../../types/receta.types";

interface RecetaDetailProps {
  receta: Receta;
}

const RecetaDetail = ({ receta }: RecetaDetailProps) => (
  <section className="detail-grid">
    <article className="surface-panel">
      <h2>Datos de receta</h2>
      <dl className="definition-list">
        <div><dt>Paciente</dt><dd>#{receta.fk_paciente_receta}</dd></div>
        <div><dt>Tratamiento</dt><dd>#{receta.fk_tratamiento_receta}</dd></div>
        <div><dt>Doctor</dt><dd>#{receta.fk_doctor_receta}</dd></div>
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

export default RecetaDetail;
