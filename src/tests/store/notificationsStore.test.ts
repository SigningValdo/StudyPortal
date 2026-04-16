import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotificationsStore } from '@store/notificationsStore';
import { Notification } from '@contracts/api-contracts';

vi.mock('@services/mock/notifications.mock', () => {
  const base: Notification[] = [
    {
      id: 'n1',
      type: 'INFO',
      title: 'Première',
      message: 'm1',
      createdAt: '2024-04-12T09:00:00Z',
      read: false,
    },
    {
      id: 'n2',
      type: 'SUCCESS',
      title: 'Deuxième',
      message: 'm2',
      createdAt: '2024-04-13T09:00:00Z',
      read: true,
    },
    {
      id: 'n3',
      type: 'WARNING',
      title: 'Troisième',
      message: 'm3',
      createdAt: '2024-04-11T09:00:00Z',
      read: false,
    },
  ];
  return {
    notificationsService: {
      getAllNotifications: vi.fn(async () => ({
        success: true,
        data: base,
      })),
      markAsRead: vi.fn(async () => ({ success: true, data: true })),
      markAllAsRead: vi.fn(async () => ({ success: true, data: true })),
    },
  };
});

describe('useNotificationsStore', () => {
  beforeEach(() => {
    useNotificationsStore.getState().reset();
  });

  it('hydrate et trie les notifications par date décroissante', async () => {
    await useNotificationsStore.getState().fetchAll();
    const items = useNotificationsStore.getState().items;
    expect(items.map((n) => n.id)).toEqual(['n2', 'n1', 'n3']);
  });

  it('calcule correctement le compteur non lu', async () => {
    await useNotificationsStore.getState().fetchAll();
    expect(useNotificationsStore.getState().unreadCount()).toBe(2);
  });

  it('markAsRead met à jour le state (optimiste)', async () => {
    await useNotificationsStore.getState().fetchAll();
    await useNotificationsStore.getState().markAsRead('n1');
    const n1 = useNotificationsStore.getState().items.find((n) => n.id === 'n1');
    expect(n1?.read).toBe(true);
    expect(useNotificationsStore.getState().unreadCount()).toBe(1);
  });

  it('markAllAsRead remet tout le monde à lu', async () => {
    await useNotificationsStore.getState().fetchAll();
    await useNotificationsStore.getState().markAllAsRead();
    expect(useNotificationsStore.getState().unreadCount()).toBe(0);
  });

  it('pushLocal ajoute la notification en tête', async () => {
    await useNotificationsStore.getState().fetchAll();
    useNotificationsStore.getState().pushLocal({
      id: 'n0',
      type: 'INFO',
      title: 'Live',
      message: 'temps réel',
      createdAt: '2024-04-14T09:00:00Z',
      read: false,
    });
    expect(useNotificationsStore.getState().items[0].id).toBe('n0');
    expect(useNotificationsStore.getState().unreadCount()).toBe(3);
  });
});
