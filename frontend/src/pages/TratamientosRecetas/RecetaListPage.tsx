import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecetaTable from "../../components/recetas/RecetaTable";
import PacienteBuscador from "../../components/tratamientos/PacienteBuscador";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import { getApiErrorMessage } from "../../services/api";
import { getRecetasPorPaciente } from "../../services/recetaService";
import type { Receta } from "../../types/receta.types";

const RecetaListPage = () => {
  const params = useParams();
  const routePacienteId = Number(params.id ?? 0);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [pacienteId, setPacienteId] = useState<number | null>(routePacienteId || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buscarRecetas = async (id: number) => {
    setPacienteId(id);
    setError("");
    setLoading(true);

    try {
      const response = await getRecetasPorPaciente(id);
      setRecetas(response.data.data);
    } catch (requestError) {
      setRecetas([]);
      setError(getApiErrorMessage(requestError, "Paciente no encontrado."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routePacienteId) void buscarRecetas(routePacienteId);
  }, [routePacienteId]);

  return (
    <TratamientosLayout title="Consultar recetas">
      <section className="primary-column wide">
        <PacienteBuscador label="Buscar recetas por paciente" onBuscar={buscarRecetas} />
        {pacienteId ? <h2>Recetas del paciente #{pacienteId}</h2> : null}
        {loading ? <div className="loading-state">Cargando recetas...</div> : null}
        {error ? <div className="error-state">{error}</div> : null}
        {pacienteId && !loading && !error ? <RecetaTable recetas={recetas} /> : null}
      </section>
    </TratamientosLayout>
  );
};

export default RecetaListPage;
