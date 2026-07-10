export interface BitacoraAuditoria {
  id_auditoria: number;
  fk_usuario_auditoria: number;
  usuario_nombre?: string | null;
  modulo_afectado: string;
  operacion_accion: string;
  fecha_registro: string;
  fecha_edicion: string;
  tabla_afectada: string;
  descripcion?: string | null;
  direccion_ip?: string | null;
}

export interface AuditoriaFiltrosParams {
  usuario?: number;
  modulo?: string;
  accion?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  per_page?: number;
}

export interface AuditoriaPaginada {
  registros: BitacoraAuditoria[];
  total: number;
  pagina_actual: number;
  total_paginas: number;
}

export interface AuditoriaExportParams extends Omit<AuditoriaFiltrosParams, "page" | "per_page"> {
  formato: "pdf" | "excel";
}

export interface UsuarioAuditoria {
  id_usuario: number;
  nombre_usuario: string;
}
