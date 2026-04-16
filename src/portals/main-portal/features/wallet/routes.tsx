import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const WalletDashboardPage = lazy(() => import('./pages/WalletDashboardPage'));
const TransactionHistoryPage = lazy(
  () => import('./pages/TransactionHistoryPage'),
);

export const walletRoutes: RouteObject[] = [
  { path: 'wallet', element: <WalletDashboardPage /> },
  { path: 'wallet/historiques', element: <TransactionHistoryPage /> },
];
