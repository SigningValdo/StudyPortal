import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Transaction, TransactionDetails, WalletBalance } from '@contracts/api-contracts';
import { walletService } from '@services/mock';
import { useAuthStore } from '@store/authStore';
import BalanceHeroCard from '../components/BalanceHeroCard';
import BalanceStatCard from '../components/BalanceStatCard';
import TransactionRow from '../components/TransactionRow';
import TransactionDetailsModal from '../components/TransactionDetailsModal';

export const WalletDashboardPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TransactionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    Promise.all([walletService.getBalance(), walletService.getTransactions()])
      .then(([balanceRes, txRes]) => {
        setBalance(balanceRes.data);
        setTransactions((txRes.data ?? []).slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.preferred_username?.split(/[. ]/)[0] ?? 'Moni';
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const openDetails = async (tx: Transaction) => {
    setModalOpen(true);
    setLoadingDetails(true);
    const res = await walletService.getTransactionDetails(tx.id);
    setSelected(res.data);
    setLoadingDetails(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[25px] border border-brand-border-soft bg-white p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-3xl mx-auto">
          {loading || !balance ? (
            <div className="flex h-64 items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <>
              <BalanceHeroCard
                userFirstName={capitalizedFirstName}
                total={balance.total}
                currency={balance.currency}
                onViewAccount={() => navigate('/wallet/historiques')}
                onSubscribeService={() => navigate('/')}
              />

              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <BalanceStatCard
                  title="Solde Créditeur"
                  amount={balance.creditor}
                  footer="More money left than you made  👀"
                  progress={(balance.creditor / balance.total) * 100}
                  progressColor="#F59E0B"
                  currency={balance.currency}
                  onSeeMore={() => navigate('/wallet/historiques')}
                />
                <BalanceStatCard
                  title="Solde débiteur"
                  amount={balance.debtor}
                  footer="Looking good so far 👌🏼"
                  progress={(balance.debtor / balance.total) * 100}
                  progressColor="#2E9E5D"
                  currency={balance.currency}
                  onSeeMore={() => navigate('/wallet/historiques')}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-brand-border-soft bg-white pb-5">
                <div className="flex flex-col gap-3 border-b px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base font-bold text-brand-dark">
                    Historique des transactions
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/wallet/historiques')}
                    className="text-xs font-bold tracking-wide text-brand-confirm hover:underline"
                  >
                    VOIR TOUT
                  </button>
                </div>

                <div className=" flex flex-col">
                  {transactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} onClick={openDetails} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <TransactionDetailsModal
        open={modalOpen}
        details={selected}
        loading={loadingDetails}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
};

export default WalletDashboardPage;
