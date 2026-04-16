import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotificationBadge from '@portals/main-portal/features/notifications/components/NotificationBadge';
import { useAuthStore } from '@store/authStore';
import { useNotificationsStore } from '@store/notificationsStore';
import { ADMIN_USER, BASIC_USER } from '@services/mock';

describe('NotificationBadge', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    useNotificationsStore.getState().reset();
  });

  it("n'affiche rien sans la permission notification:read", () => {
    const limitedUser = { ...BASIC_USER, authorities: [] };
    useAuthStore.setState({ user: limitedUser, token: 't' });
    const { container } = render(<NotificationBadge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('affiche le badge avec le nombre de non lues', () => {
    useAuthStore.setState({ user: ADMIN_USER, token: 't' });
    useNotificationsStore.setState({
      items: [
        {
          id: 'a',
          type: 'INFO',
          title: 't',
          message: 'm',
          createdAt: '2024-04-12T09:00:00Z',
          read: false,
        },
        {
          id: 'b',
          type: 'INFO',
          title: 't',
          message: 'm',
          createdAt: '2024-04-12T09:00:00Z',
          read: true,
        },
      ],
    });
    render(<NotificationBadge />);
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
  });

  it("n'affiche pas de compteur quand tout est lu", () => {
    useAuthStore.setState({ user: ADMIN_USER, token: 't' });
    useNotificationsStore.setState({
      items: [
        {
          id: 'a',
          type: 'INFO',
          title: 't',
          message: 'm',
          createdAt: '2024-04-12T09:00:00Z',
          read: true,
        },
      ],
    });
    render(<NotificationBadge />);
    expect(screen.queryByTestId('notification-count')).not.toBeInTheDocument();
  });

  it('plafonne l\'affichage à 99+', () => {
    useAuthStore.setState({ user: ADMIN_USER, token: 't' });
    useNotificationsStore.setState({
      items: Array.from({ length: 120 }, (_, i) => ({
        id: String(i),
        type: 'INFO' as const,
        title: 't',
        message: 'm',
        createdAt: '2024-04-12T09:00:00Z',
        read: false,
      })),
    });
    render(<NotificationBadge />);
    expect(screen.getByTestId('notification-count')).toHaveTextContent('99+');
  });
});
