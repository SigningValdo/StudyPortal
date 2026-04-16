import {
  ApiResponse,
  FinancementApplication,
  FinancementApplicationRequest,
  FinancementFollowupInfo,
  FinancementListRow,
  FinancementSignaturePayload,
} from '@contracts/api-contracts';

const DEFAULT_FOLLOWUP: FinancementFollowupInfo = {
  steps: [
    { id: 'step-1', label: 'Etape 1', status: 'completed' },
    { id: 'step-2', label: 'Etape 2', status: 'pending' },
    { id: 'step-x', label: 'Etape x', status: 'pending' },
  ],
};

const MOCK_APPLICATIONS: FinancementApplication[] = [];

const MOCK_LIST: FinancementListRow[] = [
  {
    id: 'fin-001',
    reference: '01',
    applicantName: 'YONKE',
    amount: 1_000_000,
    serviceType: 'A.V.I',
    requestDate: '23/02/2026',
    alreadyReimbursed: 0,
    remaining: 0,
    documentAction: 'Aucun document',
    rowStatus: 'En cours',
  },
  {
    id: 'fin-002',
    reference: '02',
    applicantName: '-',
    amount: 1_000_000,
    serviceType: '-',
    requestDate: '-',
    alreadyReimbursed: 2_000_000,
    remaining: 1_000_000,
    documentAction: 'Télécharger',
    rowStatus: 'En remboursement',
  },
  {
    id: 'fin-003',
    reference: '03',
    applicantName: '-',
    amount: 2_000_000,
    serviceType: '-',
    requestDate: '-',
    alreadyReimbursed: 2_000_000,
    remaining: 0,
    documentAction: 'Télécharger',
    rowStatus: 'Clôturé',
  },
  {
    id: 'fin-004',
    reference: '04',
    applicantName: '-',
    amount: 1_000_000,
    serviceType: '-',
    requestDate: '-',
    alreadyReimbursed: 500_000,
    remaining: 2_500_000,
    documentAction: 'Télécharger',
    rowStatus: 'Echéance ratée',
  },
  {
    id: 'fin-005',
    reference: '05',
    applicantName: '-',
    amount: 1_000_000,
    serviceType: '-',
    requestDate: '-',
    alreadyReimbursed: 0,
    remaining: 0,
    documentAction: 'Aucun document',
    rowStatus: 'Rejeté',
  },
  {
    id: 'fin-006',
    reference: '06',
    applicantName: '-',
    amount: 5_000_000,
    serviceType: 'A.V.I',
    requestDate: '20/03/2026',
    alreadyReimbursed: 0,
    remaining: 0,
    documentAction: 'Signer',
    rowStatus: 'Accepté',
  },
];

const networkDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const financementService = {
  getAllApplications: async (): Promise<ApiResponse<FinancementListRow[]>> => {
    await networkDelay(400);
    return {
      success: true,
      data: [...MOCK_LIST],
      message: 'Demandes de financement récupérées',
    };
  },

  submitApplication: async (
    payload: FinancementApplicationRequest,
  ): Promise<ApiResponse<FinancementApplication>> => {
    await networkDelay(700);

    const id = `fin-${Date.now()}`;
    const application: FinancementApplication = {
      ...payload,
      id,
      reference: id.slice(-2).toUpperCase(),
      submittedAt: new Date().toISOString(),
      submittedBy: 'current-user',
      status: 'En préparation',
      followup: DEFAULT_FOLLOWUP,
    };

    MOCK_APPLICATIONS.unshift(application);

    return {
      success: true,
      data: application,
      message: 'Demande de financement enregistrée',
    };
  },

  cancelApplication: async (
    applicationId: string,
  ): Promise<ApiResponse<{ id: string }>> => {
    await networkDelay(400);
    return {
      success: true,
      data: { id: applicationId },
      message: 'Demande annulée',
    };
  },

  signApplication: async (
    payload: FinancementSignaturePayload,
  ): Promise<ApiResponse<{ id: string; signedAt: string }>> => {
    await networkDelay(500);
    return {
      success: true,
      data: { id: payload.applicationId, signedAt: new Date().toISOString() },
      message: 'Signature enregistrée',
    };
  },
};
