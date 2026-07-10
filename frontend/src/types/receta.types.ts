export interface Receta {
  id_receta: number;
  fk_tratamiento_receta: number;
  fk_doctor_receta: number;
  fk_paciente_receta: number;
  fecha_receta: string;
  observaciones?: string | null;
  dosis: string;
  frecuencia: string;
  duracion_receta: string;
  estatus: string;
  paciente?: {
    id_paciente: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string | null;
  };
  tratamiento?: {
    id_tratamiento: number;
    descripcion?: string | null;
    diagnostico?: {
      nombre_diagnostico: string;
    };
    medicamento?: {
      uk_nombre_medicamento: string;
    };
  };
}

export interface RecetaFormData {
  fk_tratamiento_receta: number;
  fk_paciente_receta: number;
  medicamento_texto?: string;
  fecha_receta?: string;
  observaciones?: string;
  dosis: string;
  frecuencia: string;
  duracion_receta: string;
}

export interface Medicamento {
  id_medicamento: number;
  uk_nombre_medicamento: string;
  descripcion?: string | null;
  presentacion: string;
  concentracion: string;
}
