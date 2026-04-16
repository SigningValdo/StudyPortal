import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePermissions } from '@hooks/usePermissions';
import { useAuthStore } from '@store/authStore';
import { ADMIN_USER, BASIC_USER } from '@services/mock';

describe('usePermissions', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('returns false when no user is connected', () => {
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission('ticket:create')).toBe(false);
    expect(result.current.hasAnyPermission(['ticket:read'])).toBe(false);
  });

  it('grants ticket:create to ADMIN profile', () => {
    useAuthStore.setState({ user: ADMIN_USER, token: 'tok' });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission('ticket:create')).toBe(true);
  });

  it('denies ticket:create to BASIC profile', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 'tok' });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission('ticket:create')).toBe(false);
  });

  it('hasAnyPermission returns true when at least one match', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 'tok' });
    const { result } = renderHook(() => usePermissions());
    expect(
      result.current.hasAnyPermission(['ticket:create', 'ticket:read']),
    ).toBe(true);
  });

  it('hasAllPermissions requires every scope present', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 'tok' });
    const { result } = renderHook(() => usePermissions());
    expect(
      result.current.hasAllPermissions(['ticket:read', 'ticket:create']),
    ).toBe(false);
  });

  it('ignores realm_access.roles for decisions', () => {
    useAuthStore.setState({
      user: {
        sub: 'x',
        preferred_username: 'x',
        email: 'x@x',
        authorities: [],
        realm_access: { roles: ['ADMIN'] },
      },
      token: 'tok',
    });
    const { result } = renderHook(() => usePermissions());
    expect(result.current.hasPermission('ticket:create')).toBe(false);
  });
});
