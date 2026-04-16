import { FC } from 'react';

export interface SuccessPanelProps {
  onGoToRequests: () => void;
}

export const SuccessPanel: FC<SuccessPanelProps> = ({ onGoToRequests }) => {
  return (
    <div className="flex flex-col h-full items-center justify-between py-10">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#4CC38A]">
        <svg
          width="136"
          height="135"
          viewBox="0 0 136 135"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M67.7959 1.5C104.42 1.5 134.093 30.9916 134.093 67.3506C134.093 103.71 104.42 133.202 67.7959 133.202C31.1723 133.202 1.5 103.71 1.5 67.3506C1.50013 30.9917 31.1724 1.5002 67.7959 1.5Z"
            fill="#13C39C"
            stroke="#25FFAE"
            stroke-width="3"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M101.931 45.9891L63.0696 94.2598L32.5422 68.9845L38.3021 62.1181L61.7736 81.5462L94.9109 40.4102L101.931 45.9891Z"
            fill="white"
          />
        </svg>
      </div>
      <h3 className="mt-6 text-center text-xl font-bold text-brand-text-muted">
        Demande envoyé
        <br />
        avec succès
      </h3>
      <button
        type="button"
        onClick={onGoToRequests}
        className="mt-8 rounded-xl bg-brand-confirm px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Aller à mes demandes
      </button>
    </div>
  );
};

export default SuccessPanel;
