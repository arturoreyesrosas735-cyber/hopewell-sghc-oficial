import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const modules = [
  {
    title: "Auditorias",
    description: "Consulta bitacoras, filtra eventos y exporta registros.",
    path: "/auditoria",
    mark: "A",
  },
  {
    title: "Reportes",
    description: "Genera reportes clinicos por paciente, medico, sede o periodo.",
    path: "/reportes",
    mark: "R",
  },
  {
    title: "Doctores",
    description: "Administra informacion del personal medico.",
    path: "/doctores",
    mark: "D",
  },
  {
    title: "Tratamientos y recetas",
    description: "Revisa tratamientos activos, recetas y catalogos clinicos.",
    path: "/tratamientos-recetas",
    mark: "T",
  },
];

const HomePage = () => (
  <MainLayout title="INICIO" breadcrumb="Inicio">
    <section className="home-page">
      <div className="home-heading">
        <p>Hopewell SGHC</p>
        <h1>Panel principal</h1>
        <span>Selecciona un modulo para continuar trabajando.</span>
      </div>

      <div className="home-grid">
        {modules.map((module) => (
          <Link className="home-card" key={module.path} to={module.path}>
            <strong>{module.mark}</strong>
            <div>
              <h2>{module.title}</h2>
              <p>{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </MainLayout>
);

export default HomePage;
