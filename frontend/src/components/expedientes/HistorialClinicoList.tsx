import type { EventoHistorial } from '../../types/expediente.types';

const labels = {
  consulta: 'Consulta medica',
  diagnostico: 'Diagnostico',
  tratamiento: 'Tratamiento',
  documento: 'Documento',
};

export default function HistorialClinicoList({ eventos }: { eventos: EventoHistorial[] }) {
  return (
    <div className="exp-timeline">
      {eventos.map((evento) => (
        <article className="exp-timeline-item" key={`${evento.tipo}-${evento.id}-${evento.fecha}`}>
          <span className={`exp-timeline-dot exp-${evento.tipo}`} />
          <div>
            <h3>{evento.titulo ?? labels[evento.tipo]}</h3>
            <p>{evento.descripcion ?? labels[evento.tipo]}</p>
          </div>
          <time>{new Date(evento.fecha).toLocaleString()}</time>
        </article>
      ))}
    </div>
  );
}
