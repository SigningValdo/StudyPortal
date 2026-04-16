import {
  ApiResponse,
  Transaction,
  TransactionDetails,
  WalletBalance,
} from '@contracts/api-contracts';

const MOCK_BALANCE: WalletBalance = {
  total: 550000,
  creditor: 200000,
  debtor: 300000,
  currency: 'XAF',
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    label: 'Recharge compte débiteur',
    amount: 250000,
    currency: 'XAF',
    direction: 'CREDIT',
    date: '2026-01-25',
    status: 'Livré',
  },
  {
    id: 'tx-002',
    label: 'Achat service AVI',
    amount: 500000,
    currency: 'XAF',
    direction: 'DEBIT',
    date: '2026-02-02',
    status: 'Livré',
  },
  {
    id: 'tx-003',
    label: 'Recharge de compte créditeur',
    amount: 500000,
    currency: 'XAF',
    direction: 'CREDIT',
    date: '2026-01-06',
    status: 'Livré',
  },
  {
    id: 'tx-004',
    label: 'Achat service Logement',
    amount: 180000,
    currency: 'XAF',
    direction: 'DEBIT',
    date: '2025-12-20',
    status: 'Livré',
  },
  {
    id: 'tx-005',
    label: 'Remboursement',
    amount: 75000,
    currency: 'XAF',
    direction: 'CREDIT',
    date: '2025-12-05',
    status: 'En cours',
  },
];

const MOCK_DETAILS: Record<string, TransactionDetails> = {
  'tx-002': {
    ...MOCK_TRANSACTIONS[1],
    reference: 'demo-123',
    serviceType: 'Attestation de Virement Irrévocable (AVI)',
    proformaNumber: 'Proforma-classique-AVI_25894',
    category: 'Document administratif',
    balanceBefore: 500000,
    balanceAfter: 250000,
    method: 'Dépôt bancaire - Banque Atlantique',
    transactionReference: 'PROF-78542-9021',
    fees: 0,
    documents: [
      {
        id: 'd-1',
        name: 'Proforma-classique-AVI_25894.pdf',
        generatedAt: '2026-04-30',
        url: '/mock/documents/proforma.pdf',
      },
      {
        id: 'd-2',
        name: 'Contrat-classique-AVI_25894.pdf',
        generatedAt: '2026-04-30',
        url: '/mock/documents/contrat.pdf',
      },
      {
        id: 'd-3',
        name: 'AVI_25894_valide.pdf',
        generatedAt: '2026-04-30',
        url: '/mock/documents/avi-valide.pdf',
      },
    ],
  },
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const walletService = {
  getBalance: async (): Promise<ApiResponse<WalletBalance>> => {
    await delay();
    return {
      success: true,
      data: MOCK_BALANCE,
      message: 'Solde récupéré avec succès',
    };
  },

  getTransactions: async (): Promise<ApiResponse<Transaction[]>> => {
    await delay();
    return {
      success: true,
      data: [...MOCK_TRANSACTIONS],
      message: 'Transactions récupérées avec succès',
    };
  },

  getTransactionDetails: async (
    id: string,
  ): Promise<ApiResponse<TransactionDetails | null>> => {
    await delay(300);
    const base = MOCK_TRANSACTIONS.find((tx) => tx.id === id);
    if (!base) {
      return { success: false, data: null, message: 'Transaction introuvable' };
    }
    const existing = MOCK_DETAILS[id];
    if (existing) {
      return { success: true, data: existing, message: 'OK' };
    }
    const fallback: TransactionDetails = {
      ...base,
      reference: `ref-${base.id}`,
      serviceType: base.label,
      proformaNumber: '—',
      category: 'Opération wallet',
      balanceBefore: MOCK_BALANCE.total,
      balanceAfter: MOCK_BALANCE.total,
      method: 'Wallet Boaz',
      transactionReference: `TRX-${base.id.toUpperCase()}`,
      fees: 0,
      documents: [],
    };
    return { success: true, data: fallback, message: 'OK' };
  },
};
