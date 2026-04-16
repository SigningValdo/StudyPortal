import { FC } from 'react';
import { AviTrainingInfo } from '@contracts/api-contracts';
import TextField from './TextField';
import DateField from './DateField';
import FileField from './FileField';

export interface StepTrainingProps {
  value: AviTrainingInfo;
  onChange: (value: AviTrainingInfo) => void;
}

export const StepTraining: FC<StepTrainingProps> = ({ value, onChange }) => {
  const set = <K extends keyof AviTrainingInfo>(key: K, val: AviTrainingInfo[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <TextField
        placeholder="Nom de l'établissement d'acceuil"
        value={value.institutionName}
        onChange={(e) => set('institutionName', e.target.value)}
      />
      <TextField
        placeholder="Titre de la formation"
        value={value.trainingTitle}
        onChange={(e) => set('trainingTitle', e.target.value)}
      />
      <TextField
        placeholder="Ville"
        value={value.city}
        onChange={(e) => set('city', e.target.value)}
      />
      <DateField
        label="Date de début de la formation"
        value={value.startDate}
        onChange={(e) => set('startDate', e.target.value)}
      />
      <FileField
        label="Attestation d'inscription / Lettre d'admission"
        fileName={value.admissionLetterName}
        onFileChange={(file) => set('admissionLetterName', file?.name ?? '')}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default StepTraining;
