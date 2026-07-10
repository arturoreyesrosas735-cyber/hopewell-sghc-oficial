import api, { type ApiResponse } from "./api";
import type { Tratamiento } from "../types/tratamiento.types";
import type { Medicamento } from "../types/receta.types";

export interface PacienteCatalogo {
  id_paciente: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
}

export interface DiagnosticoCatalogo {
  id_diagnostico: number;
  nombre_diagnostico: string;
  descripcion_diagnostico?: string | null;
}

export interface PadecimientoCatalogo {
  id_padecimiento: number;
  uk_nombre_padecimiento: string;
}

export const getPacientesCatalogo = () =>
  api.get<ApiResponse<PacienteCatalogo[]>>("/catalogos/pacientes");

export const getDiagnosticosCatalogo = () =>
  api.get<ApiResponse<DiagnosticoCatalogo[]>>("/catalogos/diagnosticos");

export const getPadecimientosCatalogo = () =>
  api.get<ApiResponse<PadecimientoCatalogo[]>>("/catalogos/padecimientos");

export const getMedicamentosCatalogo = () =>
  api.get<ApiResponse<Medicamento[]>>("/catalogos/medicamentos");

export const getTratamientosCatalogo = () =>
  api.get<ApiResponse<Tratamiento[]>>("/catalogos/tratamientos");

export const getRecursoCatalogo = (recurso: string) =>
  api.get<ApiResponse<Record<string, unknown>[]>>("/catalogos/" + recurso);

export const crearMedicamentoCatalogo = (data: { nombre: string; descripcion?: string; presentacion?: string; concentracion?: string }) =>
  api.post<ApiResponse<Record<string, unknown>>>("/catalogos/medicamentos", data);

export const crearEnfermedadCatalogo = (data: { nombre: string }) =>
  api.post<ApiResponse<Record<string, unknown>>>("/catalogos/enfermedades", data);
