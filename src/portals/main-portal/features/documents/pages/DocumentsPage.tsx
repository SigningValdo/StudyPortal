import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { Document, PERMISSIONS } from '@contracts/api-contracts';
import { documentsService } from '@services/mock';
import { usePermissions } from '@hooks/usePermissions';
import proformaPreview from '@/assets/images/proforma.png';
import contratPreview from '@/assets/images/contrat.png';
import Button from '@/components/shared/Button';

const PREVIEW_SOURCES: Record<NonNullable<Document['preview']>, string> = {
  proforma: proformaPreview,
  contrat: contratPreview,
};

const EyeIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M8.82583 8.82583C9.17746 8.47419 9.375 7.99728 9.375 7.5C9.375 7.00272 9.17746 6.52581 8.82583 6.17417C8.47419 5.82254 7.99728 5.625 7.5 5.625C7.00272 5.625 6.52581 5.82254 6.17417 6.17417C5.82254 6.52581 5.625 7.00272 5.625 7.5C5.625 7.99728 5.82254 8.47419 6.17417 8.82583C6.52581 9.17746 7.00272 9.375 7.5 9.375C7.99728 9.375 8.47419 9.17746 8.82583 8.82583Z"
      stroke="#646464"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M1.53711 7.5C2.33336 4.96437 4.70273 3.125 7.50086 3.125C10.2996 3.125 12.6684 4.96437 13.4646 7.5C12.6684 10.0356 10.2996 11.875 7.50086 11.875C4.70273 11.875 2.33336 10.0356 1.53711 7.5Z"
      stroke="#646464"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const DownloadIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M2.5 10V10.625C2.5 11.1223 2.69754 11.5992 3.04917 11.9508C3.40081 12.3025 3.87772 12.5 4.375 12.5H10.625C11.1223 12.5 11.5992 12.3025 11.9508 11.9508C12.3025 11.5992 12.5 11.1223 12.5 10.625V10M10 7.5L7.5 10M7.5 10L5 7.5M7.5 10V2.5"
      stroke="#646464"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const EditIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M9.375 2.5L12.5 5.625M10.9375 0.9375C11.3519 0.523122 11.9136 0.290419 12.5 0.290419C13.0864 0.290419 13.6481 0.523122 14.0625 0.9375C14.4769 1.35188 14.7096 1.91364 14.7096 2.5C14.7096 3.08636 14.4769 3.64812 14.0625 4.0625L4.375 13.75L0.9375 14.0625L1.25 10.625L10.9375 0.9375Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M1.875 3.75H13.125M5.625 6.875V11.25M9.375 6.875V11.25M2.8125 3.75L3.4375 12.5C3.4375 12.8315 3.56919 13.1495 3.80361 13.3839C4.03804 13.6183 4.35598 13.75 4.6875 13.75H10.3125C10.644 13.75 10.962 13.6183 11.1964 13.3839C11.4308 13.1495 11.5625 12.8315 11.5625 12.5L12.1875 3.75M5.3125 3.75V1.875C5.3125 1.70924 5.37835 1.55027 5.49556 1.43306C5.61277 1.31585 5.77174 1.25 5.9375 1.25H9.0625C9.22826 1.25 9.38723 1.31585 9.50444 1.43306C9.62165 1.55027 9.6875 1.70924 9.6875 1.875V3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M7.5 3.125V11.875M3.125 7.5H11.875"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const DocumentsPage: FC = () => {
  const { hasPermission } = usePermissions();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    documentsService.getAllDocuments().then((res) => {
      setDocs(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const canSubmit = useMemo(() => docs.length > 0, [docs]);

  const handleDownload = async (id: string) => {
    const res = await documentsService.downloadDocument(id);
    if (res.success && import.meta.env.DEV) {
      console.log('Téléchargement mock :', res.data);
    }
  };

  const handlePreview = (doc: Document) => {
    if (import.meta.env.DEV) {
      console.log('Prévisualisation mock :', doc.url);
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const res = await documentsService.uploadDocument(file);
    if (res.success) {
      setDocs((prev) => [res.data, ...prev]);
    }
    event.target.value = '';
  };

  const handleRename = async (doc: Document) => {
    const newName = window.prompt('Nouveau nom du document', doc.name);
    if (!newName || newName.trim() === '' || newName === doc.name) return;
    const previous = docs;
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, name: newName.trim() } : d)),
    );
    const res = await documentsService.updateDocument(doc.id, { name: newName.trim() });
    if (!res.success) setDocs(previous);
  };

  const handleDelete = async (doc: Document) => {
    const ok = window.confirm(`Supprimer "${doc.name}" ?`);
    if (!ok) return;
    const previous = docs;
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    const res = await documentsService.deleteDocument(doc.id);
    if (!res.success) setDocs(previous);
  };

  const hasAnyAdminAction =
    hasPermission(PERMISSIONS.DOCUMENT_UPDATE) || hasPermission(PERMISSIONS.DOCUMENT_DELETE);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border-soft bg-white">
      <ProtectedComponent
        requiredPermissions={PERMISSIONS.DOCUMENT_READ}
        fallback={
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-brand-text-muted">
            Vous n'avez pas la permission de consulter les documents.
          </div>
        }
      >
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <ProtectedComponent requiredPermissions={PERMISSIONS.DOCUMENT_UPLOAD}>
            <div className="mb-4 flex justify-end sm:mb-6">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <PlusIcon />
                Ajouter un document
              </button>
            </div>
          </ProtectedComponent>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-brand-border-soft bg-white"
                >
                  <div className="h-44 w-full bg-[#EEF0F4] sm:h-52" />
                  <div className="h-11 w-full bg-brand-primary/40" />
                </div>
              ))}
            </div>
          ) : docs.length === 0 ? (
            <div className="flex h-full items-center justify-center py-16 text-sm text-brand-text-muted">
              Aucun document pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6 lg:gap-8">
              {docs.map((doc) => {
                const previewSrc = doc.preview ? PREVIEW_SOURCES[doc.preview] : undefined;
                return (
                  <div
                    key={doc.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-brand-border-soft bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-[#F5F6FA] sm:h-52">
                      {previewSrc ? (
                        <img
                          src={previewSrc}
                          alt={doc.name}
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-brand-text-muted">
                          PDF
                        </div>
                      )}

                      {hasAnyAdminAction && (
                        <div className="absolute right-2 top-2 flex gap-1.5">
                          <ProtectedComponent requiredPermissions={PERMISSIONS.DOCUMENT_UPDATE}>
                            <button
                              type="button"
                              onClick={() => void handleRename(doc)}
                              aria-label={`Renommer ${doc.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-text-muted shadow-sm transition-colors hover:text-brand-primary"
                            >
                              <EditIcon />
                            </button>
                          </ProtectedComponent>
                          <ProtectedComponent requiredPermissions={PERMISSIONS.DOCUMENT_DELETE}>
                            <button
                              type="button"
                              onClick={() => void handleDelete(doc)}
                              aria-label={`Supprimer ${doc.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#F21E1E] shadow-sm transition-colors hover:bg-[#F21E1E] hover:text-white"
                            >
                              <TrashIcon />
                            </button>
                          </ProtectedComponent>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-brand-primary px-3 py-3 text-sm font-semibold text-white">
                      <ProtectedComponent requiredPermissions={PERMISSIONS.DOCUMENT_DOWNLOAD}>
                        <button
                          type="button"
                          onClick={() => void handleDownload(doc.id)}
                          aria-label={`Télécharger ${doc.name}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white "
                        >
                          <DownloadIcon />
                        </button>
                      </ProtectedComponent>
                      <button
                        type="button"
                        onClick={() => handlePreview(doc)}
                        aria-label={`Prévisualiser ${doc.name}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white "
                      >
                        <EyeIcon />
                      </button>
                      <span className="truncate">{doc.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ProtectedComponent>

      <div className="flex items-center justify-center gap-3 bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Button variant="cancel">Annuler</Button>
        <Button variant="confirm" disabled={!canSubmit}>
          Suivant
        </Button>
      </div>
    </section>
  );
};

export default DocumentsPage;
