import { useState } from "react";
import type { AuditoriaExportParams } from "../../types/auditoria.types";

interface AuditoriaExportBtnProps {
  disabled?: boolean;
  onExport: (formato: AuditoriaExportParams["formato"]) => Promise<void>;
}

const AuditoriaExportBtn = ({ disabled = false, onExport }: AuditoriaExportBtnProps) => {
  const [formato, setFormato] = useState<AuditoriaExportParams["formato"]>("pdf");
  const [exportando, setExportando] = useState(false);

  const handleExport = async () => {
    setExportando(true);

    try {
      await onExport(formato);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="auditoria-export">
      <select
        aria-label="Formato de exportacion"
        value={formato}
        onChange={(event) => setFormato(event.target.value as AuditoriaExportParams["formato"])}
        disabled={disabled || exportando}
      >
        <option value="pdf">PDF</option>
        <option value="excel">Excel</option>
      </select>

      <button type="button" onClick={handleExport} disabled={disabled || exportando}>
        {exportando ? "Exportando..." : "Exportar bitacora"}
      </button>
    </div>
  );
};

export default AuditoriaExportBtn;
