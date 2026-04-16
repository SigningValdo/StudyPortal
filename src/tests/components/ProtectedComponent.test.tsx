import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { useAuthStore } from '@store/authStore';
import { ADMIN_USER, BASIC_USER } from '@services/mock';

describe('ProtectedComponent', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('renders children when user has the required permission', () => {
    useAuthStore.setState({ user: ADMIN_USER, token: 't' });
    render(
      <ProtectedComponent requiredPermissions="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );
    expect(screen.getByText('Créer un ticket')).toBeInTheDocument();
  });

  it('renders nothing (no error message) when permission missing', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 't' });
    const { container } = render(
      <ProtectedComponent requiredPermissions="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/créer/i)).not.toBeInTheDocument();
  });

  it('supports array of permissions with any mode', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 't' });
    render(
      <ProtectedComponent
        requiredPermissions={['ticket:create', 'ticket:read']}
      >
        <span>visible</span>
      </ProtectedComponent>,
    );
    expect(screen.getByText('visible')).toBeInTheDocument();
  });

  it('supports requireAll mode', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 't' });
    const { container } = render(
      <ProtectedComponent
        requireAll
        requiredPermissions={['ticket:read', 'ticket:create']}
      >
        <span>hidden</span>
      </ProtectedComponent>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders fallback when provided and permission missing', () => {
    useAuthStore.setState({ user: BASIC_USER, token: 't' });
    render(
      <ProtectedComponent
        requiredPermissions="ticket:create"
        fallback={<span>nope</span>}
      >
        <span>ok</span>
      </ProtectedComponent>,
    );
    expect(screen.getByText('nope')).toBeInTheDocument();
    expect(screen.queryByText('ok')).not.toBeInTheDocument();
  });
});
