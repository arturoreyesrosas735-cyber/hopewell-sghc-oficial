import api, { type ApiResponse } from "./api";
import type {
  AuditoriaExportParams,
  AuditoriaFiltrosParams,
  AuditoriaPaginada,
  UsuarioAuditoria,
} from "../types/auditoria.types";

const descargarBlob = (blob: Blob, nombre: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nombre;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const extensionPorFormato = (formato: AuditoriaExportParams["formato"]) =>
  formato === "excel" ? "xlsx" : "pdf";

export const getAuditoria = async (params?: AuditoriaFiltrosParams) => {
  const response = await api.get<ApiResponse<AuditoriaPaginada>>("/auditoria", { params });
  return response.data;
};

export const getUsuariosAuditoria = async () => {
  const response = await api.get<ApiResponse<UsuarioAuditoria[]>>("/usuarios", {
    params: { per_page: 100 },
  });

  return response.data;
};

export const exportarAuditoria = async (params: AuditoriaExportParams) => {
  const response = await api.get("/auditoria/exportar", {
    params,
    responseType: "blob",
  });

  descargarBlob(response.data, `bitacora-auditoria.${extensionPorFormato(params.formato)}`);
};
