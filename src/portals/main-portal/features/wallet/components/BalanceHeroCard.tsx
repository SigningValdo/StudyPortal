import { FC } from 'react';
import { formatAmount } from '../utils/format';
import { ArrowRightIcon } from './WalletIcons';
import heroBg from '@/assets/images/bg-history.png';

export interface BalanceHeroCardProps {
  userFirstName: string;
  total: number;
  currency?: 'XAF' | 'EUR' | 'USD';
  onViewAccount?: () => void;
  onSubscribeService?: () => void;
}

export const BalanceHeroCard: FC<BalanceHeroCardProps> = ({
  userFirstName,
  total,
  currency = 'XAF',
  onViewAccount,
  onSubscribeService,
}) => {
  return (
    <div
      className="relative rounded-2xl w-full h-full p-6 text-white"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundPosition: 'right',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="relative">
        <p className="text-sm font-medium opacity-90">Hello {userFirstName}, ton solde total:</p>
        <h2 className="mt-2 text-4xl font-bold">{formatAmount(total, currency)}</h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onViewAccount}
            className="w-full sm:w-auto flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-2 sm:px-6 sm:py-3 lg:px-9 lg:py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Voir mon compte
            <ArrowRightIcon />
          </button>
          <button
            type="button"
            onClick={onSubscribeService}
            className="w-full sm:w-auto flex items-center gap-2 rounded-lg bg-brand-primary px-3 py-2 sm:px-6 sm:py-3 lg:px-9 lg:py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Souscrire à un service
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceHeroCard;
