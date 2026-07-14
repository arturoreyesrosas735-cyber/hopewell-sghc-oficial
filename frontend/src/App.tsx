import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { DiagnosticosPage } from './pages/Diagnosticos/DiagnosticosPage';
import AbrirExpedientePage from './pages/ExpedienteClinico/AbrirExpedientePage';
import AdjuntarDocumentoPage from './pages/ExpedienteClinico/AdjuntarDocumentoPage';
import DocumentosListPage from './pages/ExpedienteClinico/DocumentosListPage';
import ExpedienteDetailPage from './pages/ExpedienteClinico/ExpedienteDetailPage';
import ExpedienteHomePage from './pages/ExpedienteClinico/ExpedienteHomePage';
import HistorialClinicoPage from './pages/ExpedienteClinico/HistorialClinicoPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/expedientes" replace />} />
        <Route path="/expedientes" element={<ExpedienteHomePage />} />
        <Route path="/expedientes/nuevo" element={<AbrirExpedientePage />} />
        <Route path="/expedientes/:id" element={<ExpedienteDetailPage />} />
        <Route path="/expedientes/:id/historial" element={<HistorialClinicoPage />} />
        <Route path="/expedientes/:id/documentos" element={<DocumentosListPage />} />
        <Route path="/expedientes/:id/documentos/nuevo" element={<AdjuntarDocumentoPage />} />
        <Route path="/diagnosticos" element={<DiagnosticosPage />} />
        <Route path="*" element={<Navigate to="/expedientes" replace />} />
      </Routes>
    </Router>
  );
}
