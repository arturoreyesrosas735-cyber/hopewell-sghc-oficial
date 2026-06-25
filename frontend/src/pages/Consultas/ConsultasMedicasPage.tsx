import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConsultasTable } from '../../components/ConsultasTable'
import { ModuleLayout } from '../../components/ModuleLayout'
import { pacientes, readStoredConsultas, signosPorPaciente, writeStoredConsultas } from '../../data/consultas'
import type { ConsultaGestion, PacienteConsulta, SignosVitalesForm } from '../../types/consultas'
import './ConsultasMedicas.css'

type SearchMode = 'all' | 'found' | 'empty'
type ViewMode = 'gestion' | 'nueva'

const emptyVitals: SignosVitalesForm = {
  temperatura: '', presion: '', frecuenciaCardiaca: '', frecuenciaRespiratoria: '', saturacionOxigeno: '', peso: '', talla: '',
}

export function ConsultasMedicasPage() {
  const navigate = useNavigate()
  const [consultasGuardadas, setConsultasGuardadas] = useState<ConsultaGestion[]>(() => readStoredConsultas())
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState<SearchMode>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('gestion')
  const [selectedConsulta, setSelectedConsulta] = useState<ConsultaGestion | null>(null)
  const [editingConsulta, setEditingConsulta] = useState<ConsultaGestion | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PacienteConsulta | null>(null)
  const [exportedVitals, setExportedVitals] = useState<SignosVitalesForm>(emptyVitals)
  const [newConsulta, setNewConsulta] = useState({ fecha: '13/04/2026', hora: '11:00 AM', motivo: '', tipoConsulta: 'Revisión', modalidad: 'Presencial', tratamiento: 'Paracetamol 500 mg cada 8 hrs' })
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => {
    if (mode === 'empty') return []
    if (mode === 'found') return consultasGuardadas.filter((consulta) => consulta.pacienteId === '0005')
    return consultasGuardadas.slice(0, 8)
  }, [consultasGuardadas, mode])

  const completed = consultasGuardadas.filter((consulta) => consulta.estado === 'COMPLETADA').length
  const pending = consultasGuardadas.filter((consulta) => consulta.estado === 'PENDIENTE').length
  const canceled = consultasGuardadas.filter((consulta) => consulta.estado === 'CANCELADA').length

  function handleSearch() {
    const value = search.trim().toUpperCase()
    if (!value) { setMode('all'); return }
    if (value === 'GAAA050131MDFRGP05' || value === '0005' || value.includes('ANA')) { setMode('found'); return }
    setMode('empty')
  }

  function findPatient() {
    const value = patientSearch.trim().toUpperCase().padStart(4, '0')
    const patient = pacientes.find((item) => item.id === value || item.curp === patientSearch.trim().toUpperCase() || item.nombre.toUpperCase().includes(patientSearch.trim().toUpperCase()))
    if (!patient) {
      setSelectedPatient(null)
      setExportedVitals(emptyVitals)
      setNotice('No se encontró paciente. Prueba con 0001, 0005 o GAAA050131MDFRGP05.')
      return
    }
    setSelectedPatient(patient)
    setExportedVitals(signosPorPaciente[patient.id] ?? emptyVitals)
    setNotice('Signos vitales exportados correctamente desde el registro previo del paciente.')
  }

  function saveNewConsulta() {
    if (!selectedPatient || !newConsulta.motivo.trim()) {
      setNotice('Busca un paciente y escribe el motivo de la consulta antes de guardar.')
      return
    }

    const item: ConsultaGestion = {
      id: `CONS-${selectedPatient.id}-${Date.now().toString().slice(-4)}`,
      fecha: newConsulta.fecha,
      hora: newConsulta.hora,
      paciente: selectedPatient.nombre,
      pacienteId: selectedPatient.id,
      curp: selectedPatient.curp,
      medico: 'Dr. Alexis Gonzalez Merced',
      especialidad: 'Médico General',
      motivo: newConsulta.motivo,
      estado: 'PENDIENTE',
      tipoConsulta: newConsulta.tipoConsulta,
      modalidad: newConsulta.modalidad,
      tratamiento: newConsulta.tratamiento,
    }
    const next = [item, ...consultasGuardadas]
    setConsultasGuardadas(next)
    writeStoredConsultas(next)
    setViewMode('gestion')
    setMode('all')
    setNotice('Consulta médica guardada y exportada a Gestión de Consultas Médicas.')
  }

  function saveEdit() {
    if (!editingConsulta) return
    const next = consultasGuardadas.map((consulta) => consulta.id === editingConsulta.id ? editingConsulta : consulta)
    setConsultasGuardadas(next)
    writeStoredConsultas(next)
    setEditingConsulta(null)
    setNotice('Consulta médica actualizada correctamente.')
  }

  return (
    <ModuleLayout active="consultas" crumb={viewMode === 'nueva' ? 'NUEVA CONSULTA' : ''}>
      {viewMode === 'nueva' ? (
        <NewConsultaView
          patientSearch={patientSearch}
          setPatientSearch={setPatientSearch}
          findPatient={findPatient}
          selectedPatient={selectedPatient}
          exportedVitals={exportedVitals}
          newConsulta={newConsulta}
          setNewConsulta={setNewConsulta}
          notice={notice}
          onCancel={() => setViewMode('gestion')}
          onSave={saveNewConsulta}
        />
      ) : (
        <>
          <section className="page-heading">
            <div><h1>GESTIÓN DE CONSULTAS MÉDICAS</h1><p>Administración y consulta de consultas médicas registradas.</p></div>
            <div className="heading-buttons">
              <button type="button" className="green-button" onClick={() => { setViewMode('nueva'); setNotice('') }}>Nueva consulta</button>
              <button type="button" className="outline-button">Exportar</button>
            </div>
          </section>

          <section className="filters-card">
            <label className="search-label">⌕ Búsqueda rápida</label>
            <div className="main-search">
              <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') handleSearch() }} placeholder="BUSCAR POR NOMBRE, CURP, ID PACIENTE O NSS" />
              <button type="button" onClick={handleSearch}>⌕</button>
            </div>
            <div className="filter-grid"><label>Fecha desde:<input type="text" value="01/05/2026" readOnly /></label><label>Fecha hasta:<input type="text" value="21/05/2026" readOnly /></label><label>Médico tratante :<select defaultValue="Todos"><option>Todos</option></select></label><label>Tipo de consulta:<select defaultValue="Todos"><option>Todos</option></select></label><label>Estado:<select defaultValue="Todos"><option>Todos</option></select></label></div>
          </section>

          {notice ? <p className="success-notice">{notice}</p> : null}

          {mode === 'empty' ? <EmptySearch onReset={() => { setSearch(''); setMode('all') }} /> : <>
            {mode === 'found' ? <section className="result-heading"><h2>Resultados para: “ANA De la Torre”.</h2><p>Se encontraron {filtered.length} consultas.</p></section> : null}
            <section className="stats-row"><article><span className="stat-icon">▤</span><div><strong>{consultasGuardadas.length}</strong><small>Consultas Totales</small></div></article><article><strong>{completed}</strong><small>Completadas</small></article><article><span className="stat-icon">▧</span><strong>{pending}</strong><small>Pendientes</small></article><article><span className="stat-icon">▤</span><strong>{canceled}</strong><small>Canceladas</small></article></section>
            <ConsultasTable consultas={filtered} compact={mode === 'found'} canEdit onOpenSigns={(consulta) => navigate(`/signos-vitales?paciente=${consulta.pacienteId}`)} onView={setSelectedConsulta} onEdit={setEditingConsulta} />
            {mode === 'all' ? <section className="summary-box"><h2>RESUMEN DE CONSULTAS</h2><div><span>Total de consultas:</span><strong>{consultasGuardadas.length}</strong></div><div><span>Consultas completadas:</span><strong>{completed}</strong></div><div><span>Pendientes:</span><strong>{pending}</strong></div><div><span>Consultas canceladas:</span><strong>{canceled}</strong></div><div><span>Hoy:</span><strong>7</strong></div></section> : null}
          </>}
        </>
      )}

      {selectedConsulta ? <ConsultaModal title="Ver consulta médica" consulta={selectedConsulta} readOnly onClose={() => setSelectedConsulta(null)} /> : null}
      {editingConsulta ? <ConsultaModal title="Editar consulta médica" consulta={editingConsulta} onChange={setEditingConsulta} onClose={() => setEditingConsulta(null)} onSave={saveEdit} /> : null}
    </ModuleLayout>
  )
}

