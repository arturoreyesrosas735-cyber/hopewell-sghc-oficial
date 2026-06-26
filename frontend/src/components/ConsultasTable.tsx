import type { ConsultaGestion } from '../types/consultas'

interface ConsultasTableProps {
  consultas: ConsultaGestion[]
  compact?: boolean
  canEdit?: boolean
  onOpenSigns?: (consulta: ConsultaGestion) => void
  onView?: (consulta: ConsultaGestion) => void
  onEdit?: (consulta: ConsultaGestion) => void
}

export function ConsultasTable({ consultas, compact = false, canEdit = true, onOpenSigns, onView, onEdit }: ConsultasTableProps) {
  return (
    <section className="history-card">
      <h2>Historial de Consultas</h2>
      <div className="consult-table">
        <div className="table-row table-head">
          <span>FECHA</span>
          <span>PACIENTE</span>
          <span>MÉDICO TRATANTE</span>
          <span>MOTIVO</span>
          <span>ESTADO</span>
          <span>CONSULTA MÉDICA</span>
        </div>
        {consultas.map((consulta) => (
          <div className="table-row" key={consulta.id}>
            <span>
              <strong>{consulta.fecha}</strong>
              <small>{consulta.hora}</small>
            </span>
            <span className="person-cell">
              <i className="person-avatar" />
              <span>
                <strong>{consulta.paciente}</strong>
                <small>ID: {consulta.pacienteId}</small>
              </span>
            </span>
            <span className="person-cell">
              <i className="doctor-avatar" />
              <span>
                <strong>{consulta.medico}</strong>
                <small>{consulta.especialidad}</small>
              </span>
            </span>
            <span>{consulta.motivo}</span>
            <span>
              <em className={`status ${consulta.estado.toLowerCase()}`}>{consulta.estado}</em>
            </span>
            <span className="row-actions">
              <button type="button" onClick={() => onView?.(consulta)} title="Ver consulta médica" aria-label="Ver consulta médica">
                ○
              </button>
              {canEdit ? (
                <button type="button" onClick={() => onEdit?.(consulta)} title="Editar consulta médica" aria-label="Editar consulta médica">
                  ✎
                </button>
              ) : null}
              <button type="button" onClick={() => onOpenSigns?.(consulta)} title="Ver signos vitales" aria-label="Ver signos vitales">
                ▤
              </button>
              <button type="button" aria-label="Más acciones">⋮</button>
            </span>
          </div>
        ))}
      </div>
      <div className="pagination-bar">
        <span>{compact ? `Mostrando 1 a ${consultas.length} de ${consultas.length} resultados` : `Mostrando 1 a ${Math.min(consultas.length, 5)} de ${consultas.length} consultas`}</span>
        <div>
          <button type="button">Anterior</button>
          <button className="selected" type="button">1</button>
          {!compact ? <button type="button">2</button> : null}
          {!compact ? <button type="button">3</button> : null}
          {!compact ? <button type="button">4</button> : null}
          {!compact ? <button type="button">5</button> : null}
          <button type="button">Siguiente</button>
        </div>
      </div>
    </section>
  )
}