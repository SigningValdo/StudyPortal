import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TicketsPage = lazy(() => import('./pages/TicketsPage'));

export const ticketsRoutes: RouteObject[] = [
  { path: 'tickets', element: <TicketsPage /> },
];
