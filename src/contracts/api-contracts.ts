/**
 * CONTRATS API - STUDYPORTAL
 * ⚠️ CRITIQUE : Ces interfaces définissent tous les contrats de données
 * Permet de travailler en indépendance totale du backend
 */

// ============================================
// AUTHENTIFICATION & UTILISATEUR
// ============================================

export interface AuthUser {
  sub: string;
  preferred_username: string;
  email: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    'studyportal-app': {
      roles: string[];
    };
  };
  /**
   * ⚠️ CRITIQUE : Les authorities sont la base de la protection
   * Toute la protection UI se fait sur ce tableau, JAMAIS sur les rôles
   */
  authorities: string[];
  exp?: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// ============================================
// TICKETS
// ============================================

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  tags?: string[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
  createdBy: string;
  author: {
    name: string;
    email: string;
  };
}

export interface CreateCommentRequest {
  ticketId: string;
  content: string;
}

// ============================================
// DOCUMENTS
// ============================================

export type DocumentType = 'PDF' | 'WORD' | 'EXCEL' | 'IMAGE' | 'OTHER';

export type DocumentPreview = 'proforma' | 'contrat';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  description?: string;
  preview?: DocumentPreview;
}

export interface UploadDocumentRequest {
  file: File;
  description?: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

// ============================================
// ATTESTATION DE LOGEMENT
// ============================================

export type AviDuration = '6 mois' | '12 mois' | '24 mois';
export type YesNo = 'Oui' | 'Non';
export type TravelPurpose = 'Etudes' | 'Stage' | 'Recherche' | 'Autre';
export type OriginCurrency = 'FCFA' | 'EUR' | 'USD' | 'GBP';
export type SchoolYear = '2023/2024' | '2024/2025' | '2025/2026';

export interface HousingPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportScanName: string;
  aviDuration: AviDuration;
}

export interface HousingTrainingInfo {
  institutionName: string;
  trainingTitle: string;
  city: string;
  startDate: string;
  admissionLetterName: string;
}

export interface HousingFinancialInfo {
  schoolYear: SchoolYear;
  monthlyAmountEuro: string;
  originCurrency: OriginCurrency;
  aviDuration: AviDuration;
  isRenewal: YesNo;
  travelPurpose: TravelPurpose;
  acsInsurance: YesNo;
}

export interface HousingApplicationRequest {
  personal: HousingPersonalInfo;
  training: HousingTrainingInfo;
  financial: HousingFinancialInfo;
}

export interface HousingApplication extends HousingApplicationRequest {
  id: string;
  submittedAt: string;
  submittedBy: string;
}

// ============================================
// DEMANDE DE FINANCEMENT
// ============================================

export type FinancementServiceType = 'A.V.I' | 'Logement' | 'Assurance' | 'Admission';

export type FinancementStatus =
  | 'En préparation'
  | 'En attente de paiement'
  | 'Paiement en attente'
  | 'Clôturée'
  | 'Payée'
  | 'Livré';

export type FinancementRowStatus =
  | 'En cours'
  | 'En remboursement'
  | 'Clôturé'
  | 'Echéance ratée'
  | 'Rejeté'
  | 'Accepté';

export type FinancementDocumentAction = 'Aucun document' | 'Télécharger' | 'Signer';

export interface FinancementPersonalInfo {
  firstName: string;
  lastName: string;
  birthPlace: string;
  birthDate: string;
  fullAddress: string;
  country: string;
  city: string;
  district: string;
  phoneCountryCode: string;
  phoneNumber: string;
  locationPlanFileName: string;
}

export interface FinancementParentInfo {
  fullName: string;
  phoneNumber: string;
  residence: string;
}

export interface FinancementIdentityInfo {
  cniScanFileName: string;
  cniScanPreviewName: string;
  photoFileName: string;
  photoPreviewName: string;
  parent1: FinancementParentInfo;
  parent2: FinancementParentInfo;
}

