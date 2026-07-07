import type { CSSProperties, ReactNode } from "react";
import ReportesMenu from "../reportes/ReportesMenu";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div style={wrapper}>
      <ReportesMenu />

      <div style={main}>
        <div style={header}>
          <div style={headerTop}>
            <h2 style={title}>REPORTES</h2>
            <div style={icons}>! [] =</div>
          </div>

          <div style={date}>Lunes 13 de abril, 2026</div>
          <div style={breadcrumb}>Inicio &gt; Reportes &gt; Reporte clinico</div>
        </div>

        <div style={content}>
          <div style={wrapperContent}>{children}</div>
        </div>
      </div>
    </div>
  );
};

const wrapper: CSSProperties = {
  display: "flex",
  height: "100vh",
  width: "100%",
};

const main: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

const header: CSSProperties = {
  background: "#fff",
  padding: "25px 40px",
  borderBottom: "1px solid #E5E7EB",
};

const headerTop: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const title: CSSProperties = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 600,
  letterSpacing: "0.5px",
};

const icons: CSSProperties = {
  display: "flex",
  gap: "16px",
  fontSize: "18px",
};

const date: CSSProperties = {
  fontSize: "13px",
  color: "#6B7280",
  marginTop: "6px",
};

const breadcrumb: CSSProperties = {
  fontSize: "13px",
  color: "#6B7280",
  marginTop: "10px",
  display: "flex",
  gap: "6px",
  alignItems: "center",
};

const content: CSSProperties = {
  flex: 1,
  padding: "30px",
  background: "#EEF2F5",
  display: "flex",
  justifyContent: "center",
};

const wrapperContent: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
};

export default MainLayout;
