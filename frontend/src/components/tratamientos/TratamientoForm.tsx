import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getApiFieldErrors, getApiErrorMessage } from "../../services/api";
import { crearTratamiento } from "../../services/tratamientoService";
import type { TratamientoFormData } from "../../types/tratamiento.types";

const initialForm: TratamientoFormData = {
  fk_paciente_tratamiento: 0,
  fk_diagnostico_tratamiento: 0,
  fk_padecimiento_tratamiento: 0,
  fk_medicamento_tratamiento: 0,
  descripcion: "",
  inicio_tratamiento: "",
  termino_tratamiento: "",
  indicaciones: "",
};

const TratamientoForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof TratamientoFormData, value: string) => {
    const nextValue = field.startsWith("fk_") ? Number(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const validate = () => {
    const errors: Record<string, string[]> = {};

    if (!form.fk_paciente_tratamiento) errors.fk_paciente_tratamiento = ["Debe seleccionar un paciente"];
    if (!form.fk_diagnostico_tratamiento) errors.fk_diagnostico_tratamiento = ["Debe seleccionar un diagnostico"];
    if (!form.fk_padecimiento_tratamiento) errors.fk_padecimiento_tratamiento = ["Debe seleccionar un padecimiento"];
    if (!form.fk_medicamento_tratamiento) errors.fk_medicamento_tratamiento = ["El medicamento es obligatorio"];
    if (!form.indicaciones.trim()) errors.indicaciones = ["Las indicaciones son obligatorias"];
    if (!form.inicio_tratamiento) errors.inicio_tratamiento = ["La fecha de inicio es obligatoria"];
    if (!form.termino_tratamiento || form.termino_tratamiento <= form.inicio_tratamiento) {
      errors.termino_tratamiento = ["La fecha de termino debe ser posterior a la fecha de inicio"];
    }

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
      const response = await crearTratamiento(form.fk_diagnostico_tratamiento, form);
      setMessage("Tratamiento registrado correctamente");
      navigate("/tratamientos/" + response.data.data.id_tratamiento);
    } catch (error) {
      setFieldErrors(getApiFieldErrors(error));
      setMessage(getApiErrorMessage(error, "Error al guardar el tratamiento."));
    } finally {
      setLoading(false);
    }
  };

  const errorFor = (field: string) => fieldErrors[field]?.[0];

  return (
    <form className="surface-panel form-grid" onSubmit={handleSubmit}>
      {message ? <div className="notice span-2">{message}</div> : null}
      <label>
        Paciente
        <input type="number" value={form.fk_paciente_tratamiento || ""} onChange={(event) => updateField("fk_paciente_tratamiento", event.target.value)} />
        {errorFor("fk_paciente_tratamiento") ? <span className="field-error">{errorFor("fk_paciente_tratamiento")}</span> : null}
      </label>
      <label>
        Diagnostico
        <input type="number" value={form.fk_diagnostico_tratamiento || ""} onChange={(event) => updateField("fk_diagnostico_tratamiento", event.target.value)} />
        {errorFor("fk_diagnostico_tratamiento") ? <span className="field-error">{errorFor("fk_diagnostico_tratamiento")}</span> : null}
      </label>
      <label>
        Padecimiento
        <input type="number" value={form.fk_padecimiento_tratamiento || ""} onChange={(event) => updateField("fk_padecimiento_tratamiento", event.target.value)} />
        {errorFor("fk_padecimiento_tratamiento") ? <span className="field-error">{errorFor("fk_padecimiento_tratamiento")}</span> : null}
      </label>
      <label>
        Medicamento
        <input type="number" value={form.fk_medicamento_tratamiento || ""} onChange={(event) => updateField("fk_medicamento_tratamiento", event.target.value)} />
        {errorFor("fk_medicamento_tratamiento") ? <span className="field-error">{errorFor("fk_medicamento_tratamiento")}</span> : null}
      </label>
      <label>
        Inicio
        <input type="date" value={form.inicio_tratamiento} onChange={(event) => updateField("inicio_tratamiento", event.target.value)} />
        {errorFor("inicio_tratamiento") ? <span className="field-error">{errorFor("inicio_tratamiento")}</span> : null}
      </label>
      <label>
        Termino
        <input type="date" value={form.termino_tratamiento} onChange={(event) => updateField("termino_tratamiento", event.target.value)} />
        {errorFor("termino_tratamiento") ? <span className="field-error">{errorFor("termino_tratamiento")}</span> : null}
      </label>
      <label className="span-2">
        Descripcion
        <textarea maxLength={255} value={form.descripcion} onChange={(event) => updateField("descripcion", event.target.value)} />
      </label>
      <label className="span-2">
        Indicaciones
        <textarea maxLength={255} value={form.indicaciones} onChange={(event) => updateField("indicaciones", event.target.value)} />
        {errorFor("indicaciones") ? <span className="field-error">{errorFor("indicaciones")}</span> : null}
      </label>
      <div className="form-actions span-2">
        <button className="secondary-button" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar tratamiento"}</button>
      </div>
    </form>
  );
};

export default TratamientoForm;
