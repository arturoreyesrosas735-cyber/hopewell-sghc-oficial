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
}

export interface TratamientoFormData {
  fk_paciente_tratamiento: number;
  fk_diagnostico_tratamiento: number;
  fk_padecimiento_tratamiento: number;
  fk_medicamento_tratamiento: number;
  descripcion?: string;
  inicio_tratamiento: string;
  termino_tratamiento: string;
  indicaciones: string;
}
