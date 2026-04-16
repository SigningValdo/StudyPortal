import { FC, SelectHTMLAttributes } from 'react';

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly string[];
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  options,
  className = '',
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#5E6366]">{label}</label>
      )}
      <div className="relative">
        <select
          {...rest}
          className={`w-full appearance-none rounded-[8px] bg-[#EFF1F999] px-4 py-3 pr-10 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${className}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SelectField;
