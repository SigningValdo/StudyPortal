import { FC } from 'react';
import { FinancementIdentityInfo, FinancementParentInfo } from '@contracts/api-contracts';
import FileField from './FileField';
import TextField from './TextField';

export interface StepIdentityProps {
  value: FinancementIdentityInfo;
  onChange: (value: FinancementIdentityInfo) => void;
}

const PreviewCard: FC<{ label: string }> = ({ label }) => (
  <div className="flex h-full items-center justify-center rounded-lg bg-[#D8D8D8] text-xs font-medium text-brand-text-muted">
    {label}
  </div>
);

const ParentColumn: FC<{
  title: string;
  value: FinancementParentInfo;
  onChange: (next: FinancementParentInfo) => void;
}> = ({ title, value, onChange }) => {
  const update = <K extends keyof FinancementParentInfo>(key: K, next: FinancementParentInfo[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-y-6 gap-x-10">
      <TextField
        label={title}
        placeholder=""
        value={value.fullName}
        onChange={(e) => update('fullName', e.target.value)}
      />
      <TextField
        label="Numéro de téléphone"
        placeholder=""
        value={value.phoneNumber}
        onChange={(e) => update('phoneNumber', e.target.value)}
      />
      <TextField
        label="lieu de résidence"
        placeholder=""
        value={value.residence}
        onChange={(e) => update('residence', e.target.value)}
      />
    </div>
  );
};

export const StepIdentity: FC<StepIdentityProps> = ({ value, onChange }) => {
  const updateField = <K extends keyof FinancementIdentityInfo>(
    key: K,
    next: FinancementIdentityInfo[K]
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <FileField
            placeholder="Scan CNI"
            fileName={value.cniScanFileName}
            onFileChange={(file) => updateField('cniScanFileName', file?.name ?? '')}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <FileField
            placeholder="Demi carte photo"
            fileName={value.photoFileName}
            onFileChange={(file) => updateField('photoFileName', file?.name ?? '')}
            accept=".jpg,.jpeg,.png"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PreviewCard label={value.cniScanFileName ? value.cniScanFileName : 'Aperçu'} />
          <PreviewCard label={value.photoFileName ? value.photoFileName : 'Aperçu'} />
        </div>
      </div>

      <div className="text-center text-base font-semibold text-brand-dark">
        Informations parentales
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
        <ParentColumn
          title="Nom et prénom parent 1"
          value={value.parent1}
          onChange={(next) => updateField('parent1', next)}
        />
        <ParentColumn
          title="Nom et prénom parent 2"
          value={value.parent2}
          onChange={(next) => updateField('parent2', next)}
        />
      </div>
    </div>
  );
};

export default StepIdentity;
