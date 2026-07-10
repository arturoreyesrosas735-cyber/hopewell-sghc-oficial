import type { Tratamiento } from "../../types/tratamiento.types";

interface TratamientoDetailProps {
  tratamiento: Tratamiento;
}

const TratamientoDetail = ({ tratamiento }: TratamientoDetailProps) => (
  <section className="detail-grid">
    <article className="surface-panel">
      <div className="detail-actions">
        <h2>Datos del tratamiento</h2>
        <div>
          <button type="button" className="secondary-button" onClick={() => window.print()}>Imprimir</button>
          <a className="pdf-button" href={`http://127.0.0.1:8000/api/v1/tratamientos/${tratamiento.id_tratamiento}/pdf`}>Descargar PDF</a>
        </div>
      </div>
      <dl className="definition-list">
        <div><dt>Paciente</dt><dd>{nombrePaciente(tratamiento)}</dd></div>
        <div><dt>Diagnostico</dt><dd>{tratamiento.diagnostico?.nombre_diagnostico ?? "No especificado"}</dd></div>
        <div><dt>Padecimiento</dt><dd>{tratamiento.padecimiento?.uk_nombre_padecimiento ?? "No especificado"}</dd></div>
        <div><dt>Medicamento principal</dt><dd>{tratamiento.medicamento?.uk_nombre_medicamento ?? "No especificado"}</dd></div>
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

const nombrePaciente = (tratamiento: Tratamiento) => {
  const paciente = tratamiento.paciente;
  if (!paciente) return "Paciente no especificado";
  return [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(" ");
};

export default TratamientoDetail;
