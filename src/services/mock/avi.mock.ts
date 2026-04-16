import {
  ApiResponse,
  AviApplication,
  AviApplicationRequest,
  AviSubscriptionRow,
} from '@contracts/api-contracts';

const MOCK_APPLICATIONS: AviApplication[] = [];

const MOCK_SUBSCRIPTIONS: AviSubscriptionRow[] = [
  {
    id: 'avi-001',
    reference: '01',
    name: 'Mon_AVI',
    service: 'AVI',
    date: '12/03/2026',
    status: 'En préparation',
    documentAttached: false,
  },
];

const networkDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const aviService = {
  getSubscriptions: async (): Promise<ApiResponse<AviSubscriptionRow[]>> => {
    await networkDelay(400);
    return {
      success: true,
      data: [...MOCK_SUBSCRIPTIONS],
      message: 'Souscriptions AVI récupérées',
    };
  },

  submitApplication: async (
    payload: AviApplicationRequest,
  ): Promise<ApiResponse<AviApplication>> => {
    await networkDelay(700);
    const id = `avi-${Date.now()}`;
    const application: AviApplication = {
      ...payload,
      id,
      reference: id.slice(-2).toUpperCase(),
      submittedAt: new Date().toISOString(),
      submittedBy: 'current-user',
      status: 'En préparation',
    };
    MOCK_APPLICATIONS.unshift(application);
    MOCK_SUBSCRIPTIONS.unshift({
      id,
      reference: String(MOCK_SUBSCRIPTIONS.length + 1).padStart(2, '0'),
      name: 'Mon_AVI',
      service: 'AVI',
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En préparation',
      documentAttached: false,
    });
    return {
      success: true,
      data: application,
      message: 'Souscription AVI enregistrée',
    };
  },

  cancelApplication: async (
    applicationId: string,
  ): Promise<ApiResponse<{ id: string }>> => {
    await networkDelay(400);
    return {
      success: true,
      data: { id: applicationId },
      message: 'Souscription annulée',
    };
  },

  signContract: async (payload: {
    applicationId: string;
    signatureDataUrl: string;
  }): Promise<ApiResponse<{ id: string; signedAt: string }>> => {
    await networkDelay(500);
    return {
      success: true,
      data: { id: payload.applicationId, signedAt: new Date().toISOString() },
      message: 'Contrat signé avec succès',
    };
  },
};
