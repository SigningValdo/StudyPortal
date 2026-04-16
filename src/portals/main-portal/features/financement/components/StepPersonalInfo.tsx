import { FC } from 'react';
import { FinancementPersonalInfo } from '@contracts/api-contracts';
import TextField from './TextField';
import DateField from './DateField';
import PhoneField from './PhoneField';
import FileField from './FileField';

export interface StepPersonalInfoProps {
  value: FinancementPersonalInfo;
  onChange: (value: FinancementPersonalInfo) => void;
}

export const StepPersonalInfo: FC<StepPersonalInfoProps> = ({ value, onChange }) => {
  const update = <K extends keyof FinancementPersonalInfo>(
    key: K,
    next: FinancementPersonalInfo[K]
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="grid grid-cols-1 items-end gap-x-10 gap-y-6 lg:grid-cols-2">
      <TextField
        placeholder="Moni"
        value={value.firstName}
        onChange={(e) => update('firstName', e.target.value)}
      />
      <TextField
        placeholder="Roy"
        value={value.lastName}
        onChange={(e) => update('lastName', e.target.value)}
      />

      <TextField
        label="Lieu de naissance"
        placeholder="Moncton"
        value={value.birthPlace}
        onChange={(e) => update('birthPlace', e.target.value)}
      />
      <DateField
        label="Date de naissance"
        value={value.birthDate}
        onChange={(e) => update('birthDate', e.target.value)}
      />

      <TextField
        label="Adresse complète"
        placeholder="Moncton"
        value={value.fullAddress}
        onChange={(e) => update('fullAddress', e.target.value)}
      />
      <TextField
        label="Pays"
        placeholder="Moncton"
        value={value.country}
        onChange={(e) => update('country', e.target.value)}
      />

      <TextField
        label="Ville"
        placeholder="Moncton"
        value={value.city}
        onChange={(e) => update('city', e.target.value)}
      />
      <TextField
        label="Quartier"
        placeholder="Riverview"
        value={value.district}
        onChange={(e) => update('district', e.target.value)}
      />

      <PhoneField
        label="Numéro de téléphone"
        countryCode={value.phoneCountryCode}
        phoneNumber={value.phoneNumber}
        onCountryCodeChange={(v) => update('phoneCountryCode', v)}
        onPhoneNumberChange={(v) => update('phoneNumber', v)}
      />
      <FileField
        placeholder="Plan de localisation"
        fileName={value.locationPlanFileName}
        onFileChange={(file) => update('locationPlanFileName', file?.name ?? '')}
        accept=".pdf,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default StepPersonalInfo;
