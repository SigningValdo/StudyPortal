import { FC } from 'react';
import {
  AviDuration,
  AviFinancialInfo,
  OriginCurrency,
  SchoolYear,
  TravelPurpose,
  YesNo,
} from '@contracts/api-contracts';
import TextField from './TextField';
import SelectField from './SelectField';

export interface StepFinancialProps {
  value: AviFinancialInfo;
  onChange: (value: AviFinancialInfo) => void;
}

const SCHOOL_YEARS: readonly SchoolYear[] = ['2023/2024', '2024/2025', '2025/2026'];
const CURRENCIES: readonly OriginCurrency[] = ['FCFA', 'EUR', 'USD', 'GBP'];
const DURATIONS: readonly AviDuration[] = ['6 mois', '12 mois', '24 mois'];
const YES_NO: readonly YesNo[] = ['Oui', 'Non'];
const TRAVEL_PURPOSES: readonly TravelPurpose[] = ['Etudes', 'Stage', 'Recherche', 'Autre'];

export const StepFinancial: FC<StepFinancialProps> = ({ value, onChange }) => {
  const set = <K extends keyof AviFinancialInfo>(key: K, val: AviFinancialInfo[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
      {/* Colonne gauche */}
      <div className="flex flex-col gap-6">
        <SelectField
          label="Année scolaire"
          options={SCHOOL_YEARS}
          value={value.schoolYear}
          onChange={(e) => set('schoolYear', e.target.value as SchoolYear)}
        />
        <TextField
          label="Montant à recevoir par mois en euro"
          placeholder="Exemple: 700€"
          type="number"
          value={value.monthlyAmountEuro}
          onChange={(e) => set('monthlyAmountEuro', e.target.value)}
        />
        <SelectField
          label="Devise de votre pays d'origine"
          options={CURRENCIES}
          value={value.originCurrency}
          onChange={(e) => set('originCurrency', e.target.value as OriginCurrency)}
        />
        <SelectField
          label="Durée de l'AVI"
          options={DURATIONS}
          value={value.aviDuration}
          onChange={(e) => set('aviDuration', e.target.value as AviDuration)}
        />
      </div>

      {/* Colonne droite */}
      <div className="flex flex-col gap-6">
        <SelectField
          label="Est ce un renouvellement ?"
          options={YES_NO}
          value={value.isRenewal}
          onChange={(e) => set('isRenewal', e.target.value as YesNo)}
        />
        <SelectField
          label="Je vais en France pour"
          options={TRAVEL_PURPOSES}
          value={value.travelPurpose}
          onChange={(e) => set('travelPurpose', e.target.value as TravelPurpose)}
        />
        <SelectField
          label="ACS Assurance France"
          options={YES_NO}
          value={value.acsInsurance}
          onChange={(e) => set('acsInsurance', e.target.value as YesNo)}
        />
      </div>
    </div>
  );
};

export default StepFinancial;
