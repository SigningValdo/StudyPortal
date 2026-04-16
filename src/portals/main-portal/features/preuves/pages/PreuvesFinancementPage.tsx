import { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PreuveServiceType } from '@contracts/api-contracts';
import { preuvesService } from '@services/mock';
import Button from '@/components/shared/Button';
import { SuccessModal, WarningModal } from '@/components/shared/FeedbackModal';

const SERVICE_OPTIONS: readonly PreuveServiceType[] = [
  'A.V.I',
  'Logement',
  'Assurance',
  'Admission',
];

const CameraIcon: FC = () => (
  <svg width="58" height="52" viewBox="0 0 58 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M28.666 36.6665C33.0843 36.6665 36.666 33.0848 36.666 28.6665C36.666 24.2482 33.0843 20.6665 28.666 20.6665C24.2477 20.6665 20.666 24.2482 20.666 28.6665C20.666 33.0848 24.2477 36.6665 28.666 36.6665Z"
      stroke="#646464"
      stroke-width="4"
    />
    <path
      d="M2 29.6363C2 21.4651 2 17.3792 3.99739 14.4443C4.86208 13.1737 5.9732 12.0828 7.26731 11.2338C9.18813 9.97368 11.5929 9.52328 15.2747 9.36229C17.0316 9.36229 18.5443 8.05515 18.8889 6.36363C19.4057 3.82637 21.6748 2 24.3101 2H33.0232C35.6584 2 37.9275 3.82637 38.4445 6.36363C38.7891 8.05515 40.3016 9.36229 42.0587 9.36229C45.7405 9.52328 48.1451 9.97368 50.0661 11.2338C51.36 12.0828 52.4712 13.1737 53.336 14.4443C55.3333 17.3792 55.3333 21.4651 55.3333 29.6363C55.3333 37.8077 55.3333 41.8936 53.336 44.8285C52.4712 46.0989 51.36 47.1899 50.0661 48.0389C47.0768 50 42.9155 50 34.5925 50H22.7407C14.418 50 10.2566 50 7.26731 48.0389C5.9732 47.1899 4.86208 46.0989 3.99739 44.8285C3.43323 43.9995 3.02843 43.0787 2.73795 42"
      stroke="#646464"
      stroke-width="4"
      stroke-linecap="round"
    />
    <path d="M47.3327 20.6665H44.666" stroke="#646464" stroke-width="4" stroke-linecap="round" />
  </svg>
);

const ChevronDownIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="20" height="20" rx="2" fill="#D8D8D8" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.29279 7.29308C5.48031 7.10561 5.73462 7.00029 5.99979 7.00029C6.26495 7.00029 6.51926 7.10561 6.70679 7.29308L9.99979 10.5861L13.2928 7.29308C13.385 7.19757 13.4954 7.12139 13.6174 7.06898C13.7394 7.01657 13.8706 6.98898 14.0034 6.98783C14.1362 6.98668 14.2678 7.01198 14.3907 7.06226C14.5136 7.11254 14.6253 7.18679 14.7192 7.28069C14.8131 7.37458 14.8873 7.48623 14.9376 7.60913C14.9879 7.73202 15.0132 7.8637 15.012 7.99648C15.0109 8.12926 14.9833 8.26048 14.9309 8.38249C14.8785 8.50449 14.8023 8.61483 14.7068 8.70708L10.7068 12.7071C10.5193 12.8946 10.265 12.9999 9.99979 12.9999C9.73462 12.9999 9.48031 12.8946 9.29279 12.7071L5.29279 8.70708C5.10532 8.51955 5 8.26525 5 8.00008C5 7.73492 5.10532 7.48061 5.29279 7.29308Z"
      fill="#646464"
    />
  </svg>
);

