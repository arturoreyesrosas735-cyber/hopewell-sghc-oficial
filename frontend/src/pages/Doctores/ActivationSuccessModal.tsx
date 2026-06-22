type ActivationSuccessModalProps = {
  doctorName: string;
  onBackToPanel: () => void;
  onViewProfile: () => void;
};

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
    zIndex: 95,
  },
  modal: {
    alignItems: 'center',
    background: '#FFFFFF',
    borderRadius: '10px',
    boxShadow: '0 10px 26px rgba(15, 23, 42, 0.18)',
    boxSizing: 'border-box' as const,
    display: 'grid',
    justifyItems: 'center',
    maxWidth: '560px',
    padding: '28px 32px 24px',
    width: 'min(560px, 100%)',
  },
  icon: {
    alignItems: 'center',
    background: '#27B968',
    borderRadius: '999px',
    color: '#FFFFFF',
    display: 'flex',
    fontSize: '42px',
    fontWeight: 900,
    height: '82px',
    justifyContent: 'center',
    lineHeight: 1,
    marginBottom: '17px',
    width: '82px',
  },
  title: {
    color: '#00875A',
    fontSize: '10px',
    fontWeight: 900,
    margin: 0,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
  },
  message: {
    color: '#52647A',
    fontSize: '13px',
    lineHeight: 1.4,
    margin: '4px 0 28px',
    maxWidth: '470px',
    textAlign: 'center' as const,
  },
  actions: {
    display: 'grid',
    gap: '48px',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '360px',
    width: '100%',
  },
  button: {
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 800,
    height: '40px',
  },
};

export default function ActivationSuccessModal({
  doctorName,
  onBackToPanel,
  onViewProfile,
}: ActivationSuccessModalProps) {
  return (
    <div role="presentation" style={styles.backdrop}>
      <section aria-labelledby="activation-success-title" aria-modal="true" role="dialog" style={styles.modal}>
        <div aria-hidden="true" style={styles.icon}>
          ✓
        </div>
        <h2 id="activation-success-title" style={styles.title}>
          Se realizó la activación con éxito
        </h2>
        <p style={styles.message}>
          El perfil del Dr. {doctorName} ha sido activado con éxito. Se reasignaron pacientes a la lista de espera.
        </p>
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, background: '#007A4D', border: '1px solid #007A4D', color: '#FFFFFF' }}
            type="button"
            onClick={onBackToPanel}
          >
            Volver al Panel
          </button>
          <button
            style={{ ...styles.button, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#007A4D' }}
            type="button"
            onClick={onViewProfile}
          >
            Ver Perfil Médico
          </button>
        </div>
      </section>
    </div>
  );
}
