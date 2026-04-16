import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));

export const documentsRoutes: RouteObject[] = [
  { path: 'documents', element: <DocumentsPage /> },
];