export const PreuvesFinancementPage: FC = () => {
  const navigate = useNavigate();
  const documentInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [serviceType, setServiceType] = useState<PreuveServiceType | ''>('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasDocument = documentFile !== null || photoFile !== null;
  const canSubmit = serviceType !== '' && hasDocument;

  const loadPreview = (file: File, setter: (url: string | null) => void) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setter(typeof reader.result === 'string' ? reader.result : null);
      reader.readAsDataURL(file);
    } else {
      setter(null);
    }
  };

  const handleDocumentChange = (file: File | null) => {
    setDocumentFile(file);
    if (file) loadPreview(file, setDocumentPreview);
    else setDocumentPreview(null);
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) loadPreview(file, setPhotoPreview);
    else setPhotoPreview(null);
  };

  const handleNext = () => {
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (serviceType === '') return;
    setSubmitting(true);
    await preuvesService.submitProof({
      serviceType,
      documentFileName: documentFile?.name ?? '',
      photoFileName: photoFile?.name ?? null,
    });
    setSubmitting(false);
    setConfirmOpen(false);
    setSuccessOpen(true);
  };

  const handleSuccessContinue = () => {
    setSuccessOpen(false);
    navigate('/');
  };

  const activePreview = photoPreview ?? documentPreview;
  const previewCaption = photoFile?.name ?? documentFile?.name ?? '';

  return (
    <section className="rounded-[25px] border border-brand-border-soft bg-white min-h-full p-4 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="flex flex-col gap-3">
            <div className="relative w-full max-w-xs flex items-center">
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as PreuveServiceType | '')}
                className="w-full appearance-none rounded-[8px] bg-[#EFF1F999] px-4 py-3 pr-10 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">Cliquez ici pour sélectionner le service</option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-dark">
                <ChevronDownIcon />
              </div>
            </div>
            <div className="shadow-[0_7px_16px_0_rgba(0,0,0,0.05)] border border-brand-muted rounded-[14px] bg-white py-8 px-4">
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="flex h-[111px] w-full flex-col items-center justify-center gap-3 rounded-[14px] border-[2px] border-dashed border-brand-muted bg-white text-brand-text-muted transition-colors hover:border-brand-primary/60"
              >
                <span className="text-sm font-medium">
                  {documentFile ? documentFile.name : 'Charger le document'}
                </span>
                <input
                  ref={documentInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleDocumentChange(e.target.files?.[0] ?? null)}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-16 text-sm font-medium text-brand-text-muted lg:pt-[72px]">
            Ou
          </div>

          <div className="flex flex-col items-center gap-2 lg:pt-7">
            <span className="text-sm font-medium text-brand-text-muted">Prendre une photo</span>
            <div className="shadow-[0_7px_16px_0_rgba(0,0,0,0.05)] border border-brand-muted rounded-[14px] bg-white py-8 px-4">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex h-[111px] w-[182px] flex-col items-center justify-center gap-1 rounded-[14px] border-[2px] border-dashed border-brand-muted bg-white transition-colors hover:border-brand-primary/60"
              >
                <CameraIcon />
                <span className="text-[11px] text-brand-text-muted">camera</span>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[14px] border border-brand-muted bg-white shadow-[0_7px_16px_0_rgba(0,0,0,0.05)]">
          {activePreview ? (
            <img
              src={activePreview}
              alt="Aperçu de la preuve"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm text-brand-text-muted">{previewCaption}</span>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="cancel" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button variant="confirm" onClick={handleNext} disabled={!canSubmit}>
            Suivant
          </Button>
        </div>
      </div>

      <WarningModal
        open={confirmOpen}
        title="ATTENTION!"
        message={`Vous confirmez l'envoi de la preuve de financement${
          serviceType ? ` pour le service ${serviceType}` : ''
        }. Après confirmation, vos documents seront transmis pour vérification.`}
        cancelLabel="Annuler"
        confirmLabel="Confirmer"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={submitting}
      />

      <SuccessModal
        open={successOpen}
        title="Félicitation"
        message="Preuve de financement envoyée avec succès"
        description="Vous recevrez une confirmation par mail une fois vérifiée."
        buttonLabel="Voir un récapitulatif"
        onConfirm={handleSuccessContinue}
        // iconStyle="check"
      />
    </section>
  );
};

export default PreuvesFinancementPage;
