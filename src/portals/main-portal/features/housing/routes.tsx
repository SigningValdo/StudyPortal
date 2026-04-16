import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HousingApplicationPage = lazy(() => import('./pages/HousingApplicationPage'));

export const housingRoutes: RouteObject[] = [
  { path: 'services/attestation-logement', element: <HousingApplicationPage /> },
];
