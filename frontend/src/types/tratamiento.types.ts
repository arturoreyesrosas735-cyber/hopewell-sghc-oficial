export interface Tratamiento {
  id_tratamiento: number;
  fk_paciente_tratamiento: number;
  fk_diagnostico_tratamiento: number;
  fk_padecimiento_tratamiento: number;
  fk_medicamento_tratamiento: number;
  descripcion?: string | null;
  inicio_tratamiento: string;
  termino_tratamiento: string;
  indicaciones: string;
  fecha_registro: string;
  estatus: string;
  paciente?: {
    id_paciente: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string | null;
  };
  diagnostico?: {
    id_diagnostico: number;
    nombre_diagnostico: string;
    descripcion_diagnostico?: string | null;
  };
  padecimiento?: {
    id_padecimiento: number;
    uk_nombre_padecimiento: string;
  };
  medicamento?: {
    id_medicamento: number;
    uk_nombre_medicamento: string;
    presentacion: string;
    concentracion: string;
  };
}

export interface TratamientoFormData {
  fk_paciente_tratamiento: number;
  fk_diagnostico_tratamiento: number;
  fk_padecimiento_tratamiento: number;
  fk_medicamento_tratamiento: number;
  diagnostico_texto: string;
  padecimiento_texto: string;
  medicamento_texto: string;
  descripcion?: string;
  inicio_tratamiento: string;
  termino_tratamiento: string;
  indicaciones: string;
}
