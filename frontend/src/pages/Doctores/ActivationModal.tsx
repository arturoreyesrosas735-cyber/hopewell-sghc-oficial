import { useState } from 'react';

export type ActivationPayload = {
  motivo_activacion: string;
  detalles_activacion: string;
  confirmacion_activacion: boolean;
};

type ActivationModalProps = {
  doctorName?: string;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: (payload: ActivationPayload) => void;
};

const reasons = [
  'Validación de credenciales aprobada',
  'Solicitud de Recursos Humanos Médicos',
  'Reincorporación administrativa',
  'Corrección de estatus',
  'Autorización de dirección médica',
];

const styles = {
  backdrop: {
    alignItems: 'center',
    backdropFilter: 'blur(1px)',
    background: 'rgba(244, 239, 239, 0.78)',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    padding: '20px',
    position: 'fixed' as const,
    zIndex: 90,
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 10px 26px rgba(15, 23, 42, 0.18)',
    boxSizing: 'border-box' as const,
    maxWidth: '560px',
    padding: '24px 28px 20px',
    width: 'min(560px, 100%)',
  },
  title: {
    color: '#172B4D',
    fontSize: '20px',
    fontWeight: 800,
    margin: 0,
    textAlign: 'center' as const,
  },
  subtitle: {
    color: '#52647A',
    fontSize: '12px',
    lineHeight: 1.35,
    margin: '10px auto 16px',
    maxWidth: '430px',
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
    borderRadius: '5px',
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
    borderRadius: '5px',
    boxSizing: 'border-box' as const,
    color: '#172B4D',
    fontSize: '12px',
    minHeight: '104px',
    outline: 'none',
    padding: '10px 12px',
    resize: 'vertical' as const,
    width: '100%',
  },
  acknowledgement: {
    alignItems: 'flex-start',
    background: '#F8FAFC',
    border: '1px solid #E0E7F0',
    borderRadius: '5px',
    color: '#52647A',
    display: 'grid',
    fontSize: '10px',
    gap: '9px',
    gridTemplateColumns: '14px minmax(0, 1fr)',
    lineHeight: 1.35,
    margin: '2px 0 18px',
    padding: '12px',
  },
  checkbox: {
    accentColor: '#00875A',
    height: '14px',
    margin: '1px 0 0',
    width: '14px',
  },
  actions: {
    display: 'flex',
    gap: '130px',
    justifyContent: 'center',
  },
  button: {
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 800,
    height: '36px',
    minWidth: '96px',
  },
  error: {
    color: '#DE350B',
    fontSize: '11px',
    margin: '-8px 0 12px',
    textAlign: 'center' as const,
  },
};

export default function ActivationModal({
  doctorName,
  submitting = false,
  onCancel,
  onConfirm,
}: ActivationModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  function confirm() {
    if (!reason) {
      setError('Seleccione un motivo de activación.');
      return;
    }

    if (!accepted) {
      setError('Confirme que comprende el proceso de reactivación.');
      return;
    }

    setError('');
    onConfirm({
      motivo_activacion: reason,
      detalles_activacion: details.trim(),
      confirmacion_activacion: accepted,
    });
  }

  return (
    <div role="presentation" style={styles.backdrop}>
      <section aria-labelledby="activation-title" aria-modal="true" role="dialog" style={styles.modal}>
        <h2 id="activation-title" style={styles.title}>
          Activación
        </h2>
        <p style={styles.subtitle}>
          Estás a punto de reactivar el perfil del Dr. {doctorName ?? 'seleccionado'}. Esta acción restaurará su acceso
          al sistema y le permitirá retomar su agenda de consultas.
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
            style={{ ...styles.button, background: '#00875A', border: '1px solid #00875A', color: '#FFFFFF' }}
            type="button"
            onClick={confirm}
          >
            {submitting ? 'Confirmando...' : 'Confirmar'}
          </button>
          <button
            disabled={submitting}
            style={{ ...styles.button, background: '#FFFFFF', border: '1px solid #EF4444', color: '#EF4444' }}
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
