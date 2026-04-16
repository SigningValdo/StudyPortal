import { FC, MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react';
import Button from '@/components/shared/Button';
import Modal from './Modal';
import contrat from '@/assets/images/contrat.png';

export interface SignaturePadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (signatureDataUrl: string) => void;
  loading?: boolean;
}

const WarningIcon: FC = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 7V13" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="white" />
    </svg>
  </div>
);

const EraserIcon: FC = () => (
  <svg width="43" height="38" viewBox="0 0 43 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M40.772 10.0684L32.066 1.42885C31.1356 0.531664 29.9061 0 28.6102 0C27.3142 0 26.0848 0.498435 25.1544 1.42885L1.42885 25.0214C0.498435 25.9186 0 27.1481 0 28.444C0 29.74 0.498435 30.9694 1.42885 31.8666L6.97809 37.4159C7.11101 37.5488 7.27715 37.6152 7.4433 37.6152H30.6704C31.0359 37.6152 31.335 37.3162 31.335 36.9507C31.335 36.5851 31.0359 36.2861 30.6704 36.2861H21.2998L40.7388 16.9468C42.666 15.0527 42.666 11.9624 40.772 10.0684ZM19.439 36.2861H7.70913L2.35926 30.9694C1.69468 30.3049 1.32916 29.4077 1.32916 28.444C1.32916 27.4804 1.69468 26.6164 2.35926 25.9186L14.0226 14.3549L27.7462 28.0121L19.439 36.2861Z"
      fill="white"
    />
  </svg>
);

const PenIcon: FC = () => (
  <svg
    width="172"
    height="172"
    viewBox="0 0 172 172"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.1"
      d="M78.8327 35.8332H42.9993C39.1979 35.8332 35.5522 37.3433 32.8642 40.0313C30.1761 42.7194 28.666 46.3651 28.666 50.1665V129C28.666 132.801 30.1761 136.447 32.8642 139.135C35.5522 141.823 39.1979 143.333 42.9993 143.333H121.833C125.634 143.333 129.28 141.823 131.968 139.135C134.656 136.447 136.166 132.801 136.166 129V93.1665M126.032 25.6995C127.355 24.3305 128.936 23.2386 130.685 22.4874C132.434 21.7362 134.314 21.3408 136.218 21.3243C138.121 21.3077 140.008 21.6704 141.77 22.3911C143.531 23.1118 145.132 24.1761 146.477 25.5219C147.823 26.8677 148.887 28.468 149.608 30.2295C150.329 31.991 150.691 33.8784 150.675 35.7816C150.658 37.6848 150.263 39.5656 149.512 41.3143C148.761 43.0631 147.669 44.6447 146.3 45.9669L84.7667 107.5H64.4993V87.2325L126.032 25.6995Z"
      stroke="black"
      stroke-width="5"
      stroke-linecap="round"
      stroke-linejoin="round"
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
    <Modal open={open} onClose={onClose} fullScreen transparent>
      <div className="grid h-full w-full grid-cols-1 content-center gap-6 p-6 lg:grid-cols-2 lg:p-10">
        {/* Carte contrat */}
        <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03)]">
          <img src={contrat} alt="Contrat" className=" w-full object-contain" />
        </div>

        <div className="flex flex-col gap-5 ">
          {/* Carte avertissement */}
          <div className="relative rounded-2xl bg-white px-4 py-6 pl-8 sm:px-6 sm:py-10 sm:pl-16 shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03)] h-1/3 flex items-center ">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="rounded-full border-4 border-[#F18F01] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <WarningIcon />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-center max-w-lg mx-auto my-auto text-brand-dark">
              En acceptant et en signant, vous approuvez toutes les proformas et contrats qui vous
              ont été présentés, et autres indications
            </p>
          </div>

          {/* Carte signature */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03)] p-4 sm:p-6 lg:p-10 h-2/3 flex flex-col justify-between">
            <div className="bg-[#3A3A3A] py-3 text-center rounded-2xl text-sm font-medium text-white">
              Votre Signature
            </div>
            <div className="relative">
              <div className="">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={420}
                    height={180}
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
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="cancel" onClick={onClose} disabled={loading} className="!w-[110px]">
                Annuler
              </Button>
              <button
                type="button"
                onClick={handleClear}
                className="flex h-[67px] w-[67px] items-center justify-center rounded-full bg-[#FCAF17] text-white shadow-[0_4px_12px_rgba(248,130,6,0.35)] transition-opacity hover:opacity-90"
                aria-label="Effacer la signature"
              >
                <EraserIcon />
              </button>
              <Button
                variant="confirm"
                onClick={handleConfirm}
                disabled={loading || !hasStrokes}
                className="!w-[110px]"
              >
                {loading ? '...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignaturePadModal;
