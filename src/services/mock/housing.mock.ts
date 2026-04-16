import {
  ApiResponse,
  HousingApplication,
  HousingApplicationRequest,
} from '@contracts/api-contracts';

const MOCK_APPLICATIONS: HousingApplication[] = [];

export const housingService = {
  getAllApplications: async (): Promise<ApiResponse<HousingApplication[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      success: true,
      data: [...MOCK_APPLICATIONS],
      message: 'Demandes récupérées avec succès',
    };
  },

  submitApplication: async (
    payload: HousingApplicationRequest,
  ): Promise<ApiResponse<HousingApplication>> => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const application: HousingApplication = {
      ...payload,
      id: `housing-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'current-user',
    };

    MOCK_APPLICATIONS.unshift(application);

    return {
      success: true,
      data: application,
      message: 'Demande envoyée avec succès',
    };
  },
};
