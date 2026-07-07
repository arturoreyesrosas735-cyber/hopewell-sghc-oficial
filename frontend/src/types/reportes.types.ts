export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: Record<string, string[]> | string[] | null;
}

export interface RangoFechas {
  fecha_inicio: string;
  fecha_fin: string;
}

export type FormatoExportacion = "pdf" | "excel";

export interface PacienteResumen {
  id_paciente: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  uk_curp: string;
  fecha_nacimiento?: string;
  estatus: string;
  vv_alergia?: string | null;
}

export interface ConsultaMedicaReporte {
  id_consulta_medica: number;
  fk_consultorio_consulta_medica: number;
  fk_expediente_consulta_medica: number;
  fk_tipo_consulta: number;
  horario: string;
  motivo_consulta: string;
  fecha_apertura?: string;
  id_paciente?: number;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string | null;
  id_consultorio?: number;
  nombre_consultorio?: string;
  id_sede?: number;
  nombre_sede?: string;
  total_diagnosticos?: number;
}

export interface DiagnosticoReporte {
  id_diagnostico: number;
  nombre_diagnostico: string;
  descripcion_diagnostico: string;
  observaciones?: string | null;
  fecha_crecion?: string;
}

export interface TratamientoReporte {
  id_tratamiento: number;
  descripcion?: string | null;
  inicio_tratamiento: string;
  termino_tratamiento: string;
  indicaciones: string;
  estatus: string;
  nombre_diagnostico?: string | null;
}

export interface ResumenClinicoReporte {
  paciente: PacienteResumen;
  diagnosticos: DiagnosticoReporte[];
  tratamientos: TratamientoReporte[];
  totales: {
    diagnosticos: number;
    tratamientos: number;
  };
}

export interface ConsultasReporte {
  paciente?: PacienteResumen;
  doctor?: Record<string, unknown>;
  sede?: Record<string, unknown>;
  periodo?: RangoFechas;
  consultas: ConsultaMedicaReporte[];
  estadisticas?: Record<string, number>;
  totales?: Record<string, number>;
}
