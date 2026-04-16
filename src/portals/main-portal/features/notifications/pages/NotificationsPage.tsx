import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { Notification, PERMISSIONS } from '@contracts/api-contracts';
import { useNotificationsStore } from '@store/notificationsStore';

type Filter = 'all' | 'unread';

export const NotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { items, loading, error, fetchAll, markAsRead, markAllAsRead } =
    useNotificationsStore();
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(
    () => (filter === 'unread' ? items.filter((n) => !n.read) : items),
    [filter, items],
  );

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items],
  );

  const handleOpen = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <ProtectedComponent requiredPermissions={PERMISSIONS.NOTIFICATION_READ}>
      <div className="space-y-4 px-3 pb-6 sm:px-4 sm:space-y-6 lg:px-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-brand-dark">
              Centre de notifications
            </h2>
            <p className="text-sm text-brand-text-muted">
              {unreadCount > 0
                ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                : 'Toutes vos notifications sont à jour'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              role="tablist"
              aria-label="Filtrer les notifications"
              className="flex rounded-lg border border-brand-border-soft bg-white p-1"
            >
              {(['all', 'unread'] as const).map((value) => (
                <button
                  key={value}
                  role="tab"
                  type="button"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                    filter === value
                      ? 'bg-brand-primary text-white'
                      : 'text-brand-text-muted hover:text-brand-dark'
                  }`}
                >
                  {value === 'all' ? 'Toutes' : 'Non lues'}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="rounded-lg border border-brand-primary px-3 py-2 text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary-soft"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-brand-border-soft bg-white p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-[#F21E1E]">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-brand-text-muted">
              {filter === 'unread'
                ? 'Aucune notification non lue'
                : 'Aucune notification pour le moment'}
            </div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onOpen={handleOpen}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </ProtectedComponent>
  );
};

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onOpen: (notification: Notification) => Promise<void>;
}

const NotificationRow: FC<NotificationRowProps> = ({
  notification,
  onMarkAsRead,
  onOpen,
}) => {
  const formatted = new Date(notification.createdAt);
  const dateLabel = Number.isNaN(formatted.getTime())
    ? notification.createdAt
    : formatted.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

  const typeColor: Record<Notification['type'], string> = {
    INFO: 'bg-brand-primary',
    SUCCESS: 'bg-[#27AE60]',
    WARNING: 'bg-[#F2994A]',
    ERROR: 'bg-[#F21E1E]',
  };

  return (
    <li
      className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${
        notification.read
          ? 'border-brand-border-soft bg-white'
          : 'border-brand-primary/30 bg-brand-primary-soft/40'
      }`}
    >
      <span
        className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${typeColor[notification.type]}`}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-brand-text-muted">{dateLabel}</div>
        <div className="mt-1 font-semibold text-brand-dark">
          {notification.title}
        </div>
        <p className="mt-1 text-sm text-brand-text-muted">
          {notification.message}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {notification.actionUrl && (
            <button
              type="button"
              onClick={() => void onOpen(notification)}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Ouvrir
            </button>
          )}
          {!notification.read && (
            <button
              type="button"
              onClick={() => void onMarkAsRead(notification.id)}
              className="text-xs font-semibold text-brand-text-muted hover:text-brand-dark"
            >
              Marquer comme lue
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default NotificationsPage;
