import { FC } from 'react';
import { CalendarIcon, FilterIcon, SearchIcon } from './WalletIcons';

const BUTTON_SHADOW = [
  '1px 2px 6px 0 rgba(0, 0, 0, 0.05)',
  '6px 9px 11px 0 rgba(0, 0, 0, 0.04)',
  '13px 20px 14px 0 rgba(0, 0, 0, 0.03)',
  '23px 36px 17px 0 rgba(0, 0, 0, 0.01)',
  '36px 56px 19px 0 rgba(0, 0, 0, 0)',
].join(', ');

export interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilter?: () => void;
  onOpenDate?: () => void;
  onSeeAll?: () => void;
}

export const TransactionFilters: FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  onOpenFilter,
  onOpenDate,
  onSeeAll,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-[278px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
        <input
          type="search"
          value={search}
          style={{ boxShadow: BUTTON_SHADOW }}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une transaction"
          className="w-full rounded-lg border border-brand-border-soft bg-white py-3.5 pl-10 pr-4 text-xs font-bold text-brand-border-soft placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
        />
      </div>

      <button
        type="button"
        onClick={onOpenFilter}
        style={{ boxShadow: BUTTON_SHADOW }}
        className="flex items-center gap-2 rounded-lg border border-brand-border-soft bg-white px-4 py-2.5 font-semibold text-brand-border-soft hover:bg-[#F9FAFC]"
      >
        <FilterIcon />
        Filtrer
      </button>
      <button
        type="button"
        onClick={onOpenDate}
        style={{ boxShadow: BUTTON_SHADOW }}
        className="flex items-center gap-2 rounded-lg border border-brand-border-soft bg-white px-4 py-2.5 font-semibold text-brand-border-soft hover:bg-[#F9FAFC]"
      >
        <CalendarIcon />
        Date
      </button>

      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="ml-auto text-lg font-bold tracking-wide uppercase text-brand-confirm hover:underline"
        >
          VOIR TOUT
        </button>
      )}
    </div>
  );
};

export default TransactionFilters;
