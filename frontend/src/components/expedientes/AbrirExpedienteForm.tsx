import type { FormEvent } from 'react';
import type { AbrirExpedienteFormData, PacienteResumen } from '../../types/expediente.types';

type Props = {
  paciente: PacienteResumen | null;
  loading: boolean;
  onSubmit: (payload: AbrirExpedienteFormData) => void;
};

export default function AbrirExpedienteForm({ paciente, loading, onSubmit }: Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!paciente) return;

    const form = new FormData(event.currentTarget);
    onSubmit({
      fk_paciente_expediente_clinico: paciente.id_paciente,
      motivo: String(form.get('motivo') ?? ''),
      antecedente_familiar: String(form.get('antecedente_familiar') ?? ''),
      notas: String(form.get('notas') ?? ''),
      fk_diagnostico_expediente_clinico: Number(form.get('fk_diagnostico_expediente_clinico')) || undefined,
    });
  }

  return (
    <form className="exp-form" onSubmit={handleSubmit}>
      <div className="exp-selected-patient">
        <span>Paciente seleccionado</span>
        <strong>
          {paciente
            ? `${paciente.nombres} ${paciente.apellido_paterno} ${paciente.apellido_materno ?? ''}`.trim()
            : 'Selecciona un paciente activo'}
        </strong>
        <small>{paciente?.uk_curp ?? 'Busca por nombre, ID o CURP'}</small>
      </div>

      <label>
        Motivo de apertura
        <input maxLength={255} name="motivo" placeholder="Atencion inicial, seguimiento, control..." />
      </label>
      <label>
        Antecedentes familiares
        <textarea name="antecedente_familiar" placeholder="Antecedentes relevantes del paciente" />
      </label>
      <label>
        Notas
        <textarea name="notas" placeholder="Notas adicionales" />
      </label>
      <label>
        Diagnostico vinculado
        <input min={1} name="fk_diagnostico_expediente_clinico" placeholder="Opcional mientras se resuelve BD" type="number" />
      </label>

      <button className="exp-button" disabled={!paciente || loading || paciente.estatus.toLowerCase() !== 'activo'} type="submit">
        {loading ? 'Abriendo...' : 'Abrir Expediente'}
      </button>
    </form>
  );
}
