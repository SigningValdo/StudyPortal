import { FC } from 'react';
import { HousingPersonalInfo, AviDuration } from '@contracts/api-contracts';
import TextField from './TextField';
import SelectField from './SelectField';
import DateField from './DateField';
import FileField from './FileField';
import PhoneField from './PhoneField';

const AVI_DURATIONS: readonly AviDuration[] = ['6 mois', '12 mois', '24 mois'];

export interface StepPersonalInfoProps {
  value: HousingPersonalInfo;
  onChange: (value: HousingPersonalInfo) => void;
}

export const StepPersonalInfo: FC<StepPersonalInfoProps> = ({ value, onChange }) => {
  const update = <K extends keyof HousingPersonalInfo>(
    key: K,
    next: HousingPersonalInfo[K],
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <TextField
          placeholder="Nom"
          value={value.firstName}
          onChange={(e) => update('firstName', e.target.value)}
        />
        <TextField
          placeholder="Prénom"
          value={value.lastName}
          onChange={(e) => update('lastName', e.target.value)}
        />
        <TextField
          type="email"
          placeholder="Adresse email"
          value={value.email}
          onChange={(e) => update('email', e.target.value)}
        />
        <PhoneField
          countryCode={value.phoneCountryCode}
          phoneNumber={value.phoneNumber}
          onCountryCodeChange={(v) => update('phoneCountryCode', v)}
          onPhoneNumberChange={(v) => update('phoneNumber', v)}
        />
        <SelectField
          label="Durée de l'AVI"
          options={AVI_DURATIONS}
          value={value.aviDuration}
          onChange={(e) => update('aviDuration', e.target.value as AviDuration)}
        />
      </div>

      <div className="flex flex-col gap-5">
        <TextField
          placeholder="Numéro de passeport"
          value={value.passportNumber}
          onChange={(e) => update('passportNumber', e.target.value)}
        />
        <DateField
          label="Date de délivrance du passeport"
          value={value.passportIssueDate}
          onChange={(e) => update('passportIssueDate', e.target.value)}
        />
        <DateField
          label="Date d'expiration du passeport"
          value={value.passportExpiryDate}
          onChange={(e) => update('passportExpiryDate', e.target.value)}
        />
        <FileField
          label="Scan du passeport"
          fileName={value.passportScanName}
          onFileChange={(file) => update('passportScanName', file?.name ?? '')}
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
};

export default StepPersonalInfo;
