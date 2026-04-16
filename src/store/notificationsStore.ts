import { create } from 'zustand';
import { Notification } from '@contracts/api-contracts';
import { notificationsService } from '@services/mock/notifications.mock';

interface NotificationsState {
  items: Notification[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  pushLocal: (notif: Notification) => void;
  unreadCount: () => number;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notificationsService.getAllNotifications();
      const sorted = [...(response.data ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      set({ items: sorted, loading: false });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des notifications';
      set({ loading: false, error: message });
    }
  },

  markAsRead: async (id) => {
    const previous = get().items;
    set({
      items: previous.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    });
    try {
      await notificationsService.markAsRead(id);
    } catch {
      set({ items: previous });
    }
  },

  markAllAsRead: async () => {
    const previous = get().items;
    set({ items: previous.map((item) => ({ ...item, read: true })) });
    try {
      await notificationsService.markAllAsRead();
    } catch {
      set({ items: previous });
    }
  },

  pushLocal: (notif) => {
    set({ items: [notif, ...get().items] });
  },

  unreadCount: () => get().items.filter((item) => !item.read).length,

  reset: () => set({ items: [], loading: false, error: null }),
}));
