import { FC } from 'react';
import { AviBankKey } from '@contracts/api-contracts';
import societeGeneral from '@/assets/images/societeGeneral.png';
import atlanticBank from '@/assets/images/atlanticBank.png';
import bankInfo from '@/assets/images/bankInfo.png';

export interface StepBankInfoProps {
  value: AviBankKey | '';
  onChange: (value: AviBankKey) => void;
  /** When true, shows the RIB detail panel instead of (or alongside) the bank selector. */
  showRib?: boolean;
}

interface BankOption {
  key: AviBankKey;
  name: string;
  rib: string;
  swift: string;
  iban: string;
}

const BANKS: BankOption[] = [
  {
    key: 'societe-generale',
    name: 'Société Générale',
    rib: '10002 00020 0000123456789 97',
    swift: 'SGBFCMCX',
    iban: 'CM2110002000200001234567897',
  },
  {
    key: 'banque-atlantique',
    name: 'Banque Atlantique',
    rib: '10062 00034 0000987654321 43',
    swift: 'ATLANTICMX',
    iban: 'CM2110062000340000987654321 43',
  },
];

const BankLogo: FC<{ bankKey: AviBankKey }> = ({ bankKey }) => {
  if (bankKey === 'societe-generale') {
    return <img src={societeGeneral} alt="Société Générale" />;
  }
  return <img src={atlanticBank} alt="Banque Atlantique" />;
};

export const StepBankInfo: FC<StepBankInfoProps> = ({ value, onChange, showRib = false }) => {
  const selected = BANKS.find((b) => b.key === value);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <p className="text-2xl text-center">
        {!showRib ? 'Choix de l’établissement bancaire' : 'Informations bancaires.'}
      </p>

      {/* Bank selector — à l'étape RIB, n'affiche que la banque sélectionnée */}
      {!showRib && (
        <div className="flex flex-col gap-9">
          {BANKS.map((bank, index) => {
            const isSelected = value === bank.key;
            return (
              <button
                key={bank.key}
                type="button"
                onClick={() => onChange(bank.key)}
                className={`relative flex flex-1 flex-col items-center gap-2 rounded-xl bg-white border transition-colors shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)] ${
                  isSelected
                    ? 'border-brand-primary'
                    : 'border-brand-border-soft hover:border-brand-primary'
                } ${index === 1 ? 'py-2' : 'py-1'}`}
              >
                <BankLogo bankKey={bank.key} />
              </button>
            );
          })}
        </div>
      )}

      {/* RIB details — seule la banque sélectionnée s'affiche */}
      {showRib && selected && (
        <div className="flex flex-col gap-8">
          <button
            type="button"
            className="relative flex flex-1 flex-col items-center gap-2 rounded-xl border border-brand-primary bg-white py-1 transition-colors shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)] hover:border-brand-primary"
          >
            <BankLogo bankKey={selected.key} />
          </button>

          <div className="rounded-xl flex justify-center items-center border border-brand-border-soft bg-white px-8 py-10 shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)]">
            <img src={bankInfo} alt="Informations bancaires" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepBankInfo;
