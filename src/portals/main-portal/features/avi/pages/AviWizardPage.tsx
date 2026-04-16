import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '@/components/shared/Stepper';
import Button from '@/components/shared/Button';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import {
  AviApplicationRequest,
  AviFinancialInfo,
  AviPersonalInfo,
  AviProformaKind,
  AviTrainingInfo,
  PERMISSIONS,
} from '@contracts/api-contracts';
import { aviService } from '@services/mock';

import StepPersonalInfo from '../components/StepPersonalInfo';
import StepTraining from '../components/StepTraining';
import StepFinancial from '../components/StepFinancial';
import StepPaymentPrinciple from '../components/StepPaymentPrinciple';
import StepPaymentMode from '../components/StepPaymentMode';
import StepBankInfo from '../components/StepBankInfo';
import StepProforma from '../components/StepProforma';
import StepContract from '../components/StepContract';
import SignaturePadModal from '../components/SignaturePadModal';
import { SuccessModal } from '@/components/shared/FeedbackModal';

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// 9 steps in 3 groups: 01-03, 04-06, 07-09
const STEPS_GROUP_A = [
  { label: 'Informations\nPersonnelles' },
  { label: 'Informations\nde Formation' },
  { label: 'Informations\nFinancières' },
] as const;

const STEPS_GROUP_B = [
  { label: 'Principe de\nPaiement' },
  { label: 'Mode de\nPaiement' },
  { label: 'Sélection\nde la Banque' },
] as const;

const STEPS_GROUP_C = [
  { label: 'Coordonnées\nBancaires' },
  { label: 'Proforma' },
  { label: 'Contrat' },
] as const;

const INITIAL_PERSONAL: AviPersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phoneCountryCode: '+237',
  phoneNumber: '',
  passportNumber: '',
  passportIssueDate: '',
  passportExpiryDate: '',
  passportScanName: '',
};

const INITIAL_TRAINING: AviTrainingInfo = {
  institutionName: '',
  trainingTitle: '',
  city: '',
  startDate: '',
  admissionLetterName: '',
};

const INITIAL_FINANCIAL: AviFinancialInfo = {
  schoolYear: '2025/2026',
  monthlyAmountEuro: '',
  originCurrency: 'FCFA',
  aviDuration: '12 mois',
  isRenewal: 'Non',
  travelPurpose: 'Etudes',
  acsInsurance: 'Non',
};

type GroupKey = 'A' | 'B' | 'C';

const getGroup = (step: StepIndex): GroupKey => {
  if (step <= 2) return 'A';
  if (step <= 5) return 'B';
  return 'C';
};

const getGroupSteps = (group: GroupKey) => {
  if (group === 'A') return STEPS_GROUP_A;
  if (group === 'B') return STEPS_GROUP_B;
  return STEPS_GROUP_C;
};

const GROUP_START_INDEX: Record<GroupKey, number> = { A: 0, B: 3, C: 6 };

