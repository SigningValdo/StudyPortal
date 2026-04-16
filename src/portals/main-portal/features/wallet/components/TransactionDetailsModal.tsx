import { FC, useEffect } from 'react';
import { TransactionDetails } from '@contracts/api-contracts';
import { formatAmount, formatLongDateTime } from '../utils/format';
import {
  CloseIcon,
  ContestIcon,
  DownloadIcon,
  PdfIcon,
  PrinterIcon,
  ShareIcon,
} from './WalletIcons';

export interface TransactionDetailsModalProps {
  open: boolean;
  details: TransactionDetails | null;
  loading?: boolean;
  onClose: () => void;
}

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-4">
    <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-confirm">{title}</h4>
    <div className="mt-2 rounded-xl border border-brand-border-soft bg-[#F7F7F7] shadow-[0_7px_16px_0_rgba(0,0,0,0.05)]">
      {children}
    </div>
  </div>
);

const Row: FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div className="flex items-start justify-between gap-4 px-4 py-2.5 text-xs first:pt-3 last:pb-3">
    <span className="text-brand-text-muted">{label}</span>
    <span
      className={`text-right font-semibold ${highlight ? 'text-brand-dark' : 'text-brand-dark'}`}
    >
      {value}
    </span>
  </div>
);

export const TransactionDetailsModal: FC<TransactionDetailsModalProps> = ({
  open,
  details,
  loading,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-lg overflow-hidden border-[#D8D8D8] bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex border-b items-center justify-between bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <h3 className=" font-bold">Détails de la transaction</h3>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6.66667V10M10 13.3333H10.0083M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z"
                stroke="#979797"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-dark"
            aria-label="Fermer"
          >
            <CloseIcon />
          </button>
        </div>

        {loading || !details ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
              <div className="mt-4 flex items-start justify-between rounded-xl bg-white">
                <div className="flex items-start gap-3">
                  <PdfIcon />
                  <div>
                    <div className="text-[10px] text-brand-text-muted">Transaction</div>
                    <div className="text-sm font-bold text-brand-dark">
                      Service {details.label.includes('AVI') ? 'AVI' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#E74C3C]">
                    {details.direction === 'DEBIT' ? '-' : '+'}{' '}
                    {formatAmount(details.amount, details.currency)}
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full shadow-[0_7px_16px_0_rgba(0,0,0,0.05),0_29px_29px_0_rgba(0,0,0,0.04),0_65px_39px_0_rgba(0,0,0,0.03),0_116px_46px_0_rgba(0,0,0,0.01),0_181px_51px_0_rgba(0,0,0,0)] bg-[#4CAF50] px-2 py-0.5 text-[10px] font-semibold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {details.status}
                  </span>
                </div>
              </div>

              <Section title="DÉTAILS DU SERVICE">
                <Row label="Type de service" value={details.serviceType} />
                <Row label="N° Proforma" value={details.proformaNumber} />
                <Row label="Catégorie" value={details.category} />
              </Section>

              <Section title="STATUT & WALLET">
                <div className="flex items-center border-b gap-1 text-xs font-bold mx-4 py-3">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.2127 6.59724C10.7943 8.68966 9.21656 10.6599 7.00277 11.1001C5.92307 11.3152 4.80305 11.1841 3.8022 10.7255C2.80134 10.267 1.97067 9.50432 1.42846 8.5462C0.886244 7.58808 0.660136 6.48331 0.782326 5.38921C0.904517 4.29511 1.36878 3.26745 2.109 2.45255C3.62727 0.780285 6.19091 0.31995 8.28334 1.15692"
                      stroke="#20AE5C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.09961 5.75999L6.19204 7.85242L11.2139 2.41211"
                      stroke="#20AE5C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  {details.status}
                </div>
                <Row
                  label="Solde avant"
                  value={formatAmount(details.balanceBefore, details.currency)}
                />
                <Row
                  label="Solde après"
                  value={formatAmount(details.balanceAfter, details.currency)}
                />
              </Section>

              <Section title="DÉTAILS DU SERVICE">
                <Row label="Méthode" value={details.method} />
                <Row label="ID Transaction" value={details.transactionReference} />
                <Row label="Frais" value={formatAmount(details.fees, details.currency)} />
              </Section>

              <Section title="INFORMATIONS DE BASE">
                <Row label="Date" value={formatLongDateTime(details.date)} />
                <Row label="Référence" value={details.reference} />
              </Section>

              {details.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-brand-dark">Documents liés</h4>
                  <div className="mt-2 flex flex-col gap-2">
                    {details.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-brand-border-soft bg-white px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <PdfIcon className=" h-[30px] w-[30px]" />
                          <div>
                            <div className="text-xs font-semibold text-brand-dark">{doc.name}</div>
                            <div className="text-[10px] text-brand-text-muted">
                              Généré le {formatLongDateTime(doc.generatedAt).split(' à ')[0]}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#2E9E5D]">
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F7EE] hover:opacity-80"
                            aria-label="Télécharger"
                          >
                            <DownloadIcon />
                          </button>
                          <button
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF2DB] text-[#F59E0B] hover:opacity-80"
                            aria-label="Partager"
                          >
                            <ShareIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white px-5 py-4">
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-brand-border-soft px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-[#F9FAFC]"
              >
                <PrinterIcon />
                Imprimer le reçu
              </button>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-[#FFEDD5] px-3 py-2 text-xs font-semibold text-brand-accent hover:bg-[#FFF7EC]"
              >
                <ContestIcon />
                Contester la transaction
              </button>
              <button
                type="button"
                className="ml-auto flex items-center gap-1 rounded-lg bg-brand-confirm px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.42694 8.33897C5.55319 8.08647 5.62444 7.80147 5.62444 7.50022C5.62444 7.19897 5.55319 6.91397 5.42694 6.66147M5.42694 8.33897C5.238 8.71672 4.92707 9.01961 4.5445 9.19858C4.16193 9.37754 3.73014 9.4221 3.31909 9.32504C2.90804 9.22797 2.5418 8.99497 2.2797 8.66377C2.0176 8.33257 1.875 7.92258 1.875 7.50022C1.875 7.07787 2.0176 6.66788 2.2797 6.33668C2.5418 6.00548 2.90804 5.77248 3.31909 5.67541C3.73014 5.57835 4.16193 5.62291 4.5445 5.80187C4.92707 5.98084 5.238 6.28373 5.42694 6.66147M5.42694 8.33897L9.57194 10.4115M5.42694 6.66147L9.57194 4.58897M9.57194 10.4115C9.34949 10.8564 9.31288 11.3714 9.47018 11.8433C9.62748 12.3152 9.96579 12.7053 10.4107 12.9277C10.8556 13.1502 11.3706 13.1868 11.8425 13.0295C12.3144 12.8722 12.7045 12.5339 12.9269 12.089C13.1494 11.6441 13.186 11.129 13.0287 10.6571C12.8714 10.1853 12.5331 9.79517 12.0882 9.57272C11.8679 9.46258 11.6281 9.3969 11.3824 9.37944C11.1367 9.36198 10.89 9.39308 10.6564 9.47097C10.1845 9.62826 9.79439 9.96657 9.57194 10.4115ZM9.57194 4.58897C9.68208 4.80923 9.83453 5.00563 10.0206 5.16696C10.2066 5.32829 10.4226 5.4514 10.6563 5.52926C10.8899 5.60712 11.1366 5.63819 11.3822 5.62072C11.6278 5.60324 11.8676 5.53756 12.0879 5.42741C12.3081 5.31727 12.5045 5.16482 12.6659 4.97877C12.8272 4.79272 12.9503 4.57672 13.0282 4.34309C13.106 4.10946 13.1371 3.86279 13.1196 3.61715C13.1021 3.37152 13.0365 3.13173 12.9263 2.91147C12.7039 2.46666 12.3138 2.12843 11.842 1.97119C11.3702 1.81395 10.8552 1.85059 10.4104 2.07304C9.96556 2.29549 9.62733 2.68553 9.47009 3.15736C9.31285 3.62919 9.34949 4.14416 9.57194 4.58897Z"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Partager le reçu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
