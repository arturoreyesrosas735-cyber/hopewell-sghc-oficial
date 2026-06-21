import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DoctorDetalle from './pages/Doctores/DoctorDetalle';
import DoctorForm from './pages/Doctores/DoctorForm';
import DoctoresList from './pages/Doctores/DoctoresList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/doctores" replace />} />
        <Route path="/doctores" element={<DoctoresList />} />
        <Route path="/doctores/nuevo" element={<DoctorForm />} />
        <Route path="/doctores/:id" element={<DoctorDetalle />} />
        <Route path="/doctores/:id/editar" element={<DoctorForm />} />
      </Routes>
    </Router>
  );
}

export default App;
