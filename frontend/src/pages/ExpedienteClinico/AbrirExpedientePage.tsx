import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AbrirExpedienteForm from '../../components/expedientes/AbrirExpedienteForm';
import { AlertMessage, LoadingSpinner } from '../../components/expedientes/common';
import { abrirExpediente, buscarPacientes } from '../../services/expedienteService';
import type { AbrirExpedienteFormData, PacienteResumen } from '../../types/expediente.types';
import ExpedienteLayout from './ExpedienteLayout';

export default function AbrirExpedientePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [pacientes, setPacientes] = useState<PacienteResumen[]>([]);
  const [selectedId, setSelectedId] = useState(Number(params.get('paciente')) || 0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const selectedPaciente = pacientes.find((paciente) => paciente.id_paciente === selectedId) ?? null;

  useEffect(() => {
    let mounted = true;

    buscarPacientes(search)
      .then((response) => {
        if (mounted && response.success && response.data) {
          setPacientes(response.data);
          if (!selectedId && response.data.length > 0) {
            setSelectedId(response.data[0].id_paciente);
          }
        }
      })
      .catch(() => {
        if (mounted) setMessage('No fue posible cargar pacientes desde el backend.');
      });

    return () => {
      mounted = false;
    };
  }, [search, selectedId]);

  async function handleSubmit(payload: AbrirExpedienteFormData) {
    setLoading(true);
    setMessage('');

    try {
      const response = await abrirExpediente(payload);
      if (response.success && response.data) {
        navigate(`/expedientes/${response.data.id_expediente}`, { state: { message: response.message } });
        return;
      }
      setMessage(response.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message ?? 'No fue posible abrir el expediente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ExpedienteLayout crumb="Pacientes > Abrir expediente">
      <section className="exp-workspace">
        <div className="exp-panel">
          <div className="exp-panel-header">
            <div>
              <p className="exp-kicker">CU003-01</p>
              <h2>Abrir Expediente Clinico</h2>
            </div>
          </div>
          <div className="exp-two-column">
            <div>
              <label className="exp-search-label">
                Buscar paciente
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, ID o CURP" />
              </label>
              <div className="exp-patient-list">
                {pacientes.map((paciente) => (
                  <button
                    className={selectedId === paciente.id_paciente ? 'is-selected' : ''}
                    key={paciente.id_paciente}
                    onClick={() => setSelectedId(paciente.id_paciente)}
                    type="button"
                  >
                    <strong>{paciente.nombres} {paciente.apellido_paterno}</strong>
                    <span>{paciente.uk_curp ?? `ID ${paciente.id_paciente}`}</span>
                  </button>
                ))}
                {!pacientes.length ? <LoadingSpinner label="Sin pacientes activos para mostrar." /> : null}
              </div>
            </div>
            <div>
              {message ? <AlertMessage tone="error">{message}</AlertMessage> : null}
              <AbrirExpedienteForm paciente={selectedPaciente} loading={loading} onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </section>
    </ExpedienteLayout>
  );
}
