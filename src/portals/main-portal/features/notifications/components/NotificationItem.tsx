import { FC } from 'react';
import { Notification, NotificationType } from '@contracts/api-contracts';

const TYPE_STYLES: Record<NotificationType, { dot: string; label: string }> = {
  INFO: { dot: 'bg-brand-primary', label: 'Information' },
  SUCCESS: { dot: 'bg-[#27AE60]', label: 'Succès' },
  WARNING: { dot: 'bg-[#F2994A]', label: 'Attention' },
  ERROR: { dot: 'bg-[#F21E1E]', label: 'Erreur' },
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onOpen?: (notification: Notification) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onOpen,
}) => {
  const style = TYPE_STYLES[notification.type];

  return (
    <li
      className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${
        notification.read
          ? 'border-brand-border-soft bg-white'
          : 'border-brand-primary/30 bg-brand-primary-soft/40'
      }`}
    >
      <span
        className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`}
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-text-muted">
            {style.label}
          </span>
          <span className="text-xs text-brand-text-muted">·</span>
          <span className="text-xs text-brand-text-muted">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        <div className="mt-1 font-semibold text-brand-dark">
          {notification.title}
        </div>
        <p className="mt-1 text-sm text-brand-text-muted">
          {notification.message}
        </p>
        <div className="mt-3 flex items-center gap-3">
          {notification.actionUrl && onOpen && (
            <button
              type="button"
              onClick={() => onOpen(notification)}
              className="text-xs font-semibold text-brand-primary hover:underline"
            >
              Ouvrir
            </button>
          )}
          {!notification.read && onMarkAsRead && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.id)}
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

export default NotificationItem;
