import { FC, useRef } from 'react';
import {
  FinancementJustificationFile,
  FinancementJustificationInfo,
} from '@contracts/api-contracts';

const MAX_LENGTH = 5000;

export interface StepJustificationProps {
  value: FinancementJustificationInfo;
  onChange: (value: FinancementJustificationInfo) => void;
}

const PencilIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.6933 4.36027L15.64 7.30694M13.9433 3.11027C14.3341 2.71952 14.8641 2.5 15.4167 2.5C15.9693 2.5 16.4992 2.71952 16.89 3.11027C17.2808 3.50103 17.5003 4.031 17.5003 4.58361C17.5003 5.13622 17.2808 5.66619 16.89 6.05694L5.41667 17.5303H2.5V14.5536L13.9433 3.11027Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const TrashIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.3335 9.16667V14.1667M11.6668 9.16667V14.1667M3.3335 5.83333H16.6668M15.8335 5.83333L15.111 15.9517C15.0811 16.3722 14.8929 16.7657 14.5844 17.053C14.2759 17.3403 13.87 17.5 13.4485 17.5H6.55183C6.13028 17.5 5.72439 17.3403 5.4159 17.053C5.10742 16.7657 4.91926 16.3722 4.88933 15.9517L4.16683 5.83333H15.8335ZM12.5002 5.83333V3.33333C12.5002 3.11232 12.4124 2.90036 12.2561 2.74408C12.0998 2.5878 11.8878 2.5 11.6668 2.5H8.3335C8.11248 2.5 7.90052 2.5878 7.74424 2.74408C7.58796 2.90036 7.50016 3.11232 7.50016 3.33333V5.83333H12.5002Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const StepJustification: FC<StepJustificationProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => inputRef.current?.click();

  const handleFilesPicked = (filesList: FileList | null) => {
    if (!filesList) return;
    const next: FinancementJustificationFile[] = Array.from(filesList).map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: file.name,
    }));
    onChange({ ...value, files: [...value.files, ...next] });
  };

  const handleRename = (id: string) => {
    const file = value.files.find((f) => f.id === id);
    if (!file) return;
    const newName = window.prompt('Renommer le justificatif', file.name);
    if (!newName) return;
    onChange({
      ...value,
      files: value.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    });
  };

  const handleDelete = (id: string) => {
    onChange({ ...value, files: value.files.filter((f) => f.id !== id) });
  };

  return (
    <div className="flex flex-col gap-14">
      <div className="relative">
        <p className="text-center text-xs mb-3 text-brand-text-muted">
          Expliquez votre situation, et dites pourquoi vous sollicitez un financement
        </p>
        <textarea
          value={value.explanation}
          maxLength={MAX_LENGTH}
          onChange={(e) => onChange({ ...value, explanation: e.target.value })}
          className="h-56 w-full resize-none rounded-2xl bg-[#D8D8D8] p-4 text-sm text-brand-dark placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
        <div className="absolute bottom-3 right-4 text-xs text-brand-text-muted">
          {value.explanation.length}/{MAX_LENGTH}
        </div>
      </div>

      <div className="rounded-2xl border-[2px] border-brand-border-soft pl-14 pr-10 pt-[18px] pb-16">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddClick}
            className="rounded-xl bg-[#27AE60] px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ajouter un justificatif
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFilesPicked(e.target.files)}
          />
        </div>

        <div className="mt-10 flex flex-col  gap-3">
          {value.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center border border-[#FFA600] rounded-md gap-2"
            >
              <div className="flex flex-1 items-center overflow-hidden rounded-md">
                <span className="bg-[#FFA600] px-3 py-2 text-xs font-semibold rounded-r-md text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {file.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRename(file.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FFA600] text-white transition-opacity hover:opacity-90"
                aria-label="Renommer"
              >
                <PencilIcon />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(file.id)}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E21A30] text-white transition-opacity hover:opacity-90"
                aria-label="Supprimer"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepJustification;
