import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DoctorDetalle from './pages/Doctores/DoctorDetalle';
import DoctorForm from './pages/Doctores/DoctorForm';
import DoctoresList from './pages/Doctores/DoctoresList';
import RecetaDetailPage from './pages/TratamientosRecetas/RecetaDetailPage';
import RecetaFormPage from './pages/TratamientosRecetas/RecetaFormPage';
import RecetaListPage from './pages/TratamientosRecetas/RecetaListPage';
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
        <Route path="/tratamientos/nuevo" element={<TratamientoFormPage />} />
        <Route path="/pacientes/:id/tratamientos" element={<TratamientoListPage />} />
        <Route path="/tratamientos/:id" element={<TratamientoDetailPage />} />
        <Route path="/tratamientos/:id/recetas/nueva" element={<RecetaFormPage />} />
        <Route path="/pacientes/:id/recetas" element={<RecetaListPage />} />
        <Route path="/recetas/:id" element={<RecetaDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
