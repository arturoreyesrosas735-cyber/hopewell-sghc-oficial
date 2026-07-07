import api, { type ApiResponse } from "./api";
import type { Tratamiento, TratamientoFormData } from "../types/tratamiento.types";

export const crearTratamiento = (diagnosticoId: number, data: TratamientoFormData) =>
  api.post<ApiResponse<Tratamiento>>("/diagnosticos/" + diagnosticoId + "/tratamientos", data);

export const getTratamientoById = (id: number) =>
  api.get<ApiResponse<Tratamiento>>("/tratamientos/" + id);

export const getTratamientosPorPaciente = (pacienteId: number) =>
  api.get<ApiResponse<Tratamiento[]>>("/pacientes/" + pacienteId + "/tratamientos");
