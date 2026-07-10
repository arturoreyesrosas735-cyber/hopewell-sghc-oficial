import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getApiErrorMessage } from "../../services/api";
import { getPacientesCatalogo, type PacienteCatalogo } from "../../services/catalogoM6Service";
import type {
  ApiResponse,
  ConsultasReporte,
  FormatoExportacion,
  ResumenClinicoReporte,
  RangoFechas,
} from "../../types/reportes.types";

type ReporteData = ResumenClinicoReporte | ConsultasReporte;
type ReporteKind = "medico" | "sede" | "periodo" | "resumen" | "historial";

interface ReporteWorkspaceProps {
  titulo: string;
  current: string;
  kind: ReporteKind;
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

const catalogos = {
  medico: [
    { value: "1", label: "Dr. Alonso Ruiz Mendoza" },
    { value: "2", label: "Dra. Maria Gomez Rivera" },
    { value: "3", label: "Dr. Luis Torres Vega" },
    { value: "4", label: "Dra. Claudia Perez Luna" },
  ],
  sede: [
    { value: "1", label: "Clinica Central" },
    { value: "2", label: "Clinica Norte" },
    { value: "3", label: "Clinica Sur" },
    { value: "4", label: "Clinica Este" },
  ],
  paciente: [
    { value: "1", label: "Andres Fabian Ramirez" },
    { value: "2", label: "Arely Rivera Guillen" },
    { value: "3", label: "Sofia Hernandez Luna" },
    { value: "4", label: "Miguel Torres Salinas" },
    { value: "5", label: "Valeria Mendoza Cruz" },
    { value: "6", label: "Daniel Ortega Santos" },
  ],
};

const demoRows = {
  resumen: [
    ["Andres Fabian Ramirez", "DEMO000000000000", "EXP-0001", "Control clinico general", "Fiebre viral demo", "Paracetamol 500 mg cada 8 horas", "Sin alergias registradas", "13/04/2026 09:30"],
    ["Arely Rivera Guillen", "DEMO000000000001", "EXP-0002", "Migrana recurrente", "Control de migrana", "Tomar medicamento al iniciar dolor", "Alergia leve a polvo", "13/04/2026 10:00"],
    ["Sofia Hernandez Luna", "DEMO000000000002", "EXP-0003", "Rinitis alergica", "Tratamiento antihistaminico", "Evitar polvo y cambios bruscos", "Sin alergias registradas", "13/04/2026 10:01"],
    ["Miguel Torres Salinas", "DEMO000000000003", "EXP-0004", "Dolor lumbar", "Manejo de dolor lumbar", "Reposo relativo y estiramientos", "Alergia leve a polvo", "13/04/2026 10:02"],
    ["Valeria Mendoza Cruz", "DEMO000000000004", "EXP-0005", "Gastritis leve", "Proteccion gastrica", "Evitar irritantes", "Sin alergias registradas", "13/04/2026 10:03"],
    ["Daniel Ortega Santos", "DEMO000000000005", "EXP-0006", "Faringitis aguda", "Tratamiento sintomatico", "Mantener hidratacion", "Alergia leve a polvo", "13/04/2026 10:04"],
  ],
  medico: [
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Andres Fabian Ramirez", "01/04/2026", "08:15", "Control clinico general", "Clinica Central", "Consultorio 2", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Arely Rivera Guillen", "01/04/2026", "09:40", "Revision de estudios", "Clinica Central", "Consultorio 2", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Miguel Torres Salinas", "02/04/2026", "10:30", "Dolor lumbar y seguimiento", "Clinica Norte", "Consultorio 1", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Valeria Mendoza Cruz", "03/04/2026", "12:10", "Gastritis leve", "Clinica Central", "Consultorio 2", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Daniel Ortega Santos", "06/04/2026", "08:50", "Faringitis aguda", "Clinica Sur", "Consultorio 4", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Sofia Hernandez Luna", "07/04/2026", "11:25", "Rinitis alergica", "Clinica Central", "Consultorio 2", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Carlos Eduardo Marin", "08/04/2026", "13:00", "Hipertension control", "Clinica Norte", "Consultorio 1", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Fernanda Pineda Soto", "09/04/2026", "09:15", "Revision metabolica", "Clinica Central", "Consultorio 2", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Rafael Jimenez Mora", "10/04/2026", "16:20", "Seguimiento respiratorio", "Clinica Este", "Consultorio 3", "Atendida"],
    ["1", "Dr. Alonso Ruiz Mendoza", "Medicina interna", "CED-4589210", "Lucia Morales Diaz", "13/04/2026", "10:35", "Consulta de cierre", "Clinica Central", "Consultorio 2", "Atendida"],
    ["2", "Dra. Maria Gomez Rivera", "Pediatria", "CED-7821044", "Mateo Castillo Leon", "01/04/2026", "08:30", "Control pediatrico", "Clinica Norte", "Consultorio 5", "Atendida"],
    ["2", "Dra. Maria Gomez Rivera", "Pediatria", "CED-7821044", "Camila Rojas Vega", "03/04/2026", "10:00", "Cuadro febril", "Clinica Norte", "Consultorio 5", "Atendida"],
    ["2", "Dra. Maria Gomez Rivera", "Pediatria", "CED-7821044", "Emiliano Fuentes Paz", "07/04/2026", "12:45", "Revision de crecimiento", "Clinica Central", "Consultorio 6", "Atendida"],
    ["2", "Dra. Maria Gomez Rivera", "Pediatria", "CED-7821044", "Regina Navarro Cruz", "13/04/2026", "09:20", "Alergia estacional", "Clinica Norte", "Consultorio 5", "Atendida"],
    ["3", "Dr. Luis Torres Vega", "Cardiologia", "CED-3398702", "Jorge Salgado Ruiz", "02/04/2026", "09:10", "Control de presion arterial", "Clinica Central", "Consultorio 3", "Atendida"],
    ["3", "Dr. Luis Torres Vega", "Cardiologia", "CED-3398702", "Patricia Nunez Ortiz", "04/04/2026", "11:55", "Electrocardiograma", "Clinica Sur", "Consultorio 7", "Atendida"],
    ["3", "Dr. Luis Torres Vega", "Cardiologia", "CED-3398702", "Roberto Medina Solis", "09/04/2026", "14:20", "Seguimiento cardiologico", "Clinica Central", "Consultorio 3", "Atendida"],
    ["3", "Dr. Luis Torres Vega", "Cardiologia", "CED-3398702", "Elena Chavez Ramos", "13/04/2026", "16:05", "Valoracion de riesgo", "Clinica Este", "Consultorio 2", "Atendida"],
    ["4", "Dra. Claudia Perez Luna", "Dermatologia", "CED-9102468", "Nora Aguilar Pena", "01/04/2026", "10:25", "Dermatitis de contacto", "Clinica Este", "Consultorio 1", "Atendida"],
    ["4", "Dra. Claudia Perez Luna", "Dermatologia", "CED-9102468", "Hector Luna Campos", "06/04/2026", "15:10", "Revision de lesiones", "Clinica Central", "Consultorio 8", "Atendida"],
    ["4", "Dra. Claudia Perez Luna", "Dermatologia", "CED-9102468", "Andrea Silva Roman", "11/04/2026", "12:35", "Control acne", "Clinica Este", "Consultorio 1", "Atendida"],
  ],
  sede: [
    ["1", "Hospital Hopewell Central", "Clinica Central", "Av. Salud 120, CDMX", "Dra. Laura Martinez", "55 1205 6949", "central@hopewell.com", "01/04/2026", "38", "8", "4"],
    ["1", "Hospital Hopewell Central", "Clinica Central", "Av. Salud 120, CDMX", "Dra. Laura Martinez", "55 1205 6949", "central@hopewell.com", "05/04/2026", "44", "8", "4"],
    ["1", "Hospital Hopewell Central", "Clinica Central", "Av. Salud 120, CDMX", "Dra. Laura Martinez", "55 1205 6949", "central@hopewell.com", "09/04/2026", "51", "8", "5"],
    ["1", "Hospital Hopewell Central", "Clinica Central", "Av. Salud 120, CDMX", "Dra. Laura Martinez", "55 1205 6949", "central@hopewell.com", "13/04/2026", "47", "8", "5"],
    ["2", "Hospital Hopewell Norte", "Clinica Norte", "Calz. Norte 88, CDMX", "Dr. Arturo Salinas", "55 4470 2211", "norte@hopewell.com", "01/04/2026", "31", "6", "3"],
    ["2", "Hospital Hopewell Norte", "Clinica Norte", "Calz. Norte 88, CDMX", "Dr. Arturo Salinas", "55 4470 2211", "norte@hopewell.com", "08/04/2026", "36", "6", "4"],
    ["2", "Hospital Hopewell Norte", "Clinica Norte", "Calz. Norte 88, CDMX", "Dr. Arturo Salinas", "55 4470 2211", "norte@hopewell.com", "13/04/2026", "39", "6", "4"],
    ["3", "Hospital Hopewell Sur", "Clinica Sur", "Av. Insurgentes Sur 510, CDMX", "Dra. Beatriz Leon", "55 8821 4402", "sur@hopewell.com", "02/04/2026", "24", "5", "3"],
    ["3", "Hospital Hopewell Sur", "Clinica Sur", "Av. Insurgentes Sur 510, CDMX", "Dra. Beatriz Leon", "55 8821 4402", "sur@hopewell.com", "10/04/2026", "29", "5", "3"],
    ["4", "Hospital Hopewell Este", "Clinica Este", "Circuito Medico 42, CDMX", "Dr. Daniel Cruz", "55 7710 3366", "este@hopewell.com", "03/04/2026", "18", "4", "2"],
    ["4", "Hospital Hopewell Este", "Clinica Este", "Circuito Medico 42, CDMX", "Dr. Daniel Cruz", "55 7710 3366", "este@hopewell.com", "11/04/2026", "21", "4", "2"],
  ],
  periodo: [
    ["01/04/2026 - 13/04/2026", "4", "189", "248", "4", "Clinica Central", "13/04/2026 10:35"],
    ["14/03/2026 - 31/03/2026", "4", "165", "210", "4", "Clinica Norte", "31/03/2026 18:10"],
    ["Variacion %", "+0.00%", "+14.56%", "+18.10%", "+0.00%", "+12.50%", "+16.67%"],
  ],
  historial: [
    ["Baja de usuario", "14-04-26", "Administrador", "El usuario fue dado de baja"],
    ["Edicion de reporte", "13-04-26", "Administrador", "Reporte clinico actualizado"],
    ["Nuevo reporte", "12-04-26", "Administrador", "Nuevo reporte clinico creado"],
    ["Exportacion de reporte", "10-04-26", "Administrador", "Reporte exportado a PDF"],
  ],
};

const ReporteWorkspace = ({
  titulo,
  current,
  kind,
  idLabel = "Seleccionar",
  requiereId = false,
  requiereFechas = false,
  fechasOpcionales = false,
  generar,
  exportar,
}: ReporteWorkspaceProps) => {
  const [id, setId] = useState(kind === "periodo" ? "" : "1");
  const [fechaInicio, setFechaInicio] = useState("2026-04-01");
  const [fechaFin, setFechaFin] = useState("2026-04-13");
  const [reporte, setReporte] = useState<ReporteData | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [imprimiendo, setImprimiendo] = useState(false);
  const [demoGenerado, setDemoGenerado] = useState(false);
  const [pacientesCatalogo, setPacientesCatalogo] = useState(catalogos.paciente);

  useEffect(() => {
    if (kind !== "resumen" && kind !== "historial") return;

    getPacientesCatalogo()
      .then((response) => {
        const pacientes = response.data.data.map((paciente) => ({
          value: String(paciente.id_paciente),
          label: nombrePaciente(paciente),
        }));

        if (pacientes.length > 0) setPacientesCatalogo(pacientes);
      })
      .catch(() => setPacientesCatalogo(catalogos.paciente));
  }, [kind]);

  const params = useMemo<ReporteParams>(() => {
    const fechas = fechaInicio && fechaFin ? { fecha_inicio: fechaInicio, fecha_fin: fechaFin } : undefined;

    return {
      id: id ? Number(id) : undefined,
      fechas,
    };
  }, [fechaFin, fechaInicio, id]);

  const validar = () => {
    if (requiereId && (!id || Number(id) <= 0)) return `Debe seleccionar ${idLabel.toLowerCase()}.`;

    const debeValidarFechas = requiereFechas || Boolean(fechaInicio || fechaFin);

    if (debeValidarFechas && !fechasOpcionales) {
      if (!fechaInicio) return "La fecha de inicio es obligatoria.";
      if (!fechaFin) return "La fecha de fin es obligatoria.";
    }

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) return "La fecha de inicio no puede ser mayor a la fecha de fin.";
    if ((fechaInicio && fechaInicio > hoy) || (fechaFin && fechaFin > hoy)) return "No se permiten fechas futuras.";

    return "";
  };

