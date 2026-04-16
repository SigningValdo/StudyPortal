/**
 * SERVICE KEYCLOAK
 * ⚠️ CRITIQUE - 5 POINTS
 *
 * Configuration et intégration de Keycloak pour l'authentification
 */

import Keycloak from 'keycloak-js';
import type { AuthUser } from '@contracts/api-contracts';

/**
 * Configuration Keycloak
 * ⚠️ À adapter selon votre environnement Keycloak
 *
 * Pour le mode dev/mock, ces valeurs peuvent être fictives
 */
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'studyportal',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'studyportal-app',
};

/**
 * Instance Keycloak
 */
export const keycloak = new Keycloak(keycloakConfig);

/**
 * Options d'initialisation Keycloak
 */
const initOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256' as const,
  checkLoginIframe: false,
};

/**
 * Initialiser Keycloak
 * Retourne une promesse qui résout avec le statut d'authentification
 */
export const initKeycloak = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloak.init(initOptions);

    // Configuration du refresh automatique du token
    if (authenticated) {
      setInterval(() => {
        keycloak
          .updateToken(70) // Rafraîchir si expire dans moins de 70 secondes
          .then((refreshed) => {
            if (refreshed && import.meta.env.DEV) {
              console.log('Token rafraîchi');
            }
          })
          .catch(() => {
            if (import.meta.env.DEV) {
              console.error('Échec du rafraîchissement du token');
            }
          });
      }, 60000); // Vérifier toutes les 60 secondes
    }

    return authenticated;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Erreur initialisation Keycloak:', error);
    }
    return false;
  }
};

/**
 * Extraire l'utilisateur depuis le token Keycloak
 */
export const getUserFromToken = (): AuthUser | null => {
  if (!keycloak.tokenParsed) {
    return null;
  }

  const token = keycloak.tokenParsed;

  // Extraire les authorities depuis le token
  // ⚠️ CRITIQUE : C'est ici qu'on récupère les permissions
  const authorities = (token.authorities as string[]) || [];

  const user: AuthUser = {
    sub: token.sub || '',
    preferred_username: token.preferred_username || '',
    email: token.email || '',
    realm_access: token.realm_access as AuthUser['realm_access'],
    resource_access: token.resource_access as AuthUser['resource_access'],
    authorities, // ⚠️ CRITIQUE
    exp: token.exp,
  };

  return user;
};

/**
 * Obtenir le token d'accès
 */
export const getToken = (): string | undefined => {
  return keycloak.token;
};

/**
 * Connecter l'utilisateur
 */
export const login = (): Promise<void> => {
  return keycloak.login();
};

/**
 * Déconnecter l'utilisateur
 */
export const logout = (): Promise<void> => {
  return keycloak.logout();
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return keycloak.authenticated || false;
};

/**
 * Rafraîchir le token manuellement
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    return await keycloak.updateToken(-1);
  } catch {
    return false;
  }
};

export default keycloak;
