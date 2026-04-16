import { FC, useRef } from 'react';

export interface AvatarEditorProps {
  avatarUrl?: string;
  alt?: string;
  onFileChange: (file: File) => void;
}

export const AvatarEditor: FC<AvatarEditorProps> = ({
  avatarUrl,
  alt = 'Avatar',
  onFileChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => inputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={alt}
            className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary-soft text-2xl font-bold text-brand-primary">
            {alt
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handlePick}
        className="text-sm font-semibold text-brand-confirm"
      >
        Modifier la Photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileChange(file);
        }}
      />
    </div>
  );
};

export default AvatarEditor;
