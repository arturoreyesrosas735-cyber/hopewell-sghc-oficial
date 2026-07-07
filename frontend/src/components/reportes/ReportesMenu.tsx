import type { CSSProperties } from "react";
import logo from "../../assets/logo.svg";

const menuItems = [
  { icon: "U", label: "Usuarios y acceso" },
  { icon: "D", label: "Doctores" },
  { icon: "H", label: "Hospitales y clinicas" },
  { icon: "C", label: "Consultorios" },
  { icon: "R", label: "Reportes" },
  { icon: "A", label: "Auditorias" },
];

const ReportesMenu = () => {
  return (
    <div style={container}>
      <div style={logoBox}>
        <img src={logo} style={logoImg} alt="Hopewell" />
      </div>

      <div style={menu}>
        {menuItems.map((item) => {
          const isActive = item.label === "Reportes";

          return (
            <div
              key={item.label}
              style={{
                ...itemStyle,
                ...(isActive ? active : {}),
              }}
              onMouseEnter={(event) => {
                if (!isActive) event.currentTarget.style.background = "#F3F4F6";
              }}
              onMouseLeave={(event) => {
                if (!isActive) event.currentTarget.style.background = "transparent";
              }}
            >
              <span style={icon}>{item.icon}</span>
              <span style={text}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div style={footer}>
        <strong>Administrador</strong>
        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
          admin@hopewell.com
        </div>
      </div>
    </div>
  );
};

const container: CSSProperties = {
  width: "250px",
  background: "#F7F9FB",
  padding: "20px",
  borderRight: "1px solid #E5E7EB",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const logoBox: CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: "35px",
  paddingLeft: "8px",
};

const logoImg: CSSProperties = {
  width: "210px",
  maxWidth: "100%",
  objectFit: "contain",
};

const menu: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const itemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontSize: "14px",
  color: "#374151",
};

const icon: CSSProperties = {
  fontSize: "18px",
  width: "24px",
  textAlign: "center",
};

const text: CSSProperties = {
  fontWeight: 500,
};

const active: CSSProperties = {
  background: "#E6F4EA",
  color: "#2F855A",
  fontWeight: 600,
  border: "1px solid #6FBF73",
};

const footer: CSSProperties = {
  borderTop: "1px solid #E5E7EB",
  paddingTop: "10px",
};

export default ReportesMenu;
