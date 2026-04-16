import { FC, useRef } from 'react';

export interface FileFieldProps {
  label?: string;
  fileName?: string;
  onFileChange: (file: File | null) => void;
  accept?: string;
}

export const FileField: FC<FileFieldProps> = ({
  label,
  fileName,
  onFileChange,
  accept,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-brand-text-muted">{label}</label>
      )}
      <div className="flex items-stretch overflow-hidden rounded-lg bg-[#F3F4F8]">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-[#C9CCD1] px-4 py-3 text-xs font-semibold text-brand-dark transition-opacity hover:opacity-90"
        >
          Choisir un fichier
        </button>
        <span className="flex flex-1 items-center px-4 text-xs text-brand-text-muted truncate">
          {fileName || 'Aucun fichier sélectionné'}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
};

export default FileField;
