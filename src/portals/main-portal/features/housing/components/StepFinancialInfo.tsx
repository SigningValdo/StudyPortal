import { FC } from 'react';
import {
  AviDuration,
  HousingFinancialInfo,
  OriginCurrency,
  SchoolYear,
  TravelPurpose,
  YesNo,
} from '@contracts/api-contracts';
import TextField from './TextField';
import SelectField from './SelectField';

const SCHOOL_YEARS: readonly SchoolYear[] = ['2023/2024', '2024/2025', '2025/2026'];
const CURRENCIES: readonly OriginCurrency[] = ['FCFA', 'EUR', 'USD', 'GBP'];
const AVI_DURATIONS: readonly AviDuration[] = ['6 mois', '12 mois', '24 mois'];
const YES_NO: readonly YesNo[] = ['Oui', 'Non'];
const TRAVEL_PURPOSES: readonly TravelPurpose[] = [
  'Etudes',
  'Stage',
  'Recherche',
  'Autre',
];

export interface StepFinancialInfoProps {
  value: HousingFinancialInfo;
  onChange: (value: HousingFinancialInfo) => void;
}

export const StepFinancialInfo: FC<StepFinancialInfoProps> = ({ value, onChange }) => {
  const update = <K extends keyof HousingFinancialInfo>(
    key: K,
    next: HousingFinancialInfo[K],
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <SelectField
          label="Année scolaire"
          options={SCHOOL_YEARS}
          value={value.schoolYear}
          onChange={(e) => update('schoolYear', e.target.value as SchoolYear)}
        />
        <TextField
          label="Montant à recevoir par mois en euro"
          placeholder="Exemple: 700€"
          value={value.monthlyAmountEuro}
          onChange={(e) => update('monthlyAmountEuro', e.target.value)}
        />
        <SelectField
          label="Devise de votre pays d'origine"
          options={CURRENCIES}
          value={value.originCurrency}
          onChange={(e) => update('originCurrency', e.target.value as OriginCurrency)}
        />
        <SelectField
          label="Durée de l'AVI"
          options={AVI_DURATIONS}
          value={value.aviDuration}
          onChange={(e) => update('aviDuration', e.target.value as AviDuration)}
        />
      </div>

      <div className="flex flex-col gap-5">
        <SelectField
          label="Est ce un renouvellement ?"
          options={YES_NO}
          value={value.isRenewal}
          onChange={(e) => update('isRenewal', e.target.value as YesNo)}
        />
        <SelectField
          label="Je vais en France pour"
          options={TRAVEL_PURPOSES}
          value={value.travelPurpose}
          onChange={(e) => update('travelPurpose', e.target.value as TravelPurpose)}
        />
        <SelectField
          label="ACS Assurance France"
          options={YES_NO}
          value={value.acsInsurance}
          onChange={(e) => update('acsInsurance', e.target.value as YesNo)}
        />
      </div>
    </div>
  );
};

export default StepFinancialInfo;
