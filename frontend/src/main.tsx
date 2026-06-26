import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ConsultasMedicasPage } from './pages/Consultas/ConsultasMedicasPage'
import { SignosVitalesPage } from './pages/Consultas/SignosVitalesPage'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/consultas-medicas" element={<ConsultasMedicasPage />} />
        <Route path="/signos-vitales" element={<SignosVitalesPage />} />
        <Route path="/signos-vitales/paciente" element={<SignosVitalesPage />} />
        <Route path="*" element={<Navigate to="/consultas-medicas" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
