import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertMessage, EmptyState, LoadingSpinner } from '../../components/expedientes/common';
import HistorialClinicoList from '../../components/expedientes/HistorialClinicoList';
import { getHistorialClinico } from '../../services/expedienteService';
import type { EventoHistorial } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

export default function HistorialClinicoPage() {
  const { id = '0' } = useParams();
  const [eventos, setEventos] = useState<EventoHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getHistorialClinico(Number(id))
      .then((response) => {
        if (response.success && response.data) setEventos(response.data.historial);
        else setMessage(response.message);
      })
      .catch((error) => setMessage(error.response?.data?.message ?? 'No fue posible obtener el historial.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ExpedienteLayout crumb={`Expedientes > Expediente #${id} > Historial`}>
      <section className="exp-workspace">
        <div className="exp-panel">
          <div className="exp-panel-header">
            <div>
              <p className="exp-kicker">CU003-03</p>
              <h2>Historial Clinico</h2>
            </div>
            <Link className="exp-button exp-button-secondary" to={`/expedientes/${id}`}>Volver</Link>
          </div>
          {loading ? <LoadingSpinner /> : null}
          {message ? <AlertMessage tone="error">{message}</AlertMessage> : null}
          {!loading && !eventos.length ? <EmptyState>El historial clinico de este paciente no registra eventos aun.</EmptyState> : null}
          {eventos.length ? <HistorialClinicoList eventos={eventos} /> : null}
        </div>
      </section>
    </ExpedienteLayout>
  );
}
