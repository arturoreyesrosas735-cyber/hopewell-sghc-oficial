import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ReportesIndexPage from "./pages/reportes/ReportesIndexPage";
import ResumenClinicoPage from "./pages/reportes/ResumenClinicoPage";
import HistorialConsultasPage from "./pages/reportes/HistorialConsultasPage";
import ReporteMedicoPage from "./pages/reportes/ReporteMedicoPage";
import ReporteSedePage from "./pages/reportes/ReporteSedePage";
import ReportePeriodoPage from "./pages/reportes/ReportePeriodoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/reportes" />}
        />

        <Route
          path="/reportes"
          element={<ReportesIndexPage />}
        />

        <Route
          path="/reportes/resumen-clinico"
          element={<ResumenClinicoPage />}
        />

        <Route
          path="/reportes/historial-consultas"
          element={<HistorialConsultasPage />}
        />

        <Route
          path="/reportes/por-medico"
          element={<ReporteMedicoPage />}
        />

        <Route
          path="/reportes/por-sede"
          element={<ReporteSedePage />}
        />

        <Route
          path="/reportes/por-periodo"
          element={<ReportePeriodoPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;