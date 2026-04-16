import { FC, useEffect, useMemo, useState } from 'react';
import { Transaction, TransactionDetails } from '@contracts/api-contracts';
import { walletService } from '@services/mock';
import TransactionRow from '../components/TransactionRow';
import TransactionFilters from '../components/TransactionFilters';
import TransactionDetailsModal from '../components/TransactionDetailsModal';

export const TransactionHistoryPage: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<TransactionDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    walletService
      .getTransactions()
      .then((res) => setTransactions(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((tx) => tx.label.toLowerCase().includes(q));
  }, [transactions, search]);

  const openDetails = async (tx: Transaction) => {
    setModalOpen(true);
    setLoadingDetails(true);
    const res = await walletService.getTransactionDetails(tx.id);
    setSelected(res.data);
    setLoadingDetails(false);
  };

  return (
    <section className="rounded-[25px] border border-brand-border-soft min-h-full w-full bg-white p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto ">
        <h3 className="text-lg font-bold text-brand-primary">Historique des transactions</h3>

        <div className="mt-6">
          <TransactionFilters
            search={search}
            onSearchChange={setSearch}
            onSeeAll={() => setSearch('')}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-brand-border-soft bg-white py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-brand-text-muted">
              Aucune transaction trouvée.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} onClick={openDetails} />
              ))}
            </div>
          )}
        </div>

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
    </section>
  );
};

export default TransactionHistoryPage;
