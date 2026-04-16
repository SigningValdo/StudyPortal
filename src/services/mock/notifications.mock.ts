/**
 * MOCKS NOTIFICATIONS
 */

import { Notification, ApiResponse } from '@contracts/api-contracts';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'INFO',
    title: 'Nouveau ticket assigné',
    message: 'Le ticket #002 vous a été assigné',
    createdAt: '2024-04-12T09:30:00Z',
    read: false,
    actionUrl: '/tickets/ticket-002',
  },
  {
    id: 'notif-002',
    type: 'SUCCESS',
    title: 'Ticket résolu',
    message: 'Votre ticket #003 a été résolu avec succès',
    createdAt: '2024-04-11T15:20:00Z',
    read: false,
    actionUrl: '/tickets/ticket-003',
  },
  {
    id: 'notif-003',
    type: 'WARNING',
    title: 'Document expiré',
    message: 'Le document "Règlement 2023" expire dans 7 jours',
    createdAt: '2024-04-10T10:00:00Z',
    read: true,
  },
  {
    id: 'notif-004',
    type: 'INFO',
    title: 'Nouveau commentaire',
    message: 'Un nouveau commentaire a été ajouté à votre ticket #001',
    createdAt: '2024-04-10T10:15:00Z',
    read: true,
    actionUrl: '/tickets/ticket-001',
  },
  {
    id: 'notif-005',
    type: 'SUCCESS',
    title: 'Upload réussi',
    message: 'Votre document "Photo promotion 2024.jpg" a été uploadé avec succès',
    createdAt: '2024-04-10T16:45:00Z',
    read: true,
    actionUrl: '/documents',
  },
];

/**
 * Service mock pour les notifications
 */
export const notificationsService = {
  /**
   * Récupérer toutes les notifications
   */
  getAllNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      success: true,
      data: MOCK_NOTIFICATIONS,
      message: 'Notifications récupérées',
    };
  },

  /**
   * Récupérer les notifications non lues
   */
  getUnreadNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);

    return {
      success: true,
      data: unread,
      message: `${unread.length} notification(s) non lue(s)`,
    };
  },

  /**
   * Marquer une notification comme lue
   */
  markAsRead: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const notification = MOCK_NOTIFICATIONS.find((n) => n.id === id);

    if (!notification) {
      return {
        success: false,
        data: false,
        message: 'Notification non trouvée',
      };
    }

    notification.read = true;

    return {
      success: true,
      data: true,
      message: 'Notification marquée comme lue',
    };
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead: async (): Promise<ApiResponse<boolean>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    MOCK_NOTIFICATIONS.forEach((n) => {
      n.read = true;
    });

    return {
      success: true,
      data: true,
      message: 'Toutes les notifications ont été marquées comme lues',
    };
  },

  /**
   * Nombre de notifications non lues
   */
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const count = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

    return {
      success: true,
      data: count,
    };
  },
};
