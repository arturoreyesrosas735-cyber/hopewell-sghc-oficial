import { useState } from "react";
import type { FormEvent } from "react";

interface PacienteBuscadorProps {
  label?: string;
  onBuscar: (pacienteId: number) => void;
}

const PacienteBuscador = ({ label = "Buscar paciente", onBuscar }: PacienteBuscadorProps) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pacienteId = Number.parseInt(query.trim(), 10);

    if (!pacienteId) {
      setError("Paciente no encontrado.");
      return;
    }

    setError("");
    onBuscar(pacienteId);
  };

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <label htmlFor="paciente-busqueda">{label}</label>
      <div className="search-row">
        <span aria-hidden="true" className="search-icon">ID</span>
        <input
          id="paciente-busqueda"
          inputMode="numeric"
          placeholder="ID de paciente"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Buscar</button>
      </div>
      {error ? <p className="field-error">{error}</p> : null}
    </form>
  );
};

export default PacienteBuscador;
