import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/shared/Button';
import { SuccessModal } from '@/components/shared/FeedbackModal';

interface ParcoursStep {
  id: number;
  title: string;
  description: string;
}

const PARCOURS_STEPS: ParcoursStep[] = [
  {
    id: 1,
    title: 'Informations Personnelles',
    description: 'Ici, veuillez remplir vos informations personnelles',
  },
  {
    id: 2,
    title: 'Détails de la Formation',
    description: 'Ici, veuillez renseigner les détails de votre formation',
  },
  {
    id: 3,
    title: 'Informations Financières et Autres',
    description: 'Ici, veuillez compléter vos informations financières et autres détails requis',
  },
  {
    id: 4,
    title: 'Principe de paiement',
    description: 'Ici, veuillez choisir le principe de paiement qui vous convient',
  },
  {
    id: 5,
    title: 'Mode de paiement',
    description: 'Ici, veuillez sélectionner votre mode de paiement',
  },
  {
    id: 6,
    title: 'Etablissement bancaire',
    description: "Ici, veuillez indiquer l'établissement bancaire concerné",
  },
  {
    id: 7,
    title: 'Coordonnées bancaires',
    description: 'Ici, veuillez saisir vos coordonnées bancaires',
  },
  {
    id: 8,
    title: 'Proforma',
    description: 'Ici, veuillez consulter et valider la proforma',
  },
  {
    id: 9,
    title: 'Mon contrat',
    description: 'Ici, veuillez consulter et signer votre contrat',
  },
  {
    id: 10,
    title: 'Dépôt de preuve',
    description: 'Ici, veuillez déposer la preuve de votre paiement',
  },
];

const ChevronIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M6.92822 12L2.01226e-05 -1.30507e-06L13.8564 -9.36995e-08L6.92822 12Z"
      fill="#646464"
    />
  </svg>
);

const DownloadIcon: FC = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="7" x2="1" y2="13" stroke="white" stroke-width="2" stroke-linecap="round" />
    <line x1="19" y1="7" x2="19" y2="13" stroke="white" stroke-width="2" stroke-linecap="round" />
    <line x1="1" y1="14" x2="19" y2="14" stroke="white" stroke-width="2" stroke-linecap="round" />
    <path
      d="M9.64645 10.3536C9.84171 10.5488 10.1583 10.5488 10.3536 10.3536L13.5355 7.17157C13.7308 6.97631 13.7308 6.65973 13.5355 6.46447C13.3403 6.2692 13.0237 6.2692 12.8284 6.46447L10 9.29289L7.17157 6.46447C6.97631 6.2692 6.65973 6.2692 6.46447 6.46447C6.2692 6.65973 6.2692 6.97631 6.46447 7.17157L9.64645 10.3536ZM10 0L9.5 0V10H10H10.5V0L10 0Z"
      fill="white"
    />
  </svg>
);

export const AviParcoursPage: FC = () => {
  const navigate = useNavigate();
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [downloadSuccessOpen, setDownloadSuccessOpen] = useState(false);

  const toggleStep = (id: number) => setOpenStep((prev) => (prev === id ? null : id));

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full bg-white p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl sm:text-2xl text-center font-bold text-brand-dark">Parcours à suivre</h1>

          <div className="mt-11 space-y-4">
            {PARCOURS_STEPS.map((step) => {
              const isOpen = openStep === step.id;
              return (
                <div key={step.id} className="flex items-start">
                  <div className="flex items-center flex-shrink-0">
                    <span
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold bg-white border border-brand-primary text-brand-primary`}
                    >
                      {String(step.id).padStart(2, '0')}
                    </span>
                    <hr className="border-[6px] relative -left-[1px] border-primary w-2 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`rounded-xl border w-full transition-colors border-brand-primary overflow-hidden`}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 sm:gap-4 pl-3 sm:pl-5 text-left"
                        onClick={() => toggleStep(step.id)}
                      >
                        <span
                          className={`min-w-0 flex-1 text-xs sm:text-sm font-semibold ${
                            isOpen ? 'text-brand-primary' : 'text-[#999999]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="border text-[10px] sm:text-xs py-1 px-2 sm:w-28 flex-shrink-0 rounded-md border-brand-text-muted">
                          Aller à la page
                        </span>
                        <span className="bg-[#D9D9D9] h-9 w-9 sm:h-10 sm:w-10 flex flex-shrink-0 items-center justify-center">
                          <ChevronIcon open={isOpen} />
                        </span>
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-2 sm:px-4">
                        <div
                          className={`rounded-b-xl border border-t-0 w-full transition-colors border-brand-primary px-3 sm:px-5 pt-2 pb-4`}
                        >
                          <p className="text-xs leading-relaxed text-brand-text-muted">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-full ml-auto max-w-2xl mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setDownloadSuccessOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#868484] px-6 py-3 text-xl font-meduim text-white transition-colors hover:bg-[#868484]/70"
          >
            Télécharger un résumé
            <DownloadIcon />
          </button>
          <Button
            variant="confirm"
            className="min-w-52"
            onClick={() => navigate('/services/avi/nouvelle')}
          >
            Commencer
          </Button>
        </div>
      </div>

      <SuccessModal
        open={downloadSuccessOpen}
        message="Action effectuée avec succès"
        description="Téléchargement du résumé en cours"
        onConfirm={() => setDownloadSuccessOpen(false)}
      />
    </section>
  );
};

export default AviParcoursPage;
