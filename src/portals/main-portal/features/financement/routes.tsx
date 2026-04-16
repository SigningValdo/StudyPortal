import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const FinancementListPage = lazy(() => import('./pages/FinancementListPage'));
const FinancementWizardPage = lazy(() => import('./pages/FinancementWizardPage'));

export const financementRoutes: RouteObject[] = [
  { path: 'financement', element: <FinancementListPage /> },
  { path: 'financement/nouvelle', element: <FinancementWizardPage /> },
];
