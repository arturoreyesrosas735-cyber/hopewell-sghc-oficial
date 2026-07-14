import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdjuntarDocumentoForm from '../../components/expedientes/AdjuntarDocumentoForm';
import { AlertMessage } from '../../components/expedientes/common';
import { adjuntarDocumento } from '../../services/expedienteService';
import type { AdjuntarDocumentoFormData } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

export default function AdjuntarDocumentoPage() {
  const { id = '0' } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(payload: AdjuntarDocumentoFormData) {
    setLoading(true);
    setMessage('');

    try {
      const response = await adjuntarDocumento(Number(id), payload);
      if (response.success) {
        navigate(`/expedientes/${id}/documentos`, { state: { message: response.message } });
        return;
      }
      setMessage(response.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message ?? 'No fue posible adjuntar el documento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ExpedienteLayout crumb={`Expedientes > Expediente #${id} > Documentos > Adjuntar`}>
      <section className="exp-workspace">
        <div className="exp-panel exp-narrow-panel">
          <div className="exp-panel-header">
            <div>
              <p className="exp-kicker">CU003-04</p>
              <h2>Adjuntar Documento Clinico</h2>
            </div>
          </div>
          {message ? <AlertMessage tone="error">{message}</AlertMessage> : null}
          <AdjuntarDocumentoForm loading={loading} onSubmit={handleSubmit} />
        </div>
      </section>
    </ExpedienteLayout>
  );
}
