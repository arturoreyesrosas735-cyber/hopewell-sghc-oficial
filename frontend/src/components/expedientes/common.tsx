import type { ReactNode } from 'react';

export function AlertMessage({ tone = 'info', children }: { tone?: 'info' | 'success' | 'error'; children: ReactNode }) {
  return <div className={`exp-alert exp-alert-${tone}`}>{children}</div>;
}

export function LoadingSpinner({ label = 'Cargando informacion...' }: { label?: string }) {
  return <div className="exp-loading">{label}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="exp-empty">{children}</div>;
}
