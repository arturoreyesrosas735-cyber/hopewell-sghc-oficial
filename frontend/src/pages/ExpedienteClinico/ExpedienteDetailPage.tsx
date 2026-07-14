import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertMessage, LoadingSpinner } from '../../components/expedientes/common';
import ExpedienteCard from '../../components/expedientes/ExpedienteCard';
import { getExpedienteById } from '../../services/expedienteService';
import type { ExpedienteClinico } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

export default function ExpedienteDetailPage() {
  const { id = '0' } = useParams();
  const location = useLocation();
  const idExpediente = Number(id);
  const [expediente, setExpediente] = useState<ExpedienteClinico | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getExpedienteById(idExpediente)
      .then((response) => {
        if (response.success) setExpediente(response.data);
        else setMessage(response.message);
      })
      .catch((error) => setMessage(error.response?.data?.message ?? 'No fue posible obtener el expediente.'))
      .finally(() => setLoading(false));
  }, [idExpediente]);

  return (
    <ExpedienteLayout crumb={`Expedientes > Expediente #${id}`}>
      <section className="exp-workspace">
        {loading ? <LoadingSpinner /> : null}
        {(location.state as { message?: string } | null)?.message ? (
          <AlertMessage tone="success">{(location.state as { message: string }).message}</AlertMessage>
        ) : null}
        {message ? <AlertMessage tone="error">{message}</AlertMessage> : null}
        {expediente ? (
          <>
            <ExpedienteCard expediente={expediente} />
            <div className="exp-action-row">
              <Link className="exp-button exp-button-secondary" to={`/expedientes/${id}/historial`}>Historial Clinico</Link>
              <Link className="exp-button exp-button-secondary" to={`/expedientes/${id}/documentos`}>Documentos Adjuntos</Link>
              <Link className="exp-button" to={`/expedientes/${id}/documentos/nuevo`}>Adjuntar Documento</Link>
            </div>
          </>
        ) : null}
      </section>
    </ExpedienteLayout>
  );
}
