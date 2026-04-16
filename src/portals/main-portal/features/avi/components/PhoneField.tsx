import { FC } from 'react';

const COUNTRY_CODES = [
  { code: '+237', flag: '🇨🇲', label: 'Cameroun' },
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+225', flag: '🇨🇮', label: "Côte d'Ivoire" },
  { code: '+221', flag: '🇸🇳', label: 'Sénégal' },
  { code: '+1', flag: '🇺🇸', label: 'États-Unis' },
];

export interface PhoneFieldProps {
  label?: string;
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export const PhoneField: FC<PhoneFieldProps> = ({
  label = 'Numéro de téléphone',
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#5E6366]">{label}</label>
      <div className="flex gap-2">
        <div className="relative w-28 flex-shrink-0">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="h-full w-full appearance-none rounded-[8px] bg-[#EFF1F999] px-3 py-3 pr-7 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-brand-text-muted"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder="696418984"
          className="flex-1 rounded-[8px] bg-[#EFF1F999] px-4 py-3 text-sm text-brand-dark placeholder:text-[#ABAFB1] focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
      </div>
    </div>
  );
};

export default PhoneField;