interface NewConsultaProps {
  patientSearch: string
  setPatientSearch: (value: string) => void
  findPatient: () => void
  selectedPatient: PacienteConsulta | null
  exportedVitals: SignosVitalesForm
  newConsulta: { fecha: string; hora: string; motivo: string; tipoConsulta: string; modalidad: string; tratamiento: string }
  setNewConsulta: (value: { fecha: string; hora: string; motivo: string; tipoConsulta: string; modalidad: string; tratamiento: string }) => void
  notice: string
  onCancel: () => void
  onSave: () => void
}

function NewConsultaView({ patientSearch, setPatientSearch, findPatient, selectedPatient, exportedVitals, newConsulta, setNewConsulta, notice, onCancel, onSave }: NewConsultaProps) {
  const imc = exportedVitals.peso && exportedVitals.talla ? (Number(exportedVitals.peso) / (Number(exportedVitals.talla) / 100) ** 2).toFixed(1) : ''
  return <>
    <section className="page-heading"><div><h1>CONSULTA MÉDICA</h1><p>Consulta médica del paciente seleccionado.</p></div><div className="heading-buttons"><button className="outline-button" type="button" onClick={onCancel}>Volver</button><button className="green-button" type="button" onClick={onSave}>Guardar consulta médica</button></div></section>
    <section className="filters-card"><label className="search-label">⌕ Búsqueda rápida del paciente.</label><div className="main-search"><input value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') findPatient() }} placeholder="BUSCAR POR NOMBRE, CURP, ID PACIENTE, NSS, EXPEDIENTE." /><button type="button" onClick={findPatient}>⌕</button></div>{notice ? <p className="success-notice">{notice}</p> : null}</section>
    {selectedPatient ? <>
      <h2 className="consult-result-title">Resultados para: “{selectedPatient.nombre.split(' ')[0]} {selectedPatient.nombre.split(' ')[1]}”</h2>
      <section className="patient-detail-card"><div className="big-avatar">👩</div><div className="patient-info"><h3>NOMBRE: {selectedPatient.nombre.toUpperCase()} <em>PACIENTE ACTIVO</em></h3><div className="patient-columns"><span>ID PACIENTE:<strong>{selectedPatient.id}</strong></span><span>TELÉFONO:<strong>{selectedPatient.telefono}</strong></span><span>CURP:<strong>{selectedPatient.curp}</strong></span><span>CORREO:<strong>{selectedPatient.correo}</strong></span><span>FECHA DE NACIMIENTO:<strong>{selectedPatient.nacimiento} ({selectedPatient.edad})</strong></span><span>OCUPACIÓN:<strong>{selectedPatient.ocupacion}</strong></span><span>SEXO:<strong>{selectedPatient.sexo}</strong></span><span>CONTACTO DE EMERGENCIA:<strong>{selectedPatient.emergencia}</strong></span><span>TIPO SANGUÍNEO:<strong>{selectedPatient.tipoSanguineo}</strong></span></div></div></section>
      <section className="consult-grid"><article className="consult-form"><h2>DATOS DE LA CONSULTA</h2><div className="new-consult-fields"><label>Fecha de consulta<input value={newConsulta.fecha} onChange={(e) => setNewConsulta({ ...newConsulta, fecha: e.target.value })} /></label><label>Hora de consulta<input value={newConsulta.hora} onChange={(e) => setNewConsulta({ ...newConsulta, hora: e.target.value })} /></label><label>Tipo de consulta<input value={newConsulta.tipoConsulta} onChange={(e) => setNewConsulta({ ...newConsulta, tipoConsulta: e.target.value })} /></label><label>Modalidad<input value={newConsulta.modalidad} onChange={(e) => setNewConsulta({ ...newConsulta, modalidad: e.target.value })} /></label></div><label className="full-field">Motivo de la consulta<textarea value={newConsulta.motivo} onChange={(e) => setNewConsulta({ ...newConsulta, motivo: e.target.value })} placeholder="Escribe el motivo de la consulta médica" /></label></article><aside className="alerts-box"><h2>ALERTAS MÉDICAS</h2>{selectedPatient.alertas.map((alert) => <p key={alert}>{alert}</p>)}</aside></section>
      <section className="exported-vitals"><h2>SIGNOS VITALES. <span>Exportados correctamente</span></h2><div className="vital-mini-grid"><MiniVital label="TEMPERATURA" value={exportedVitals.temperatura} unit="°C" /><MiniVital label="PRESIÓN ARTERIAL" value={exportedVitals.presion} unit="mmHg" /><MiniVital label="FRECUENCIA CARDÍACA" value={exportedVitals.frecuenciaCardiaca} unit="lpm" /><MiniVital label="FRECUENCIA RESPIRATORIA" value={exportedVitals.frecuenciaRespiratoria} unit="rpm" /><MiniVital label="SATURACIÓN DE OXÍGENO" value={exportedVitals.saturacionOxigeno} unit="%" /><MiniVital label="PESO" value={exportedVitals.peso} unit="kg" /><MiniVital label="TALLA" value={exportedVitals.talla} unit="m" /><MiniVital label="IMC" value={imc} unit="kg/m²" /></div></section>
      <section className="treatment-card"><h2>TRATAMIENTO Y RECETA</h2><textarea value={newConsulta.tratamiento} onChange={(e) => setNewConsulta({ ...newConsulta, tratamiento: e.target.value })} /></section>
    </> : null}
  </>
}

