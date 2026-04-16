import { FC, MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import Button from '@/components/shared/Button';
import Modal from './Modal';

export interface SignaturePadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (signatureDataUrl: string) => void;
  loading?: boolean;
}

const WarningIcon: FC = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F88206]">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 7V13" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="white" />
    </svg>
  </div>
);

const EraserIcon: FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M16 3L21 8L9 20H4V15L16 3Z"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 7L17 12" stroke="white" strokeWidth="2" />
  </svg>
);

const PenIcon: FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 6L18 10M3 21H7L20 8L16 4L3 17V21Z"
      stroke="#ABB7C2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SignaturePadModal: FC<SignaturePadModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  useEffect(() => {
    if (!open) {
      setHasStrokes(false);
    }
  }, [open]);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const getRelativePos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (clientX: number, clientY: number) => {
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getRelativePos(clientX, clientY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const continueDraw = (clientX: number, clientY: number) => {
    if (!drawing) return;
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getRelativePos(clientX, clientY);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0D0B26';
    ctx.stroke();
    setHasStrokes(true);
  };

  const endDraw = () => setDrawing(false);

  const handleClear = () => {
    const ctx = getContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleConfirm = () => {
    if (!hasStrokes) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onConfirm(canvas.toDataURL('image/png'));
  };

  return (
    <Modal open={open} onClose={onClose} width={760}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-xl bg-white text-sm text-brand-text-muted">
          Aperçu du document
          <br />à signer
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <WarningIcon />
            <p className="text-xs text-brand-dark">
              En acceptant et en signant, vous approuvez toutes les proformats et
              contrats qui vous ont été présentés, et autres indications
            </p>
          </div>

          <div className="rounded-xl bg-[#F3F4F8]">
            <div className="rounded-t-xl bg-[#646464] py-2 text-center text-xs font-semibold text-white">
              Votre Signature
            </div>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={420}
                height={140}
                className="block w-full cursor-crosshair touch-none"
                onMouseDown={(e: MouseEvent<HTMLCanvasElement>) =>
                  startDraw(e.clientX, e.clientY)
                }
                onMouseMove={(e: MouseEvent<HTMLCanvasElement>) =>
                  continueDraw(e.clientX, e.clientY)
                }
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={(e: TouchEvent<HTMLCanvasElement>) => {
                  const touch = e.touches[0];
                  startDraw(touch.clientX, touch.clientY);
                }}
                onTouchMove={(e: TouchEvent<HTMLCanvasElement>) => {
                  const touch = e.touches[0];
                  continueDraw(touch.clientX, touch.clientY);
                }}
                onTouchEnd={endDraw}
              />
              {!hasStrokes && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <PenIcon />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="cancel"
              onClick={onClose}
              disabled={loading}
              style={{ width: 90 }}
            >
              Annuler
            </Button>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F88206] text-white transition-opacity hover:opacity-90"
              aria-label="Effacer la signature"
            >
              <EraserIcon />
            </button>
            <Button
              variant="confirm"
              onClick={handleConfirm}
              disabled={loading || !hasStrokes}
              style={{ width: 100 }}
            >
              {loading ? '...' : 'Confirmer'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignaturePadModal;
