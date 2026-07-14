export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[] | null;
}

export interface PacienteResumen {
  id_paciente: number;
  uk_curp?: string | null;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  fecha_nacimiento?: string | null;
  estatus: string;
  uk_correo_electronico?: string | null;
  uk_telefono?: string | null;
}

export interface ExpedienteClinico {
  id_expediente: number;
  fk_paciente_expediente_clinico: number;
  motivo: string | null;
  fk_diagnostico_expediente_clinico?: number | null;
  antecedente_familiar: string | null;
  notas: string | null;
  fecha_apertura: string;
  paciente?: PacienteResumen | null;
}

export interface AbrirExpedienteFormData {
  fk_paciente_expediente_clinico: number;
  motivo?: string;
  antecedente_familiar?: string;
  notas?: string;
  fk_diagnostico_expediente_clinico?: number;
}

export interface Documento {
  id_documento: number;
  fk_expediente_clinico_documento: number;
  nombre_documento: string;
  tipo_documento?: string | null;
  extension_archivo: string;
  ruta_archivo: string | null;
  tamano_archivo: number;
  fecha_carga: string;
  estatus: string;
  url_descarga?: string;
  url_ver?: string;
}

export interface AdjuntarDocumentoFormData {
  archivo: File;
  nombre_documento: string;
  tipo_documento: string;
}

export type TipoEventoHistorial = 'consulta' | 'diagnostico' | 'tratamiento' | 'documento';

export interface EventoHistorial {
  tipo: TipoEventoHistorial;
  fecha: string;
  id: number;
  titulo?: string;
  descripcion?: string | null;
}

export interface HistorialClinico {
  id_expediente: number;
  historial: EventoHistorial[];
}

export interface ResumenDia {
  pacientes: Array<{
    tiempo: string;
    nombre: string;
    edad: number | string;
    razon: string;
    doctor: string;
  }>;
  ultimas_consultas: Array<{
    modulo: string;
    fecha: string;
    estatus: string;
  }>;
  busqueda_rapida: string[];
  mensajes: string[];
}
