import { FC } from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
}

export const ToggleSwitch: FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && (
          <div className="text-sm font-semibold text-brand-dark">{label}</div>
        )}
        {description && (
          <p className="mt-0.5 text-xs text-brand-text-muted">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        style={{ backgroundColor: checked ? '#0140FF' : '#D5D5D5' }}
      >
        <span
          className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
