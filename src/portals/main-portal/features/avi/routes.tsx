/**
 * AVI feature route definitions.
 * Consumed by AppRouter.tsx (lazy imports are defined there for code-splitting).
 */
export const AVI_ROUTES = {
  parcours: '/services/avi',
  wizard: '/services/avi/nouvelle',
  subscriptions: '/services/avi/souscriptions',
  instructions: '/services/avi/instructions',
} as const;
