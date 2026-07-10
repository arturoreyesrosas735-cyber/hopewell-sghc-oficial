import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import TratamientosLayout from "../../components/tratamientos/TratamientosLayout";
import {
  crearEnfermedadCatalogo,
  crearMedicamentoCatalogo,
  getRecursoCatalogo,
} from "../../services/catalogoM6Service";

interface CatalogoEditablePageProps {
  recurso: "medicamentos" | "enfermedades";
  title: string;
}

const CatalogoEditablePage = ({ recurso, title }: CatalogoEditablePageProps) => {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [nombre, setNombre] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [concentracion, setConcentracion] = useState("");
  const [message, setMessage] = useState("");

  const load = () => {
    getRecursoCatalogo(recurso).then((response) => setRows(response.data.data));
  };

  useEffect(load, [recurso]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");

    if (!nombre.trim()) {
      setMessage("Escribe un nombre.");
      return;
    }

    if (recurso === "medicamentos") {
      await crearMedicamentoCatalogo({ nombre, presentacion, concentracion });
    } else {
      await crearEnfermedadCatalogo({ nombre });
    }

    setNombre("");
    setPresentacion("");
    setConcentracion("");
    setMessage("Registro guardado correctamente.");
    load();
  };

  return (
    <TratamientosLayout title={title}>
      <section className="primary-column wide">
        <form className="surface-panel form-grid" onSubmit={submit}>
          {message ? <div className="notice span-2">{message}</div> : null}
          <label className={recurso === "medicamentos" ? "" : "span-2"}>
            Nombre
            <input value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder={recurso === "medicamentos" ? "Ej. Loratadina 10 mg" : "Ej. Hipertension arterial"} />
          </label>
          {recurso === "medicamentos" ? (
            <>
              <label>
                Presentacion
                <input value={presentacion} onChange={(event) => setPresentacion(event.target.value)} placeholder="Ej. Tabletas" />
              </label>
              <label>
                Concentracion
                <input value={concentracion} onChange={(event) => setConcentracion(event.target.value)} placeholder="Ej. 10 mg" />
              </label>
            </>
          ) : null}
          <div className="form-actions span-2">
            <button type="submit">Guardar</button>
          </div>
        </form>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                {Object.keys(rows[0] ?? {}).slice(0, 5).map((key) => <th key={key}>{key.replaceAll("_", " ")}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {Object.keys(rows[0] ?? {}).slice(0, 5).map((key) => <td key={key}>{String(row[key] ?? "Sin dato")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </TratamientosLayout>
  );
};

export default CatalogoEditablePage;
