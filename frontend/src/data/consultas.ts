import type { ConsultaGestion, PacienteConsulta, SignosVitalesForm } from '../types/consultas'

export const pacientes: PacienteConsulta[] = [
  { id: '0001', nombre: 'Ana Carranza Duque', curp: 'CADU920405MDFRQN09', expediente: 'EXP-2026-0001', edad: '34 anos', sexo: 'Femenino', telefono: '55 60220001', correo: 'ana.carranza@hopewell.mx', ocupacion: 'Enfermera', nacimiento: '05/04/1992', tipoSanguineo: 'AB+', emergencia: 'Luis Duque TEL: 55 60124578', alertas: ['Alergias: ninguna', 'Consulta activa: anual', 'Riesgo cardiovascular: bajo'] },
  { id: '0002', nombre: 'Yoshiro Gonzalez Palencia', curp: 'GOPY930112HDFNZS02', expediente: 'EXP-2026-0002', edad: '33 anos', sexo: 'Masculino', telefono: '55 44120078', correo: 'yoshiro.gonzalez@gmail.com', ocupacion: 'Ingeniero', nacimiento: '12/01/1993', tipoSanguineo: 'B+', emergencia: 'Marcos Gonzalez TEL: 55 21219090', alertas: ['Alergias: mariscos', 'Diabetes: no'] },
  { id: '0003', nombre: 'Victor De la Cruz Gonzalz', curp: 'CUGV880719HDFRNC03', expediente: 'EXP-2026-0003', edad: '38 anos', sexo: 'Masculino', telefono: '55 88774411', correo: 'victor.cruz@gmail.com', ocupacion: 'Tecnico', nacimiento: '19/07/1988', tipoSanguineo: 'O+', emergencia: 'Laura Gonzalz TEL: 55 90887766', alertas: ['Hipertension: seguimiento'] },
  { id: '0004', nombre: 'Yoat De la Merced Gonzalez', curp: 'MEGY910228HDFRNO04', expediente: 'EXP-2026-0004', edad: '35 anos', sexo: 'Masculino', telefono: '55 19003344', correo: 'yoat.merced@gmail.com', ocupacion: 'Administrador', nacimiento: '28/02/1991', tipoSanguineo: 'A+', emergencia: 'Rosa Gonzalez TEL: 55 55224411', alertas: ['Medicamentos restringidos: ninguno'] },
  { id: '0005', nombre: 'Ana Garcia Agapito', curp: 'GAAA050131MDFRGP05', expediente: 'EXP-2026-0005', edad: '25 anos', sexo: 'Femenino', telefono: '55 77551209', correo: 'ana.garcia@gmail.com', ocupacion: 'Estudiante', nacimiento: '31/01/2005', tipoSanguineo: 'O-', emergencia: 'Agapito Garcia TEL: 55 33334444', alertas: ['Alergias: ninguna', 'Riesgo cardiovascular: bajo'] },
  { id: '0006', nombre: 'Arely Rivera Guillen', curp: 'RIGA990901MDFRVL06', expediente: 'EXP-2026-0006', edad: '27 anos', sexo: 'Femenino', telefono: '55 12098776', correo: 'arely.rivera@gmail.com', ocupacion: 'Docente', nacimiento: '01/09/1999', tipoSanguineo: 'A-', emergencia: 'Patricia Guillen TEL: 55 88990012', alertas: ['Embarazo: no', 'Diabetes: no'] },
  { id: '0007', nombre: 'Alan Arzaluz Romero', curp: 'AARA901020HDFRML07', expediente: 'EXP-2026-0007', edad: '35 anos', sexo: 'Masculino', telefono: '55 70441122', correo: 'alan.arzaluz@gmail.com', ocupacion: 'Contador', nacimiento: '20/10/1990', tipoSanguineo: 'O+', emergencia: 'Roberto Romero TEL: 55 44442222', alertas: ['Gastritis: seguimiento'] },
  { id: '0008', nombre: 'Rosa Isela Vega', curp: 'VEIR850605MDFGSS08', expediente: 'EXP-2026-0008', edad: '41 anos', sexo: 'Femenino', telefono: '55 66557788', correo: 'rosa.vegaisela@gmail.com', ocupacion: 'Comerciante', nacimiento: '05/06/1985', tipoSanguineo: 'B-', emergencia: 'Laura Vega TEL: 55 87878787', alertas: ['Alergias: sulfas'] },
]