export interface FinancementDetailsInfo {
  serviceType: FinancementServiceType;
  serviceCost: string;
  maxFinancing: string;
  amountNeeded: string;
  financingFees: string;
  totalToReimburse: string;
}

export interface FinancementScheduleEntry {
  dueDate: string;
  amount: string;
}

export interface FinancementScheduleInfo {
  installmentsCount: number;
  entries: FinancementScheduleEntry[];
}

export interface FinancementJustificationFile {
  id: string;
  name: string;
}

export interface FinancementJustificationInfo {
  explanation: string;
  files: FinancementJustificationFile[];
}

export interface FinancementFollowupStep {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

export interface FinancementFollowupInfo {
  steps: FinancementFollowupStep[];
}

export interface FinancementApplicationRequest {
  personal: FinancementPersonalInfo;
  identity: FinancementIdentityInfo;
  details: FinancementDetailsInfo;
  schedule: FinancementScheduleInfo;
  justification: FinancementJustificationInfo;
}

export interface FinancementApplication extends FinancementApplicationRequest {
  id: string;
  reference: string;
  submittedAt: string;
  submittedBy: string;
  status: FinancementStatus;
  followup: FinancementFollowupInfo;
}

export interface FinancementListRow {
  id: string;
  reference: string;
  applicantName: string;
  amount: number;
  serviceType: FinancementServiceType | '-';
  requestDate: string;
  alreadyReimbursed: number;
  remaining: number;
  documentAction: FinancementDocumentAction;
  rowStatus: FinancementRowStatus;
}

export interface FinancementSignaturePayload {
  applicationId: string;
  signatureDataUrl: string;
}

// ============================================
// PREUVES DE FINANCEMENT (preuves de versement)
// ============================================

export type PreuveServiceType = 'A.V.I' | 'Logement' | 'Assurance' | 'Admission';

export interface PreuvePaymentProofRequest {
  serviceType: PreuveServiceType;
  documentFileName: string;
  photoFileName: string | null;
}

export interface PreuvePaymentProof extends PreuvePaymentProofRequest {
  id: string;
  submittedAt: string;
  submittedBy: string;
}

// ============================================
// AVI (Attestation de Virement Irrévocable)
// ============================================

export type AviPaymentPrinciple = 'Paiement total' | 'Paiement par financement';

export type AviPaymentMode =
  | 'Dépôt Bancaire'
  | 'Virement Bancaire Direct'
  | 'Mobile Money';

export type AviBankKey = 'societe-generale' | 'banque-atlantique';

export type AviProformaKind = 'service' | 'financement';

export type AviSubscriptionStatus =
  | 'En préparation'
  | 'En attente de paiement'
  | 'Paiement en attente'
  | 'Clôturée'
  | 'Payée'
  | 'Livré';

export interface AviPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportScanName: string;
}

export interface AviTrainingInfo {
  institutionName: string;
  trainingTitle: string;
  city: string;
  startDate: string;
  admissionLetterName: string;
}

export interface AviFinancialInfo {
  schoolYear: SchoolYear;
  monthlyAmountEuro: string;
  originCurrency: OriginCurrency;
  aviDuration: AviDuration;
  isRenewal: YesNo;
  travelPurpose: TravelPurpose;
  acsInsurance: YesNo;
}

export interface AviPaymentInfo {
  principle: AviPaymentPrinciple | '';
  mode: AviPaymentMode | '';
  bank: AviBankKey | '';
}

export interface AviContractSignature {
  signatureDataUrl: string;
  signedAt: string;
}

export interface AviApplicationRequest {
  personal: AviPersonalInfo;
  training: AviTrainingInfo;
  financial: AviFinancialInfo;
  payment: AviPaymentInfo;
  signature: AviContractSignature | null;
}

export interface AviApplication extends AviApplicationRequest {
  id: string;
  reference: string;
  submittedAt: string;
  submittedBy: string;
  status: AviSubscriptionStatus;
}

