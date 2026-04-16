import { FC, useState } from 'react';
import { EyeIcon, EyeOffIcon } from './ProfileIcons';

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PasswordField: FC<PasswordFieldProps> = ({ label, value, onChange, placeholder }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-brand-text-muted">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-[8px] bg-[#EFF1F999] px-4 py-2 text-2xl text-brand-dark placeholder:text-[#ABAFB1] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 `}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-dark"
          aria-label={visible ? 'Masquer' : 'Afficher'}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
