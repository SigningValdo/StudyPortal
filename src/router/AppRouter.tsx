import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '@/components/Layout/MainLayout';

const LoginPage = lazy(
  () => import('@portals/auth-portal/pages/LoginPage'),
);
const HomePage = lazy(
  () => import('@portals/main-portal/features/home/HomePage'),
);
const AgentHomePage = lazy(
  () => import('@portals/main-portal/features/home/AgentHomePage'),
);
const TicketsPage = lazy(
  () => import('@portals/main-portal/features/tickets/pages/TicketsPage'),
);
const DocumentsPage = lazy(
  () => import('@portals/main-portal/features/documents/pages/DocumentsPage'),
);
const HousingApplicationPage = lazy(
  () =>
    import(
      '@portals/main-portal/features/housing/pages/HousingApplicationPage'
    ),
);
const WalletDashboardPage = lazy(
  () =>
    import('@portals/main-portal/features/wallet/pages/WalletDashboardPage'),
);
const TransactionHistoryPage = lazy(
  () =>
    import('@portals/main-portal/features/wallet/pages/TransactionHistoryPage'),
);
const ProfilePage = lazy(
  () => import('@portals/main-portal/features/profile/pages/ProfilePage'),
);
const FinancementListPage = lazy(
  () =>
    import(
      '@portals/main-portal/features/financement/pages/FinancementListPage'
    ),
);
const FinancementWizardPage = lazy(
  () =>
    import(
      '@portals/main-portal/features/financement/pages/FinancementWizardPage'
    ),
);
const AviParcoursPage = lazy(
  () => import('@portals/main-portal/features/avi/pages/AviParcoursPage'),
);
const AviWizardPage = lazy(
  () => import('@portals/main-portal/features/avi/pages/AviWizardPage'),
);
const AviSubscriptionsPage = lazy(
  () => import('@portals/main-portal/features/avi/pages/AviSubscriptionsPage'),
);
const AviInstructionsPage = lazy(
  () => import('@portals/main-portal/features/avi/pages/AviInstructionsPage'),
);
const PreuvesFinancementPage = lazy(
  () =>
    import(
      '@portals/main-portal/features/preuves/pages/PreuvesFinancementPage'
    ),
);
const NotificationsPage = lazy(
  () =>
    import(
      '@portals/main-portal/features/notifications/pages/NotificationsPage'
    ),
);
const DashboardPage = lazy(
  () =>
    import('@portals/main-portal/features/dashboard/pages/DashboardPage'),
);

const RouteFallback: FC = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="spinner" />
  </div>
);

export const AppRouter: FC = () => {
  const { user } = useAuthStore();
  const isAgent = user?.authorities?.includes('ticket:update') ?? false;
  const userRole = isAgent ? 'Agent' : 'User';

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout
                  variant={isAgent ? 'agent' : 'user'}
                  title="Acceuil"
                  userRole={userRole}
                />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={isAgent ? <AgentHomePage /> : <HomePage />}
            />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route
              path="services/attestation-logement"
              element={<HousingApplicationPage />}
            />
            <Route path="wallet" element={<WalletDashboardPage />} />
            <Route
              path="wallet/historiques"
              element={<TransactionHistoryPage />}
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="financement" element={<FinancementListPage />} />
            <Route
              path="financement/nouvelle"
              element={<FinancementWizardPage />}
            />
            <Route path="services/avi" element={<AviParcoursPage />} />
            <Route path="services/avi/nouvelle" element={<AviWizardPage />} />
            <Route
              path="services/avi/souscriptions"
              element={<AviSubscriptionsPage />}
            />
            <Route
              path="services/avi/instructions"
              element={<AviInstructionsPage />}
            />
            <Route
              path="preuves-de-financement"
              element={<PreuvesFinancementPage />}
            />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
