/**
 * MOCKS AUTHENTIFICATION
 * ⚠️ CRITIQUE : 2 profils minimum avec permissions différentes
 */

import { AuthUser, PERMISSIONS } from '@contracts/api-contracts';

/**
 * Profil ADMIN - Toutes les permissions
 * Login: admin / admin123
 */
export const ADMIN_USER: AuthUser = {
  sub: 'admin-uuid-1234-5678-90ab-cdef',
  preferred_username: 'admin',
  email: 'admin@boaz-study.com',
  realm_access: {
    roles: ['ADMIN', 'USER'],
  },
  resource_access: {
    'studyportal-app': {
      roles: ['ADMIN'],
    },
  },
  /**
   * ⚠️ CRITIQUE : Toutes les permissions pour l'admin
   */
  authorities: [
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.TICKET_UPDATE,
    PERMISSIONS.TICKET_DELETE,
    PERMISSIONS.TICKET_COMMENT,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_DOWNLOAD,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_MANAGE,
    PERMISSIONS.HOUSING_CREATE,
    PERMISSIONS.HOUSING_READ,
    PERMISSIONS.FINANCEMENT_CREATE,
    PERMISSIONS.FINANCEMENT_READ,
    PERMISSIONS.FINANCEMENT_UPDATE,
    PERMISSIONS.FINANCEMENT_CANCEL,
    PERMISSIONS.FINANCEMENT_SIGN,
    PERMISSIONS.PREUVE_CREATE,
    PERMISSIONS.PREUVE_READ,
    PERMISSIONS.AVI_CREATE,
    PERMISSIONS.AVI_READ,
    PERMISSIONS.AVI_UPDATE,
    PERMISSIONS.AVI_CANCEL,
    PERMISSIONS.AVI_SIGN,
    PERMISSIONS.WALLET_READ,
    PERMISSIONS.TRANSACTION_READ,
  ],
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 heure
};

/**
 * Profil USER BASIQUE - Permissions limitées (lecture uniquement)
 * Login: user / user123
 */
export const BASIC_USER: AuthUser = {
  sub: 'user-uuid-abcd-efgh-ijkl-mnop',
  preferred_username: 'john.doe',
  email: 'john.doe@boaz-study.com',
  realm_access: {
    roles: ['USER'],
  },
  resource_access: {
    'studyportal-app': {
      roles: ['USER'],
    },
  },
  /**
   * ⚠️ CRITIQUE : Permissions limitées (lecture + commentaire uniquement)
   * NE PEUT PAS créer de tickets ni uploader de documents
   */
  authorities: [
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.TICKET_COMMENT,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_DOWNLOAD,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.HOUSING_CREATE,
    PERMISSIONS.HOUSING_READ,
    PERMISSIONS.FINANCEMENT_CREATE,
    PERMISSIONS.FINANCEMENT_READ,
    PERMISSIONS.FINANCEMENT_CANCEL,
    PERMISSIONS.FINANCEMENT_SIGN,
    PERMISSIONS.PREUVE_CREATE,
    PERMISSIONS.PREUVE_READ,
    PERMISSIONS.AVI_CREATE,
    PERMISSIONS.AVI_READ,
    PERMISSIONS.AVI_CANCEL,
    PERMISSIONS.AVI_SIGN,
    PERMISSIONS.WALLET_READ,
    PERMISSIONS.TRANSACTION_READ,
  ],
  exp: Math.floor(Date.now() / 1000) + 3600,
};

/**
 * Profil AGENT - Permissions intermédiaires
 * Login: agent / agent123
 */
export const AGENT_USER: AuthUser = {
  sub: 'agent-uuid-qrst-uvwx-yz12-3456',
  preferred_username: 'agent.support',
  email: 'agent.support@boaz-study.com',
  realm_access: {
    roles: ['AGENT', 'USER'],
  },
  resource_access: {
    'studyportal-app': {
      roles: ['AGENT'],
    },
  },
  /**
   * Peut gérer les tickets mais pas les supprimer
   */
  authorities: [
    PERMISSIONS.TICKET_CREATE,
    PERMISSIONS.TICKET_READ,
    PERMISSIONS.TICKET_UPDATE,
    PERMISSIONS.TICKET_COMMENT,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.DOCUMENT_DOWNLOAD,
    PERMISSIONS.DOCUMENT_UPDATE,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.HOUSING_READ,
    PERMISSIONS.FINANCEMENT_READ,
    PERMISSIONS.FINANCEMENT_UPDATE,
    PERMISSIONS.AVI_READ,
    PERMISSIONS.AVI_UPDATE,
    PERMISSIONS.WALLET_READ,
    PERMISSIONS.TRANSACTION_READ,
  ],
  exp: Math.floor(Date.now() / 1000) + 3600,
};

/**
 * Base de données des utilisateurs mock pour la connexion
 */
export const MOCK_USERS = {
  admin: {
    password: 'admin123',
    user: ADMIN_USER,
  },
  user: {
    password: 'user123',
    user: BASIC_USER,
  },
  agent: {
    password: 'agent123',
    user: AGENT_USER,
  },
};

/**
 * Fonction de connexion mock
 */
export const mockLogin = (
  username: string,
  password: string
): { success: boolean; user?: AuthUser; error?: string } => {
  // Simulation d'un délai réseau
  const userKey = username as keyof typeof MOCK_USERS;
  const mockUser = MOCK_USERS[userKey];

  if (!mockUser) {
    return {
      success: false,
      error: 'Utilisateur non trouvé',
    };
  }

  if (mockUser.password !== password) {
    return {
      success: false,
      error: 'Mot de passe incorrect',
    };
  }

  return {
    success: true,
    user: mockUser.user,
  };
};

/**
 * Mock du token JWT
 */
export const generateMockToken = (user: AuthUser): string => {
  // En production, ce serait un vrai JWT
  // Ici on encode juste en base64 pour la démo
  const payload = {
    sub: user.sub,
    preferred_username: user.preferred_username,
    email: user.email,
    authorities: user.authorities,
    exp: user.exp,
  };

  return btoa(JSON.stringify(payload));
};
