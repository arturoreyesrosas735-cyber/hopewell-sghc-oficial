import api from './api';
import type {
  AbrirExpedienteFormData,
  AdjuntarDocumentoFormData,
  ApiResponse,
  Documento,
  ExpedienteClinico,
  HistorialClinico,
  PacienteResumen,
  ResumenDia,
} from '../types/expediente.types';

export async function getResumenDia(): Promise<ApiResponse<ResumenDia>> {
  const { data } = await api.get<ApiResponse<ResumenDia>>('/expedientes/resumen-dia');
  return data;
}

export async function getExpedientes(search = ''): Promise<ApiResponse<ExpedienteClinico[]>> {
  const { data } = await api.get<ApiResponse<ExpedienteClinico[]>>('/expedientes', {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function buscarPacientes(search = ''): Promise<ApiResponse<PacienteResumen[]>> {
  const { data } = await api.get<ApiResponse<PacienteResumen[]>>('/pacientes', {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function abrirExpediente(
  payload: AbrirExpedienteFormData,
): Promise<ApiResponse<ExpedienteClinico>> {
  const { data } = await api.post<ApiResponse<ExpedienteClinico>>('/expedientes', payload);
  return data;
}

export async function getExpedienteById(id: number): Promise<ApiResponse<ExpedienteClinico>> {
  const { data } = await api.get<ApiResponse<ExpedienteClinico>>(`/expedientes/${id}`);
  return data;
}

export async function getHistorialClinico(id: number): Promise<ApiResponse<HistorialClinico>> {
  const { data } = await api.get<ApiResponse<HistorialClinico>>(`/expedientes/${id}/historial`);
  return data;
}

export async function adjuntarDocumento(
  idExpediente: number,
  payload: AdjuntarDocumentoFormData,
): Promise<ApiResponse<Documento>> {
  const formData = new FormData();
  formData.append('archivo', payload.archivo);
  formData.append('nombre_documento', payload.nombre_documento);
  formData.append('tipo_documento', payload.tipo_documento);

  const { data } = await api.post<ApiResponse<Documento>>(
    `/expedientes/${idExpediente}/documentos`,
    formData,
  );
  return data;
}

export async function getDocumentosExpediente(id: number): Promise<ApiResponse<Documento[]>> {
  const { data } = await api.get<ApiResponse<Documento[]>>(`/expedientes/${id}/documentos`);
  return data;
}
