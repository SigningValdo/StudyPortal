import { FC, InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  trailingText?: string;
}

export const TextField: FC<TextFieldProps> = ({
  label,
  trailingText,
  className = '',
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#5E6366]">{label}</label>
      )}
      <div className="relative">
        <input
          {...rest}
          className={`w-full rounded-[8px] bg-[#EFF1F999] px-4 py-3 ${
            trailingText ? 'pr-14' : ''
          } text-sm text-brand-dark placeholder:text-[#ABAFB1] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${className}`}
        />
        {trailingText && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-text-muted">
            {trailingText}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextField;
