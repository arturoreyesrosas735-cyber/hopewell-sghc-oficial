import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RecetaDetail from "../../components/recetas/RecetaDetail";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import { getApiErrorMessage } from "../../services/api";
import { getRecetaById } from "../../services/recetaService";
import type { Receta } from "../../types/receta.types";

const RecetaDetailPage = () => {
  const params = useParams();
  const recetaId = Number(params.id);
  const [receta, setReceta] = useState<Receta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReceta = async () => {
      if (!recetaId) {
        setError("Receta no encontrada");
        setLoading(false);
        return;
      }

      try {
        const response = await getRecetaById(recetaId);
        setReceta(response.data.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Receta no encontrada"));
      } finally {
        setLoading(false);
      }
    };

    void loadReceta();
  }, [recetaId]);

  return (
    <TratamientosLayout title="Detalle de receta">
      {loading ? <div className="loading-state">Cargando receta...</div> : null}
      {error ? <div className="error-state">{error}</div> : null}
      {receta ? <RecetaDetail receta={receta} /> : null}
    </TratamientosLayout>
  );
};

export default RecetaDetailPage;
