import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReportesIndexPage from "./pages/reportes/ReportesIndexPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/reportes" />} />
        <Route path="/reportes" element={<ReportesIndexPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
