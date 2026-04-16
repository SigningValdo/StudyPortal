import { ButtonHTMLAttributes, FC } from 'react';

export type ButtonVariant = 'confirm' | 'cancel';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  confirm: 'bg-brand-confirm text-white',
  cancel: 'bg-brand-neutral text-white',
};

export const Button: FC<ButtonProps> = ({
  variant = 'confirm',
  className = '',
  style,
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`inline-flex min-w-[110px] items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
