import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPacientesCatalogo,
  type PacienteCatalogo,
} from "../../services/catalogoM6Service";
import { getApiFieldErrors, getApiErrorMessage } from "../../services/api";
import { crearTratamiento } from "../../services/tratamientoService";
import type { TratamientoFormData } from "../../types/tratamiento.types";

const initialForm: TratamientoFormData = {
  fk_paciente_tratamiento: 0,
  fk_diagnostico_tratamiento: 0,
  fk_padecimiento_tratamiento: 0,
  fk_medicamento_tratamiento: 0,
  diagnostico_texto: "",
  padecimiento_texto: "",
  medicamento_texto: "",
  descripcion: "",
  inicio_tratamiento: "",
  termino_tratamiento: "",
  indicaciones: "",
};

const TratamientoForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [pacientes, setPacientes] = useState<PacienteCatalogo[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const response = await getPacientesCatalogo();
        setPacientes(response.data.data);
      } catch {
        setMessage("No fue posible cargar la lista de pacientes.");
      } finally {
        setCatalogLoading(false);
      }
    };

    void cargarPacientes();
  }, []);

  const updateField = (field: keyof TratamientoFormData, value: string) => {
    const nextValue = field.startsWith("fk_") ? Number(value) : value;
    setForm((current) => ({ ...current, [field]: nextValue }));
  };

  const validate = () => {
    const errors: Record<string, string[]> = {};

    if (!form.fk_paciente_tratamiento) errors.fk_paciente_tratamiento = ["Debe seleccionar un paciente"];
    if (!form.diagnostico_texto.trim()) errors.diagnostico_texto = ["El diagnostico es obligatorio"];
    if (!form.padecimiento_texto.trim()) errors.padecimiento_texto = ["El padecimiento es obligatorio"];
    if (!form.medicamento_texto.trim()) errors.medicamento_texto = ["El medicamento es obligatorio"];
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
      const response = await crearTratamiento(0, form);
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
      {catalogLoading ? <div className="loading-state span-2">Cargando pacientes...</div> : null}

      <label className="span-2">
        Paciente
        <select value={form.fk_paciente_tratamiento || ""} onChange={(event) => updateField("fk_paciente_tratamiento", event.target.value)}>
          <option value="">Selecciona un paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id_paciente} value={paciente.id_paciente}>
              {nombrePaciente(paciente)}
            </option>
          ))}
        </select>
        {errorFor("fk_paciente_tratamiento") ? <span className="field-error">{errorFor("fk_paciente_tratamiento")}</span> : null}
      </label>

      <label>
        Diagnostico
        <input value={form.diagnostico_texto} onChange={(event) => updateField("diagnostico_texto", event.target.value)} placeholder="Ej. Bronquitis aguda" />
        {errorFor("diagnostico_texto") ? <span className="field-error">{errorFor("diagnostico_texto")}</span> : null}
      </label>

      <label>
        Padecimiento
        <input value={form.padecimiento_texto} onChange={(event) => updateField("padecimiento_texto", event.target.value)} placeholder="Ej. Tos persistente" />
        {errorFor("padecimiento_texto") ? <span className="field-error">{errorFor("padecimiento_texto")}</span> : null}
      </label>

      <label className="span-2">
        Medicamento
        <input value={form.medicamento_texto} onChange={(event) => updateField("medicamento_texto", event.target.value)} placeholder="Ej. Ibuprofeno 400 mg" />
        {errorFor("medicamento_texto") ? <span className="field-error">{errorFor("medicamento_texto")}</span> : null}
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
        <button type="submit" disabled={loading || catalogLoading}>{loading ? "Guardando..." : "Guardar tratamiento"}</button>
      </div>
    </form>
  );
};

const nombrePaciente = (paciente: PacienteCatalogo) =>
  [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno]
    .filter(Boolean)
    .join(" ");

export default TratamientoForm;
