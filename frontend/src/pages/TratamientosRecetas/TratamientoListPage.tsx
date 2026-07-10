import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PacienteBuscador from "../../components/tratamientos/PacienteBuscador";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import TratamientoTable from "../../components/tratamientos/TratamientoTable";
import { getApiErrorMessage } from "../../services/api";
import { getTratamientosPorPaciente } from "../../services/tratamientoService";
import type { Tratamiento } from "../../types/tratamiento.types";

const TratamientoListPage = () => {
  const params = useParams();
  const routePacienteId = Number(params.id ?? 0);
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [pacienteId, setPacienteId] = useState<number | null>(routePacienteId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pacienteNombre = nombrePaciente(tratamientos[0], pacienteId);

  const buscarTratamientos = async (id: number) => {
    setPacienteId(id);
    setError("");
    setLoading(true);

    try {
      const response = await getTratamientosPorPaciente(id);
      setTratamientos(response.data.data);
    } catch (requestError) {
      setTratamientos([]);
      setError(getApiErrorMessage(requestError, "Paciente no encontrado."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routePacienteId) {
      void buscarTratamientos(routePacienteId);
    }
  }, [routePacienteId]);

  return (
    <TratamientosLayout title="Control medico">
      <div className="module-grid">
        <section className="primary-column">
          <PacienteBuscador onBuscar={buscarTratamientos} />

          <article className="patient-card">
            <div className="patient-avatar" aria-hidden="true">+</div>
            <div>
              <h2>{pacienteNombre}</h2>
              <p>Consulta tratamientos activos, genera recetas y revisa indicaciones registradas.</p>
            </div>
          </article>

          <div className="action-panel">
            <h2>Recetas y acciones</h2>
            <div className="action-grid">
              <Link to="/tratamientos/nuevo" className="action-card green">
                <strong>+</strong>
                <span>Nuevo tratamiento</span>
              </Link>
              <Link
                to="/recetas/nueva"
                className="action-card blue"
              >
                <strong>Rx</strong>
                <span>Nueva receta</span>
              </Link>
              <Link
                to={pacienteId ? "/pacientes/" + pacienteId + "/tratamientos" : "/tratamientos-recetas"}
                className="action-card violet"
              >
                <strong>#</strong>
                <span>Tratamientos del paciente</span>
              </Link>
            </div>
          </div>

          {loading ? <div className="loading-state">Cargando tratamientos...</div> : null}
          {error ? <div className="error-state">{error}</div> : null}
          {pacienteId && !loading && !error ? <TratamientoTable tratamientos={tratamientos} /> : null}
        </section>

        <aside className="side-column">
          <section className="alert-panel">
            <h2>Alertas de seguridad</h2>
            <p>Alergias, interacciones y notas clinicas relevantes.</p>
            <span />
            <span />
            <span />
          </section>
          <section className="surface-panel">
            <h2>Registro de recetas</h2>
            <p className="muted-text">Selecciona un paciente para consultar el historial de recetas.</p>
          </section>
        </aside>
      </div>
    </TratamientosLayout>
  );
};

const nombrePaciente = (tratamiento: Tratamiento | undefined, pacienteId: number | null) => {
  if (!pacienteId) return "Buscar paciente";

  const paciente = tratamiento?.paciente;

  if (!paciente) return "Paciente #" + pacienteId;

  return [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno]
    .filter(Boolean)
    .join(" ");
};

export default TratamientoListPage;
