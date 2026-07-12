export interface Diagnostico {
  id_diagnostico: number;
  fk_consulta_medica_diagnostico: number;
  nombre_diagnostico: string;
  descripcion_diagnostico: string;
  observaciones: string | null;
  fecha_crecion: string;
  paciente_nombre?: string | null;
  paciente_apellido?: string | null;
}

export interface DiagnosticoPayload {
  nombre_diagnostico: string;
  descripcion_diagnostico: string;
  observaciones?: string;
}
