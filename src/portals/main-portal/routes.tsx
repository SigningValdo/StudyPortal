import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { homeRoutes } from './features/home/routes';
import { ticketsRoutes } from './features/tickets/routes';
import { documentsRoutes } from './features/documents/routes';
import { financementRoutes } from './features/financement/routes';

export const mainPortalRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout variant="user" title="Acceuil" userRole="User" />,
    children: [
      ...homeRoutes,
      ...ticketsRoutes,
      ...documentsRoutes,
      ...financementRoutes,
    ],
  },
];
