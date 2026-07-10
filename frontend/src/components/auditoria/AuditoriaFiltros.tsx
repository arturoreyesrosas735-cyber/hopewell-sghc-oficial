import type { FormEvent } from "react";
import type { AuditoriaFiltrosParams, UsuarioAuditoria } from "../../types/auditoria.types";

interface AuditoriaFiltrosProps {
  filtros: AuditoriaFiltrosParams;
  usuarios: UsuarioAuditoria[];
  loading: boolean;
  error?: string;
  onChange: (filtros: AuditoriaFiltrosParams) => void;
  onSubmit: () => void;
  onClear: () => void;
  onExport: () => void;
}

const AuditoriaFiltros = ({
  filtros,
  usuarios,
  loading,
  error,
  onChange,
  onSubmit,
  onClear,
  onExport,
}: AuditoriaFiltrosProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="auditoria-filtros" onSubmit={handleSubmit}>
      <div className="auditoria-field">
        <label htmlFor="auditoria-usuario">Seleccionar usuario</label>
        <select
          id="auditoria-usuario"
          value={filtros.usuario ?? ""}
          onChange={(event) =>
            onChange({
              ...filtros,
              usuario: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        >
          <option value="">Todos los usuarios</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id_usuario} value={usuario.id_usuario}>
              {usuario.nombre_usuario}
            </option>
          ))}
        </select>
      </div>

      <div className="auditoria-field">
        <label htmlFor="auditoria-fechas">Rango de fechas</label>
        <div className="auditoria-date-group" id="auditoria-fechas">
          <input
            aria-label="Fecha inicio"
            type="date"
            value={filtros.fecha_desde ?? ""}
            onChange={(event) => onChange({ ...filtros, fecha_desde: event.target.value })}
          />

          <input
            aria-label="Fecha fin"
            type="date"
            value={filtros.fecha_hasta ?? ""}
            onChange={(event) => onChange({ ...filtros, fecha_hasta: event.target.value })}
          />
        </div>
      </div>

      <div className="auditoria-date-group">
        <div className="auditoria-field">
          <label htmlFor="auditoria-modulo">Modulo</label>
          <select
            id="auditoria-modulo"
            value={filtros.modulo ?? ""}
            onChange={(event) => onChange({ ...filtros, modulo: event.target.value || undefined })}
          >
            <option value="">Seleccionar modulo</option>
            <option value="M1 - Usuarios y Accesos">Usuarios y Accesos</option>
            <option value="M4 - Consultas Medicas">Consultas Medicas</option>
            <option value="M6 - Gestion de Tratamientos y Recetas">Tratamientos y Recetas</option>
            <option value="M12 - Reportes">Reportes</option>
            <option value="M13 - Auditorias">Auditorias</option>
          </select>
        </div>

        <div className="auditoria-field">
          <label htmlFor="auditoria-accion">Accion</label>
          <select
            id="auditoria-accion"
            value={filtros.accion ?? ""}
            onChange={(event) => onChange({ ...filtros, accion: event.target.value || undefined })}
          >
            <option value="">Seleccionar accion</option>
            <option value="CREAR">Creacion</option>
            <option value="CONSULTAR">Consulta</option>
            <option value="ACTUALIZAR">Actualizacion</option>
            <option value="ELIMINAR">Eliminacion</option>
            <option value="EXPORTAR">Exportacion</option>
          </select>
        </div>
      </div>

      {error && <div className="field-error auditoria-filter-error">{error}</div>}

      <div className="auditoria-filter-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Filtrando..." : "Filtrar auditoria"}
        </button>
        <button className="secondary-button" type="button" onClick={onClear} disabled={loading}>
          Limpiar filtros
        </button>
        <button className="secondary-button auditoria-export-inline" type="button" onClick={onExport} disabled={loading}>
          Exportar bitacora (PDF)
        </button>
      </div>
    </form>
  );
};

export default AuditoriaFiltros;
