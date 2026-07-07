import { useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getApiErrorMessage } from "../../services/api";
import type {
  ApiResponse,
  ConsultasReporte,
  FormatoExportacion,
  ResumenClinicoReporte,
  RangoFechas,
} from "../../types/reportes.types";

type ReporteData = ResumenClinicoReporte | ConsultasReporte;

interface ReporteWorkspaceProps {
  titulo: string;
  descripcion: string;
  idLabel?: string;
  requiereId?: boolean;
  requiereFechas?: boolean;
  fechasOpcionales?: boolean;
  generar: (params: ReporteParams) => Promise<ApiResponse<ReporteData>>;
  exportar: (params: ReporteParams, formato: FormatoExportacion) => Promise<void>;
}

export interface ReporteParams {
  id?: number;
  fechas?: RangoFechas;
}

const hoy = new Date().toISOString().slice(0, 10);

const ReporteWorkspace = ({
  titulo,
  descripcion,
  idLabel = "ID",
  requiereId = false,
  requiereFechas = false,
  fechasOpcionales = false,
  generar,
  exportar,
}: ReporteWorkspaceProps) => {
  const [id, setId] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporte, setReporte] = useState<ReporteData | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState<FormatoExportacion | null>(null);

  const params = useMemo<ReporteParams>(() => {
    const fechas =
      fechaInicio || fechaFin
        ? {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          }
        : undefined;

    return {
      id: id ? Number(id) : undefined,
      fechas,
    };
  }, [fechaFin, fechaInicio, id]);

  const validar = () => {
    if (requiereId && (!id || Number(id) <= 0)) {
      return `Debe capturar un ${idLabel.toLowerCase()} valido.`;
    }

    const debeValidarFechas = requiereFechas || Boolean(fechaInicio || fechaFin);

    if (debeValidarFechas) {
      if (!fechaInicio) return "La fecha de inicio es obligatoria.";
      if (!fechaFin) return "La fecha de fin es obligatoria.";
      if (fechaInicio > fechaFin) return "La fecha de inicio no puede ser mayor a la fecha de fin.";
      if (fechaInicio > hoy || fechaFin > hoy) return "No se permiten fechas futuras.";
    }

    return "";
  };

  const onGenerar = async () => {
    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const response = await generar(params);
      setReporte(response.data);
      setMensaje(response.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Ocurrio un error al conectar con el servidor."));
      setReporte(null);
    } finally {
      setLoading(false);
    }
  };

  const onExportar = async (formato: FormatoExportacion) => {
    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return;
    }

    setExportando(formato);
    setError("");

    try {
      await exportar(params, formato);
      setMensaje("Archivo exportado correctamente.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Ocurrio un error al generar o exportar el reporte."));
    } finally {
      setExportando(null);
    }
  };

  return (
    <MainLayout>
      <section className="reportes-page">
        <div className="reportes-heading">
          <div>
            <p>M12 - Reportes</p>
            <h1>{titulo}</h1>
            <span>{descripcion}</span>
          </div>
        </div>

        <div className="reportes-panel">
          <div className="reportes-form">
            {requiereId && (
              <label>
                {idLabel}
                <input
                  min="1"
                  type="number"
                  value={id}
                  onChange={(event) => setId(event.target.value)}
                  placeholder="Ej. 1"
                />
              </label>
            )}

            {(requiereFechas || fechasOpcionales) && (
              <>
                <label>
                  Fecha inicio
                  <input
                    max={hoy}
                    type="date"
                    value={fechaInicio}
                    onChange={(event) => setFechaInicio(event.target.value)}
                  />
                </label>

                <label>
                  Fecha fin
                  <input
                    max={hoy}
                    type="date"
                    value={fechaFin}
                    onChange={(event) => setFechaFin(event.target.value)}
                  />
                </label>
              </>
            )}

            <div className="reportes-actions">
              <button type="button" onClick={onGenerar} disabled={loading}>
                {loading ? "Generando..." : "Generar"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => onExportar("pdf")}
                disabled={loading || exportando !== null}
              >
                {exportando === "pdf" ? "Exportando..." : "PDF"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => onExportar("excel")}
                disabled={loading || exportando !== null}
              >
                {exportando === "excel" ? "Exportando..." : "Excel"}
              </button>
            </div>
          </div>

          {error && <div className="error-state">{error}</div>}
          {mensaje && !error && <div className="notice">{mensaje}</div>}
          {loading && <div className="loading-state">Consultando informacion...</div>}

          {!loading && reporte && <ReporteResultado reporte={reporte} />}
        </div>
      </section>
    </MainLayout>
  );
};

const ReporteResultado = ({ reporte }: { reporte: ReporteData }) => {
  if ("diagnosticos" in reporte) {
    return (
      <div className="reportes-results">
        <ResumenPaciente paciente={reporte.paciente} />
        <SimpleTable
          titulo="Diagnosticos"
          rows={reporte.diagnosticos}
          empty="No hay diagnosticos registrados."
        />
        <SimpleTable
          titulo="Tratamientos"
          rows={reporte.tratamientos}
          empty="No hay tratamientos registrados."
        />
      </div>
    );
  }

  return (
    <div className="reportes-results">
      {reporte.estadisticas && (
        <div className="reportes-kpis">
          {Object.entries(reporte.estadisticas).map(([key, value]) => (
            <div key={key} className="reportes-kpi">
              <strong>{value}</strong>
              <span>{key.replaceAll("_", " ")}</span>
            </div>
          ))}
        </div>
      )}

      <SimpleTable
        titulo="Consultas"
        rows={reporte.consultas}
        empty="No existen registros disponibles para la consulta realizada."
      />
    </div>
  );
};

const ResumenPaciente = ({ paciente }: { paciente: ResumenClinicoReporte["paciente"] }) => (
  <div className="surface-panel">
    <h2>{paciente.nombres} {paciente.apellido_paterno} {paciente.apellido_materno ?? ""}</h2>
    <dl className="definition-list compact">
      <div>
        <dt>ID</dt>
        <dd>{paciente.id_paciente}</dd>
      </div>
      <div>
        <dt>CURP</dt>
        <dd>{paciente.uk_curp}</dd>
      </div>
      <div>
        <dt>Estatus</dt>
        <dd>{paciente.estatus}</dd>
      </div>
    </dl>
  </div>
);

const SimpleTable = ({
  titulo,
  rows,
  empty,
}: {
  titulo: string;
  rows: object[];
  empty: string;
}) => {
  const normalizedRows = rows as Array<Record<string, unknown>>;
  const columns = normalizedRows[0] ? Object.keys(normalizedRows[0]).slice(0, 7) : [];

  return (
    <div className="table-card">
      <h2 className="table-title">{titulo}</h2>
      {rows.length === 0 ? (
        <div className="empty-state">{empty}</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column.replaceAll("_", " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalizedRows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column}>{String(row[column] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReporteWorkspace;
