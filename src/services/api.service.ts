/**
 * SERVICE API AXIOS
 * ⚠️ CRITIQUE - 6 POINTS
 *
 * - Intercepteur pour injecter automatiquement le token JWT
 * - Fallback vers les mocks si le backend est indisponible
 * - Gestion du refresh token automatique
 */

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getToken, refreshToken } from './keycloak.service';
import {
  ticketsService,
  documentsService,
  notificationsService,
  financementService,
  aviService,
} from './mock';
import type {
  AviApplicationRequest,
  FinancementApplicationRequest,
  FinancementSignaturePayload,
} from '@contracts/api-contracts';

/**
 * Configuration de base de l'API
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Mode mock forcé (utile pour le développement sans backend)
 * Mettre à true pour utiliser uniquement les mocks
 */
const FORCE_MOCK_MODE = import.meta.env.VITE_FORCE_MOCK === 'true' || true;

/**
 * Instance Axios configurée
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * INTERCEPTEUR REQUEST
 * ⚠️ CRITIQUE : Injection automatique du token JWT
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Récupérer le token
    const token = getToken();

    // Injecter le token dans le header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en dev
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTEUR RESPONSE
 * ⚠️ CRITIQUE : Gestion du fallback vers les mocks
 */
apiClient.interceptors.response.use(
  (response) => {
    // Réponse réussie - on retourne telle quelle
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1. Gestion du token expiré (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const refreshed = await refreshToken();

        if (refreshed) {
          // Réessayer la requête avec le nouveau token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        if (import.meta.env.DEV) {
          console.error('Impossible de rafraîchir le token');
        }
        return Promise.reject(refreshError);
      }
    }

    // 2. FALLBACK VERS LES MOCKS
    // ⚠️ CRITIQUE : Si le backend est indisponible ou en mode mock forcé
    if (FORCE_MOCK_MODE || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      if (import.meta.env.DEV) {
        console.warn(
          `[API Fallback] Backend indisponible pour ${originalRequest.url} - Utilisation des mocks`
        );
      }

      return handleMockFallback(originalRequest);
    }

    // 3. Autres erreurs
    return Promise.reject(error);
  }
);

/**
 * Gestion du fallback vers les services mock
 * ⚠️ CRITIQUE : Permet de travailler sans backend
 */
const handleMockFallback = async (
  config: AxiosRequestConfig
): Promise<{ data: unknown }> => {
  const url = config.url || '';
  const method = config.method?.toUpperCase();

  try {
    // TICKETS
    if (url.includes('/tickets')) {
      if (method === 'GET' && url.match(/\/tickets\/[^/]+$/)) {
        const id = url.split('/').pop() || '';
        const response = await ticketsService.getTicketById(id);
        return { data: response };
      }
      if (method === 'GET') {
        const response = await ticketsService.getAllTickets();
        return { data: response };
      }
      if (method === 'POST') {
        const response = await ticketsService.createTicket(config.data);
        return { data: response };
      }
      if (method === 'PUT' || method === 'PATCH') {
        const id = url.split('/').pop() || '';
        const response = await ticketsService.updateTicket(id, config.data);
        return { data: response };
      }
    }

    // COMMENTS
    if (url.includes('/comments')) {
      const ticketId = url.match(/tickets\/([^/]+)/)?.[1] || '';
      if (method === 'GET') {
        const response = await ticketsService.getTicketComments(ticketId);
        return { data: response };
      }
      if (method === 'POST') {
        const response = await ticketsService.addComment(ticketId, config.data.content);
        return { data: response };
      }
    }

    // DOCUMENTS
    if (url.includes('/documents')) {
      if (method === 'GET' && url.match(/\/documents\/[^/]+$/)) {
        const id = url.split('/').pop() || '';
        const response = await documentsService.getDocumentById(id);
        return { data: response };
      }
      if (method === 'GET') {
        const response = await documentsService.getAllDocuments();
        return { data: response };
      }
      if (method === 'POST') {
        const response = await documentsService.uploadDocument(
          config.data.file,
          config.data.description
        );
        return { data: response };
      }
      if (method === 'DELETE') {
        const id = url.split('/').pop() || '';
        const response = await documentsService.deleteDocument(id);
        return { data: response };
      }
    }

    // NOTIFICATIONS
    if (url.includes('/notifications')) {
      if (url.includes('/unread')) {
        const response = await notificationsService.getUnreadNotifications();
        return { data: response };
      }
      if (url.includes('/count')) {
        const response = await notificationsService.getUnreadCount();
        return { data: response };
      }
      if (method === 'GET') {
        const response = await notificationsService.getAllNotifications();
        return { data: response };
      }
      if (method === 'PUT' || method === 'PATCH') {
        if (url.includes('/mark-all-read')) {
          const response = await notificationsService.markAllAsRead();
          return { data: response };
        }
        const id = url.split('/').pop() || '';
        const response = await notificationsService.markAsRead(id);
        return { data: response };
      }
    }

    // AVI
    if (url.includes('/avi')) {
      if (url.includes('/sign') && method === 'POST') {
        const payload = config.data as {
          applicationId: string;
          signatureDataUrl: string;
        };
        const response = await aviService.signContract(payload);
        return { data: response };
      }
      if (url.includes('/cancel') && method === 'POST') {
        const id = url.split('/').slice(-2, -1)[0] || '';
        const response = await aviService.cancelApplication(id);
        return { data: response };
      }
      if (method === 'GET') {
        const response = await aviService.getSubscriptions();
        return { data: response };
      }
      if (method === 'POST') {
        const payload = config.data as AviApplicationRequest;
        const response = await aviService.submitApplication(payload);
        return { data: response };
      }
    }

    // FINANCEMENT
    if (url.includes('/financements')) {
      if (url.includes('/sign') && method === 'POST') {
        const payload = config.data as FinancementSignaturePayload;
        const response = await financementService.signApplication(payload);
        return { data: response };
      }
      if (url.includes('/cancel') && method === 'POST') {
        const id = url.split('/').slice(-2, -1)[0] || '';
        const response = await financementService.cancelApplication(id);
        return { data: response };
      }
      if (method === 'GET') {
        const response = await financementService.getAllApplications();
        return { data: response };
      }
      if (method === 'POST') {
        const payload = config.data as FinancementApplicationRequest;
        const response = await financementService.submitApplication(payload);
        return { data: response };
      }
    }

    // Fallback par défaut
    return {
      data: {
        success: false,
        message: 'Endpoint mock non implémenté',
      },
    };
  } catch (mockError) {
    if (import.meta.env.DEV) {
      console.error('Erreur dans le fallback mock:', mockError);
    }
    throw mockError;
  }
};

/**
 * Export des méthodes HTTP simplifiées
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default api;
