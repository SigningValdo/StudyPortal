/**
 * MOCKS TICKETS
 */

import { Ticket, TicketComment, ApiResponse } from '@contracts/api-contracts';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-001',
    title: 'Problème de connexion à la plateforme',
    description:
      "Je n'arrive pas à me connecter depuis ce matin. Le message d'erreur indique 'Session expirée'.",
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: '2024-04-10T08:30:00Z',
    updatedAt: '2024-04-10T08:30:00Z',
    createdBy: 'john.doe',
    tags: ['connexion', 'urgent'],
  },
  {
    id: 'ticket-002',
    title: "Demande d'ajout de fonctionnalité export CSV",
    description:
      'Il serait utile de pouvoir exporter les données des étudiants au format CSV pour nos analyses.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: '2024-04-09T14:20:00Z',
    updatedAt: '2024-04-11T10:15:00Z',
    createdBy: 'admin',
    assignedTo: 'dev-team',
    tags: ['feature', 'export'],
  },
  {
    id: 'ticket-003',
    title: 'Bug affichage dashboard mobile',
    description:
      "Les graphiques du dashboard ne s'affichent pas correctement sur mobile (iPhone 12).",
    status: 'RESOLVED',
    priority: 'MEDIUM',
    createdAt: '2024-04-08T16:45:00Z',
    updatedAt: '2024-04-10T11:30:00Z',
    createdBy: 'agent.support',
    assignedTo: 'frontend-team',
    tags: ['bug', 'mobile', 'ui'],
  },
  {
    id: 'ticket-004',
    title: 'Question sur la politique de confidentialité',
    description: 'Pourriez-vous clarifier comment les données des étudiants sont protégées ?',
    status: 'CLOSED',
    priority: 'LOW',
    createdAt: '2024-04-05T09:00:00Z',
    updatedAt: '2024-04-06T15:20:00Z',
    createdBy: 'john.doe',
    assignedTo: 'legal-team',
    tags: ['question', 'rgpd'],
  },
  {
    id: 'ticket-005',
    title: 'Lenteur du chargement des documents',
    description:
      'Le chargement des documents PDF prend plus de 30 secondes. Peut-on optimiser ?',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: '2024-04-11T11:00:00Z',
    updatedAt: '2024-04-11T11:00:00Z',
    createdBy: 'admin',
    tags: ['performance', 'documents'],
  },
];

export const MOCK_COMMENTS: TicketComment[] = [
  {
    id: 'comment-001',
    ticketId: 'ticket-001',
    content: "Nous avons identifié le problème. C'est lié à l'expiration des sessions Redis.",
    createdAt: '2024-04-10T09:15:00Z',
    createdBy: 'admin',
    author: {
      name: 'Admin Support',
      email: 'admin@boaz-study.com',
    },
  },
  {
    id: 'comment-002',
    ticketId: 'ticket-001',
    content: 'Merci ! Quand est-ce que ce sera résolu ?',
    createdAt: '2024-04-10T10:00:00Z',
    createdBy: 'john.doe',
    author: {
      name: 'John Doe',
      email: 'john.doe@boaz-study.com',
    },
  },
  {
    id: 'comment-003',
    ticketId: 'ticket-002',
    content: 'Nous avons commencé le développement. Livraison prévue semaine prochaine.',
    createdAt: '2024-04-11T10:15:00Z',
    createdBy: 'dev-team',
    author: {
      name: 'Dev Team',
      email: 'dev@boaz-study.com',
    },
  },
];

/**
 * Service mock pour les tickets
 */
export const ticketsService = {
  /**
   * Récupérer tous les tickets
   */
  getAllTickets: async (): Promise<ApiResponse<Ticket[]>> => {
    // Simulation délai réseau
    await new Promise((resolve) => setTimeout(resolve, 80));

    return {
      success: true,
      data: MOCK_TICKETS,
      message: 'Tickets récupérés avec succès',
    };
  },

  /**
   * Récupérer un ticket par ID
   */
  getTicketById: async (id: string): Promise<ApiResponse<Ticket | null>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const ticket = MOCK_TICKETS.find((t) => t.id === id);

    return {
      success: !!ticket,
      data: ticket || null,
      message: ticket ? 'Ticket trouvé' : 'Ticket non trouvé',
    };
  },

  /**
   * Créer un nouveau ticket
   */
  createTicket: async (ticketData: Partial<Ticket>): Promise<ApiResponse<Ticket>> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: ticketData.title || '',
      description: ticketData.description || '',
      status: 'OPEN',
      priority: ticketData.priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user',
      tags: ticketData.tags || [],
    };

    MOCK_TICKETS.unshift(newTicket);

    return {
      success: true,
      data: newTicket,
      message: 'Ticket créé avec succès',
    };
  },

  /**
   * Mettre à jour un ticket
   */
  updateTicket: async (
    id: string,
    updates: Partial<Ticket>
  ): Promise<ApiResponse<Ticket | null>> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const index = MOCK_TICKETS.findIndex((t) => t.id === id);

    if (index === -1) {
      return {
        success: false,
        data: null,
        message: 'Ticket non trouvé',
      };
    }

    MOCK_TICKETS[index] = {
      ...MOCK_TICKETS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: MOCK_TICKETS[index],
      message: 'Ticket mis à jour avec succès',
    };
  },

  /**
   * Récupérer les commentaires d'un ticket
   */
  getTicketComments: async (ticketId: string): Promise<ApiResponse<TicketComment[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const comments = MOCK_COMMENTS.filter((c) => c.ticketId === ticketId);

    return {
      success: true,
      data: comments,
      message: 'Commentaires récupérés',
    };
  },

  /**
   * Ajouter un commentaire
   */
  addComment: async (
    ticketId: string,
    content: string
  ): Promise<ApiResponse<TicketComment>> => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const newComment: TicketComment = {
      id: `comment-${Date.now()}`,
      ticketId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      author: {
        name: 'Current User',
        email: 'user@boaz-study.com',
      },
    };

    MOCK_COMMENTS.push(newComment);

    return {
      success: true,
      data: newComment,
      message: 'Commentaire ajouté',
    };
  },

  /**
   * Supprimer un ticket
   */
  deleteTicket: async (id: string): Promise<ApiResponse<boolean>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const index = MOCK_TICKETS.findIndex((t) => t.id === id);

    if (index === -1) {
      return {
        success: false,
        data: false,
        message: 'Ticket non trouvé',
      };
    }

    MOCK_TICKETS.splice(index, 1);

    return {
      success: true,
      data: true,
      message: 'Ticket supprimé avec succès',
    };
  },
};