export const AviWizardPage: FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [personal, setPersonal] = useState<AviPersonalInfo>(INITIAL_PERSONAL);
  const [training, setTraining] = useState<AviTrainingInfo>(INITIAL_TRAINING);
  const [financial, setFinancial] = useState<AviFinancialInfo>(INITIAL_FINANCIAL);
  const [paymentPrinciple, setPaymentPrinciple] =
    useState<AviApplicationRequest['payment']['principle']>('');
  const [paymentMode, setPaymentMode] = useState<AviApplicationRequest['payment']['mode']>('');
  const [bank, setBank] = useState<AviApplicationRequest['payment']['bank']>('');
  const [proformaSelected, setProformaSelected] = useState<AviProformaKind | null>(null);
  const [isSigned, setIsSigned] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const group = getGroup(currentStep);
  const groupSteps = getGroupSteps(group);
  const localIndex = currentStep - GROUP_START_INDEX[group];
  const startIndex = GROUP_START_INDEX[group];

  const steps: Step[] = useMemo(
    () =>
      groupSteps.map((entry, idx) => ({
        label: entry.label,
        status: idx < localIndex ? 'completed' : idx === localIndex ? 'active' : 'pending',
      })),
    [groupSteps, localIndex]
  );

  const handleNext = () => {
    if (currentStep < 8) setCurrentStep((currentStep + 1) as StepIndex);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((currentStep - 1) as StepIndex);
  };

  const handleSignatureConfirm = async (dataUrl: string) => {
    setIsSigned(true);
    const payload: AviApplicationRequest = {
      personal,
      training,
      financial,
      payment: { principle: paymentPrinciple, mode: paymentMode, bank },
      signature: { signatureDataUrl: dataUrl, signedAt: new Date().toISOString() },
    };
    setSubmitting(true);
    try {
      await aviService.submitApplication(payload);
      setSignatureOpen(false);
      setSuccessOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessContinue = () => {
    setSuccessOpen(false);
    navigate('/services/avi/instructions');
  };

  const renderStepBody = () => {
    switch (currentStep) {
      case 0:
        return <StepPersonalInfo value={personal} onChange={setPersonal} />;
      case 1:
        return <StepTraining value={training} onChange={setTraining} />;
      case 2:
        return <StepFinancial value={financial} onChange={setFinancial} />;
      case 3:
        return <StepPaymentPrinciple value={paymentPrinciple} onChange={setPaymentPrinciple} />;
      case 4:
        return <StepPaymentMode value={paymentMode} onChange={setPaymentMode} />;
      case 5:
        return <StepBankInfo value={bank} onChange={setBank} showRib={false} />;
      case 6:
        return <StepBankInfo value={bank} onChange={setBank} showRib={true} />;
      case 7:
        return <StepProforma selected={proformaSelected} onSelect={setProformaSelected} />;
      case 8:
        return <StepContract onSign={() => setSignatureOpen(true)} isSigned={isSigned} />;
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (currentStep === 0) {
      return (
        <>
          <Button variant="cancel" onClick={() => navigate('/services/avi')}>
            Annuler
          </Button>
          <Button variant="confirm" onClick={handleNext}>
            Suivant
          </Button>
        </>
      );
    }
    if (currentStep === 7) {
      return (
        <>
          <Button variant="cancel" onClick={() => navigate('/services/avi')}>
            Annuler
          </Button>
          <Button variant="confirm" onClick={handleNext}>
            Voir le contrat
          </Button>
        </>
      );
    }

    if (currentStep === 8) {
      return (
        <>
          <Button variant="cancel" onClick={handleBack}>
            Retour
          </Button>
          <ProtectedComponent requiredPermissions={PERMISSIONS.AVI_CREATE}>
            <Button
              variant="confirm"
              className="!w-[139px]"
              onClick={() => setSignatureOpen(true)}
              disabled={submitting}
            >
              {submitting ? '...' : 'Cliquer pour signer'}
            </Button>
          </ProtectedComponent>
        </>
      );
    }

    return (
      <>
        <Button variant="cancel" onClick={handleBack}>
          Retour
        </Button>
        <Button variant="confirm" onClick={handleNext}>
          Suivant
        </Button>
      </>
    );
  };

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full flex flex-col lg:justify-center w-full items-center overflow-x-hidden bg-white p-4 sm:p-6 lg:p-10">
      <div className="w-full mx-auto max-w-4xl">
        <Stepper steps={steps} variant="numbered" startIndex={startIndex} />
      </div>

      <div className="mt-10 sm:mt-16 lg:mt-20 w-full mx-auto max-w-5xl">{renderStepBody()}</div>

      <div className="mt-10 sm:mt-16 lg:mt-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">{renderActionButtons()}</div>

      <SignaturePadModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onConfirm={handleSignatureConfirm}
        loading={submitting}
      />

      <SuccessModal
        open={successOpen}
        title="SUCCESS!"
        message="Contrat signé avec succès"
        description="Votre demande d'Attestation de Virement Irrévocable a bien été enregistrée."
        onConfirm={handleSuccessContinue}
      />
    </section>
  );
};

export default AviWizardPage;
