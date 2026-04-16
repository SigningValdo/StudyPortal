/**
 * HOOK USEAUTH
 * Hook pour accéder à l'état d'authentification
 */

import { useAuthStore } from '@store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, setUser, logout, setLoading } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    logout,
    setLoading,
  };
};
