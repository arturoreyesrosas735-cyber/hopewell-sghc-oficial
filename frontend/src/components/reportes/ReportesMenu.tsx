import logo from "../../assets/logo.svg";

const menuItems = [
  { icon: "👤", label: "Usuarios y acceso" },
  { icon: "🩺", label: "Doctores" },
  { icon: "🏥", label: "Hospitales y clínicas" },
  { icon: "📍", label: "Consultorios" },
  { icon: "📊", label: "Reportes" },
  { icon: "🔍", label: "Auditorías" }
];

const ReportesMenu = () => {
  return (
    <div style={container}>

      {/* LOGO */}
      <div style={logoBox}>
  <img src={logo} style={logoImg} />
</div>

      {/* MENU */}
      <div style={menu}>
        {menuItems.map((item, i) => {
          const isActive = item.label === "Reportes";

          return (
            <div
              key={i}
              style={{
                ...itemStyle,
                ...(isActive && active)
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "#F3F4F6";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={icon}>{item.icon}</span>
              <span style={text}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* USER */}
      <div style={footer}>
        <strong>Administrador</strong>
        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
          admin@hopewell.com
        </div>
      </div>

    </div>
  );
};

/* ESTILOS */

const container = {
  width: "250px",
  background: "#F7F9FB",
  padding: "20px",
  borderRight: "1px solid #E5E7EB",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const logoBox = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: "35px",
  paddingLeft: "8px"
};
``

const logoImg = {
  width: "210px",   // 🔥 antes 150 → ahora más grande
  maxWidth: "100%",
  objectFit: "contain"
};


const menu = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

/* ITEM */
const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontSize: "14px",
  color: "#374151"
};

/* ICONO */
const icon = {
  fontSize: "18px",
  width: "24px",
  textAlign: "center"
};

/* TEXTO */
const text = {
  fontWeight: 500
};

/* ACTIVO */
const active = {
  background: "#E6F4EA",
  color: "#2F855A",
  fontWeight: 600,
  border: "1px solid #6FBF73"
};

const footer = {
  borderTop: "1px solid #E5E7EB",
  paddingTop: "10px"
};

export default ReportesMenu;
``