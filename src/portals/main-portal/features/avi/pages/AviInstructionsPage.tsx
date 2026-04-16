import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/shared/Button';

interface InstructionStep {
  id: number;
  content: React.ReactNode;
  completed?: boolean;
}

const CheckIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12L10 17L20 7"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 8V13" stroke="#0140FF" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.2" fill="#0140FF" />
  </svg>
);

export const AviInstructionsPage: FC = () => {
  const navigate = useNavigate();

  const steps: InstructionStep[] = [
    {
      id: 1,
      completed: true,
      content: (
        <>
          La proforma vous a été envoyé par email.{' '}
          <a href="#" className="text-brand-primary underline">
            Cliquez ici pour télécharger
          </a>
        </>
      ),
    },
    {
      id: 2,
      content:
        'Vous devez aller en banque effectuer le versement en précisant les informations de la proforma',
    },
    {
      id: 3,
      content:
        'Ensuite aller à mes souscriptions de votre espace, choisissez ce service et allez au dépôt de la preuve de versement',
    },
  ];

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full bg-white p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-xl sm:text-2xl text-center font-medium text-brand-dark">Instructions</h1>

        <div className="relative mt-12 pl-6">
          {/* Ligne verticale reliant les étapes */}
          <div
            className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-brand-border-soft"
            aria-hidden
          />

          <ul className="flex flex-col gap-4 sm:gap-6 lg:gap-10">
            {steps.map((step) => (
              <li key={step.id} className="flex items-start gap-4">
                <span
                  className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    step.completed ? 'bg-brand-primary' : 'border-2 border-brand-primary bg-white'
                  }`}
                >
                  {step.completed ? <CheckIcon /> : <InfoIcon />}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-brand-dark">{step.content}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex items-center justify-center">
          <Button variant="confirm" onClick={() => navigate('/services/avi/souscriptions')}>
            Aller à mes services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AviInstructionsPage;