export const signosPorPaciente: Record<string, SignosVitalesForm> = {
  '0001': { temperatura: '36.6', presion: '120 / 80', frecuenciaCardiaca: '78', frecuenciaRespiratoria: '18', saturacionOxigeno: '98', peso: '63.0', talla: '165' },
  '0002': { temperatura: '36.8', presion: '122 / 82', frecuenciaCardiaca: '80', frecuenciaRespiratoria: '18', saturacionOxigeno: '97', peso: '74.0', talla: '170' },
  '0003': { temperatura: '36.9', presion: '136 / 88', frecuenciaCardiaca: '86', frecuenciaRespiratoria: '19', saturacionOxigeno: '96', peso: '83.2', talla: '174' },
  '0004': { temperatura: '37.0', presion: '124 / 79', frecuenciaCardiaca: '81', frecuenciaRespiratoria: '18', saturacionOxigeno: '97', peso: '76.4', talla: '171' },
  '0005': { temperatura: '36.5', presion: '116 / 75', frecuenciaCardiaca: '76', frecuenciaRespiratoria: '17', saturacionOxigeno: '99', peso: '60.5', talla: '162' },
  '0006': { temperatura: '36.7', presion: '115 / 74', frecuenciaCardiaca: '73', frecuenciaRespiratoria: '18', saturacionOxigeno: '98', peso: '58.6', talla: '160' },
  '0007': { temperatura: '37.2', presion: '118 / 76', frecuenciaCardiaca: '82', frecuenciaRespiratoria: '19', saturacionOxigeno: '97', peso: '78.4', talla: '172' },
  '0008': { temperatura: '38.6', presion: '150 / 95', frecuenciaCardiaca: '112', frecuenciaRespiratoria: '8', saturacionOxigeno: '88', peso: '81.0', talla: '168' },
}

export const consultas: ConsultaGestion[] = [
  { id: 'CONS-0001-2026', fecha: '13/04/2026', hora: '11:00 AM', paciente: 'Ana Carranza Duque', pacienteId: '0001', curp: 'CADU920405MDFRQN09', medico: 'Dr. Alexis Gonzalez Merced', especialidad: 'Medico General', motivo: 'Cefalea y fatiga', estado: 'COMPLETADA', tipoConsulta: 'Revision', modalidad: 'Presencial' },
  { id: 'CONS-0002-2026', fecha: '12/04/2026', hora: '04:00 PM', paciente: 'Yoshiro Gonzalez Palencia', pacienteId: '0002', curp: 'GOPY930112HDFNZS02', medico: 'Dra.Laura Mendez Luz', especialidad: 'Cardiologa', motivo: 'Hipertension arterial', estado: 'COMPLETADA', tipoConsulta: 'Control', modalidad: 'Presencial' },
  { id: 'CONS-0003-2026', fecha: '11/04/2026', hora: '10:00 AM', paciente: 'Victor De la Cruz Gonzalz', pacienteId: '0003', curp: 'CUGV880719HDFRNC03', medico: 'Dr. Juan Perez', especialidad: 'Medico General', motivo: 'Dolor abdominal', estado: 'CANCELADA', tipoConsulta: 'Urgencia', modalidad: 'Presencial' },
  { id: 'CONS-0004-2026', fecha: '11/04/2026', hora: '12:00 PM', paciente: 'Yoat De la Merced Gonzalez', pacienteId: '0004', curp: 'MEGY910228HDFRNO04', medico: 'Dra.Ericka Bustamante', especialidad: 'Medicina interna', motivo: 'Dolor de higado', estado: 'COMPLETADA', tipoConsulta: 'Revision', modalidad: 'Presencial' },
  { id: 'CONS-0005-2026', fecha: '10/04/2026', hora: '10:00 AM', paciente: 'Ana Garcia Agapito', pacienteId: '0005', curp: 'GAAA050131MDFRGP05', medico: 'Dr. Alexis Gonzalez Merced', especialidad: 'Medico General', motivo: 'Dolor de garganta', estado: 'PENDIENTE', tipoConsulta: 'Revision', modalidad: 'Presencial' },
  { id: 'CONS-0006-2026', fecha: '10/04/2026', hora: '11:00 AM', paciente: 'Arely Rivera Guillen', pacienteId: '0006', curp: 'RIGA990901MDFRVL06', medico: 'Dra.Laura Mendez Luz', especialidad: 'Cardiologa', motivo: 'Palpitaciones', estado: 'COMPLETADA', tipoConsulta: 'Control', modalidad: 'Presencial' },
  { id: 'CONS-0007-2026', fecha: '10/04/2026', hora: '11:00 AM', paciente: 'Alan Arzaluz Romero', pacienteId: '0007', curp: 'AARA901020HDFRML07', medico: 'Dr. Juan Perez', especialidad: 'Medico General', motivo: 'Problemas gastricos', estado: 'COMPLETADA', tipoConsulta: 'Revision', modalidad: 'Presencial' },
  { id: 'CONS-0008-2026', fecha: '10/04/2026', hora: '02:00 PM', paciente: 'Rosa Isela Vega', pacienteId: '0008', curp: 'VEIR850605MDFGSS08', medico: 'Dra.Ericka Bustamante', especialidad: 'Medicina interna', motivo: 'Fiebre', estado: 'CANCELADA', tipoConsulta: 'Urgencia', modalidad: 'Presencial' },
]

export const busquedaAnaGarcia = consultas.filter((consulta) => consulta.pacienteId === '0005')

export function readStoredConsultas(): ConsultaGestion[] {
  const raw = localStorage.getItem('hopewell_consultas_guardadas_v3')
  if (!raw) return consultas
  try {
    return JSON.parse(raw) as ConsultaGestion[]
  } catch {
    return consultas
  }
}

export function writeStoredConsultas(items: ConsultaGestion[]) {
  localStorage.setItem('hopewell_consultas_guardadas_v3', JSON.stringify(items))
}
