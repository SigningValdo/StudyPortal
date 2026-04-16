import { FC, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Stepper, { Step } from '@/components/shared/Stepper';
import Button from '@/components/shared/Button';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import {
  FinancementApplicationRequest,
  FinancementDetailsInfo,
  FinancementFollowupInfo,
  FinancementIdentityInfo,
  FinancementJustificationInfo,
  FinancementPersonalInfo,
  FinancementScheduleInfo,
  PERMISSIONS,
} from '@contracts/api-contracts';
import { financementService } from '@services/mock';

import StepPersonalInfo from '../components/StepPersonalInfo';
import StepIdentity from '../components/StepIdentity';
import StepDetails from '../components/StepDetails';
import StepSchedule from '../components/StepSchedule';
import StepJustification from '../components/StepJustification';
import StepFollowup from '../components/StepFollowup';
import {
  ConfirmModal,
  WarningModal,
  SuccessModal,
  ErrorModal,
} from '@/components/shared/FeedbackModal';
import SignaturePadModal from '../components/SignaturePadModal';

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

const STEPS_GROUP_A = [
  { label: 'Informations Personnelles' },
  { label: 'Identités' },
  { label: 'Informations Financières\net Autres Détails' },
] as const;

const STEPS_GROUP_B = [
  { label: 'Echéancier' },
  { label: 'Justificatifs de demande\nde financement' },
  { label: 'Marche à suivre' },
] as const;

const INITIAL_PERSONAL: FinancementPersonalInfo = {
  firstName: '',
  lastName: '',
  birthPlace: '',
  birthDate: '',
  fullAddress: '',
  country: '',
  city: '',
  district: '',
  phoneCountryCode: '+237',
  phoneNumber: '',
  locationPlanFileName: '',
};

const INITIAL_IDENTITY: FinancementIdentityInfo = {
  cniScanFileName: '',
  cniScanPreviewName: '',
  photoFileName: '',
  photoPreviewName: '',
  parent1: { fullName: '', phoneNumber: '', residence: '' },
  parent2: { fullName: '', phoneNumber: '', residence: '' },
};

const INITIAL_DETAILS: FinancementDetailsInfo = {
  serviceType: 'A.V.I',
  serviceCost: '',
  maxFinancing: '',
  amountNeeded: '',
  financingFees: '',
  totalToReimburse: '',
};

const INITIAL_SCHEDULE: FinancementScheduleInfo = {
  installmentsCount: 3,
  entries: [
    { dueDate: '', amount: '' },
    { dueDate: '', amount: '' },
    { dueDate: '', amount: '' },
  ],
};

const INITIAL_JUSTIFICATION: FinancementJustificationInfo = {
  explanation: '',
  files: [
    { id: 'doc-1', name: 'Document_1.pdf' },
    { id: 'doc-2', name: 'Document_2.pdf' },
  ],
};

const INITIAL_FOLLOWUP: FinancementFollowupInfo = {
  steps: [
    { id: 'step-1', label: 'Etape 1', status: 'completed' },
    { id: 'step-2', label: 'Etape 2', status: 'pending' },
    { id: 'step-x', label: 'Etape x', status: 'pending' },
  ],
};

export const FinancementWizardPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSignTarget = searchParams.get('sign');

  const [currentStep, setCurrentStep] = useState<StepIndex>(0);
  const [personal, setPersonal] = useState(INITIAL_PERSONAL);
  const [identity, setIdentity] = useState(INITIAL_IDENTITY);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [justification, setJustification] = useState(INITIAL_JUSTIFICATION);
  const [followup] = useState(INITIAL_FOLLOWUP);

  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [cancelWarningOpen, setCancelWarningOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(initialSignTarget !== null);
  const [submitSuccessOpen, setSubmitSuccessOpen] = useState(false);
  const [submitErrorOpen, setSubmitErrorOpen] = useState(false);
  const [downloadSuccessOpen, setDownloadSuccessOpen] = useState(false);

  const isGroupB = currentStep >= 3;

  const steps: Step[] = useMemo(() => {
    const labels = isGroupB ? STEPS_GROUP_B : STEPS_GROUP_A;
    const localIndex = isGroupB ? currentStep - 3 : currentStep;
    return labels.map((entry, idx) => ({
      label: entry.label,
      status: idx < localIndex ? 'completed' : idx === localIndex ? 'active' : 'pending',
    }));
  }, [currentStep, isGroupB]);

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((currentStep + 1) as StepIndex);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((currentStep - 1) as StepIndex);
  };

  const handleSubmit = async () => {
    const payload: FinancementApplicationRequest = {
      personal,
      identity,
      details,
      schedule,
      justification,
    };
    setSubmitting(true);
    try {
      await financementService.submitApplication(payload);
      setConfirmSubmitOpen(false);
      setSubmitSuccessOpen(true);
    } catch {
      setConfirmSubmitOpen(false);
      setSubmitErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try {
      await financementService.cancelApplication('draft');
      setCancelWarningOpen(false);
      navigate('/financement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignatureConfirm = async (signatureDataUrl: string) => {
    if (!initialSignTarget) {
      setSignatureOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await financementService.signApplication({
        applicationId: initialSignTarget,
        signatureDataUrl,
      });
      setSignatureOpen(false);
      navigate('/financement');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepBody = () => {
    switch (currentStep) {
      case 0:
        return <StepPersonalInfo value={personal} onChange={setPersonal} />;
      case 1:
        return <StepIdentity value={identity} onChange={setIdentity} />;
      case 2:
        return <StepDetails value={details} onChange={setDetails} />;
      case 3:
        return <StepSchedule value={schedule} onChange={setSchedule} />;
      case 4:
        return <StepJustification value={justification} onChange={setJustification} />;
      case 5:
        return (
          <StepFollowup
            value={followup}
            onDownloadSummary={() => {
              setDownloadSuccessOpen(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    // Step 0: Annuler / Suivant
    if (currentStep === 0) {
      return (
        <>
          <Button variant="cancel" onClick={() => setCancelWarningOpen(true)}>
            Annuler
          </Button>
          <Button variant="confirm" onClick={handleNext}>
            Suivant
          </Button>
        </>
      );
    }

    // Step 5 (last): Annuler / Terminer (with submit confirmation)
    if (currentStep === 5) {
      return (
        <>
          <Button variant="cancel" onClick={() => setCancelWarningOpen(true)}>
            Annuler
          </Button>
          <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_CREATE}>
            <Button
              variant="confirm"
              onClick={() => setConfirmSubmitOpen(true)}
              disabled={submitting}
            >
              Terminer
            </Button>
          </ProtectedComponent>
        </>
      );
    }

    // Intermediate steps: Retour / Suivant
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
      <div className=" w-full mx-auto max-w-4xl">
        <Stepper steps={steps} variant="numbered" startIndex={isGroupB ? 3 : 0} />
      </div>

      <div className="mt-10 sm:mt-16 lg:mt-20 w-full mx-auto max-w-5xl">{renderStepBody()}</div>

      <div className="mt-10 sm:mt-16 lg:mt-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">{renderActionButtons()}</div>

      <ConfirmModal
        open={confirmSubmitOpen}
        message={`Êtes vous sur de vouloir "Envoyer" ?`}
        onCancel={() => setConfirmSubmitOpen(false)}
        onConfirm={handleSubmit}
        loading={submitting}
      />

      <WarningModal
        open={cancelWarningOpen}
        message="Attention action critique en cours"
        description="Voulez-vous vraiment annuler votre demande en cours ?"
        onCancel={() => setCancelWarningOpen(false)}
        onConfirm={handleCancel}
        loading={submitting}
      />

      <SuccessModal
        open={submitSuccessOpen}
        message="Action effectuée avec succès"
        description="Votre demande de financement a été envoyée"
        onConfirm={() => {
          setSubmitSuccessOpen(false);
          navigate('/financement');
        }}
      />

      <ErrorModal
        open={submitErrorOpen}
        message="Impossible d'effectuer l'action"
        description="Description de l'erreur"
        onRetry={() => {
          setSubmitErrorOpen(false);
          setConfirmSubmitOpen(true);
        }}
      />

      <SuccessModal
        open={downloadSuccessOpen}
        message="Action effectuée avec succès"
        description="Téléchargement du résumé en cours"
        onConfirm={() => setDownloadSuccessOpen(false)}
      />

      <SignaturePadModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onConfirm={handleSignatureConfirm}
        loading={submitting}
      />
    </section>
  );
};

export default FinancementWizardPage;
