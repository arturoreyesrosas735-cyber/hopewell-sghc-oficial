import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AlertMessage, EmptyState, LoadingSpinner } from '../../components/expedientes/common';
import DocumentosList from '../../components/expedientes/DocumentosList';
import { getDocumentosExpediente } from '../../services/expedienteService';
import type { Documento } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

export default function DocumentosListPage() {
  const { id = '0' } = useParams();
  const location = useLocation();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDocumentosExpediente(Number(id))
      .then((response) => {
        if (response.success && response.data) setDocumentos(response.data);
        else setMessage(response.message);
      })
      .catch((error) => setMessage(error.response?.data?.message ?? 'No fue posible obtener documentos.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <ExpedienteLayout crumb={`Expedientes > Expediente #${id} > Documentos`}>
      <section className="exp-workspace">
        <div className="exp-panel">
          <div className="exp-panel-header">
            <div>
              <p className="exp-kicker">CU003-05</p>
              <h2>Documentos Adjuntos</h2>
            </div>
            <Link className="exp-button" to={`/expedientes/${id}/documentos/nuevo`}>Adjuntar Documento</Link>
          </div>
          {loading ? <LoadingSpinner /> : null}
          {(location.state as { message?: string } | null)?.message ? (
            <AlertMessage tone="success">{(location.state as { message: string }).message}</AlertMessage>
          ) : null}
          {message ? <AlertMessage tone="error">{message}</AlertMessage> : null}
          {!loading && !documentos.length ? <EmptyState>Este expediente no tiene documentos adjuntos aun.</EmptyState> : null}
          {documentos.length ? <DocumentosList documentos={documentos} /> : null}
        </div>
      </section>
    </ExpedienteLayout>
  );
}
