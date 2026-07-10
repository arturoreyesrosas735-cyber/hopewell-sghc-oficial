import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getPacientesCatalogo, type PacienteCatalogo } from "../../services/catalogoM6Service";
import { getApiFieldErrors, getApiErrorMessage } from "../../services/api";
import { crearRecetaDirecta } from "../../services/recetaService";
import type { RecetaFormData } from "../../types/receta.types";

const RecetaForm = () => {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState<PacienteCatalogo[]>([]);
  const [form, setForm] = useState<RecetaFormData>({
    fk_tratamiento_receta: 0,
    fk_paciente_receta: 0,
    medicamento_texto: "",
    dosis: "",
    frecuencia: "",
    duracion_receta: "",
    observaciones: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPacientesCatalogo()
      .then((response) => setPacientes(response.data.data))
      .catch(() => setMessage("No fue posible cargar pacientes."));
  }, []);

  const updateField = (field: keyof RecetaFormData, value: string) => {
    const nextValue = field.startsWith("fk_") ? Number(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const validate = () => {
    const errors: Record<string, string[]> = {};
    if (!form.fk_paciente_receta) errors.fk_paciente_receta = ["Debe seleccionar un paciente"];
    if (!form.medicamento_texto?.trim()) errors.medicamento_texto = ["El medicamento es obligatorio"];
    if (!form.dosis.trim()) errors.dosis = ["La dosis es obligatoria"];
    if (!form.frecuencia.trim()) errors.frecuencia = ["La frecuencia es obligatoria"];
    if (!form.duracion_receta.trim()) errors.duracion_receta = ["La duracion es obligatoria"];
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
      const response = await crearRecetaDirecta(form);
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
      <label className="span-2">
        Paciente
        <select value={form.fk_paciente_receta || ""} onChange={(event) => updateField("fk_paciente_receta", event.target.value)}>
          <option value="">Selecciona un paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id_paciente} value={paciente.id_paciente}>
              {[paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(" ")}
            </option>
          ))}
        </select>
        {errorFor("fk_paciente_receta") ? <span className="field-error">{errorFor("fk_paciente_receta")}</span> : null}
      </label>
      <label className="span-2">
        Medicamento
        <input value={form.medicamento_texto} onChange={(event) => updateField("medicamento_texto", event.target.value)} placeholder="Ej. Amoxicilina 500 mg" />
        {errorFor("medicamento_texto") ? <span className="field-error">{errorFor("medicamento_texto")}</span> : null}
      </label>
      <label>
        Dosis
        <input maxLength={100} value={form.dosis} onChange={(event) => updateField("dosis", event.target.value)} placeholder="Ej. 1 capsula" />
        {errorFor("dosis") ? <span className="field-error">{errorFor("dosis")}</span> : null}
      </label>
      <label>
        Frecuencia
        <input maxLength={100} value={form.frecuencia} onChange={(event) => updateField("frecuencia", event.target.value)} placeholder="Ej. Cada 8 horas" />
        {errorFor("frecuencia") ? <span className="field-error">{errorFor("frecuencia")}</span> : null}
      </label>
      <label className="span-2">
        Duracion
        <input maxLength={100} value={form.duracion_receta} onChange={(event) => updateField("duracion_receta", event.target.value)} placeholder="Ej. 7 dias" />
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
