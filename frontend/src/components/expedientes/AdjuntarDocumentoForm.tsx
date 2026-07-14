import { useState, type FormEvent } from 'react';
import type { AdjuntarDocumentoFormData } from '../../types/expediente.types';
import { AlertMessage } from './common';

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
const maxBytes = 5 * 1024 * 1024;

export default function AdjuntarDocumentoForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (payload: AdjuntarDocumentoFormData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  function validateFile(nextFile: File | null) {
    if (!nextFile) {
      setFile(null);
      setFileError('Debe seleccionar un archivo para adjuntar.');
      return;
    }

    const extension = nextFile.name.split('.').pop()?.toLowerCase() ?? '';
    if (!allowedExtensions.includes(extension) || nextFile.size > maxBytes) {
      setFile(null);
      setFileError('El archivo no es valido. Use PDF, JPG o PNG de maximo 5 MB.');
      return;
    }

    setFile(nextFile);
    setFileError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nombre = String(form.get('nombre_documento') ?? '').trim();
    const tipo = String(form.get('tipo_documento') ?? '').trim();

    if (!file) {
      setFileError('Debe seleccionar un archivo para adjuntar.');
      return;
    }

    if (!nombre) {
      setFileError('Debe ingresar un nombre para el documento.');
      return;
    }

    if (!tipo) {
      setFileError('Debe seleccionar un tipo de documento.');
      return;
    }

    onSubmit({ archivo: file, nombre_documento: nombre, tipo_documento: tipo });
  }

  return (
    <form className="exp-form" onSubmit={handleSubmit}>
      {fileError ? <AlertMessage tone="error">{fileError}</AlertMessage> : null}
      <label>
        Tipo de documento
        <select name="tipo_documento" defaultValue="">
          <option value="" disabled>Seleccionar tipo</option>
          <option value="Estudio de laboratorio">Estudio de laboratorio</option>
          <option value="Resultado clinico">Resultado clinico</option>
          <option value="Receta">Receta</option>
          <option value="Consentimiento">Consentimiento</option>
          <option value="Imagen medica">Imagen medica</option>
          <option value="Otro">Otro</option>
        </select>
      </label>
      <label>
        Nombre del documento
        <input maxLength={150} name="nombre_documento" placeholder="Resultado laboratorio 21-06-2026" />
      </label>
      <label>
        Archivo clinico
        <input accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => validateFile(event.target.files?.[0] ?? null)} type="file" />
      </label>
      <button className="exp-button" disabled={!file || loading || Boolean(fileError)} type="submit">
        {loading ? 'Adjuntando...' : 'Adjuntar Documento'}
      </button>
    </form>
  );
}
