import { useEffect, useMemo, useState } from "react";
import AuditoriaFiltros from "../../components/auditoria/AuditoriaFiltros";
import AuditoriaTable from "../../components/auditoria/AuditoriaTable";
import MainLayout from "../../components/layout/MainLayout";
import { exportarAuditoria, getAuditoria, getUsuariosAuditoria } from "../../services/auditoriaService";
import { getApiErrorMessage } from "../../services/api";
import type {
  BitacoraAuditoria,
  AuditoriaFiltrosParams,
  AuditoriaPaginada,
  UsuarioAuditoria,
} from "../../types/auditoria.types";

const PER_PAGE = 5;

const emptyData: AuditoriaPaginada = {
  registros: [],
  total: 0,
  pagina_actual: 1,
  total_paginas: 1,
};

const AuditoriaListPage = () => {
  const [filtros, setFiltros] = useState<AuditoriaFiltrosParams>({});
  const [appliedFiltros, setAppliedFiltros] = useState<AuditoriaFiltrosParams>({});
  const [usuarios, setUsuarios] = useState<UsuarioAuditoria[]>([]);
  const [data, setData] = useState<AuditoriaPaginada>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [selectedRegistro, setSelectedRegistro] = useState<BitacoraAuditoria | null>(null);

  const params = useMemo(
    () => ({
      ...appliedFiltros,
      page: appliedFiltros.page ?? 1,
      per_page: PER_PAGE,
    }),
    [appliedFiltros],
  );

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const response = await getUsuariosAuditoria();
        setUsuarios(response.data ?? []);
      } catch {
        setUsuarios([]);
      }
    };

    loadUsuarios();
  }, []);

  useEffect(() => {
    const loadAuditoria = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAuditoria(params);
        setData(response.data ?? emptyData);
        setMensaje(response.message);
      } catch (err) {
        setError(getApiErrorMessage(err, "Ocurrio un error al conectar con el servidor."));
        setData(emptyData);
      } finally {
        setLoading(false);
      }
    };

    loadAuditoria();
  }, [params]);

  const validarFiltros = () => {
    const usaUnaFecha = Boolean(filtros.fecha_desde || filtros.fecha_hasta);

    if (usaUnaFecha && (!filtros.fecha_desde || !filtros.fecha_hasta)) {
      return "Debe ingresar una fecha inicial y una fecha final para aplicar el filtro.";
    }

    if (filtros.fecha_desde && filtros.fecha_hasta && filtros.fecha_desde > filtros.fecha_hasta) {
      return "La fecha inicial no puede ser mayor a la fecha final.";
    }

    return "";
  };

  const aplicarFiltros = () => {
    const validationError = validarFiltros();

    if (validationError) {
      setFilterError(validationError);
      return;
    }

    setFilterError("");
    setAppliedFiltros({ ...filtros, page: 1 });
    setSelectedRegistro(null);
  };

  const limpiarFiltros = () => {
    setFiltros({});
    setAppliedFiltros({ page: 1 });
    setFilterError("");
  };

  const cambiarPagina = (page: number) => {
    setAppliedFiltros((current) => ({ ...current, page }));
    setSelectedRegistro(null);
  };

  const exportar = async (formato: "pdf" | "excel") => {
    setError("");

    try {
      await exportarAuditoria({
        formato,
        usuario: appliedFiltros.usuario,
        modulo: appliedFiltros.modulo,
        accion: appliedFiltros.accion,
        fecha_desde: appliedFiltros.fecha_desde,
        fecha_hasta: appliedFiltros.fecha_hasta,
      });
      setMensaje("Archivo exportado correctamente.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Ocurrio un error al exportar la informacion."));
    }
  };

  const isEmpty = !loading && data.registros.length === 0;
  const showTable = data.registros.length > 0 || (loading && data.total > 0);

  return (
    <MainLayout title="AUDITORIAS" breadcrumb="Inicio > Auditorias > Filtrar por usuario">
      <section className="auditoria-page">
        <div className="auditoria-heading">
          <div>
            <p>M13 - Auditorias</p>
            <h1>Filtrar auditoria por usuario</h1>
            <span>Consulta, filtra y exporta la bitacora del sistema.</span>
          </div>

        </div>

        <div className="auditoria-panel">
          <AuditoriaFiltros
            filtros={filtros}
            usuarios={usuarios}
            loading={loading}
            error={filterError}
            onChange={setFiltros}
            onSubmit={aplicarFiltros}
            onClear={limpiarFiltros}
            onExport={() => exportar("pdf")}
          />
        </div>

        {error && <div className="error-state">{error}</div>}
        {mensaje && !error && !loading && <div className="notice">{mensaje}</div>}
        {loading && <div className="loading-state">Consultando bitacora...</div>}
        {isEmpty && <div className="empty-state">No existen registros disponibles en la bitacora.</div>}

        {showTable && (
          <div className="auditoria-results">
            <h2>Bitacora de auditoria por usuario</h2>
            <AuditoriaTable
              registros={data.registros}
              total={data.total}
              paginaActual={data.pagina_actual}
              totalPaginas={data.total_paginas}
              loading={loading}
              onPageChange={cambiarPagina}
              onSelect={setSelectedRegistro}
            />
          </div>
        )}

        {selectedRegistro && (
          <div className="auditoria-detail-backdrop" role="presentation">
            <section className="auditoria-detail" aria-label="Detalle de auditoria">
              <div className="auditoria-detail-header">
                <div>
                  <p>Registro #{String(selectedRegistro.id_auditoria).padStart(5, "0")}</p>
                  <h2>Detalle de auditoria</h2>
                </div>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setSelectedRegistro(null)}
                >
                  Cerrar
                </button>
              </div>

              <dl className="definition-list compact">
                <div>
                  <dt>Usuario</dt>
                  <dd>{selectedRegistro.usuario_nombre ?? `Usuario ${selectedRegistro.fk_usuario_auditoria}`}</dd>
                </div>
                <div>
                  <dt>Modulo</dt>
                  <dd>{selectedRegistro.modulo_afectado}</dd>
                </div>
                <div>
                  <dt>Accion</dt>
                  <dd>{selectedRegistro.operacion_accion}</dd>
                </div>
                <div>
                  <dt>Tabla afectada</dt>
                  <dd>{selectedRegistro.tabla_afectada}</dd>
                </div>
                <div>
                  <dt>Fecha registro</dt>
                  <dd>{selectedRegistro.fecha_registro}</dd>
                </div>
                <div>
                  <dt>IP origen</dt>
                  <dd>{selectedRegistro.direccion_ip ?? "-"}</dd>
                </div>
              </dl>

              <div className="auditoria-detail-description">
                <strong>Descripcion</strong>
                <p>{selectedRegistro.descripcion ?? "Sin descripcion registrada."}</p>
              </div>
            </section>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default AuditoriaListPage;
