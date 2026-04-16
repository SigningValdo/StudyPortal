import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import boazLogo from '@/assets/images/BOAZ  studyy.png';
import { useAuthStore } from '@store/authStore';
import { ADMIN_USER, AGENT_USER, BASIC_USER, generateMockToken } from '@services/mock';
import type { AuthUser } from '@contracts/api-contracts';

type Profile = 'admin' | 'agent' | 'user';

const PROFILES: Array<{ key: Profile; user: AuthUser }> = [
  { key: 'admin', user: ADMIN_USER },
  { key: 'agent', user: AGENT_USER },
  { key: 'user', user: BASIC_USER },
];

// Mock credentials mapped to profiles for the UI
const PROFILE_CREDENTIALS: Record<Profile, { email: string; password: string }> = {
  admin: { email: 'admin@boaz.cm', password: 'Admin2025!' },
  agent: { email: 'agent@boaz.cm', password: 'Agent2025!' },
  user: { email: 'signing@gmail.com', password: '········' },
};

const EnvelopeIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#ABB7C2" strokeWidth="1.5" />
    <path d="M3 7L12 13L21 7" stroke="#ABB7C2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LockIcon: FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#ABB7C2" strokeWidth="1.5" />
    <path
      d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
      stroke="#ABB7C2"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EyeIcon: FC<{ open: boolean }> = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
        stroke="#ABB7C2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#ABB7C2" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20C5 20 2 12 2 12A18.45 18.45 0 015.06 6.06M9.9 4.24A9.12 9.12 0 0112 4C19 4 22 12 22 12A18.5 18.5 0 0119.42 16.46M1 1L23 23"
        stroke="#ABB7C2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  // Default to the "user" mock profile pre-filled
  const [email, setEmail] = useState(PROFILE_CREDENTIALS.user.email);
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  const detectProfile = (): Profile => {
    for (const p of PROFILES) {
      if (email === PROFILE_CREDENTIALS[p.key].email) return p.key;
    }
    return 'user';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = detectProfile();
    const mockUser = PROFILES.find((p) => p.key === profile)?.user;
    if (!mockUser) return;
    setUser(mockUser, generateMockToken(mockUser));
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <img src={boazLogo} alt="Boaz Study" className="h-20 w-auto" />
        </div>

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-lg font-bold text-brand-dark">Connectez-vous à votre compte</h1>
          <p className="mt-1 text-xs text-brand-text-muted">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-3 rounded-xl bg-[#EEF1F8] px-4 py-3">
            <EnvelopeIcon />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 bg-transparent text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 rounded-xl bg-[#EEF1F8] px-4 py-3">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="flex-1 bg-transparent text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button type="button" className="text-xs font-medium text-[#E05C3A] hover:underline">
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Se connecter
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center">
          <p className="text-xs text-brand-text-muted">Vous n'avez pas encore de compte ?</p>
          <button
            type="button"
            className="mt-0.5 text-xs font-semibold text-brand-primary hover:underline"
          >
            Créer mon compte
          </button>
        </div>

        {/* Dev hint */}
        <p className="mt-5 border-t border-brand-border pt-4 text-center text-[10px] text-brand-muted">
          Mock — utilisez admin@boaz.cm · agent@boaz.cm · signing@gmail.com
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
