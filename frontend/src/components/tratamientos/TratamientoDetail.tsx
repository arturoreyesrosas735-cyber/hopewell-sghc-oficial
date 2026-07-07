import type { Tratamiento } from "../../types/tratamiento.types";

interface TratamientoDetailProps {
  tratamiento: Tratamiento;
}

const TratamientoDetail = ({ tratamiento }: TratamientoDetailProps) => (
  <section className="detail-grid">
    <article className="surface-panel">
      <h2>Datos del tratamiento</h2>
      <dl className="definition-list">
        <div><dt>Paciente</dt><dd>#{tratamiento.fk_paciente_tratamiento}</dd></div>
        <div><dt>Diagnostico</dt><dd>#{tratamiento.fk_diagnostico_tratamiento}</dd></div>
        <div><dt>Padecimiento</dt><dd>#{tratamiento.fk_padecimiento_tratamiento}</dd></div>
        <div><dt>Medicamento principal</dt><dd>#{tratamiento.fk_medicamento_tratamiento}</dd></div>
        <div><dt>Inicio</dt><dd>{tratamiento.inicio_tratamiento}</dd></div>
        <div><dt>Termino</dt><dd>{tratamiento.termino_tratamiento}</dd></div>
        <div><dt>Estatus</dt><dd>{tratamiento.estatus}</dd></div>
      </dl>
    </article>
    <article className="surface-panel">
      <h2>Indicaciones</h2>
      <p>{tratamiento.indicaciones}</p>
      <h2>Descripcion</h2>
      <p>{tratamiento.descripcion || "Sin descripcion registrada."}</p>
    </article>
  </section>
);

export default TratamientoDetail;
