import type { BitacoraAuditoria } from "../../types/auditoria.types";

interface AuditoriaTableProps {
  registros: BitacoraAuditoria[];
  total: number;
  paginaActual: number;
  totalPaginas: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSelect: (registro: BitacoraAuditoria) => void;
}

const formatDate = (value: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
};

const formatTime = (value: string) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const pageButtons = (paginaActual: number, totalPaginas: number) => {
  const pages = new Set([1, paginaActual - 1, paginaActual, paginaActual + 1, totalPaginas]);
  return Array.from(pages).filter((page) => page >= 1 && page <= totalPaginas).sort((a, b) => a - b);
};

const AuditoriaTable = ({
  registros,
  total,
  paginaActual,
  totalPaginas,
  loading,
  onPageChange,
  onSelect,
}: AuditoriaTableProps) => {
  const inicio = total === 0 ? 0 : (paginaActual - 1) * 5 + 1;
  const fin = Math.min(paginaActual * 5, total);

  return (
    <div className="table-card auditoria-table-card">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Usuario</th>
            <th>Modulo</th>
            <th>Accion</th>
            <th>Detalles</th>
            <th>IP origen</th>
            <th>Consulta</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr
              className="auditoria-clickable-row"
              key={registro.id_auditoria}
              onClick={() => onSelect(registro)}
            >
              <td>{String(registro.id_auditoria).padStart(5, "0")}</td>
              <td>{formatDate(registro.fecha_registro)}</td>
              <td>{formatTime(registro.fecha_registro)}</td>
              <td>
                <span className="auditoria-user">
                  <span>{(registro.usuario_nombre ?? "U").slice(0, 1).toUpperCase()}</span>
                  {registro.usuario_nombre ?? `Usuario ${registro.fk_usuario_auditoria}`}
                </span>
              </td>
              <td>{registro.modulo_afectado}</td>
              <td>
                <button
                  className="status-pill auditoria-action-pill"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(registro);
                  }}
                >
                  {registro.operacion_accion}
                </button>
              </td>
              <td>{registro.descripcion ?? registro.tabla_afectada}</td>
              <td>{registro.direccion_ip ?? "-"}</td>
              <td>
                <button
                  className="auditoria-link-button"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(registro);
                  }}
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="auditoria-pagination">
        <span>
          {loading
            ? "Actualizando registros..."
            : `Mostrando ${inicio} a ${fin} de ${total} registros`}
        </span>

        <div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onPageChange(paginaActual - 1)}
            disabled={loading || paginaActual <= 1}
          >
            &lt;
          </button>

          {pageButtons(paginaActual, totalPaginas).map((page) => (
            <button
              key={page}
              className={page === paginaActual ? "auditoria-page-active" : "secondary-button"}
              type="button"
              onClick={() => onPageChange(page)}
              disabled={loading}
            >
              {page}
            </button>
          ))}

          <button
            className="secondary-button"
            type="button"
            onClick={() => onPageChange(paginaActual + 1)}
            disabled={loading || paginaActual >= totalPaginas}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditoriaTable;
