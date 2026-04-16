import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '@/components/shared/Stepper';
import Button from '@/components/shared/Button';
import {
  HousingApplicationRequest,
  HousingFinancialInfo,
  HousingPersonalInfo,
  HousingTrainingInfo,
} from '@contracts/api-contracts';
import { housingService } from '@services/mock';
import StepPersonalInfo from '../components/StepPersonalInfo';
import StepTrainingInfo from '../components/StepTrainingInfo';
import StepFinancialInfo from '../components/StepFinancialInfo';
import SuccessPanel from '../components/SuccessPanel';

type StepIndex = 0 | 1 | 2;

const INITIAL_PERSONAL: HousingPersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phoneCountryCode: '+237',
  phoneNumber: '',
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  passportScanName: '',
  aviDuration: '12 mois',
};

const INITIAL_TRAINING: HousingTrainingInfo = {
  institutionName: '',
  trainingTitle: '',
  city: '',
  startDate: '',
  admissionLetterName: '',
};

const INITIAL_FINANCIAL: HousingFinancialInfo = {
  schoolYear: '2024/2025',
  monthlyAmountEuro: '',
  originCurrency: 'FCFA',
  aviDuration: '12 mois',
  isRenewal: 'Non',
  travelPurpose: 'Etudes',
  acsInsurance: 'Oui',
};

const STEP_LABELS = [
  { label: 'Mes informations', description: '' },
  { label: 'Détails de la formation', description: '' },
  { label: 'Informations Financières et Autres Détails', description: '' },
] as const;

export const HousingApplicationPage: FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [personal, setPersonal] = useState<HousingPersonalInfo>(INITIAL_PERSONAL);
  const [training, setTraining] = useState<HousingTrainingInfo>(INITIAL_TRAINING);
  const [financial, setFinancial] = useState<HousingFinancialInfo>(INITIAL_FINANCIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps: Step[] = useMemo(() => {
    if (submitted) {
      return STEP_LABELS.map(({ label, description }) => ({
        label,
        description,
        status: 'completed',
      }));
    }
    return STEP_LABELS.map(({ label, description }, idx) => ({
      label,
      description,
      status: idx < currentStep ? 'completed' : idx === currentStep ? 'active' : 'pending',
    }));
  }, [currentStep, submitted]);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((currentStep + 1) as StepIndex);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((currentStep - 1) as StepIndex);
  };

  const handleSubmit = async () => {
    const payload: HousingApplicationRequest = { personal, training, financial };
    setSubmitting(true);
    try {
      await housingService.submitApplication(payload);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full flex flex-col lg:justify-center w-full items-center overflow-x-hidden bg-white p-4 sm:p-6 lg:p-10">
      <div className=" w-full max-w-4xl">
        <Stepper steps={steps} variant={submitted ? 'icon' : 'numbered'} />
      </div>

      <div className="mt-10 sm:mt-16 lg:mt-20 w-full max-w-5xl">
        {submitted ? (
          <SuccessPanel onGoToRequests={() => navigate('/')} />
        ) : (
          <>
            {currentStep === 0 && <StepPersonalInfo value={personal} onChange={setPersonal} />}
            {currentStep === 1 && <StepTrainingInfo value={training} onChange={setTraining} />}
            {currentStep === 2 && <StepFinancialInfo value={financial} onChange={setFinancial} />}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              {currentStep === 0 ? (
                <Button variant="cancel" onClick={() => navigate('/')} disabled>
                  Annuler
                </Button>
              ) : (
                <Button variant="cancel" onClick={handleBack}>
                  Retour
                </Button>
              )}
              {currentStep < 2 ? (
                <Button variant="confirm" onClick={handleNext}>
                  Suivant
                </Button>
              ) : (
                <Button variant="confirm" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? '...' : 'Envoyer'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HousingApplicationPage;
