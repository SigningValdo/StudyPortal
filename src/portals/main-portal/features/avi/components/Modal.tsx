import { FC, ReactNode, useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  width?: number | string;
  fullScreen?: boolean;
  transparent?: boolean;
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  children,
  className = '',
  width = 420,
  fullScreen = false,
  transparent = false,
}) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const containerStyle = fullScreen ? undefined : { width };
  const containerClass = fullScreen
    ? `h-full w-full ${transparent ? '' : 'bg-white'} ${transparent ? '' : 'rounded-2xl shadow-xl'} ${className}`
    : `max-w-full rounded-2xl p-6 ${transparent ? '' : 'bg-white shadow-xl'} ${className}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${fullScreen ? 'p-10' : 'p-4'}`}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={containerStyle} className={containerClass}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
