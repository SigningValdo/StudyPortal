/**
 * HOOK USEPERMISSIONS
 * ⚠️ CRITIQUE - 8 POINTS
 *
 * Ce hook est la BASE de tout le système de protection.
 * TOUTE la protection UI se fait via les permissions (authorities[]),
 * JAMAIS via les rôles (realm_access.roles).
 *
 * Basé uniquement sur le champ authorities[] du JWT
 */

import { useAuth } from './useAuth';
import { Permission } from '@contracts/api-contracts';

interface UsePermissionsReturn {
  /**
   * Vérifie si l'utilisateur possède UNE permission spécifique
   * @param permission - Le scope de permission à vérifier (ex: "ticket:create")
   * @returns true si l'utilisateur a la permission, false sinon
   */
  hasPermission: (permission: Permission | string) => boolean;

  /**
   * Vérifie si l'utilisateur possède AU MOINS UNE des permissions fournies
   * @param permissions - Tableau de scopes à vérifier
   * @returns true si l'utilisateur a au moins une permission, false sinon
   */
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;

  /**
   * Vérifie si l'utilisateur possède TOUTES les permissions fournies
   * @param permissions - Tableau de scopes à vérifier
   * @returns true si l'utilisateur a toutes les permissions, false sinon
   */
  hasAllPermissions: (permissions: (Permission | string)[]) => boolean;

  /**
   * Retourne toutes les permissions de l'utilisateur
   */
  permissions: string[];
}

/**
 * Hook personnalisé pour gérer les permissions
 *
 * @example
 * ```tsx
 * const { hasPermission } = usePermissions();
 *
 * if (hasPermission('ticket:create')) {
 *   return <button>Créer un ticket</button>;
 * }
 * ```
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  /**
   * ⚠️ CRITIQUE : On lit UNIQUEMENT le champ authorities[]
   * On ignore complètement realm_access.roles et resource_access
   */
  const permissions = user?.authorities || [];

  /**
   * Vérifie si une permission spécifique existe
   */
  const hasPermission = (permission: Permission | string): boolean => {
    if (!user || !permissions.length) {
      return false;
    }

    return permissions.includes(permission);
  };

  /**
   * Vérifie si AU MOINS UNE permission est présente
   */
  const hasAnyPermission = (requiredPermissions: (Permission | string)[]): boolean => {
    if (!user || !permissions.length || !requiredPermissions.length) {
      return false;
    }

    return requiredPermissions.some((permission) => permissions.includes(permission));
  };

  /**
   * Vérifie si TOUTES les permissions sont présentes
   */
  const hasAllPermissions = (requiredPermissions: (Permission | string)[]): boolean => {
    if (!user || !permissions.length || !requiredPermissions.length) {
      return false;
    }

    return requiredPermissions.every((permission) => permissions.includes(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  };
};
