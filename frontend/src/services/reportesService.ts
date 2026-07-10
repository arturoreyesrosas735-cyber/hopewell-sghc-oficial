import api from "./api";
import type {
  ApiResponse,
  ConsultasReporte,
  FormatoExportacion,
  RangoFechas,
  ResumenClinicoReporte,
} from "../types/reportes.types";

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

const extensionPorFormato = (formato: FormatoExportacion) =>
  formato === "excel" ? "xls" : "pdf";

export const getResumenClinico = async (idPaciente: number) => {
  const response = await api.get<ApiResponse<ResumenClinicoReporte>>(
    `/reportes/resumen-clinico/${idPaciente}`,
  );

  return response.data;
};

export const getHistorialConsultas = async (
  idPaciente: number,
  fechas?: Partial<RangoFechas>,
) => {
  const response = await api.get<ApiResponse<ConsultasReporte>>(
    `/reportes/historial-consultas/${idPaciente}`,
    { params: fechas },
  );

  return response.data;
};

export const getReportePorMedico = async (
  idDoctor: number,
  fechas: RangoFechas,
) => {
  const response = await api.get<ApiResponse<ConsultasReporte>>(
    `/reportes/por-medico/${idDoctor}`,
    { params: fechas },
  );

  return response.data;
};

export const getReportePorSede = async (idSede: number) => {
  const response = await api.get<ApiResponse<ConsultasReporte>>(
    `/reportes/por-sede/${idSede}`,
  );

  return response.data;
};

export const getReportePorPeriodo = async (fechas: RangoFechas) => {
  const response = await api.get<ApiResponse<ConsultasReporte>>(
    "/reportes/por-periodo",
    { params: fechas },
  );

  return response.data;
};

export const exportarResumenClinico = async (
  idPaciente: number,
  formato: FormatoExportacion,
) => {
  const response = await api.get(`/reportes/resumen-clinico/${idPaciente}/exportar`, {
    params: { formato },
    responseType: "blob",
  });
  descargarBlob(response.data, `resumen-clinico.${extensionPorFormato(formato)}`);
};

export const exportarHistorialConsultas = async (
  idPaciente: number,
  formato: FormatoExportacion,
  fechas?: Partial<RangoFechas>,
) => {
  const response = await api.get(`/reportes/historial-consultas/${idPaciente}/exportar`, {
    params: { ...fechas, formato },
    responseType: "blob",
  });
  descargarBlob(response.data, `historial-consultas.${extensionPorFormato(formato)}`);
};

export const exportarReportePorMedico = async (
  idDoctor: number,
  fechas: RangoFechas,
  formato: FormatoExportacion,
) => {
  const response = await api.get(`/reportes/por-medico/${idDoctor}/exportar`, {
    params: { ...fechas, formato },
    responseType: "blob",
  });
  descargarBlob(response.data, `reporte-medico.${extensionPorFormato(formato)}`);
};

export const exportarReportePorSede = async (
  idSede: number,
  formato: FormatoExportacion,
) => {
  const response = await api.get(`/reportes/por-sede/${idSede}/exportar`, {
    params: { formato },
    responseType: "blob",
  });
  descargarBlob(response.data, `reporte-sede.${extensionPorFormato(formato)}`);
};

export const exportarReportePorPeriodo = async (
  fechas: RangoFechas,
  formato: FormatoExportacion,
) => {
  const response = await api.get("/reportes/por-periodo/exportar", {
    params: { ...fechas, formato },
    responseType: "blob",
  });
  descargarBlob(response.data, `reporte-periodo.${extensionPorFormato(formato)}`);
};
