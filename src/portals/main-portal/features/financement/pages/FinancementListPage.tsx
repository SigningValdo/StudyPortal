import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FinancementListRow, FinancementStatus, PERMISSIONS } from '@contracts/api-contracts';
import { financementService } from '@services/mock';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import ProformaModal from '../components/ProformaModal';

const FILTERS: readonly FinancementStatus[] = [
  'En préparation',
  'En attente de paiement',
  'Paiement en attente',
  'Clôturée',
  'Payée',
  'Livré',
];

const formatXaf = (value: number) => (value === 0 ? '0' : `${value.toLocaleString('fr-FR')} XAF`);

const EyeIcon: FC<{ color?: string }> = ({ color = '#1C274C' }) => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.7294 12.1094C2.02113 11.2353 1.66699 10.7982 1.66699 9.50033C1.66699 8.20247 2.02113 7.76541 2.7294 6.89125C4.14363 5.14581 6.51542 3.16699 10.0003 3.16699C13.4852 3.16699 15.857 5.14581 17.2712 6.89125C17.9795 7.76541 18.3337 8.20247 18.3337 9.50033C18.3337 10.7982 17.9795 11.2353 17.2712 12.1094C15.857 13.8548 13.4852 15.8337 10.0003 15.8337C6.51542 15.8337 4.14363 13.8548 2.7294 12.1094Z"
      stroke={color}
      strokeWidth="2"
    />
    <path
      d="M12.5 9.5C12.5 10.8117 11.3807 11.875 10 11.875C8.61925 11.875 7.5 10.8117 7.5 9.5C7.5 8.18829 8.61925 7.125 10 7.125C11.3807 7.125 12.5 8.18829 12.5 9.5Z"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const PencilIcon: FC<{ color?: string }> = ({ color = '#000000' }) => (
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.7893 3.92425L13.294 6.57625M11.8518 2.79925C12.184 2.44757 12.6345 2.25 13.1042 2.25C13.5739 2.25 14.0244 2.44757 14.3565 2.79925C14.6886 3.15092 14.8752 3.6279 14.8752 4.12525C14.8752 4.62259 14.6886 5.09957 14.3565 5.45125L4.60417 15.7772H2.125V13.0982L11.8518 2.79925Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const TrashIcon: FC<{ color?: string }> = ({ color = '#000000' }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 8.25V12.75M10.5 8.25V12.75M3 5.25H15M14.25 5.25L13.5997 14.3565C13.5728 14.7349 13.4035 15.0891 13.1258 15.3477C12.8482 15.6063 12.4829 15.75 12.1035 15.75H5.8965C5.5171 15.75 5.1518 15.6063 4.87416 15.3477C4.59653 15.0891 4.42719 14.7349 4.40025 14.3565L3.75 5.25H14.25ZM11.25 5.25V3C11.25 2.80109 11.171 2.61032 11.0303 2.46967C10.8897 2.32902 10.6989 2.25 10.5 2.25H7.5C7.30109 2.25 7.11032 2.32902 6.96967 2.46967C6.82902 2.61032 6.75 2.80109 6.75 3V5.25H11.25Z"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const FinancementListPage: FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<FinancementListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [proformaRow, setProformaRow] = useState<FinancementListRow | null>(null);

  useEffect(() => {
    let active = true;
    financementService
      .getAllApplications()
      .then((response) => {
        if (active) setRows(response.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const renderDocumentAction = (row: FinancementListRow) => {
    if (row.documentAction === 'Aucun document') {
      return <span className="text-xs">Aucun document</span>;
    }
    if (row.documentAction === 'Télécharger') {
      return (
        <button
          type="button"
          onClick={() => setProformaRow(row)}
          className="rounded-full bg-[#4379EE] px-3 py-1 text-xs font-bold text-white"
        >
          Télécharger
        </button>
      );
    }
    return (
      <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_SIGN}>
        <button
          type="button"
          onClick={() => navigate('/financement/nouvelle?sign=' + row.id)}
          className="rounded-full bg-[#7C5BD9] px-3 py-1 text-xs font-semibold text-white"
        >
          Signer
        </button>
      </ProtectedComponent>
    );
  };

  return (
    <section className="rounded-[25px] border border-brand-border-soft bg-white min-h-full p-4 sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-6 lg:gap-x-11 lg:gap-y-8 w-full max-w-4xl mx-auto">
        {FILTERS.map((status) => (
          <StatusPill key={status} status={status} variant="chip" />
        ))}
      </div>

      {/* Mobile: cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {loading && (
          <div className="py-12 text-center text-brand-text-muted">
            <span className="spinner inline-block" />
          </div>
        )}
        {!loading &&
          rows.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border-[2px] border-brand-border-soft p-4 text-xs text-brand-dark"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-brand-text-muted">
                    N° {row.reference}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-bold">{row.applicantName}</p>
                </div>
                <StatusPill status={row.rowStatus} />
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Somme</dt>
                  <dd className="font-semibold">{formatXaf(row.amount)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Service</dt>
                  <dd className="font-semibold truncate">{row.serviceType}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Demandée le</dt>
                  <dd className="font-semibold">{row.requestDate}</dd>
                </div>
                <div>
                  <dt className="text-[10px] text-brand-text-muted">Restante</dt>
                  <dd className="font-semibold">{formatXaf(row.remaining)}</dd>
                </div>
              </dl>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border-soft pt-3">
                <div>{renderDocumentAction(row)}</div>
                <div className="flex items-center gap-3">
                  <button type="button" aria-label="Voir">
                    <EyeIcon />
                  </button>
                  <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_UPDATE}>
                    <button type="button" aria-label="Modifier">
                      <PencilIcon />
                    </button>
                  </ProtectedComponent>
                  <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_CANCEL}>
                    <button type="button" aria-label="Supprimer">
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
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[24px] border-[2px] border-brand-border-soft text-left text-xs font-bold text-brand-text-muted">
          <thead>
            <tr className="text-brand-text-muted">
              <th className="border-b-[2px] border-brand-border-soft px-3 py-3">No</th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-bold">
                Nom
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-bold">
                Somme financement
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-bold">
                Pour service
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-bold">
                Date de la demande
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-semibold">
                Somme déjà remboursée
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-semibold">
                Somme restante
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-semibold">
                Document associé
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-semibold">
                Status
              </th>
              <th className="border-b-[2px] border-l-[2px] border-brand-border-soft px-3 py-3 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-brand-text-muted">
                  <span className="spinner inline-block" />
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row, rowIdx) => {
                const rowBorder = rowIdx === 0 ? '' : 'border-t-[2px] border-brand-border-soft';
                return (
                  <tr key={row.id} className="text-brand-dark">
                    <td className={`px-3 py-4 ${rowBorder}`}>{row.reference}</td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.applicantName}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {formatXaf(row.amount)}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.serviceType}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {row.requestDate}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {formatXaf(row.alreadyReimbursed)}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {formatXaf(row.remaining)}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      {renderDocumentAction(row)}
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      <StatusPill status={row.rowStatus} />
                    </td>
                    <td
                      className={`border-l-[2px] border-brand-border-soft px-3 py-4 ${rowBorder}`}
                    >
                      <div className="flex items-center gap-2">
                        <button type="button" aria-label="Voir">
                          <EyeIcon />
                        </button>
                        <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_UPDATE}>
                          <button type="button" aria-label="Modifier">
                            <PencilIcon />
                          </button>
                        </ProtectedComponent>
                        <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_CANCEL}>
                          <button type="button" aria-label="Supprimer">
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
        <ProtectedComponent requiredPermissions={PERMISSIONS.FINANCEMENT_CREATE}>
          <Button variant="confirm" onClick={() => navigate('/financement/nouvelle')}>
            Suivant
          </Button>
        </ProtectedComponent>
      </div>

      <ProformaModal
        open={proformaRow !== null}
        onClose={() => setProformaRow(null)}
        applicantName={proformaRow?.applicantName}
        reference={proformaRow?.reference}
      />
    </section>
  );
};

export default FinancementListPage;