export interface AviSubscriptionRow {
  id: string;
  reference: string;
  name: string;
  service: string;
  date: string;
  status: AviSubscriptionStatus;
  documentAttached: boolean;
}

// ============================================
// BOAZ WALLET
// ============================================

export type WalletCurrency = 'XAF' | 'EUR' | 'USD';

export type TransactionDirection = 'CREDIT' | 'DEBIT';

export type TransactionStatus = 'Livré' | 'En cours' | 'Annulé';

export type TransactionCategory =
  | 'Recharge compte débiteur'
  | 'Recharge de compte créditeur'
  | 'Achat service AVI'
  | 'Achat service Logement'
  | 'Remboursement';

export interface WalletBalance {
  total: number;
  creditor: number;
  debtor: number;
  currency: WalletCurrency;
}

export interface TransactionDocument {
  id: string;
  name: string;
  generatedAt: string;
  url: string;
}

export interface Transaction {
  id: string;
  label: TransactionCategory;
  amount: number;
  currency: WalletCurrency;
  direction: TransactionDirection;
  date: string;
  status: TransactionStatus;
}

export interface TransactionDetails extends Transaction {
  reference: string;
  serviceType: string;
  proformaNumber: string;
  category: string;
  balanceBefore: number;
  balanceAfter: number;
  method: string;
  transactionReference: string;
  fees: number;
  documents: TransactionDocument[];
}

// ============================================
// PROFIL UTILISATEUR
// ============================================

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationPreferences {
  emailMarketing: boolean;
  emailSecurity: boolean;
  emailTransactions: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
}

export interface TwoFactorSettings {
  enabled: boolean;
  method: 'sms' | 'email' | 'app';
  phone?: string;
  email?: string;
}

// ============================================
// RÉPONSES API GÉNÉRIQUES
// ============================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// ============================================
// DASHBOARD & STATISTIQUES
// ============================================

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  totalDocuments: number;
  unreadNotifications: number;
}

// ============================================
// PERMISSIONS DISPONIBLES
// ============================================

export const PERMISSIONS = {
  // Tickets
  TICKET_CREATE: 'ticket:create',
  TICKET_READ: 'ticket:read',
  TICKET_UPDATE: 'ticket:update',
  TICKET_DELETE: 'ticket:delete',
  TICKET_COMMENT: 'ticket:comment',

  // Documents
  DOCUMENT_UPLOAD: 'document:upload',
  DOCUMENT_READ: 'document:read',
  DOCUMENT_DOWNLOAD: 'document:download',
  DOCUMENT_UPDATE: 'document:update',
  DOCUMENT_DELETE: 'document:delete',

  // Notifications
  NOTIFICATION_READ: 'notification:read',
  NOTIFICATION_MANAGE: 'notification:manage',

  // Housing (Attestation de logement)
  HOUSING_CREATE: 'housing:create',
  HOUSING_READ: 'housing:read',

  // Financement (Demande de financement)
  FINANCEMENT_CREATE: 'financement:create',
  FINANCEMENT_READ: 'financement:read',
  FINANCEMENT_UPDATE: 'financement:update',
  FINANCEMENT_CANCEL: 'financement:cancel',
  FINANCEMENT_SIGN: 'financement:sign',

  // Preuves de financement (preuves de versement)
  PREUVE_CREATE: 'preuve:create',
  PREUVE_READ: 'preuve:read',

  // AVI (Attestation de Virement Irrévocable)
  AVI_CREATE: 'avi:create',
  AVI_READ: 'avi:read',
  AVI_UPDATE: 'avi:update',
  AVI_CANCEL: 'avi:cancel',
  AVI_SIGN: 'avi:sign',

  // Wallet
  WALLET_READ: 'wallet:read',
  TRANSACTION_READ: 'transaction:read',

  // Profil
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
