import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TratamientoDetail from "../../components/tratamientos/TratamientoDetail";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import { getApiErrorMessage } from "../../services/api";
import { getTratamientoById } from "../../services/tratamientoService";
import type { Tratamiento } from "../../types/tratamiento.types";

const TratamientoDetailPage = () => {
  const params = useParams();
  const tratamientoId = Number(params.id);
  const [tratamiento, setTratamiento] = useState<Tratamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTratamiento = async () => {
      if (!tratamientoId) {
        setError("Tratamiento no encontrado");
        setLoading(false);
        return;
      }

      try {
        const response = await getTratamientoById(tratamientoId);
        setTratamiento(response.data.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Tratamiento no encontrado"));
      } finally {
        setLoading(false);
      }
    };

    void loadTratamiento();
  }, [tratamientoId]);

  return (
    <TratamientosLayout title="Detalle del tratamiento">
      {loading ? <div className="loading-state">Cargando tratamiento...</div> : null}
      {error ? <div className="error-state">{error}</div> : null}
      {tratamiento ? <TratamientoDetail tratamiento={tratamiento} /> : null}
      {tratamiento ? <Link className="floating-action" to={"/tratamientos/" + tratamiento.id_tratamiento + "/recetas/nueva"}>Generar receta</Link> : null}
    </TratamientosLayout>
  );
};

export default TratamientoDetailPage;
