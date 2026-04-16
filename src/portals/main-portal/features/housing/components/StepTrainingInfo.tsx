import { FC } from 'react';
import { HousingTrainingInfo } from '@contracts/api-contracts';
import TextField from './TextField';
import DateField from './DateField';
import FileField from './FileField';

export interface StepTrainingInfoProps {
  value: HousingTrainingInfo;
  onChange: (value: HousingTrainingInfo) => void;
}

export const StepTrainingInfo: FC<StepTrainingInfoProps> = ({ value, onChange }) => {
  const update = <K extends keyof HousingTrainingInfo>(
    key: K,
    next: HousingTrainingInfo[K],
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <TextField
        placeholder="Nom de l'établissement d'acceuil"
        value={value.institutionName}
        onChange={(e) => update('institutionName', e.target.value)}
      />
      <TextField
        placeholder="Titre de la formation"
        value={value.trainingTitle}
        onChange={(e) => update('trainingTitle', e.target.value)}
      />
      <TextField
        placeholder="Ville"
        value={value.city}
        onChange={(e) => update('city', e.target.value)}
      />
      <DateField
        label="Date de début de la formation"
        value={value.startDate}
        onChange={(e) => update('startDate', e.target.value)}
      />
      <FileField
        label="Attestation d'inscription / Lettre d'admission"
        fileName={value.admissionLetterName}
        onFileChange={(file) => update('admissionLetterName', file?.name ?? '')}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default StepTrainingInfo;
