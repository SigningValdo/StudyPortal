import { FC } from 'react';
import { Transaction } from '@contracts/api-contracts';
import { formatAmount, formatShortDate } from '../utils/format';
import achatIcon from '@/assets/images/achat.png';
import rechargeIcon from '@/assets/images/recharge.png';

export interface TransactionRowProps {
  transaction: Transaction;
  onClick?: (tx: Transaction) => void;
}

const IconForLabel: FC<{ label: Transaction['label'] }> = ({ label }) => {
  const isAchat = label === 'Achat service AVI' || label === 'Achat service Logement';
  const src = isAchat ? achatIcon : rechargeIcon;
  const alt = isAchat ? 'Achat' : label === 'Remboursement' ? 'Remboursement' : 'Recharge';
  return <img src={src} alt={alt} className="h-7 w-7 object-contain" />;
};

export const TransactionRow: FC<TransactionRowProps> = ({ transaction, onClick }) => {
  const { label, amount, currency, date } = transaction;

  const content = (
    <div className="flex items-center justify-between border-b border-brand-border-soft bg-white px-4 py-3 transition-colors hover:bg-[#F9FAFC]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 bg-[#F9F9F9] items-center justify-center rounded-lg">
          <IconForLabel label={label} />
        </div>
        <div>
          <div className="text-sm font-semibold text-brand-dark">{label}</div>
          <div className="text-xs text-brand-text-muted">{formatShortDate(date)}</div>
        </div>
      </div>
      <div className="text-sm font-bold text-brand-dark">{formatAmount(amount, currency)}</div>
    </div>
  );

  if (!onClick) return content;

  return (
    <button type="button" onClick={() => onClick(transaction)} className="w-full text-left">
      {content}
    </button>
  );
};

export default TransactionRow;
