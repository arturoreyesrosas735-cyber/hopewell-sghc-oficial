import api from "./api";

export const crearExpediente = (data:any) =>
  api.post("/expedientes", data);
