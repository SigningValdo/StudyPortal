import { FC, ReactNode, useEffect } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  width?: number | string;
}

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  children,
  className = '',
  width = 420,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width }}
        className={`max-w-full rounded-2xl bg-white p-6 shadow-xl ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
