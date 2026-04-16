import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AviSubscriptionRow, AviSubscriptionStatus, PERMISSIONS } from '@contracts/api-contracts';
import { aviService } from '@services/mock';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { SuccessModal } from '@/components/shared/FeedbackModal';

const STATUS_FILTERS: readonly AviSubscriptionStatus[] = [
  'En préparation',
  'En attente de paiement',
  'Paiement en attente',
  'Clôturée',
  'Payée',
  'Livré',
];

const EyeIcon = () => (
  <svg width="25" height="20" viewBox="0 0 25 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.43425 13.7077C1.47808 12.4654 1 11.8443 1 10C1 8.15568 1.47808 7.5346 2.43425 6.29237C4.34345 3.81201 7.54537 1 12.25 1C16.9546 1 20.1565 3.81201 22.0657 6.29237C23.0219 7.5346 23.5 8.15568 23.5 10C23.5 11.8443 23.0219 12.4654 22.0657 13.7077C20.1565 16.188 16.9546 19 12.25 19C7.54537 19 4.34345 16.188 2.43425 13.7077Z"
      stroke="#1C274C"
      stroke-width="2"
    />
    <path
      d="M15.625 10C15.625 11.864 14.114 13.375 12.25 13.375C10.386 13.375 8.875 11.864 8.875 10C8.875 8.13599 10.386 6.625 12.25 6.625C14.114 6.625 15.625 8.13599 15.625 10Z"
      stroke="#1C274C"
      stroke-width="2"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.232 5.23184L18.768 8.76784M16.732 3.73184C17.2009 3.26294 17.8369 2.99951 18.5 2.99951C19.1631 2.99951 19.7991 3.26294 20.268 3.73184C20.7369 4.20074 21.0003 4.83671 21.0003 5.49984C21.0003 6.16297 20.7369 6.79894 20.268 7.26784L6.5 21.0358H3V17.4638L16.732 3.73184Z"
      stroke="black"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const AviSubscriptionsPage: FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AviSubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<AviSubscriptionStatus | null>(null);
  const [downloadSuccessOpen, setDownloadSuccessOpen] = useState(false);

  useEffect(() => {
    let active = true;
    aviService
      .getSubscriptions()
      .then((res) => {
        if (active) setRows(res.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = activeFilter === null ? rows : rows.filter((r) => r.status === activeFilter);

  return (
    <section className="rounded-[25px] border border-brand-border-soft bg-white min-h-full p-4 sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-6 lg:gap-x-11 lg:gap-y-8 w-full max-w-4xl mx-auto">
        {STATUS_FILTERS.map((status) => (
          <StatusPill
            key={status}
            status={status}
            variant="chip"
            active={activeFilter === status}
            onClick={() => setActiveFilter((prev) => (prev === status ? null : status))}
          />
        ))}
      </div>

      {/* Mobile: cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {loading && (
          <div className="py-12 text-center text-brand-text-muted">
            <span className="spinner inline-block" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-brand-text-muted">
            Aucune souscription trouvée
          </div>
        )}
        {!loading &&
          filtered.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border-[2px] border-brand-border-soft p-4 text-xs text-brand-dark"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-brand-text-muted">
                    ID {row.reference}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold">{row.name}</p>
                </div>
                <StatusPill status={row.status} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Service</dt>
                  <dd className="font-semibold truncate">{row.service}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Date</dt>
                  <dd className="font-semibold">{row.date}</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border-soft pt-3">
                <div>
                  {row.documentAttached ? (
                    <button
                      type="button"
                      onClick={() => setDownloadSuccessOpen(true)}
                      className="rounded-full bg-[#4379EE] px-3 py-1 text-xs font-bold text-white"
                    >
                      Télécharger
                    </button>
                  ) : (
                    <span className="text-xs">Aucun document</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Voir">
                    <EyeIcon />
                  </button>
                  <button type="button" aria-label="Editer">
                    <EditIcon />
                  </button>
                  <ProtectedComponent requiredPermissions={PERMISSIONS.AVI_CANCEL}>
                    <button type="button" aria-label="Annuler">
                      <TrashIcon />
                    </button>
                  </ProtectedComponent>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Desktop: table */}
      <div className="mt-9 hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[24px] border-[2px] border-brand-border-soft text-left font-bold text-brand-text-muted">
          <thead>
            <tr className="text-brand-text-muted">
              <th className="border-b-[2px] border-brand-border-soft px-3 py-3">Id</th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Nom
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Service
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Date
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Statut
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Document
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-brand-text-muted">
                  <span className="spinner inline-block" />
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-brand-text-muted">
                  Aucune souscription trouvée
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((row, rowIdx) => {
                const rowBorder = rowIdx === 0 ? '' : 'border-t-[2px] border-brand-border-soft';
                return (
                  <tr key={row.id} className="text-brand-dark">
                    <td className={`px-3 py-4 ${rowBorder}`}>{row.reference}</td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.service}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.date}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      <StatusPill status={row.status} />
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.documentAttached ? (
                        <button
                          type="button"
                          onClick={() => setDownloadSuccessOpen(true)}
                          className="rounded-full bg-[#4379EE] px-3 py-1 text-xs font-bold text-white"
                        >
                          Télécharger
                        </button>
                      ) : (
                        <span className="text-xs">Aucun document</span>
                      )}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft text-center px-3 py-4 ${rowBorder}`}
                    >
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label="Voir">
                          <EyeIcon />
                        </button>
                        <button type="button" aria-label="Editer">
                          <EditIcon />
                        </button>
                        <ProtectedComponent requiredPermissions={PERMISSIONS.AVI_CANCEL}>
                          <button type="button" aria-label="Annuler">
                            <TrashIcon />
                          </button>
                        </ProtectedComponent>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Button variant="cancel" disabled>
          Retour
        </Button>
        <ProtectedComponent requiredPermissions={PERMISSIONS.AVI_CREATE}>
          <Button variant="confirm" onClick={() => navigate('/services/avi/nouvelle')}>
            Suivant
          </Button>
        </ProtectedComponent>
      </div>

      <SuccessModal
        open={downloadSuccessOpen}
        message="Action effectuée avec succès"
        description="Téléchargement du document en cours"
        onConfirm={() => setDownloadSuccessOpen(false)}
      />
    </section>
  );
};

export default AviSubscriptionsPage;
