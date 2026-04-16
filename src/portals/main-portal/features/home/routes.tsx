import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('./HomePage'));
const AgentHomePage = lazy(() => import('./AgentHomePage'));

export const homeRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
];

export const agentHomeRoutes: RouteObject[] = [
  { index: true, element: <AgentHomePage /> },
];
