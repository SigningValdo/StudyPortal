import { FC } from 'react';
import { FinancementDetailsInfo, FinancementServiceType } from '@contracts/api-contracts';
import TextField from './TextField';
import SelectField, { SelectOption } from './SelectField';

const SERVICE_OPTIONS: readonly SelectOption[] = [
  { value: 'A.V.I', label: 'A.V.I' },
  { value: 'Logement', label: 'Logement' },
  { value: 'Assurance', label: 'Assurance' },
  { value: 'Admission', label: 'Admission' },
];

export interface StepDetailsProps {
  value: FinancementDetailsInfo;
  onChange: (value: FinancementDetailsInfo) => void;
}

export const StepDetails: FC<StepDetailsProps> = ({ value, onChange }) => {
  const update = <K extends keyof FinancementDetailsInfo>(
    key: K,
    next: FinancementDetailsInfo[K]
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
        <SelectField
          label="Choisissez le service à financer"
          options={SERVICE_OPTIONS}
          value={value.serviceType}
          onChange={(e) => update('serviceType', e.target.value as FinancementServiceType)}
        />
        <TextField
          label="Coût du service choisit"
          placeholder="xxxxxx XAF"
          value={value.serviceCost}
          onChange={(e) => update('serviceCost', e.target.value)}
        />
        <TextField
          label="Financement maximal possible"
          placeholder="Exemple: 700€"
          value={value.maxFinancing}
          onChange={(e) => update('maxFinancing', e.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-brand-border-soft p-5">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
          <TextField
            label="De quelle somme avez-vous besoin ?"
            placeholder=""
            trailingText="XAF"
            value={value.amountNeeded}
            onChange={(e) => update('amountNeeded', e.target.value)}
          />
          <TextField
            label="Frais de financements"
            placeholder=""
            trailingText="XAF"
            value={value.financingFees}
            onChange={(e) => update('financingFees', e.target.value)}
          />
          <TextField
            label="Somme totale à rembourser"
            placeholder=""
            trailingText="XAF"
            value={value.totalToReimburse}
            onChange={(e) => update('totalToReimburse', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepDetails;
