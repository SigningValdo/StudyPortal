import { FC } from 'react';
import { formatAmount } from '../utils/format';
import expensesIcon from '@/assets/images/expenses.png';

export interface BalanceStatCardProps {
  title: string;
  amount: number;
  footer: string;
  progress: number;
  progressColor: string;
  currency?: 'XAF' | 'EUR' | 'USD';
  onSeeMore?: () => void;
}

export const BalanceStatCard: FC<BalanceStatCardProps> = ({
  title,
  amount,
  footer,
  progress,
  progressColor,
  currency = 'XAF',
  onSeeMore,
}) => {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div className="rounded-2xl border border-brand-border-soft bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
        <button
          type="button"
          onClick={onSeeMore}
          className="text-xs font-bold tracking-wide text-brand-primary hover:underline"
        >
          VOIR PLUS
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <img src={expensesIcon} alt="" className="h-16 w-16 object-contain" />
        <div className="flex-1">
          <div className="text-center text-base font-semibold text-brand-dark">
            {formatAmount(amount, currency)}
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-[#E6E7EE]">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: progressColor }}
            />
            <p className="mt-3 text-xs text-brand-text-muted">{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceStatCard;
