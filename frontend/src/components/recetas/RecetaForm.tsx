import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiFieldErrors, getApiErrorMessage } from "../../services/api";
import { crearReceta } from "../../services/recetaService";
import type { RecetaFormData } from "../../types/receta.types";

const RecetaForm = () => {
  const navigate = useNavigate();
  const params = useParams();
  const tratamientoIdFromRoute = Number(params.id ?? 0);
  const [form, setForm] = useState<RecetaFormData>({
    fk_tratamiento_receta: tratamientoIdFromRoute,
    fk_paciente_receta: 0,
    dosis: "",
    frecuencia: "",
    duracion_receta: "",
    observaciones: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof RecetaFormData, value: string) => {
    const nextValue = field.startsWith("fk_") ? Number(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const validate = () => {
    const errors: Record<string, string[]> = {};

    if (!form.fk_tratamiento_receta) errors.fk_tratamiento_receta = ["Debe seleccionar un tratamiento"];
    if (!form.fk_paciente_receta) errors.fk_paciente_receta = ["Debe seleccionar un paciente"];
    if (!form.dosis.trim() || form.dosis.length > 100) errors.dosis = ["La dosis es obligatoria"];
    if (!form.frecuencia.trim() || form.frecuencia.length > 100) errors.frecuencia = ["La frecuencia es obligatoria"];
    if (!form.duracion_receta.trim() || form.duracion_receta.length > 100) errors.duracion_receta = ["La duracion es obligatoria"];

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    setMessage("");

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const response = await crearReceta(form.fk_tratamiento_receta, form);
      setMessage("Receta generada correctamente");
      navigate("/recetas/" + response.data.data.id_receta);
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setMessage(getApiErrorMessage(error, "Error al generar la receta."));
    } finally {
      setLoading(false);
    }
  };

  const errorFor = (field: string) => fieldErrors[field]?.[0];

  return (
    <form className="surface-panel form-grid" onSubmit={handleSubmit}>
      {message ? <div className="notice span-2">{message}</div> : null}
      <label>
        Tratamiento
        <input type="number" value={form.fk_tratamiento_receta || ""} onChange={(event) => updateField("fk_tratamiento_receta", event.target.value)} />
        {errorFor("fk_tratamiento_receta") ? <span className="field-error">{errorFor("fk_tratamiento_receta")}</span> : null}
      </label>
      <label>
        Paciente
        <input type="number" value={form.fk_paciente_receta || ""} onChange={(event) => updateField("fk_paciente_receta", event.target.value)} />
        {errorFor("fk_paciente_receta") ? <span className="field-error">{errorFor("fk_paciente_receta")}</span> : null}
      </label>
      <label>
        Dosis
        <input maxLength={100} value={form.dosis} onChange={(event) => updateField("dosis", event.target.value)} />
        {errorFor("dosis") ? <span className="field-error">{errorFor("dosis")}</span> : null}
      </label>
      <label>
        Frecuencia
        <input maxLength={100} value={form.frecuencia} onChange={(event) => updateField("frecuencia", event.target.value)} />
        {errorFor("frecuencia") ? <span className="field-error">{errorFor("frecuencia")}</span> : null}
      </label>
      <label className="span-2">
        Duracion
        <input maxLength={100} value={form.duracion_receta} onChange={(event) => updateField("duracion_receta", event.target.value)} />
        {errorFor("duracion_receta") ? <span className="field-error">{errorFor("duracion_receta")}</span> : null}
      </label>
      <label className="span-2">
        Observaciones
        <textarea value={form.observaciones} onChange={(event) => updateField("observaciones", event.target.value)} />
      </label>
      <div className="form-actions span-2">
        <button className="secondary-button" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        <button type="submit" disabled={loading}>{loading ? "Generando..." : "Guardar receta"}</button>
      </div>
    </form>
  );
};

export default RecetaForm;
