import { FC, InputHTMLAttributes } from 'react';

export interface DateFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const DateField: FC<DateFieldProps> = ({ label, className = '', ...rest }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#5E6366]">{label}</label>
      )}
      <div className="relative">
        <input
          {...rest}
          type="text"
          placeholder="jj/mm/aa"
          className={`w-full rounded-[8px] bg-[#EFF1F999] px-4 py-3 pr-10 text-sm text-brand-dark placeholder:text-[#ABAFB1] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${className}`}
          onFocus={(e) => (e.currentTarget.type = 'date')}
          onBlur={(e) => {
            if (!e.currentTarget.value) e.currentTarget.type = 'text';
          }}
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 3V7M16 3V7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default DateField;
