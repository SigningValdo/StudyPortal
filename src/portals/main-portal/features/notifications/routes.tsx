import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

export const notificationsRoutes: RouteObject[] = [
  { path: 'notifications', element: <NotificationsPage /> },
];