function MiniVital({ label, value, unit }: { label: string; value: string; unit: string }) { return <article className="mini-vital"><strong>{label}</strong><span>{value}</span><small>{unit}</small></article> }
function EmptySearch({ onReset }: { onReset: () => void }) { return <section className="empty-card"><div className="empty-illustration">⌕</div><h2>No se encontraron resultados</h2><p>Intenta con otros criterios de búsqueda.</p><button type="button" className="green-button" onClick={onReset}>Nueva búsqueda</button></section> }
function ConsultaModal({ title, consulta, readOnly, onChange, onClose, onSave }: { title: string; consulta: ConsultaGestion; readOnly?: boolean; onChange?: (consulta: ConsultaGestion) => void; onClose: () => void; onSave?: () => void }) { return <div className="modal-backdrop"><section className="consulta-modal"><button className="modal-close" onClick={onClose}>×</button><h2>{title}</h2><label>Paciente<input value={consulta.paciente} readOnly /></label><label>Motivo<textarea value={consulta.motivo} readOnly={readOnly} onChange={(e) => onChange?.({ ...consulta, motivo: e.target.value })} /></label><label>Estado<select value={consulta.estado} disabled={readOnly} onChange={(e) => onChange?.({ ...consulta, estado: e.target.value as ConsultaGestion['estado'] })}><option>COMPLETADA</option><option>PENDIENTE</option><option>CANCELADA</option></select></label>{!readOnly ? <button className="green-button" onClick={onSave}>Guardar cambios</button> : null}</section></div> }


