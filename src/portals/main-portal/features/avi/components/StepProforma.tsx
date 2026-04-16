import { FC, useState } from 'react';
import { AviProformaKind } from '@contracts/api-contracts';
import { SuccessModal } from '@/components/shared/FeedbackModal';
import proforma from '@/assets/images/proforma.png';

export interface StepProformaProps {
  /** Which proforma is currently previewed. */
  selected: AviProformaKind | null;
  onSelect: (kind: AviProformaKind) => void;
}

const PROFORMAS: { kind: AviProformaKind; label: string; fileName: string }[] = [
  {
    kind: 'service',
    label: 'Proforma de service',
    fileName: 'Proforma_service_AVI.pdf',
  },
  {
    kind: 'financement',
    label: 'Proforma de financement',
    fileName: 'Proforma_financement_AVI.pdf',
  },
];

export const StepProforma: FC<StepProformaProps> = ({ selected, onSelect }) => {
  // const [hovered, setHovered] = useState<AviProformaKind | null>(null);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);
  // const previewKind = hovered ?? selected;

  return (
    <>
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
        {/* Left — card list */}
        <div className="space-y-10">
          <p className="text-2xl text-center">Cliquez pour voir vos proformas</p>

          {PROFORMAS.map((pf) => {
            const isSelected = selected === pf.kind;
            return (
              <button
                key={pf.kind}
                type="button"
                onClick={() => onSelect(pf.kind)}
                // onMouseEnter={() => setHovered(pf.kind)}
                // onMouseLeave={() => setHovered(null)}
                className={`flex w-full items-center shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)] gap-3 rounded-xl border  p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-l-[18px] border-l-brand-primary'
                    : ' border-brand-border-soft bg-white'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold text-center text-brand-dark">{pf.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right — preview */}
        <div className="flex flex-1 min-h-[260px] items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_7px_16px_0_rgba(0,0,0,0.05)]">
          <img src={proforma} alt="Proforma" />
        </div>
      </div>
      <SuccessModal
        open={downloadedFileName !== null}
        message="Action effectuée avec succès"
        description={downloadedFileName ? `Téléchargement de ${downloadedFileName} en cours` : ''}
        onConfirm={() => setDownloadedFileName(null)}
      />
    </>
  );
};

export default StepProforma;
