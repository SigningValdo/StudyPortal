import { FC } from 'react';
import { AviPersonalInfo } from '@contracts/api-contracts';
import TextField from './TextField';
import PhoneField from './PhoneField';
import DateField from './DateField';
import FileField from './FileField';

export interface StepPersonalInfoProps {
  value: AviPersonalInfo;
  onChange: (value: AviPersonalInfo) => void;
}

export const StepPersonalInfo: FC<StepPersonalInfoProps> = ({ value, onChange }) => {
  const set = <K extends keyof AviPersonalInfo>(key: K, val: AviPersonalInfo[K]) =>
    onChange({ ...value, [key]: val });

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
      {/* Colonne gauche */}
      {/* <div className="flex flex-col gap-6"> */}
      <TextField
        placeholder="Moni"
        value={value.lastName}
        onChange={(e) => set('lastName', e.target.value)}
      />
      <TextField
        placeholder="Numéro de passeport"
        value={value.passportNumber}
        onChange={(e) => set('passportNumber', e.target.value)}
      />
      <TextField
        placeholder="Roy"
        value={value.firstName}
        onChange={(e) => set('firstName', e.target.value)}
      />
      <DateField
        label="Date de délivrance du passeport"
        value={value.passportIssueDate}
        onChange={(e) => set('passportIssueDate', e.target.value)}
      />
      <TextField
        placeholder="Moniroy22@mail.com"
        type="email"
        value={value.email}
        onChange={(e) => set('email', e.target.value)}
      />
      <DateField
        label="Date d'expiration du passeport"
        value={value.passportExpiryDate}
        onChange={(e) => set('passportExpiryDate', e.target.value)}
      />
      <PhoneField
        label="Numéro de téléphone"
        countryCode={value.phoneCountryCode}
        phoneNumber={value.phoneNumber}
        onCountryCodeChange={(v) => set('phoneCountryCode', v)}
        onPhoneNumberChange={(v) => set('phoneNumber', v)}
      />
      <FileField
        label="Scan du passeport"
        fileName={value.passportScanName}
        onFileChange={(file) => set('passportScanName', file?.name ?? '')}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      {/* </div> */}

      {/* Colonne droite */}
      {/* <div className="flex flex-col gap-6"></div> */}
    </div>
  );
};

export default StepPersonalInfo;
