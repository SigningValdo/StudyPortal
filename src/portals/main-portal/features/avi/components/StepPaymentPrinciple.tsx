import { FC } from 'react';
import { AviPaymentPrinciple } from '@contracts/api-contracts';

export interface StepPaymentPrincipleProps {
  value: AviPaymentPrinciple | '';
  onChange: (value: AviPaymentPrinciple) => void;
}

const OPTIONS: { key: AviPaymentPrinciple; description: string }[] = [
  {
    key: 'Paiement total',
    description: 'Choisissez cette option si vous souhaitez payer la totalité des frais.',
  },
  {
    key: 'Paiement par financement',
    description: 'Choisissez cette option si vous avez souscrits à un fiancement',
  },
];

const ChevronIcon: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={`transition-transform ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StepPaymentPrinciple: FC<StepPaymentPrincipleProps> = ({ value, onChange }) => {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12">
      <p className="text-2xl text-center">Sélectionnez votre mode de paiement</p>

      <div className="space-y-9">
        {OPTIONS.map((option) => {
          const isSelected = value === option.key;
          return (
            <div
              key={option.key}
              className="rounded-xl bg-white shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)]"
            >
              <button
                key={option.key}
                type="button"
                onClick={() => onChange(option.key)}
                className={`w-full rounded-xl border px-5 py-4 text-left transition-colors bg-white shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)] ${
                  isSelected ? 'border-brand-primary' : 'border-brand-border-soft'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold w-full text-center ${'text-brand-dark'}`}>
                    {option.key}
                  </span>
                  <ChevronIcon open={isSelected} />
                </div>
              </button>
              {isSelected && (
                <p className=" p-10 italic text-sm text-[#495AFF]">{option.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepPaymentPrinciple;
