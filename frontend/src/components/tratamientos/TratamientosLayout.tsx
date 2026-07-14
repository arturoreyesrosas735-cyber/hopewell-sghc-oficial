import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import MainLayout from "../layout/MainLayout";

interface TratamientosLayoutProps {
  title: string;
  children: ReactNode;
}

const navItems = [
  { label: "Pacientes", to: "/pacientes" },
  { label: "Expedientes", to: "/expedientes" },
  { label: "Consultas", to: "/consultas" },
  { label: "Diagnosticos", to: "/diagnosticos" },
  { label: "Tratamientos", to: "/tratamientos-recetas" },
  { label: "Recetas", to: "/recetas" },
  { label: "Medicamentos", to: "/medicamentos" },
  { label: "Padecimientos", to: "/padecimientos" },
];

const TratamientosLayout = ({ title, children }: TratamientosLayoutProps) => {
  const location = useLocation();

  return (
    <MainLayout
      title="TRATAMIENTOS Y RECETAS"
      breadcrumb={`Inicio > Tratamientos y recetas > ${title}`}
    >
      <section className="treatment-page">
        <div className="treatment-heading">
          <div>
            <p>M6 - Tratamientos y Recetas</p>
            <h1>{title}</h1>
            <span>Gestiona tratamientos, recetas y recursos clinicos asociados.</span>
          </div>
        </div>

        <nav className="treatment-tabs" aria-label="Secciones de tratamientos y recetas">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive || isTratamientosHome(item.to, location.pathname) ? "active" : ""
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {children}
      </section>
    </MainLayout>
  );
};

const isTratamientosHome = (itemPath: string, currentPath: string) =>
  itemPath === "/tratamientos-recetas" &&
  (currentPath === "/tratamientos-recetas" || currentPath.startsWith("/tratamientos/"));

export default TratamientosLayout;
