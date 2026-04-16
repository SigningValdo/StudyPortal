import { ChangeEvent, FC, useEffect } from 'react';
import { FinancementScheduleEntry, FinancementScheduleInfo } from '@contracts/api-contracts';
import DateField from './DateField';
import TextField from './TextField';
import SelectField, { SelectOption } from './SelectField';

const COUNT_OPTIONS: readonly SelectOption[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
  value: String(n),
  label: String(n),
}));

export interface StepScheduleProps {
  value: FinancementScheduleInfo;
  onChange: (value: FinancementScheduleInfo) => void;
}

const emptyEntry = (): FinancementScheduleEntry => ({ dueDate: '', amount: '' });

export const StepSchedule: FC<StepScheduleProps> = ({ value, onChange }) => {
  // Sync entries length with installmentsCount.
  useEffect(() => {
    const target = Math.max(1, value.installmentsCount);
    if (value.entries.length === target) return;
    if (value.entries.length < target) {
      const next = [
        ...value.entries,
        ...Array.from({ length: target - value.entries.length }, emptyEntry),
      ];
      onChange({ ...value, entries: next });
    } else {
      onChange({ ...value, entries: value.entries.slice(0, target) });
    }
  }, [value, onChange]);

  const handleCountChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, installmentsCount: Number(e.target.value) });
  };

  const updateEntry = (index: number, patch: Partial<FinancementScheduleEntry>) => {
    const next = value.entries.map((entry, idx) =>
      idx === index ? { ...entry, ...patch } : entry
    );
    onChange({ ...value, entries: next });
  };

  const labelFor = (index: number) => {
    if (index === value.entries.length - 1 && value.entries.length > 2) {
      return 'Echéance x';
    }
    return `Echéance ${index + 1}`;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto w-max mb-2">
        <SelectField
          label="Choisissez le nombre d'échéances"
          options={COUNT_OPTIONS}
          value={String(value.installmentsCount)}
          onChange={handleCountChange}
        />
      </div>

      <div className="text-center text-2xl text-brand-dark">
        Veuillez renseigner les différentes dates
      </div>

      <div className="flex flex-col gap-5">
        {value.entries.map((entry, index) => (
          <div key={index} className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
            <DateField
              label={labelFor(index)}
              value={entry.dueDate}
              onChange={(e) => updateEntry(index, { dueDate: e.target.value })}
            />
            <TextField
              label="Somme à verser"
              placeholder=""
              trailingText="XAF"
              value={entry.amount}
              onChange={(e) => updateEntry(index, { amount: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepSchedule;
