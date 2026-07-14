import type { ExpedienteClinico } from '../../types/expediente.types';

export default function ExpedienteCard({ expediente }: { expediente: ExpedienteClinico }) {
  const paciente = expediente.paciente;
  const nombrePaciente = paciente
    ? `${paciente.nombres} ${paciente.apellido_paterno} ${paciente.apellido_materno ?? ''}`.trim()
    : `Paciente #${expediente.fk_paciente_expediente_clinico}`;

  return (
    <section className="exp-panel">
      <div className="exp-panel-header">
        <div>
          <p className="exp-kicker">Solo lectura</p>
          <h2>Expediente #{expediente.id_expediente}</h2>
        </div>
        <span className="exp-status">Activo</span>
      </div>
      <div className="exp-detail-grid">
        <div>
          <span>Paciente</span>
          <strong>{nombrePaciente}</strong>
        </div>
        <div>
          <span>Fecha de apertura</span>
          <strong>{new Date(expediente.fecha_apertura).toLocaleString()}</strong>
        </div>
        <div>
          <span>CURP</span>
          <strong>{paciente?.uk_curp ?? 'Sin registro'}</strong>
        </div>
        <div>
          <span>Contacto</span>
          <strong>{paciente?.uk_telefono ?? paciente?.uk_correo_electronico ?? 'Sin registro'}</strong>
        </div>
        <div className="exp-detail-wide">
          <span>Motivo</span>
          <p>{expediente.motivo || 'Sin motivo registrado.'}</p>
        </div>
        <div className="exp-detail-wide">
          <span>Antecedentes familiares</span>
          <p>{expediente.antecedente_familiar || 'Sin antecedentes registrados.'}</p>
        </div>
        <div className="exp-detail-wide">
          <span>Notas</span>
          <p>{expediente.notas || 'Sin notas adicionales.'}</p>
        </div>
      </div>
    </section>
  );
}
