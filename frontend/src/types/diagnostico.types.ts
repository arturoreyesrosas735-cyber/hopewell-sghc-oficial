export interface Diagnostico {
  id_diagnostico: number;
  fk_consulta_medica_diagnostico: number;
  nombre_diagnostico: string;
  descripcion_diagnostico: string;
  observaciones: string | null;
  fecha_crecion: string;
  paciente_nombre?: string | null;
  paciente_apellido?: string | null;
  paciente_curp?: string | null;
  id_expediente?: number | null;
}

export interface DiagnosticoPayload {
  nombre_diagnostico: string;
  descripcion_diagnostico: string;
  observaciones?: string;
}

export interface PadecimientoOption {
  id_padecimiento: number;
  uk_nombre_padecimiento: string;
  uk_codigo_cie: string;
  vv_descripcion: string | null;
}
