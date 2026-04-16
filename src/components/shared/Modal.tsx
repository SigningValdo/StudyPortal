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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-3 py-4 sm:items-center sm:px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width }}
        className={`max-h-full w-full max-w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-8 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
