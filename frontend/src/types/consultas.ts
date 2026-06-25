export type EstadoConsulta = 'COMPLETADA' | 'PENDIENTE' | 'CANCELADA'

export interface ConsultaGestion {
  id: string
  fecha: string
  hora: string
  paciente: string
  pacienteId: string
  curp: string
  medico: string
  especialidad: string
  motivo: string
  estado: EstadoConsulta
  tipoConsulta?: string
  modalidad?: string
  tratamiento?: string
}

export interface PacienteConsulta {
  id: string
  nombre: string
  curp: string
  expediente: string
  edad: string
  sexo: string
  telefono: string
  correo: string
  ocupacion: string
  nacimiento: string
  tipoSanguineo: string
  emergencia: string
  alertas: string[]
}

export interface SignosVitalesForm {
  temperatura: string
  presion: string
  frecuenciaCardiaca: string
  frecuenciaRespiratoria: string
  saturacionOxigeno: string
  peso: string
  talla: string
}

export interface ModalState {
  type: 'none' | 'invalid' | 'no-active' | 'success'
}