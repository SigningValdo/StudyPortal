import { FC } from 'react';
import { TwoFactorSettings } from '@contracts/api-contracts';
import ToggleSwitch from './ToggleSwitch';

export interface TwoFactorTabProps {
  value: TwoFactorSettings;
  onChange: (value: TwoFactorSettings) => void;
}

const METHODS: { key: TwoFactorSettings['method']; label: string; hint: string }[] = [
  { key: 'email', label: 'Email', hint: 'Recevoir un code par email' },
  { key: 'sms', label: 'SMS', hint: 'Recevoir un code par SMS' },
  {
    key: 'app',
    label: "Application d'authentification",
    hint: 'Google Authenticator, Authy, etc.',
  },
];

export const TwoFactorTab: FC<TwoFactorTabProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-brand-border-soft p-4">
        <ToggleSwitch
          checked={value.enabled}
          onChange={(next) => onChange({ ...value, enabled: next })}
          label="Activer l'identification à double facteur"
          description="Ajoute une étape de vérification à chaque connexion."
        />
      </div>

      <div
        className="flex flex-col gap-3 transition-opacity"
        style={{
          opacity: value.enabled ? 1 : 0.5,
          pointerEvents: value.enabled ? 'auto' : 'none',
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
          Méthode de vérification
        </span>
        {METHODS.map((method) => {
          const active = value.method === method.key;
          return (
            <button
              key={method.key}
              type="button"
              onClick={() => onChange({ ...value, method: method.key })}
              className="flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors"
              style={{
                borderColor: active ? '#0140FF' : '#E5E7EB',
                backgroundColor: active ? '#F1F3FF' : '#FFFFFF',
              }}
            >
              <div>
                <div className="text-sm font-semibold text-brand-dark">{method.label}</div>
                <div className="text-xs text-brand-text-muted">{method.hint}</div>
              </div>
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full border"
                style={{
                  borderColor: active ? '#0140FF' : '#ABB7C2',
                  backgroundColor: active ? '#0140FF' : 'transparent',
                }}
              >
                {active && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TwoFactorTab;
