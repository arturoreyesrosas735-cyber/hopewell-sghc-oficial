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
}

export interface RecetaFormData {
  fk_tratamiento_receta: number;
  fk_paciente_receta: number;
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
