import MainLayout from "../../components/layout/MainLayout";
import { useNavigate } from "react-router-dom";

const ReportesIndexPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={container}>
        {/* HEADER */}
        <div style={header}>
          <div>
            <h1 style={pageTitle}>📊 Reportes Clínicos</h1>
            <p style={pageSubtitle}>
              Gestión, visualización y exportación de reportes médicos
            </p>
          </div>

          <div style={badge}>
            M12
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div style={grid}>
          {/* MODULO REPORTES */}
          <div style={card}>
            <h2 style={title}>Generar Reportes</h2>

            <p style={subtitle}>
              Selecciona el reporte que deseas consultar.
            </p>

            <div style={menuContainer}>
              <button
                style={btnPrimary}
                onClick={() =>
                  navigate("/reportes/resumen-clinico")
                }
              >
                📄 Resumen Clínico
              </button>

              <button
                style={btnPrimary}
                onClick={() =>
                  navigate("/reportes/historial-consultas")
                }
              >
                📑 Historial de Consultas
              </button>

              <button
                style={btnPrimary}
                onClick={() =>
                  navigate("/reportes/por-medico")
                }
              >
                👨‍⚕️ Reporte por Médico
              </button>

              <button
                style={btnPrimary}
                onClick={() =>
                  navigate("/reportes/por-sede")
                }
              >
                🏥 Reporte por Sede
              </button>

              <button
                style={btnPrimary}
                onClick={() =>
                  navigate("/reportes/por-periodo")
                }
              >
                📅 Reporte por Período
              </button>
            </div>
          </div>

          {/* VISUALIZACION */}
          <div style={card}>
            <h2 style={title}>
              Visualización de Reportes
            </h2>

            <div style={chart}>
              <div style={chartCenter}>
                <span style={chartCenterTitle}>
                  SGHC
                </span>

                <span style={chartCenterText}>
                  M12
                </span>
              </div>
            </div>

            <p style={chartText}>
              Sistema de Gestión de Historial Clínico
            </p>

            <div style={actions}>
              <button style={actionBtn}>
                👁 Visualizar
              </button>

              <button style={actionBtn}>
                📥 Exportar
              </button>

              <button style={actionBtn}>
                🖨 Imprimir
              </button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={statsGrid}>
          <div style={statCard}>
            <div style={statIcon}>👨</div>

            <h2 style={statNumber}>256</h2>

            <p style={statText}>Pacientes</p>
          </div>

          <div style={statCard}>
            <div style={statIcon}>🩺</div>

            <h2 style={statNumber}>112</h2>

            <p style={statText}>Consultas</p>
          </div>

          <div style={statCard}>
            <div style={statIcon}>👨‍⚕️</div>

            <h2 style={statNumber}>37</h2>

            <p style={statText}>Médicos</p>
          </div>

          <div style={statCard}>
            <div style={statIcon}>📄</div>

            <h2 style={statNumber}>5</h2>

            <p style={statText}>Tipos de Reporte</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

/* =========================== */
/* ESTILOS */
/* =========================== */

const container = {
  padding: "24px",
  background: "#F5F7FA",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const pageTitle = {
  fontSize: "36px",
  fontWeight: 700,
  color: "#1E293B",
  marginBottom: "5px",
};

const pageSubtitle = {
  color: "#64748B",
  fontSize: "15px",
};

const badge = {
  background:
    "linear-gradient(135deg,#6FBF73,#4CAF50)",
  color: "#fff",
  padding: "10px 22px",
  borderRadius: "30px",
  fontWeight: 700,
  fontSize: "18px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1.8fr",
  gap: "24px",
};

const card = {
  background: "#FFFFFF",
  borderRadius: "24px",
  padding: "32px",
  border: "1px solid #E5E7EB",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const title = {
  fontSize: "28px",
  fontWeight: 700,
  marginBottom: "10px",
};

const subtitle = {
  color: "#6FBF73",
  marginBottom: "24px",
  fontSize: "15px",
};

const menuContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "14px",
};

const btnPrimary = {
  background:
    "linear-gradient(135deg,#6FBF73,#4CAF50)",
  color: "#fff",
  border: "none",
  borderRadius: "18px",
  padding: "18px",
  fontWeight: 600,
  fontSize: "16px",
  cursor: "pointer",
  boxShadow:
    "0 8px 20px rgba(111,191,115,.25)",
};

const chart = {
  width: "280px",
  height: "280px",
  borderRadius: "50%",
  background:
    "conic-gradient(#6FBF73 0 75%, #D9F0DB 75% 100%)",
  margin: "20px auto",
  position: "relative" as const,
  boxShadow:
    "0 15px 35px rgba(111,191,115,.25)",
};

const chartCenter = {
  position: "absolute" as const,
  width: "130px",
  height: "130px",
  background: "#fff",
  borderRadius: "50%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column" as const,
};

const chartCenterTitle = {
  fontWeight: 700,
  fontSize: "22px",
};

const chartCenterText = {
  color: "#6FBF73",
  fontWeight: 700,
  fontSize: "18px",
};

const chartText = {
  textAlign: "center" as const,
  fontSize: "18px",
  fontWeight: 500,
  color: "#334155",
};

const actions = {
  display: "flex",
  gap: "14px",
  marginTop: "24px",
};

const actionBtn = {
  flex: 1,
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "15px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginTop: "30px",
};

const statCard = {
  background: "#FFFFFF",
  borderRadius: "24px",
  padding: "24px",
  textAlign: "center" as const,
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const statIcon = {
  fontSize: "36px",
};

const statNumber = {
  margin: "12px 0 5px 0",
  fontSize: "32px",
  color: "#16A34A",
};

const statText = {
  color: "#64748B",
};

export default ReportesIndexPage;