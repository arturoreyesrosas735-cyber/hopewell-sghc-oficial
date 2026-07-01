import MainLayout from "../../components/layout/MainLayout";

const ReportesIndexPage = () => {
  return (
    <MainLayout>

      <div style={grid}>

        {/* IZQUIERDA */}
        <div style={card}>
          <h3 style={title}>GENERAR REPORTE CLÍNICO</h3>
          <span style={sub}>PACIENTES</span>

          <input placeholder="Buscar paciente..." style={input} />

          {[
            ["Ana López", "26", "F", "Consulta médica"],
            ["Luis García", "36", "M", "Signos"],
            ["Dr. Alonso Ruiz", "45", "M", "Consulta médica"]
          ].map((p, i) => (
            <div key={i} style={row}>
              <input type="radio" defaultChecked={i === 0} />
              <span>{p[0]}</span>
              <span>{p[1]}</span>
              <span>{p[2]}</span>
              <span>{p[3]}</span>
              <button style={btnMini}>Ver / Editar</button>
            </div>
          ))}

          <button style={btnPrimary}>
            GENERAR REPORTE CLÍNICO
          </button>
        </div>

        {/* DERECHA */}
        <div style={right}>

          <div style={card}>
            <h3 style={title}>VISUALIZACIÓN DE REPORTES</h3>

            <div style={chart}>
              <div style={center}>256</div>
            </div>

          </div>

          <div style={cardRow}>
            <div style={action}>Visualizar</div>
            <div style={action}>Exportar</div>
            <div style={action}>Imprimir</div>
          </div>

        </div>

      </div>

      {/* HISTORIAL */}
      <div style={card}>
        <h3 style={title}>HISTORIAL DE CONSULTA</h3>

        <div style={tableHeader}>
          <span>Acción</span>
          <span>Fecha</span>
          <span>Usuario</span>
          <span>Detalle</span>
        </div>

        <div style={tableRow}>
          <span>Baja usuario</span>
          <span>14-04</span>
          <span>Admin</span>
          <span>Dado de baja</span>
        </div>

        <div style={tableRow}>
          <span>Edición</span>
          <span>13-04</span>
          <span>Admin</span>
          <span>Editado</span>
        </div>
      </div>

    </MainLayout>
  );
};

/* ---------- ESTILOS ---------- */

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "24px",
  marginBottom: "20px"
};

const right = {
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const card = {
  background: "#fff",
  padding: "28px",
  borderRadius: "18px",
  border: "1px solid #E6E9ED",
  boxShadow: "0 8px 18px rgba(0,0,0,0.05)"
};

const title = {
  fontWeight: 600,
  fontSize: "18px",
  marginBottom: "10px"
};

const sub = {
  fontSize: "13px",
  color: "#6FBF73",
  fontWeight: 500
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  margin: "12px 0"
};

const row = {
  display: "grid",
  gridTemplateColumns: "30px 1fr 80px 40px 1fr 140px",
  padding: "12px",
  fontSize: "14px",
  borderBottom: "1px solid #eee",
  alignItems: "center"
};

const btnMini = {
  background: "#E6F4EA",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px"
};

const btnPrimary = {
  marginTop: "18px",
  background: "#6FBF73",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  width: "100%",
  fontWeight: 600
};

const chart = {
  width: "160px",
  height: "160px",
  borderRadius: "50%",
  background: "conic-gradient(#6FBF73 40%, #ddd 60%)",
  margin: "20px auto",
  position: "relative"
};

const center = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  fontSize: "16px"
};

const cardRow = {
  display: "flex",
  gap: "12px"
};

const action = {
  flex: 1,
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  textAlign: "center"
};

const tableHeader = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 2fr",
  fontWeight: 600,
  fontSize: "14px",
  marginTop: "10px"
};

const tableRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 2fr",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
  fontSize: "14px"
};

export default ReportesIndexPage;