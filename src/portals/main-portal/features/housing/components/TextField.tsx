import { FC, InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TextField: FC<TextFieldProps> = ({ label, className = '', ...rest }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#5E6366]">{label}</label>
      )}
      <input
        {...rest}
        className={`w-full rounded-[8px] bg-[#EFF1F999] px-4 py-3 text-sm text-brand-dark placeholder:text-[#ABAFB1] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 ${className}`}
      />
    </div>
  );
};

export default TextField;
