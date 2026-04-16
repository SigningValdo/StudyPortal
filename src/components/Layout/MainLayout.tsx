import { FC, ReactNode, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar, { SidebarVariant } from './Sidebar';
import Header from './Header';
import { useAuthStore } from '@store/authStore';
import { useNotificationsStore } from '@store/notificationsStore';
import { usePermissions } from '@hooks/usePermissions';
import { PERMISSIONS } from '@contracts/api-contracts';

const KEY_TO_PATH: Record<string, string> = {
  accueil: '/',
  tickets: 'tickets',
  documents: 'documents',
  financement: '/financement',
  preuves: '/preuves-de-financement',
  wallet: '/wallet',
  historiques: '/wallet/historiques',
  parametres: '/profile',
  dashboard: '/dashboard',
};

const PATH_TO_KEY: Record<string, string> = {
  '/': 'accueil',
  '/tickets': 'tickets',
  '/documents': 'documents',
  '/services/attestation-logement': 'services-top',
  '/services/avi': 'services-top',
  '/services/avi/nouvelle': 'services-top',
  '/services/avi/souscriptions': 'services-top',
  '/financement': 'financement',
  '/financement/nouvelle': 'financement',
  '/preuves-de-financement': 'preuves',
  '/wallet': 'wallet',
  '/wallet/historiques': 'wallet',
  '/profile': 'parametres',
  '/dashboard': 'dashboard',
};

const PATH_TO_TITLE: Record<string, string> = {
  '/services/attestation-logement': 'Attestation de logement',
  '/services/avi': 'Attestation de Virement Irrévocable',
  '/services/avi/nouvelle': 'Attestation de Virement Irrévocable',
  '/services/avi/souscriptions': 'Mes souscriptions AVI',
  '/financement': 'Demande de financement',
  '/financement/nouvelle': 'Demande de financement',
  '/preuves-de-financement': 'Preuves de financement',
  '/wallet': 'Boaz Wallet',
  '/wallet/historiques': 'Boaz Wallet',
  '/profile': 'Profil',
  '/documents': 'Liste des documents',
  '/tickets': 'Tickets',
  '/notifications': 'Notifications',
  '/dashboard': 'Tableau de bord',
};

export interface MainLayoutProps {
  variant?: SidebarVariant;
  title?: string;
  userRole?: string;
  children?: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({
  variant = 'user',
  title = 'Acceuil',
  userRole = 'Admin',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { hasPermission } = usePermissions();
  const fetchNotifications = useNotificationsStore((state) => state.fetchAll);
  const resetNotifications = useNotificationsStore((state) => state.reset);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hasPermission(PERMISSIONS.NOTIFICATION_READ)) {
      void fetchNotifications();
    }
  }, [hasPermission, fetchNotifications]);

  const activeKey = PATH_TO_KEY[location.pathname] ?? 'accueil';
  const resolvedTitle = PATH_TO_TITLE[location.pathname] ?? title;

  const handleSelect = (key: string) => {
    const path = KEY_TO_PATH[key];
    if (path) navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="h-screen bg-[#F5F6FA] p-3 sm:p-4 lg:p-6 overflow-hidden">
      <div className="flex h-full gap-3 sm:gap-4 lg:gap-6 overflow-hidden">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={`${
            mobileOpen
              ? 'fixed inset-y-0 left-0 z-40 block'
              : 'hidden lg:block'
          } h-full lg:static`}
        >
          <Sidebar
            variant={variant}
            activeKey={activeKey}
            onSelect={handleSelect}
            onClose={() => setMobileOpen(false)}
            isMobile={mobileOpen}
          />
        </div>

        <div className="flex w-full flex-col gap-3 sm:gap-4 lg:gap-6 min-h-0">
          <Header
            title={resolvedTitle}
            organizationName="Mon organisation"
            userName={user?.preferred_username ?? 'Utilisateur'}
            userRole={userRole}
            onProfileClick={() => navigate('/profile')}
            onSettingsClick={() => navigate('/profile')}
            onNotificationsClick={() => navigate('/notifications')}
            onLogoutClick={() => {
              resetNotifications();
              logout();
              navigate('/login', { replace: true });
            }}
            onMenuClick={() => setMobileOpen(true)}
          />

          <Suspense
            fallback={
              <div className="flex items-center justify-center flex-1 py-12">
                <div className="spinner" />
              </div>
            }
          >
            <div className="flex-1 overflow-y-auto min-h-0">
              <Outlet />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
