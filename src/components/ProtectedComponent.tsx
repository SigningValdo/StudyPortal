/**
 * COMPOSANT PROTECTEDCOMPONENT
 * ⚠️ CRITIQUE - 8 POINTS
 *
 * Composant wrapper qui affiche ou cache du contenu selon les permissions.
 *
 * IMPORTANT :
 * - N'affiche PAS de message d'erreur si l'utilisateur n'a pas la permission
 * - Le contenu doit simplement être absent de l'UI
 * - Basé uniquement sur les permissions (authorities), jamais sur les rôles
 */

import React from 'react';
import { usePermissions } from '@hooks/usePermissions';
import { Permission } from '@contracts/api-contracts';

interface ProtectedComponentProps {
  /**
   * Permission(s) requise(s) pour afficher le contenu
   * Si plusieurs permissions sont fournies, l'utilisateur doit en avoir AU MOINS UNE
   */
  requiredPermissions: Permission | Permission[] | string | string[];

  /**
   * Si true, l'utilisateur doit avoir TOUTES les permissions
   * Par défaut : false (au moins une suffit)
   */
  requireAll?: boolean;

  /**
   * Contenu à afficher si l'utilisateur a la/les permission(s)
   */
  children: React.ReactNode;

  /**
   * Composant alternatif à afficher si l'utilisateur n'a pas les permissions
   * Par défaut : null (rien n'est affiché)
   */
  fallback?: React.ReactNode;
}

/**
 * Composant wrapper pour la protection par permissions
 *
 * @example Utilisation simple
 * ```tsx
 * <ProtectedComponent requiredPermissions="ticket:create">
 *   <button>Créer un ticket</button>
 * </ProtectedComponent>
 * ```
 *
 * @example Avec plusieurs permissions (OR)
 * ```tsx
 * <ProtectedComponent requiredPermissions={['ticket:update', 'ticket:delete']}>
 *   <button>Modifier</button>
 * </ProtectedComponent>
 * ```
 *
 * @example Avec plusieurs permissions (AND)
 * ```tsx
 * <ProtectedComponent
 *   requiredPermissions={['ticket:update', 'ticket:delete']}
 *   requireAll={true}
 * >
 *   <button>Action admin</button>
 * </ProtectedComponent>
 * ```
 *
 * @example Avec fallback
 * ```tsx
 * <ProtectedComponent
 *   requiredPermissions="ticket:create"
 *   fallback={<p>Vous n'avez pas accès à cette fonctionnalité</p>}
 * >
 *   <button>Créer</button>
 * </ProtectedComponent>
 * ```
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  requiredPermissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Normaliser en tableau
  const permissionsArray = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  // Vérifier les permissions
  let hasAccess = false;

  if (permissionsArray.length === 1) {
    // Cas simple : une seule permission
    hasAccess = hasPermission(permissionsArray[0]);
  } else if (requireAll) {
    // Cas : toutes les permissions requises
    hasAccess = hasAllPermissions(permissionsArray);
  } else {
    // Cas : au moins une permission suffit
    hasAccess = hasAnyPermission(permissionsArray);
  }

  // ⚠️ CRITIQUE : Si pas d'accès, on retourne le fallback (null par défaut)
  // PAS de message d'erreur - le composant est simplement absent de l'UI
  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * HOC (Higher-Order Component) pour protéger un composant entier
 *
 * @example
 * ```tsx
 * const ProtectedButton = withPermission(Button, 'ticket:create');
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: Permission | Permission[] | string | string[],
  requireAll = false
) {
  return (props: P) => (
    <ProtectedComponent requiredPermissions={requiredPermissions} requireAll={requireAll}>
      <Component {...props} />
    </ProtectedComponent>
  );
}
