import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DoctorDetalle from './pages/Doctores/DoctorDetalle';
import DoctorForm from './pages/Doctores/DoctorForm';
import DoctoresList from './pages/Doctores/DoctoresList';
import RecetaDetailPage from './pages/TratamientosRecetas/RecetaDetailPage';
import RecetaFormPage from './pages/TratamientosRecetas/RecetaFormPage';
import RecetaListPage from './pages/TratamientosRecetas/RecetaListPage';
import CatalogoEditablePage from './pages/TratamientosRecetas/CatalogoEditablePage';
import RecursoListPage from './pages/TratamientosRecetas/RecursoListPage';
import HistorialConsultasPage from './pages/reportes/HistorialConsultasPage';
import AuditoriaListPage from './pages/Auditoria/AuditoriaListPage';
import ReporteMedicoPage from './pages/reportes/ReporteMedicoPage';
import ReportePeriodoPage from './pages/reportes/ReportePeriodoPage';
import ReporteSedePage from './pages/reportes/ReporteSedePage';
import ReportesIndexPage from './pages/reportes/ReportesIndexPage';
import ResumenClinicoPage from './pages/reportes/ResumenClinicoPage';
import TratamientoDetailPage from './pages/TratamientosRecetas/TratamientoDetailPage';
import TratamientoFormPage from './pages/TratamientosRecetas/TratamientoFormPage';
import TratamientoListPage from './pages/TratamientosRecetas/TratamientoListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tratamientos-recetas" replace />} />
        <Route path="/doctores" element={<DoctoresList />} />
        <Route path="/doctores/nuevo" element={<DoctorForm />} />
        <Route path="/doctores/:id" element={<DoctorDetalle />} />
        <Route path="/doctores/:id/editar" element={<DoctorForm />} />
        <Route path="/tratamientos-recetas" element={<TratamientoListPage />} />
        <Route path="/pacientes" element={<RecursoListPage recurso="pacientes" title="Pacientes" />} />
        <Route path="/expedientes" element={<RecursoListPage recurso="expedientes" title="Expedientes clinicos" />} />
        <Route path="/consultas" element={<RecursoListPage recurso="consultas" title="Consultas medicas" />} />
        <Route path="/diagnosticos" element={<RecursoListPage recurso="diagnosticos" title="Diagnosticos" />} />
        <Route path="/padecimientos" element={<RecursoListPage recurso="padecimientos" title="Padecimientos" />} />
        <Route path="/medicamentos" element={<CatalogoEditablePage recurso="medicamentos" title="Medicamentos" />} />
        <Route path="/enfermedades" element={<CatalogoEditablePage recurso="enfermedades" title="Enfermedades" />} />
        <Route path="/tratamientos" element={<TratamientoListPage />} />
        <Route path="/tratamientos/nuevo" element={<TratamientoFormPage />} />
        <Route path="/pacientes/:id/tratamientos" element={<TratamientoListPage />} />
        <Route path="/tratamientos/:id" element={<TratamientoDetailPage />} />
        <Route path="/tratamientos/:id/recetas/nueva" element={<RecetaFormPage />} />
        <Route path="/recetas" element={<RecetaListPage />} />
        <Route path="/recetas/nueva" element={<RecetaFormPage />} />
        <Route path="/pacientes/:id/recetas" element={<RecetaListPage />} />
        <Route path="/recetas/:id" element={<RecetaDetailPage />} />
        <Route path="/reportes" element={<ReportesIndexPage />} />
        <Route path="/reportes/resumen-clinico" element={<ResumenClinicoPage />} />
        <Route path="/reportes/historial-consultas" element={<HistorialConsultasPage />} />
        <Route path="/reportes/por-medico" element={<ReporteMedicoPage />} />
        <Route path="/reportes/por-sede" element={<ReporteSedePage />} />
        <Route path="/reportes/por-periodo" element={<ReportePeriodoPage />} />
        <Route path="/auditoria" element={<AuditoriaListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
