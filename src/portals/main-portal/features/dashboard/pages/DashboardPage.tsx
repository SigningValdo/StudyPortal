import { FC, useState } from 'react';
import illustration404 from '@/assets/images/404.png';

export const DashboardPage: FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  return (
    <section className="flex h-full justify-center overflow-hidden rounded-2xl border border-brand-border-soft bg-white px-4 pb-6 sm:px-8 sm:pb-10">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center sm:gap-8">
        <img
          src={illustration404}
          alt="Page indisponible"
          className="h-auto w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px] xl:max-w-[700px]"
        />
        <div className="space-y-1">
          <p
            className="text-base font-bold uppercase tracking-[0.3em] sm:text-lg"
            style={{ color: '#565872' }}
          >
            Oupsi ! page <br /> indisponible
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="min-w-[140px] rounded-full px-6 py-2.5 text-sm border border-[#FB8133] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-70"
          style={{ backgroundColor: '#FFA600' }}
        >
          {refreshing ? '...' : 'ACTUALISER'}
        </button>
      </div>
    </section>
  );
};

export default DashboardPage;
