import { FC, useEffect, useRef, useState } from 'react';
import { BuildingIcon, ChevronDownIcon, SettingsIcon } from './icons';
import NotificationBadge from '@portals/main-portal/features/notifications/components/NotificationBadge';

export interface HeaderProps {
  title: string;
  organizationName?: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
}

const LogoutIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M12.5 13.3333L16.6667 9.16667M16.6667 9.16667L12.5 5M16.6667 9.16667H7.5M9.16667 13.3333V14.1667C9.16667 14.8297 8.90327 15.4656 8.43443 15.9344C7.96559 16.4033 7.3297 16.6667 6.66667 16.6667H5C4.33696 16.6667 3.70107 16.4033 3.23223 15.9344C2.76339 15.4656 2.5 14.8297 2.5 14.1667V5.83333C2.5 5.17029 2.76339 4.53441 3.23223 4.06557C3.70107 3.59673 4.33696 3.33333 5 3.33333H6.66667C7.3297 3.33333 7.96559 3.59673 8.43443 4.06557C8.90327 4.53441 9.16667 5.17029 9.16667 5.83333V6.66667"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Header: FC<HeaderProps> = ({
  title,
  organizationName = 'Mon organisation',
  userName,
  userRole,
  userAvatar,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onNotificationsClick,
  onMenuClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleSettings = () => {
    setMenuOpen(false);
    (onSettingsClick ?? onProfileClick)?.();
  };

  const handleLogout = () => {
    setMenuOpen(false);
    onLogoutClick?.();
  };

  return (
    <header
      className="flex items-center justify-between gap-2 rounded-2xl border bg-white px-3 py-3 sm:rounded-[25px] sm:px-5 sm:py-4 lg:pl-[36px] lg:pr-[26px] lg:pt-[18px] lg:pb-[17px]"
      style={{ borderColor: '#D8D8D8' }}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-border-soft text-brand-text-muted transition-colors hover:bg-brand-primary-soft lg:hidden"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
              <path d="M1 1H17M1 7H17M1 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <h1
          className="truncate text-lg font-bold sm:text-xl lg:text-[32px]"
          style={{ color: '#0140FF' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="hidden items-center gap-2 lg:flex"
          style={{ color: '#646464' }}
        >
          <BuildingIcon style={{ color: '#3F3F46' }} />
          <span className="text-sm font-semibold">{organizationName}</span>
        </div>

        <NotificationBadge onClick={onNotificationsClick} />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 sm:gap-3 lg:gap-5"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
              />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white sm:h-11 sm:w-11"
                style={{ backgroundColor: '#0140FF' }}
              >
                {userName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <div
                className="max-w-[100px] sm:max-w-[140px] truncate text-sm font-bold"
                style={{ color: '#404040' }}
              >
                {userName}
              </div>
              <div className="text-xs font-semibold" style={{ color: '#565656' }}>
                {userRole}
              </div>
            </div>
            <div
              className="hidden h-6 w-6 items-center justify-center rounded-full border transition-transform sm:flex"
              style={{
                borderColor: '#D5D5D5',
                color: '#646464',
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ChevronDownIcon width={12} height={12} />
            </div>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border bg-white shadow-lg"
              style={{ borderColor: '#E5E7EB' }}
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleSettings}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-brand-primary-soft"
                style={{ color: '#3F3F46' }}
              >
                <SettingsIcon width={18} height={18} style={{ color: '#0140FF' }} />
                <span>Paramètres</span>
              </button>
              <div className="border-t" style={{ borderColor: '#E5E7EB' }} />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-brand-primary-soft"
                style={{ color: '#F21E1E' }}
              >
                <LogoutIcon className="shrink-0" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
