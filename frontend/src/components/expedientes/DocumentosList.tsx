import type { Documento } from '../../types/expediente.types';

export default function DocumentosList({ documentos }: { documentos: Documento[] }) {
  return (
    <div className="exp-doc-list">
      {documentos.map((documento) => {
        const isImage = ['jpg', 'jpeg', 'png'].includes(documento.extension_archivo.toLowerCase());
        const documentUrl = documento.url_ver ?? documento.url_descarga;

        return (
          <article className="exp-doc-item" key={documento.id_documento}>
            {isImage && documentUrl ? (
              <a className="exp-doc-thumb" href={documentUrl} target="_blank" rel="noreferrer">
                <img src={documentUrl} alt={documento.nombre_documento} />
              </a>
            ) : (
              <span className="exp-doc-icon">{documento.extension_archivo.toUpperCase()}</span>
            )}
            <div>
              <h3>{documento.nombre_documento}</h3>
              <p>
                {documento.tipo_documento ? `${documento.tipo_documento} | ` : ''}
                {Number(documento.tamano_archivo).toFixed(2)} MB | {new Date(documento.fecha_carga).toLocaleString()}
              </p>
            </div>
            {documentUrl ? (
              <div className="exp-doc-actions">
                <a className="exp-button exp-button-secondary" href={documentUrl} target="_blank" rel="noreferrer">
                  Ver documento
                </a>
                <a className="exp-button" href={documento.url_descarga ?? documentUrl} target="_blank" rel="noreferrer" download>
                  Descargar
                </a>
              </div>
            ) : (
              <span className="exp-muted">Sin archivo</span>
            )}
          </article>
        );
      })}
    </div>
  );
}