  const generarReporte = async (): Promise<boolean> => {
    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const response = await generar(params);
      setReporte(response.data);
      setMensaje(response.message);
      setDemoGenerado(false);
      return true;
    } catch (err) {
      console.info(getApiErrorMessage(err, "Modo demo activado."));
      setReporte(null);
      setDemoGenerado(true);
      setMensaje("Reporte demo generado correctamente.");
      return true;
    } finally {
      setLoading(false);
    }
  };

  const onVisualizar = async () => {
    const generado = await generarReporte();

    if (generado) {
      window.setTimeout(() => {
        document.getElementById("report-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  const asegurarReporteGenerado = async () => {
    if (reporte || demoGenerado) return true;

    return generarReporte();
  };

  const onImprimirPdf = async () => {
    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return;
    }

    const printWindow = window.open("", "_blank", "width=1100,height=800");

    const listo = await asegurarReporteGenerado();

    if (!listo) {
      printWindow?.close();
      return;
    }

    setImprimiendo(true);
    setMensaje("Vista lista para imprimir o guardar como PDF.");

    window.setTimeout(() => {
      if (printWindow) {
        imprimirReporte(printWindow, titulo, getColumns(kind), getRows(kind, reporte, id, fechaInicio, fechaFin), kind);
      } else {
        window.print();
      }

      setImprimiendo(false);
    }, 120);
  };

  const onExportarExcel = async () => {
    const validationError = validar();

    if (validationError) {
      setError(validationError);
      return;
    }

    setExportando(true);
    setError("");

    try {
      await exportar(params, "excel");
      setMensaje("Archivo exportado correctamente.");
    } catch (err) {
      console.info(getApiErrorMessage(err, "Exportacion demo activada."));
      descargarExcelDemo(titulo, getColumns(kind), getRows(kind, reporte, id, fechaInicio, fechaFin));
      setMensaje("Archivo Excel demo exportado correctamente.");
    } finally {
      setExportando(false);
    }
  };

  const rows = getRows(kind, reporte, id, fechaInicio, fechaFin);
  const columns = getColumns(kind);
  const selectOptions = kind === "sede" || kind === "periodo" ? catalogos.sede : kind === "medico" ? catalogos.medico : pacientesCatalogo;

  return (
    <MainLayout title={titulo.toUpperCase()} current={current}>
      <section className="report-screen">
        <div className="report-screen-actions">
          <button className="outline-export" type="button" onClick={onVisualizar} disabled={loading}>
            {loading ? "Generando..." : "Visualizar"}
          </button>
          <button className="outline-export" type="button" onClick={onImprimirPdf} disabled={loading || imprimiendo}>
            {imprimiendo ? "Preparando..." : "Imprimir PDF"}
          </button>
          <button className="outline-export" type="button" onClick={onExportarExcel} disabled={exportando}>
            {exportando ? "Exportando..." : "Exportar Excel"}
          </button>
        </div>

        <div className="report-filter-card">
          {requiereId && (
            <label>
              <span>{idLabel}</span>
              <select value={id} onChange={(event) => setId(event.target.value)}>
                <option value="">Seleccionar</option>
                {selectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(requiereFechas || fechasOpcionales) && (
            <>
              <label>
                <span>Fecha inicio</span>
                <input max={hoy} type="date" value={fechaInicio} onChange={(event) => setFechaInicio(event.target.value)} />
              </label>
              <label>
                <span>Fecha fin</span>
                <input max={hoy} type="date" value={fechaFin} onChange={(event) => setFechaFin(event.target.value)} />
              </label>
            </>
          )}

          <button type="button" onClick={onVisualizar} disabled={loading}>
            {loading ? "Generando..." : "Generar reporte"}
          </button>
        </div>

        {error && <div className="error-state">{error}</div>}
        {mensaje && !error && <div className="notice">{mensaje}</div>}

        <div id="report-preview" className={demoGenerado ? "report-table-card demo-ready" : "report-table-card"}>
          <div className="print-report-header">
            <strong>HOPEWELL HISTORIALES CLINICOS</strong>
            <span>{titulo}</span>
            <small>Reporte generado correctamente</small>
          </div>
          <h2>{kind === "periodo" ? "Resumen general" : kind === "historial" ? "Historial" : titulo}</h2>
          <table className="report-reference-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`} className={row[0] === "Totales" ? "total-row" : ""}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${cell}-${cellIndex}`} className={String(cell).startsWith("+") ? "positive-cell" : ""}>
                      {cellIndex === 0 && kind !== "periodo" && kind !== "historial" ? (
                        <span className="entity-cell">
                          <span className="entity-avatar">{String(cell).charAt(0)}</span>
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="report-table-note">
            {kind === "periodo" ? "(Conectado con reportes por medico y sedes en el periodo seleccionado)" : `Mostrando 1 a ${rows.length} de ${rows.length} registros`}
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

const getColumns = (kind: ReporteKind) => {
  if (kind === "historial") return ["Accion", "Fecha", "Usuario", "Detalle"];
  if (kind === "periodo") return ["Periodo", "Medicos", "Pacientes", "Consultas", "Sedes", "Sede principal", "Generado"];
  if (kind === "sede") return ["Hospital", "Sede", "Direccion", "Responsable", "Telefono", "Correo", "Fecha", "Consultas", "Consultorios", "Medicos"];
  if (kind === "resumen") return ["Paciente", "CURP", "Expediente", "Antecedentes", "Diagnostico", "Tratamiento / receta", "Alergias", "Ultima consulta"];
  return ["Medico", "Especialidad", "Cedula", "Paciente", "Fecha", "Hora", "Motivo", "Sede", "Consultorio", "Estado"];
};

const getRows = (kind: ReporteKind, reporte: ReporteData | null, selectedId?: string, fechaInicio?: string, fechaFin?: string) => {
  if (reporte && "diagnosticos" in reporte) {
    return [[
      [reporte.paciente.nombres, reporte.paciente.apellido_paterno, reporte.paciente.apellido_materno].filter(Boolean).join(" "),
      reporte.paciente.uk_curp,
      String(getNested(reporte, "expediente.id_expediente") ?? "EXP-" + reporte.paciente.id_paciente),
      String(getNested(reporte, "expediente.antecedente_familiar") ?? getNested(reporte, "expediente.notas") ?? "Sin antecedentes registrados"),
      reporte.diagnosticos.map((diagnostico) => diagnostico.nombre_diagnostico).join("; ") || "Sin diagnosticos",
      reporte.tratamientos.map((tratamiento) => tratamiento.indicaciones || tratamiento.descripcion || "Tratamiento activo").join("; ") || "Sin tratamientos",
      reporte.paciente.vv_alergia || "Sin alergias registradas",
      String(getNested(reporte, "ultima_consulta.fecha_apertura") ?? "Sin consultas"),
    ]];
  }

  if (reporte && "consultas" in reporte && reporte.consultas.length > 0) {
    if (kind === "medico") {
      return [[
        String(getNested(reporte, "doctor.nombre_completo") ?? "Medico seleccionado"),
        String(getNested(reporte, "doctor.especialidad") ?? "Especialidad no registrada"),
        String(getNested(reporte, "doctor.uk_cedula_profesional") ?? "Cedula no registrada"),
        String(getNested(reporte, "consultas.0.paciente") ?? "Pacientes del periodo"),
        String(getNested(reporte, "periodo.fecha_inicio") ?? "Inicio"),
        "Periodo",
        `${getNested(reporte, "estadisticas.pacientes_atendidos") ?? "0"} pacientes / ${getNested(reporte, "estadisticas.total_consultas") ?? "0"} consultas`,
        "Sedes registradas",
        "Consultorios usados",
        String(getNested(reporte, "generado_en") ?? new Date().toLocaleString()),
      ]];
    }

    if (kind === "sede") {
      return [[
        String(getNested(reporte, "sede.hospital") ?? "Hospital Hopewell"),
        String(getNested(reporte, "sede.nombre_sede") ?? "Sede seleccionada"),
        String(getNested(reporte, "sede.direccion") ?? "Direccion registrada en sede"),
        String(getNested(reporte, "sede.responsable") ?? "Responsable no registrado"),
        String(getNested(reporte, "sede.telefono") ?? "Sin telefono"),
        String(getNested(reporte, "sede.uk_correo") ?? "Sin correo"),
        String(getNested(reporte, "generado_en") ?? new Date().toLocaleString()),
        String(getNested(reporte, "estadisticas.total_consultas") ?? "0"),
        String(getNested(reporte, "estadisticas.consultorios_usados") ?? "0"),
        "Medicos activos",
      ]];
    }

    if (kind === "periodo") {
      return [[
        `${getNested(reporte, "periodo.fecha_inicio") ?? "Inicio"} - ${getNested(reporte, "periodo.fecha_fin") ?? "Fin"}`,
        String(getNested(reporte, "estadisticas.medicos_activos") ?? "0"),
        String(getNested(reporte, "estadisticas.pacientes_atendidos") ?? "0"),
        String(getNested(reporte, "estadisticas.total_consultas") ?? "0"),
        String(getNested(reporte, "estadisticas.sedes") ?? "0"),
        String(getNested(reporte, "estadisticas.sede_principal") ?? "No especificada"),
        String(getNested(reporte, "generado_en") ?? new Date().toLocaleString()),
      ]];
    }
  }

  if (kind === "sede") {
    const rows = selectedId ? demoRows.sede.filter((row) => row[0] === selectedId) : demoRows.sede;
    return filtrarPorPeriodo(rows, 7, fechaInicio, fechaFin).map((row) => row.slice(1));
  }
  if (kind === "periodo") return demoRows.periodo;
  if (kind === "historial") return demoRows.historial;
  if (kind === "resumen") return selectedId ? demoRows.resumen.filter((_, index) => String(index + 1) === selectedId) : demoRows.resumen;
  return filtrarPorPeriodo(
    selectedId ? demoRows.medico.filter((row) => row[0] === selectedId) : demoRows.medico,
    5,
    fechaInicio,
    fechaFin,
  ).map((row) => row.slice(1));
};

const filtrarPorPeriodo = (rows: string[][], fechaIndex: number, fechaInicio?: string, fechaFin?: string) =>
  rows.filter((row) => {
    const fecha = fechaDemoAIso(row[fechaIndex]);

    if (!fecha) return true;
    if (fechaInicio && fecha < fechaInicio) return false;
    if (fechaFin && fecha > fechaFin) return false;

    return true;
  });

const fechaDemoAIso = (fecha: string) => {
  const [dia, mes, anio] = fecha.split("/");

  if (!dia || !mes || !anio) return "";

  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

const getNested = (source: unknown, path: string) =>
  path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object" && key in value) return (value as Record<string, unknown>)[key];

    return undefined;
  }, source);

const nombrePaciente = (paciente: PacienteCatalogo) =>
  [paciente.nombres, paciente.apellido_paterno, paciente.apellido_materno].filter(Boolean).join(" ");

const descargarExcelDemo = (titulo: string, columns: string[], rows: string[][]) => {
  const tableRows = [columns, ...rows]
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  const excelHtml = `<!doctype html><html><head><meta charset="utf-8"></head><body><table>${tableRows}</table></body></html>`;
  const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${titulo.toLowerCase().replaceAll(" ", "-")}-demo.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const imprimirReporte = (printWindow: Window, titulo: string, columns: string[], rows: string[][], kind: ReporteKind) => {
  const generatedAt = new Date().toLocaleString("es-MX");
  const headerCells = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const bodyRows = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");
  const cards = metricasReporte(kind, rows)
    .map((metric) => `<section class="metric"><span>${escapeHtml(metric.label)}</span><strong>${escapeHtml(metric.value)}</strong></section>`)
    .join("");
  const summary = resumenReporte(kind, columns, rows);

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(titulo)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        background: #F6F8FA;
        color: #1F2A44;
        font-family: Arial, Helvetica, sans-serif;
        margin: 0;
        padding: 28px;
      }
      .sheet {
        background: #FFFFFF;
        border: 1px solid #E3E8EF;
        border-radius: 18px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, .08);
        padding: 28px;
      }
      header {
        border-bottom: 1px solid #DDE3EA;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
        padding-bottom: 18px;
      }
      .brand {
        color: #174A78;
        font-size: 20px;
        font-weight: 900;
      }
      .brand small {
        color: #4B5563;
        display: block;
        font-size: 11px;
        letter-spacing: .3px;
        margin-top: 2px;
      }
      h1 {
        color: #071A3D;
        font-size: 24px;
        margin: 0 0 8px;
        text-transform: uppercase;
      }
      .meta {
        color: #536176;
        font-size: 12px;
        text-align: right;
      }
      .summary {
        background: #EAF7F0;
        border-left: 5px solid #1F9B61;
        border-radius: 12px;
        color: #174A2F;
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 18px;
        padding: 14px 16px;
      }
      .metrics {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(4, 1fr);
        margin-bottom: 18px;
      }
      .metric {
        border: 1px solid #DDE3EA;
        border-radius: 14px;
        padding: 14px;
      }
      .metric span {
        color: #6B7588;
        display: block;
        font-size: 11px;
        font-weight: 800;
        margin-bottom: 7px;
        text-transform: uppercase;
      }
      .metric strong {
        color: #071A3D;
        display: block;
        font-size: 20px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        overflow: hidden;
      }
      th, td {
        border: 1px solid #DDE3EA;
        font-size: 11px;
        padding: 8px 9px;
        text-align: left;
        vertical-align: top;
      }
      th {
        background: #F1F5F9;
        color: #071A3D;
        font-weight: 900;
        text-transform: uppercase;
      }
      tr:nth-child(even) td {
        background: #F8FAFC;
      }
      footer {
        color: #6B7588;
        font-size: 11px;
        margin-top: 18px;
      }
      @page { margin: 14mm; }
      @media print {
        body { background: #FFFFFF; padding: 0; }
        .sheet { border: 0; box-shadow: none; padding: 0; }
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <header>
        <div>
          <div class="brand">HOPEWELL<small>HISTORIALES CLINICOS</small></div>
        </div>
        <div>
          <h1>${escapeHtml(titulo)}</h1>
          <div class="meta">Generado: ${escapeHtml(generatedAt)}<br />Modulo 12 - Reportes</div>
        </div>
      </header>
      <div class="summary">${escapeHtml(summary)}</div>
      <div class="metrics">${cards}</div>
      <table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
      <footer>Reporte generado por SGHC Hopewell. Use la opcion de guardar como PDF si necesita conservar una copia digital.</footer>
    </main>
    <script>
      window.onload = function () {
        window.focus();
        window.print();
      };
    </script>
  </body>
</html>`);
  printWindow.document.close();
};

const resumenReporte = (kind: ReporteKind, columns: string[], rows: string[][]) => {
  const row = rows[0] ?? [];
  const value = (column: string) => row[columns.indexOf(column)] ?? "No disponible";

  if (kind === "medico") {
    const pacientes = new Set(rows.map((item) => item[3])).size;
    return `${value("Medico")} - ${value("Especialidad")}. Cedula ${value("Cedula")}. El reporte incluye ${rows.length} consultas y ${pacientes} pacientes atendidos, con fechas y horas distribuidas dentro del periodo seleccionado.`;
  }

  if (kind === "sede") {
    const consultas = rows.reduce((total, item) => total + Number(item[7] ?? 0), 0);
    return `${value("Hospital")} / ${value("Sede")}. Responsable: ${value("Responsable")}. El reporte agrupa ${consultas} consultas registradas por fecha dentro del periodo seleccionado.`;
  }

  if (kind === "periodo") {
    return `Resumen del periodo ${value("Periodo")}: ${value("Pacientes")} pacientes, ${value("Consultas")} consultas, ${value("Medicos")} medicos y ${value("Sedes")} sedes participantes.`;
  }

  if (kind === "resumen") {
    return `Expediente clinico de ${value("Paciente")}. Diagnostico principal: ${value("Diagnostico")}. Tratamiento o receta: ${value("Tratamiento / receta")}.`;
  }

  return "Historial de actividad del modulo de reportes.";
};

const metricasReporte = (kind: ReporteKind, rows: string[][]) => {
  const row = rows[0] ?? [];

  if (kind === "medico") {
    const pacientes = new Set(rows.map((item) => item[3])).size;
    const sedes = new Set(rows.map((item) => item[7])).size;

    return [
      { label: "Pacientes atendidos", value: String(pacientes) },
      { label: "Consultas", value: String(rows.length) },
      { label: "Especialidad", value: row[1] ?? "No registrada" },
      { label: "Sedes visitadas", value: String(sedes) },
    ];
  }

  if (kind === "sede") {
    const consultas = rows.reduce((total, item) => total + Number(item[7] ?? 0), 0);
    const medicos = rows.reduce((total, item) => total + Number(item[9] ?? 0), 0);

    return [
      { label: "Consultas", value: String(consultas) },
      { label: "Consultorios", value: row[8] ?? "0" },
      { label: "Responsable", value: row[3] ?? "No registrado" },
      { label: "Medicos por corte", value: String(medicos) },
    ];
  }

  if (kind === "periodo") {
    return [
      { label: "Medicos", value: row[1] ?? "0" },
      { label: "Pacientes", value: row[2] ?? "0" },
      { label: "Consultas", value: row[3] ?? "0" },
      { label: "Sedes", value: row[4] ?? "0" },
    ];
  }

  if (kind === "resumen") {
    return [
      { label: "Paciente", value: row[0] ?? "No disponible" },
      { label: "Expediente", value: row[2] ?? "No disponible" },
      { label: "Diagnostico", value: row[4] ?? "No disponible" },
      { label: "Ultima consulta", value: row[7] ?? "No disponible" },
    ];
  }

  return [
    { label: "Registros", value: String(rows.length) },
    { label: "Modulo", value: "Reportes" },
    { label: "Usuario", value: "Administrador" },
    { label: "Estado", value: "Generado" },
  ];
};

const escapeHtml = (value: string) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export default ReporteWorkspace;
