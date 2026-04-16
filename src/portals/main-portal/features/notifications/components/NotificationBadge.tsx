import { FC } from 'react';
import { usePermissions } from '@hooks/usePermissions';
import { useNotificationsStore } from '@store/notificationsStore';
import { PERMISSIONS } from '@contracts/api-contracts';

export interface NotificationBadgeProps {
  onClick?: () => void;
}

export const NotificationBadge: FC<NotificationBadgeProps> = ({ onClick }) => {
  const { hasPermission } = usePermissions();
  const count = useNotificationsStore((state) =>
    state.items.filter((n) => !n.read).length,
  );

  if (!hasPermission(PERMISSIONS.NOTIFICATION_READ)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        count > 0
          ? `${count} notification${count > 1 ? 's' : ''} non lue${count > 1 ? 's' : ''}`
          : 'Notifications'
      }
      className="relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:bg-brand-primary-soft"
      style={{ borderColor: '#D5D5D5' }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M15.8333 13.3333V8.33333C15.8333 5.11167 13.2217 2.5 10 2.5C6.77833 2.5 4.16667 5.11167 4.16667 8.33333V13.3333L2.5 15H17.5L15.8333 13.3333ZM10 17.5C10.9205 17.5 11.6667 16.7538 11.6667 15.8333H8.33333C8.33333 16.7538 9.07952 17.5 10 17.5Z"
          stroke="#3F3F46"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#F21E1E] px-1 text-[10px] font-bold text-white"
          data-testid="notification-count"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
