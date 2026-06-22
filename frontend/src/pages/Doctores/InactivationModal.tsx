import { useState } from 'react';

export type InactivationPayload = {
  motivo_inactivacion: string;
  detalles_inactivacion: string;
  confirmacion_inactivacion: boolean;
};

type InactivationModalProps = {
  doctorName?: string;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: (payload: InactivationPayload) => void;
};

const reasons = [
  'Baja administrativa',
  'Suspensión temporal',
  'Validación de credenciales pendiente',
  'Cambio de adscripción',
  'Solicitud de Recursos Humanos Médicos',
];

const styles = {
  backdrop: {
    alignItems: 'center',
    backdropFilter: 'blur(1px)',
    background: 'rgba(244, 239, 239, 0.76)',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    padding: '20px',
    position: 'fixed' as const,
    zIndex: 90,
  },
  modal: {
    background: '#FFFFFF',
    border: '1px solid #C7D7EA',
    boxShadow: '0 18px 38px rgba(15, 23, 42, 0.22)',
    boxSizing: 'border-box' as const,
    maxWidth: '460px',
    padding: '30px 28px 24px',
    width: 'min(460px, 100%)',
  },
  title: {
    color: '#172B4D',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#64748B',
    fontSize: '12px',
    lineHeight: 1.35,
    margin: '11px auto 18px',
    maxWidth: '300px',
    textAlign: 'center' as const,
  },
  label: {
    color: '#52647A',
    display: 'grid',
    fontSize: '9px',
    fontWeight: 900,
    gap: '6px',
    marginBottom: '12px',
    textTransform: 'uppercase' as const,
  },
  select: {
    background: '#F0F6FF',
    border: '1px solid #AFC0D4',
    borderRadius: '4px',
    color: '#172B4D',
    fontSize: '12px',
    height: '36px',
    outline: 'none',
    padding: '0 12px',
    width: '100%',
  },
  textarea: {
    background: '#F0F6FF',
    border: '1px solid #AFC0D4',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    fontSize: '12px',
    minHeight: '96px',
    outline: 'none',
    padding: '10px 12px',
    resize: 'vertical' as const,
    width: '100%',
  },
  acknowledgement: {
    alignItems: 'flex-start',
    background: '#F8FAFC',
    border: '1px solid #E0E7F0',
    borderRadius: '4px',
    color: '#52647A',
    display: 'grid',
    fontSize: '10px',
    gap: '9px',
    gridTemplateColumns: '14px minmax(0, 1fr)',
    lineHeight: 1.35,
    margin: '2px 0 22px',
    padding: '12px',
  },
  checkbox: {
    accentColor: '#00875A',
    height: '14px',
    margin: '1px 0 0',
    width: '14px',
  },
  actions: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr 1fr',
  },
  button: {
    border: 0,
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 800,
    height: '40px',
  },
  error: {
    color: '#DE350B',
    fontSize: '11px',
    margin: '-10px 0 12px',
    textAlign: 'center' as const,
  },
};

export default function InactivationModal({
  doctorName,
  submitting = false,
  onCancel,
  onConfirm,
}: InactivationModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  function confirm() {
    if (!reason) {
      setError('Seleccione un motivo de inactivación.');
      return;
    }

    if (!accepted) {
      setError('Confirme que comprende el proceso de reversión.');
      return;
    }

    setError('');
    onConfirm({
      motivo_inactivacion: reason,
      detalles_inactivacion: details.trim(),
      confirmacion_inactivacion: accepted,
    });
  }

  return (
    <div role="presentation" style={styles.backdrop}>
      <section aria-labelledby="inactivation-title" aria-modal="true" role="dialog" style={styles.modal}>
        <h2 id="inactivation-title" style={styles.title}>
          Inactivación
        </h2>
        <p style={styles.subtitle}>
          Por favor, especifique el motivo para proceder con la inactivación del perfil médico
          {doctorName ? ` de ${doctorName}` : ''}.
        </p>

        <label style={styles.label}>
          Motivo de inactivación
          <select
            disabled={submitting}
            style={styles.select}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          >
            <option value="">Seleccione una opción...</option>
            {reasons.map((currentReason) => (
              <option key={currentReason} value={currentReason}>
                {currentReason}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Detalles adicionales
          <textarea
            disabled={submitting}
            placeholder="Describa brevemente las razones del cambio de estado..."
            style={styles.textarea}
            value={details}
            onChange={(event) => setDetails(event.target.value)}
          />
        </label>

        <label style={styles.acknowledgement}>
          <input
            checked={accepted}
            disabled={submitting}
            style={styles.checkbox}
            type="checkbox"
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>
            Entiendo que esta acción es reversible solo mediante una solicitud formal al departamento de Recursos Humanos
            Médicos y una nueva validación de credenciales.
          </span>
        </label>

        {error ? <p style={styles.error}>{error}</p> : null}

        <div style={styles.actions}>
          <button
            disabled={submitting}
            style={{ ...styles.button, background: '#00875A', color: '#FFFFFF', opacity: submitting ? 0.7 : 1 }}
            type="button"
            onClick={confirm}
          >
            {submitting ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button
            disabled={submitting}
            style={{ ...styles.button, background: '#FFE2E2', color: '#FF0000', opacity: submitting ? 0.7 : 1 }}
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </section>
    </div>
  );
}
