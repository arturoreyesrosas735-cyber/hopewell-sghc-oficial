import { useState } from "react";
import { crearExpediente } from "../../services/expedienteService";

export default function ExpedientePage(){

  const crear = async ()=>{
    await crearExpediente({ fk_paciente_expediente_clinico: 1});
    alert("creado");
  }

  return (
    <div>
      <h1>Expedientes</h1>
      <button onClick={crear}>Crear expediente</button>
    </div>
  );
}
