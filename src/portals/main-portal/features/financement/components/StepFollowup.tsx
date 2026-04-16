import { FC } from 'react';
import { FinancementFollowupInfo } from '@contracts/api-contracts';

const COLORS = {
  active: '#495AFF',
  muted: '#ABB7C2',
};

const CheckIcon: FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12L10 17L20 7"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoCircle: FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={COLORS.active} strokeWidth="2" />
    <path d="M12 8V13M12 16V16.5" stroke={COLORS.active} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3V15M12 15L7 10M12 15L17 10M5 21H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface StepFollowupProps {
  value: FinancementFollowupInfo;
  onDownloadSummary: () => void;
}

export const StepFollowup: FC<StepFollowupProps> = ({ value, onDownloadSummary }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex w-full max-w-sm flex-col">
        {value.steps.map((step, index) => {
          const isLast = index === value.steps.length - 1;
          const circle =
            step.status === 'completed' ? (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.active }}
              >
                <CheckIcon />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <InfoCircle />
              </div>
            );

          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center">
                {circle}
                {!isLast && (
                  <div
                    className="w-0"
                    style={{
                      height: 50,
                      borderLeftWidth: 1,
                      borderColor: step.status === 'completed' ? COLORS.active : COLORS.muted,
                    }}
                  />
                )}
              </div>
              <div className="ml-4 pt-2 text-base font-semibold text-brand-dark">{step.label}</div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onDownloadSummary}
        className="inline-flex items-center gap-2 rounded-xl bg-[#27AE60] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
      >
        <DownloadIcon />
        Télécharger le résumé de ma demande
      </button>
    </div>
  );
};

export default StepFollowup;
