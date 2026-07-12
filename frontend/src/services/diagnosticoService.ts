import type { Diagnostico, DiagnosticoPayload } from '../types/diagnostico.types';

const API_BASE = '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de comunicacion.' }));
    throw new Error(error.message ?? 'Error de comunicacion.');
  }

  return response.json();
}

export async function getDiagnosticosResumen(): Promise<{
  data: Diagnostico[];
  meta: { total: number; pendientes_revision: number };
}> {
  return request('/diagnosticos/resumen');
}

export async function getDiagnosticosByConsulta(consultaId: number): Promise<{ data: Diagnostico[] }> {
  return request(`/consultas/${consultaId}/diagnosticos`);
}

export async function createDiagnostico(consultaId: number, payload: DiagnosticoPayload): Promise<{ data: Diagnostico }> {
  return request(`/consultas/${consultaId}/diagnosticos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateDiagnostico(id: number, payload: DiagnosticoPayload): Promise<{ data: Diagnostico }> {
  return request(`/diagnosticos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
