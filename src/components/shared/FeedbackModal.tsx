import { FC } from 'react';
import Modal from './Modal';

type FeedbackButtonVariant = 'success' | 'warning' | 'danger' | 'cancel' | 'confirm';

interface FeedbackButtonProps {
  variant: FeedbackButtonVariant;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  uppercase?: boolean;
  widthPx?: number;
}

const BUTTON_COLORS: Record<FeedbackButtonVariant, string> = {
  success: 'bg-brand-success text-white',
  warning: 'bg-brand-warning text-white',
  danger: 'bg-brand-danger text-white',
  cancel: 'bg-brand-neutral-dark text-white',
  confirm: 'bg-brand-success text-white',
};

const FeedbackButton: FC<FeedbackButtonProps> = ({
  variant,
  onClick,
  disabled,
  children,
  uppercase = false,
  widthPx = 150,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto min-w-[150px] ${BUTTON_COLORS[variant]} ${uppercase ? 'uppercase tracking-wide' : ''}`}
    style={{ minWidth: widthPx }}
  >
    {children}
  </button>
);

const SuccessIcon: FC = () => (
  <svg
    width="61"
    height="61"
    viewBox="0 0 61 61"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M57.0921 33.3347C54.9378 44.1063 46.8161 54.2487 35.4198 56.5151C29.8617 57.6219 24.096 56.9471 18.9437 54.5865C13.7914 52.2259 9.51526 48.3 6.72403 43.3677C3.93281 38.4355 2.76884 32.7483 3.39786 27.116C4.02688 21.4838 6.41682 16.1935 10.2274 11.9985C18.0432 3.38993 31.2405 1.0202 42.012 5.32881"
      stroke="#20AE5C"
      strokeWidth="6.46291"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.4692 29.0259L31.2408 39.7974L57.0924 11.7915"
      stroke="#20AE5C"
      strokeWidth="6.46291"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SuccessCheckIcon: FC = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M10 28L23 41L46 14"
      stroke="#27AE60"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningTriangleIcon: FC = () => (
  <svg
    width="69"
    height="60"
    viewBox="0 0 69 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M34.021 2.43066L2.43066 56.9958H65.6114L34.021 2.43066Z"
      stroke="#F18F01"
      strokeWidth="4.86104"
      strokeLinejoin="round"
    />
    <path
      d="M34.021 45.5085V46.9444M34.021 22.5337L34.0325 36.8929"
      stroke="#F18F01"
      strokeWidth="4.86104"
      strokeLinecap="round"
    />
  </svg>
);

const ErrorFaceIcon: FC = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M69.6016 34.8008C69.6016 30.2307 68.7014 25.7053 66.9525 21.4831C65.2036 17.2609 62.6402 13.4245 59.4087 10.1929C56.1771 6.96136 52.3407 4.39796 48.1185 2.64905C43.8963 0.900149 39.3709 0 34.8008 0C30.2307 0 25.7053 0.900149 21.4831 2.64905C17.2609 4.39796 13.4245 6.96136 10.1929 10.1929C6.96136 13.4245 4.39796 17.2609 2.64905 21.4831C0.900149 25.7053 -6.80999e-08 30.2307 0 34.8008C1.37534e-07 44.0305 3.6665 52.8823 10.1929 59.4087C16.7193 65.9351 25.571 69.6016 34.8008 69.6016C44.0305 69.6016 52.8823 65.9351 59.4087 59.4087C65.9351 52.8823 69.6016 44.0305 69.6016 34.8008ZM5.80013 34.8008C5.80013 27.1093 8.85555 19.7329 14.2942 14.2942C19.7329 8.85555 27.1093 5.80013 34.8008 5.80013C42.4922 5.80013 49.8687 8.85555 55.3074 14.2942C60.746 19.7329 63.8014 27.1093 63.8014 34.8008C63.8014 42.4922 60.746 49.8687 55.3074 55.3074C49.8687 60.746 42.4922 63.8014 34.8008 63.8014C27.1093 63.8014 19.7329 60.746 14.2942 55.3074C8.85555 49.8687 5.80013 42.4922 5.80013 34.8008ZM29.0007 27.5506C29.0007 28.1219 28.8881 28.6876 28.6695 29.2153C28.4509 29.7431 28.1305 30.2227 27.7265 30.6266C27.3226 31.0306 26.843 31.351 26.3153 31.5696C25.7875 31.7882 25.2218 31.9007 24.6506 31.9007C24.0793 31.9007 23.5136 31.7882 22.9858 31.5696C22.4581 31.351 21.9785 31.0306 21.5746 30.6266C21.1706 30.2227 20.8502 29.7431 20.6316 29.2153C20.413 28.6876 20.3005 28.1219 20.3005 27.5506C20.3005 26.3969 20.7588 25.2904 21.5746 24.4746C22.3904 23.6588 23.4968 23.2005 24.6506 23.2005C25.8043 23.2005 26.9107 23.6588 27.7265 24.4746C28.5423 25.2904 29.0007 26.3969 29.0007 27.5506ZM49.3011 27.5506C49.3011 28.7043 48.8428 29.8108 48.027 30.6266C47.2112 31.4424 46.1047 31.9007 44.951 31.9007C43.7973 31.9007 42.6908 31.4424 41.875 30.6266C41.0592 29.8108 40.6009 28.7043 40.6009 27.5506C40.6009 26.3969 41.0592 25.2904 41.875 24.4746C42.6908 23.6588 43.7973 23.2005 44.951 23.2005C46.1047 23.2005 47.2112 23.6588 48.027 24.4746C48.8428 25.2904 49.3011 26.3969 49.3011 27.5506ZM23.9661 51.1688C29.3313 44.8118 40.2645 44.8118 45.6354 51.1688C45.8751 51.4771 46.1746 51.7338 46.5159 51.9236C46.8572 52.1133 47.2333 52.2322 47.6217 52.2731C48.01 52.3139 48.4026 52.2759 48.776 52.1614C49.1493 52.0468 49.4956 51.858 49.7942 51.6063C50.0928 51.3546 50.3375 51.0452 50.5136 50.6967C50.6897 50.3481 50.7935 49.9676 50.819 49.5779C50.8444 49.1882 50.7909 48.7974 50.6617 48.4289C50.5324 48.0604 50.33 47.7219 50.0667 47.4335C42.3816 38.3273 27.2142 38.3273 19.5348 47.4335C19.2715 47.7219 19.0692 48.0604 18.9399 48.4289C18.8106 48.7974 18.7571 49.1882 18.7826 49.5779C18.808 49.9676 18.9119 50.3481 19.088 50.6967C19.2641 51.0452 19.5088 51.3546 19.8074 51.6063C20.106 51.858 20.4523 52.0468 20.8256 52.1614C21.1989 52.2759 21.5916 52.3139 21.9799 52.2731C22.3683 52.2322 22.7444 52.1133 23.0857 51.9236C23.427 51.7338 23.7265 51.4771 23.9661 51.1688Z"
      fill="#F21E1E"
      fillOpacity="0.93"
    />
  </svg>
);

const SimpleConfirmIcon: FC = () => (
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-warning">
    <svg width="8" height="28" viewBox="0 0 8 28" fill="none" aria-hidden>
      <path d="M4 2V18" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <circle cx="4" cy="24" r="2.5" fill="white" />
    </svg>
  </div>
);

export interface SuccessModalProps {
  open: boolean;
  title?: string;
  message: string;
  description?: string;
  buttonLabel?: string;
  onConfirm: () => void;
  /** 'circled' uses the circled check (FR style); 'check' uses bare check (EN style). */
  iconStyle?: 'circled' | 'check';
}

export const SuccessModal: FC<SuccessModalProps> = ({
  open,
  title = 'SUCCESS!',
  message,
  description,
  buttonLabel = 'Continuer',
  onConfirm,
  iconStyle = 'circled',
}) => (
  <Modal open={open} onClose={onConfirm} width={624}>
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      {iconStyle === 'circled' ? <SuccessIcon /> : <SuccessCheckIcon />}
      <h2 className="text-xl font-bold tracking-wide text-brand-success">{title}</h2>
      <div className="space-y-1">
        <p className="text-lg font-medium text-brand-dark whitespace-pre-line">{message}</p>
        {description && <p className="text-lg font-light">{description}</p>}
      </div>
      <FeedbackButton variant="success" onClick={onConfirm}>
        {buttonLabel}
      </FeedbackButton>
    </div>
  </Modal>
);

export interface WarningModalProps {
  open: boolean;
  title?: string;
  message: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const WarningModal: FC<WarningModalProps> = ({
  open,
  title = 'ATTENTION!',
  message,
  description,
  cancelLabel = 'Annuler',
  confirmLabel = 'Confirmer',
  onCancel,
  onConfirm,
  loading = false,
}) => (
  <Modal open={open} onClose={onCancel} width={624}>
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <WarningTriangleIcon />
      <h2 className="text-xl font-bold tracking-wide text-brand-warning-soft">{title}</h2>
      <div className="space-y-1">
        <p className="text-lg font-medium text-brand-dark whitespace-pre-line">{message}</p>
        {description && <p className="text-lg font-light">{description}</p>}
      </div>
      <div className="flex items-center justify-center gap-3">
        <FeedbackButton variant="cancel" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </FeedbackButton>
        <FeedbackButton variant="warning" onClick={onConfirm} disabled={loading}>
          {loading ? '...' : confirmLabel}
        </FeedbackButton>
      </div>
    </div>
  </Modal>
);

export interface ErrorModalProps {
  open: boolean;
  title?: string;
  message: string;
  description?: string;
  buttonLabel?: string;
  onRetry: () => void;
}

export const ErrorModal: FC<ErrorModalProps> = ({
  open,
  title = 'ERREUR!',
  message,
  description,
  buttonLabel = 'REESSAYER',
  onRetry,
}) => (
  <Modal open={open} onClose={onRetry} width={624}>
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <ErrorFaceIcon />
      <h2 className="text-xl font-bold tracking-wide text-brand-danger">{title}</h2>
      <div className="space-y-1">
        <p className="text-lg font-medium text-brand-dark whitespace-pre-line">{message}</p>
        {description && <p className="text-lg font-light">{description}</p>}
      </div>
      <FeedbackButton variant="danger" onClick={onRetry} uppercase>
        {buttonLabel}
      </FeedbackButton>
    </div>
  </Modal>
);

export interface ConfirmModalProps {
  open: boolean;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  message,
  cancelLabel = 'Annuler',
  confirmLabel = 'Confirmer',
  onCancel,
  onConfirm,
  loading = false,
}) => (
  <Modal open={open} onClose={onCancel} width={624}>
    <div className="flex flex-col items-center gap-6 py-2 text-center">
      <SimpleConfirmIcon />
      <p className="text-lg font-medium text-brand-dark whitespace-pre-line">{message}</p>
      <div className="flex items-center justify-center gap-3">
        <FeedbackButton variant="cancel" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </FeedbackButton>
        <FeedbackButton variant="confirm" onClick={onConfirm} disabled={loading}>
          {loading ? '...' : confirmLabel}
        </FeedbackButton>
      </div>
    </div>
  </Modal>
);
