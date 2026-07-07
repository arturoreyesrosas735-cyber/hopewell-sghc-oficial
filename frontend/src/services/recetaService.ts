import api, { type ApiResponse } from "./api";
import type { Receta, RecetaFormData } from "../types/receta.types";

export const crearReceta = (tratamientoId: number, data: RecetaFormData) =>
  api.post<ApiResponse<Receta>>("/tratamientos/" + tratamientoId + "/recetas", data);

export const getRecetaById = (id: number) =>
  api.get<ApiResponse<Receta>>("/recetas/" + id);

export const getRecetasPorPaciente = (pacienteId: number) =>
  api.get<ApiResponse<Receta[]>>("/pacientes/" + pacienteId + "/recetas");
