import {
  ApiResponse,
  PreuvePaymentProof,
  PreuvePaymentProofRequest,
} from '@contracts/api-contracts';

const MOCK_PROOFS: PreuvePaymentProof[] = [];

const networkDelay = (ms = 500) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

export const preuvesService = {
  submitProof: async (
    payload: PreuvePaymentProofRequest,
  ): Promise<ApiResponse<PreuvePaymentProof>> => {
    await networkDelay(600);
    const proof: PreuvePaymentProof = {
      ...payload,
      id: `preuve-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'current-user',
    };
    MOCK_PROOFS.unshift(proof);
    return {
      success: true,
      data: proof,
      message: 'Preuve de financement enregistrée',
    };
  },
};
