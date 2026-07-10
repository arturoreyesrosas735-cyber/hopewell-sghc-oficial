import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getPacientesCatalogo, type PacienteCatalogo } from "../../services/catalogoM6Service";

interface PacienteBuscadorProps {
  label?: string;
  onBuscar: (pacienteId: number) => void;
}

const PacienteBuscador = ({ label = "Buscar paciente", onBuscar }: PacienteBuscadorProps) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [pacientes, setPacientes] = useState<PacienteCatalogo[]>([]);

  useEffect(() => {
    getPacientesCatalogo()
      .then((response) => setPacientes(response.data.data))
      .catch(() => setPacientes([]));
  }, []);

  const opciones = useMemo(
    () =>
      pacientes.map((paciente) => ({
        id: paciente.id_paciente,
        label: nombrePaciente(paciente),
      })),
    [pacientes],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    const pacienteId = Number.parseInt(value, 10);
    const pacientePorNombre = opciones.find((opcion) => opcion.label.toLowerCase() === value.toLowerCase());

    if (!pacienteId && !pacientePorNombre) {
      setError("Paciente no encontrado.");
      return;
    }

    setError("");
    onBuscar(pacientePorNombre?.id ?? pacienteId);
  };

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="paciente-busqueda">{label}</label>
      <div className="search-row">
        <span aria-hidden="true" className="search-icon">ID</span>
        <input
          id="paciente-busqueda"
          list="pacientes-catalogo"
          placeholder="Nombre o ID de paciente"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <datalist id="pacientes-catalogo">
          {opciones.map((opcion) => (
            <option key={opcion.id} value={opcion.label} />
          ))}
        </datalist>
        <button type="submit">Buscar</button>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </form>
  );
};

const nombrePaciente = (paciente: PacienteCatalogo) =>
  [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(" ");

export default PacienteBuscador;
