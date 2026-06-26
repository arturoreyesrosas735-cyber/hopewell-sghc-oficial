import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ModuleLayout } from '../../components/ModuleLayout'
import { pacientes, signosPorPaciente } from '../../data/consultas'
import type { ModalState, PacienteConsulta, SignosVitalesForm } from '../../types/consultas'
import './SignosVitales.css'

const emptyForm: SignosVitalesForm = { temperatura: '', presion: '', frecuenciaCardiaca: '', frecuenciaRespiratoria: '', saturacionOxigeno: '', peso: '', talla: '' }
const invalidRows = [['Temperatura', '38.6 °C', '36.0 - 37.5 °C', 'Alto'], ['Frecuencia cardíaca', '112 lpm', '60 - 100 lpm', 'Alto'], ['Frecuencia respiratoria', '8 rpm', '12 - 20 rpm', 'Bajo'], ['Saturación de oxígeno', '88 %', '95 - 100 %', 'Bajo'], ['Presión arterial', '150/95 mmHg', '90/60 - 120/80 mmHg', 'Alto']]

export function SignosVitalesPage() {
  const [params] = useSearchParams()
  const initialPatient = pacientes.find((item) => item.id === params.get('paciente')) ?? null
  const [form, setForm] = useState<SignosVitalesForm>(initialPatient ? signosPorPaciente[initialPatient.id] : emptyForm)
  const [patient, setPatient] = useState<PacienteConsulta | null>(initialPatient)
  const [search, setSearch] = useState(initialPatient?.id ?? '')
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const [notice, setNotice] = useState(initialPatient ? 'Signos vitales exportados correctamente.' : '')

  const imc = useMemo(() => {
    const peso = Number(form.peso)
    const tallaCm = Number(form.talla)
    if (!peso || !tallaCm) return ''
    return (peso / (tallaCm / 100) ** 2).toFixed(1)
  }, [form.peso, form.talla])

  function updateField(field: keyof SignosVitalesForm, value: string) { setForm((current) => ({ ...current, [field]: value })) }
  function buscarPaciente() {
    const value = search.trim().toUpperCase().padStart(4, '0')
    const found = pacientes.find((item) => item.id === value || item.curp === search.trim().toUpperCase() || item.nombre.toUpperCase().includes(search.trim().toUpperCase()))
    if (!found) { setPatient(null); setForm(emptyForm); setNotice('No se encontró paciente con esos datos.'); return }
    setPatient(found); setForm(signosPorPaciente[found.id] ?? emptyForm); setNotice('Signos vitales exportados correctamente.')
  }
  function nuevoFormulario() { setPatient(null); setForm(emptyForm); setSearch(''); setNotice('Nuevo formulario listo para captura.'); setModal({ type: 'none' }) }
  function limpiar() { setForm(emptyForm); setNotice('Formulario limpio.') }
  function guardar() {
    if (!patient) { setModal({ type: 'no-active' }); return }
    const temperatura = Number(form.temperatura); const frecuenciaCardiaca = Number(form.frecuenciaCardiaca); const frecuenciaRespiratoria = Number(form.frecuenciaRespiratoria); const saturacion = Number(form.saturacionOxigeno); const [sistolicaRaw, diastolicaRaw] = form.presion.split('/').map((value) => Number(value.trim()))
    const invalid = temperatura > 37.5 || frecuenciaCardiaca > 100 || frecuenciaRespiratoria < 12 || saturacion < 95 || sistolicaRaw > 120 || diastolicaRaw > 80
    setModal({ type: invalid ? 'invalid' : 'success' })
  }

  return <ModuleLayout active="signos" crumb="SIGNOS VITALES" userName="Enf. Ana Carranza Duque" userRole="ENFERMERA">
    <section className="page-heading signs-heading"><div><h1>{patient ? 'CAPTURA DE SIGNOS VITALES EJEMPLO' : 'CAPTURA DE SIGNOS VITALES'}</h1><p>Captura y registro de signos vitales del paciente.</p></div><button type="button" className="green-button" onClick={nuevoFormulario}>Nuevo formulario de captura.</button></section>
    {!patient ? <section className="filters-card signs-search"><label className="search-label">⌕ Búsqueda rápida del paciente.</label><div className="main-search"><input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') buscarPaciente() }} placeholder="BUSCAR POR NOMBRE, CURP, ID PACIENTE, NSS, EXPEDIENTE." /><button type="button" onClick={buscarPaciente}>⌕</button></div>{notice ? <p className="success-notice">{notice}</p> : null}</section> : <section className="patient-strip"><div><strong>Paciente:</strong><span>{patient.nombre}</span></div><div><strong>Expediente:</strong><span>{patient.expediente}</span><b>|</b><span>Edad: {patient.edad}</span><b>|</b><span>Sexo: {patient.sexo}</span></div><div className="active-consult"><strong>Consulta activa:</strong><span>Consulta anual - Dr. Alejandro Vance</span></div>{notice ? <p className="success-notice">{notice}</p> : null}</section>}
    <section className="vitals-form-card"><h2>SIGNOS VITALES.</h2><div className="vitals-form-grid"><VitalField label="TEMPERATURA" unit="°C" value={form.temperatura} placeholder="INGRESE LA TEMPERATURA" onChange={(v) => updateField('temperatura', v)} /><VitalField label="PRESIÓN ARTERIAL:" unit="mmHg" value={form.presion} placeholder="INGRESE LA PRESIÓN ARTERIAL" onChange={(v) => updateField('presion', v)} /><VitalField label="FRECUENCIA CARDÍACA" unit="lpm" value={form.frecuenciaCardiaca} placeholder="INGRESE LA FC" onChange={(v) => updateField('frecuenciaCardiaca', v)} /><VitalField label="FRECUENCIA RESPIRATORIA:" unit="rpm" value={form.frecuenciaRespiratoria} placeholder="INGRESE LA FR" onChange={(v) => updateField('frecuenciaRespiratoria', v)} /><VitalField label="SATURACIÓN DE OXÍGENO:" unit="%" value={form.saturacionOxigeno} placeholder="INGRESE LA SATURACIÓN" onChange={(v) => updateField('saturacionOxigeno', v)} /><VitalField label="PESO:" unit="kg" value={form.peso} placeholder="INGRESE EL PESO" onChange={(v) => updateField('peso', v)} /><VitalField label="TALLA:" unit="m" value={form.talla} placeholder="INGRESE LA TALLA" onChange={(v) => updateField('talla', v)} /><VitalField label="IMC" unit="kg/m²" value={imc} placeholder="IMC CALCULADO" readOnly onChange={() => undefined} /></div><p className="imc-caption">(Calculado automáticamente)</p><div className="sign-actions"><button type="button" className="outline-button" onClick={limpiar}>Limpiar</button><button type="button" className="green-button" onClick={guardar}>Guardar signos vitales</button></div></section>
    {modal.type === 'invalid' ? <InvalidValuesModal onClose={() => setModal({ type: 'none' })} /> : null}{modal.type === 'no-active' ? <NoActiveModal onClose={nuevoFormulario} /> : null}{modal.type === 'success' ? <SuccessModal patient={patient?.nombre ?? 'Paciente'} onClose={() => setModal({ type: 'none' })} /> : null}
  </ModuleLayout>
}

interface VitalFieldProps { label: string; unit: string; value: string; placeholder: string; readOnly?: boolean; onChange: (value: string) => void }
function VitalField({ label, unit, value, placeholder, readOnly, onChange }: VitalFieldProps) { return <label className="vital-field"><span>{label}</span><div><input value={value} placeholder={placeholder} readOnly={readOnly} onChange={(event) => onChange(event.target.value)} /><strong>{unit}</strong></div></label> }
function InvalidValuesModal({ onClose }: { onClose: () => void }) { return <div className="modal-backdrop"><section className="clinical-modal danger"><button className="modal-close" type="button" onClick={onClose}>×</button><div className="modal-icon danger-icon">!</div><h2>Valores fuera de rango</h2><p>Se encontraron valores fuera de los rangos normales.<br />Por favor, verifica la información antes de guardar.</p><div className="invalid-table"><div><strong>Signo vital</strong><strong>Valor capturado</strong><strong>Rango normal</strong><strong>Estado</strong></div>{invalidRows.map(([name, value, range, state]) => <div key={name}><span>{name}</span><strong>{value}</strong><span>{range}</span><em>{state}</em></div>)}</div><button type="button" className="outline-button modal-action" onClick={onClose}>Entendido</button></section></div> }
function NoActiveModal({ onClose }: { onClose: () => void }) { return <div className="modal-backdrop"><section className="clinical-modal no-active"><div className="folder-icon">!</div><h2>Sin consulta activa</h2><p>En este momento no tienes una <strong>consulta activa.</strong></p><p>Por favor, inicia una consulta para comenzar la atención.</p><button type="button" className="green-button big-button" onClick={onClose}>+ Nueva consulta</button></section></div> }
function SuccessModal({ patient, onClose }: { patient: string; onClose: () => void }) { return <div className="modal-backdrop"><section className="clinical-modal success"><button className="modal-close" type="button" onClick={onClose}>×</button><div className="modal-icon success-icon">✓</div><h2>Registro clínico exitoso</h2><p>Los signos vitales se han guardado correctamente.</p><div className="success-details"><span>Paciente:</span><strong>{patient}</strong><span>Fecha y hora:</span><strong>21/05/2026&nbsp;&nbsp;&nbsp;10:45 AM</strong><span>Registrado por:</span><strong>Enf. Ana Carranza Duque</strong><span>Consulta asociada:</span><strong>Control anual - Dr. Alejandro Vance</strong><span>ID Registro:</span><strong>SV-2026-000145</strong></div><button type="button" className="accept-button" onClick={onClose}>Aceptar</button></section></div> }

