import ReportesMenu from "../reportes/ReportesMenu";

const MainLayout = ({ children }: any) => {
  return (
    <div style={wrapper}>

      <ReportesMenu />

      <div style={main}>

        {/* HEADER */}
        <div style={header}>

          <div style={headerTop}>
            <h2 style={title}>REPORTES</h2>

            <div style={icons}>
              🔔 📅 ☰
            </div>
          </div>

          <div style={date}>
            Lunes 13 de abril, 2026
          </div>

          <div style={breadcrumb}>
            Inicio &gt; Reportes &gt; Reporte clínico
          </div>
        </div>

        {/* ✅ CONTENIDO CENTRADO */}
        <div style={content}>
          <div style={wrapperContent}>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ESTILOS */

const wrapper = {
  display: "flex",
  height: "100vh",
  width: "100%"
};

const main = {
  flex: 1,
  display: "flex",
  flexDirection: "column"
};

const header = {
  background: "#fff",
  padding: "25px 40px",
  borderBottom: "1px solid #E5E7EB"
};

const headerTop = {
  display: "flex",
  justifyContent: "space-between"
};

const title = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 600,
  letterSpacing: "0.5px"
};

const icons = {
  display: "flex",
  gap: "16px",
  fontSize: "18px"
};

const date = {
  fontSize: "13px",
  color: "#6B7280",
  marginTop: "6px"
};

const breadcrumb = {
  fontSize: "13px",
  color: "#6B7280",
  marginTop: "10px",
  display: "flex",
  gap: "6px",
  alignItems: "center"
};

const content = {
  flex: 1,
  padding: "30px",
  background: "#EEF2F5",
  display: "flex",
  justifyContent: "center"
};

/* ✅ CLAVE DEL CENTRADO */
const wrapperContent = {
  width: "100%",
  maxWidth: "1200px"
};

export default MainLayout;
