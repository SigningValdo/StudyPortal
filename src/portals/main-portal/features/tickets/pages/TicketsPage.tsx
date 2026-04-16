import { FC, useEffect, useMemo, useState } from 'react';
import { ProtectedComponent } from '@/components/ProtectedComponent';
import {
  PERMISSIONS,
  Ticket,
  TicketPriority,
  TicketStatus,
} from '@contracts/api-contracts';
import { ticketsService } from '@services/mock';
import { usePermissions } from '@hooks/usePermissions';
import TicketFormModal, {
  TicketFormValues,
} from '../components/TicketFormModal';

type StatusFilter = TicketStatus | 'ALL';

const STATUS_STYLES: Record<TicketStatus, { bg: string; text: string; label: string }> = {
  OPEN: { bg: 'bg-[#EEF2FF]', text: 'text-[#0140FF]', label: 'Ouvert' },
  IN_PROGRESS: { bg: 'bg-[#FFF4E5]', text: 'text-[#F2994A]', label: 'En cours' },
  RESOLVED: { bg: 'bg-[#E6F6EC]', text: 'text-[#27AE60]', label: 'Résolu' },
  CLOSED: { bg: 'bg-[#F1F1F4]', text: 'text-[#646464]', label: 'Fermé' },
};

const PRIORITY_STYLES: Record<TicketPriority, { bg: string; text: string; label: string }> = {
  LOW: { bg: 'bg-[#E6F6EC]', text: 'text-[#27AE60]', label: 'Basse' },
  MEDIUM: { bg: 'bg-[#FFF4E5]', text: 'text-[#F2994A]', label: 'Moyenne' },
  HIGH: { bg: 'bg-[#FDE8E8]', text: 'text-[#F21E1E]', label: 'Haute' },
};

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'ALL', label: 'Tous' },
  { key: 'OPEN', label: 'Ouverts' },
  { key: 'IN_PROGRESS', label: 'En cours' },
  { key: 'RESOLVED', label: 'Résolus' },
  { key: 'CLOSED', label: 'Fermés' },
];

const PlusIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
    <path
      d="M7.5 3.125V11.875M3.125 7.5H11.875"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
    <path
      d="M9.375 2.5L12.5 5.625M10.9375 0.9375C11.3519 0.523122 11.9136 0.290419 12.5 0.290419C13.0864 0.290419 13.6481 0.523122 14.0625 0.9375C14.4769 1.35188 14.7096 1.91364 14.7096 2.5C14.7096 3.08636 14.4769 3.64812 14.0625 4.0625L4.375 13.75L0.9375 14.0625L1.25 10.625L10.9375 0.9375Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
    <path
      d="M1.875 3.75H13.125M5.625 6.875V11.25M9.375 6.875V11.25M2.8125 3.75L3.4375 12.5C3.4375 12.8315 3.56919 13.1495 3.80361 13.3839C4.03804 13.6183 4.35598 13.75 4.6875 13.75H10.3125C10.644 13.75 10.962 13.6183 11.1964 13.3839C11.4308 13.1495 11.5625 12.8315 11.5625 12.5L12.1875 3.75M5.3125 3.75V1.875C5.3125 1.70924 5.37835 1.55027 5.49556 1.43306C5.61277 1.31585 5.77174 1.25 5.9375 1.25H9.0625C9.22826 1.25 9.38723 1.31585 9.50444 1.43306C9.62165 1.55027 9.6875 1.70924 9.6875 1.875V3.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CommentIcon: FC = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden>
    <path
      d="M13.125 10.625C13.125 10.9565 12.9933 11.2745 12.7589 11.5089C12.5245 11.7433 12.2065 11.875 11.875 11.875H4.375L1.875 14.375V3.125C1.875 2.79348 2.00669 2.47554 2.24112 2.24112C2.47554 2.00669 2.79348 1.875 3.125 1.875H11.875C12.2065 1.875 12.5245 2.00669 12.7589 2.24112C12.9933 2.47554 13.125 2.79348 13.125 3.125V10.625Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const TicketsPage: FC = () => {
  const { hasPermission } = usePermissions();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Ticket | null>(null);

  useEffect(() => {
    void loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    const res = await ticketsService.getAllTickets();
    setTickets(res.data ?? []);
    setLoading(false);
  };

  const filtered = useMemo(
    () =>
      filter === 'ALL'
        ? tickets
        : tickets.filter((t) => t.status === filter),
    [tickets, filter],
  );

  const counts = useMemo(() => {
    const base: Record<StatusFilter, number> = {
      ALL: tickets.length,
      OPEN: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };
    tickets.forEach((t) => {
      base[t.status] += 1;
    });
    return base;
  }, [tickets]);

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (ticket: Ticket) => {
    setEditTarget(ticket);
    setFormOpen(true);
  };

  const handleSubmit = async (values: TicketFormValues) => {
    if (editTarget) {
      const res = await ticketsService.updateTicket(editTarget.id, values);
      if (res.success && res.data) {
        setTickets((prev) =>
          prev.map((t) => (t.id === editTarget.id ? res.data! : t)),
        );
      }
    } else {
      const res = await ticketsService.createTicket(values);
      if (res.success) {
        setTickets((prev) => [res.data, ...prev]);
      }
    }
  };

  const handleDelete = async (ticket: Ticket) => {
    const ok = window.confirm(`Supprimer "${ticket.title}" ?`);
    if (!ok) return;
    const previous = tickets;
    setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    const res = await ticketsService.deleteTicket(ticket.id);
    if (!res.success) setTickets(previous);
  };

  const canComment = hasPermission(PERMISSIONS.TICKET_COMMENT);
  const canUpdate = hasPermission(PERMISSIONS.TICKET_UPDATE);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-border-soft bg-white">
      <ProtectedComponent
        requiredPermissions={PERMISSIONS.TICKET_READ}
        fallback={
          <div className="flex flex-1 items-center justify-center p-6 text-sm text-brand-text-muted">
            Vous n'avez pas la permission de consulter les tickets.
          </div>
        }
      >
        <header className="flex flex-col gap-4 border-b border-brand-border-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {STATUS_FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-brand-border-soft bg-white text-brand-text-muted hover:border-brand-primary/40 hover:text-brand-dark'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${
                      active ? 'bg-white/20 text-white' : 'bg-brand-primary-soft text-brand-primary'
                    }`}
                  >
                    {counts[f.key]}
                  </span>
                </button>
              );
            })}
          </div>

          <ProtectedComponent requiredPermissions={PERMISSIONS.TICKET_CREATE}>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <PlusIcon />
              Créer un ticket
            </button>
          </ProtectedComponent>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {loading ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <li
                  key={idx}
                  className="flex animate-pulse flex-col gap-3 rounded-2xl border border-brand-border-soft bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-2">
                    <div className="h-4 w-16 rounded-full bg-[#EEF0F4]" />
                    <div className="h-4 w-16 rounded-full bg-[#EEF0F4]" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-4/5 rounded bg-[#EEF0F4]" />
                    <div className="h-3 w-full rounded bg-[#EEF0F4]" />
                    <div className="h-3 w-3/4 rounded bg-[#EEF0F4]" />
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-brand-border-soft pt-3">
                    <div className="h-6 w-24 rounded bg-[#EEF0F4]" />
                    <div className="h-6 w-16 rounded bg-[#EEF0F4]" />
                  </div>
                </li>
              ))}
            </ul>
          ) : filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center text-sm text-brand-text-muted">
              <span className="text-base font-semibold text-brand-dark">
                Aucun ticket
              </span>
              <span>
                {filter === 'ALL'
                  ? 'Créez votre premier ticket pour commencer.'
                  : 'Aucun ticket ne correspond à ce filtre.'}
              </span>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((ticket) => {
                const statusStyle = STATUS_STYLES[ticket.status];
                const priorityStyle = PRIORITY_STYLES[ticket.priority];
                return (
                  <li
                    key={ticket.id}
                    className="flex flex-col gap-3 rounded-2xl border border-brand-border-soft bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          {statusStyle.label}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priorityStyle.bg} ${priorityStyle.text}`}
                        >
                          {priorityStyle.label}
                        </span>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-brand-text-muted">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="line-clamp-2 text-sm font-semibold text-brand-dark">
                        {ticket.title}
                      </h3>
                      <p className="line-clamp-3 text-xs text-brand-text-muted">
                        {ticket.description}
                      </p>
                    </div>

                    {ticket.tags && ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#F5F6FA] px-2 py-0.5 text-[10px] font-medium text-brand-text-muted"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-brand-border-soft pt-3 text-[11px] text-brand-text-muted">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: '#0140FF' }}
                          aria-hidden
                        >
                          {ticket.createdBy.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="truncate">{ticket.createdBy}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {canComment && (
                          <button
                            type="button"
                            aria-label={`Commenter ${ticket.title}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-muted transition-colors hover:bg-brand-primary-soft hover:text-brand-primary"
                          >
                            <CommentIcon />
                          </button>
                        )}
                        <ProtectedComponent
                          requiredPermissions={PERMISSIONS.TICKET_UPDATE}
                        >
                          <button
                            type="button"
                            onClick={() => openEdit(ticket)}
                            aria-label={`Modifier ${ticket.title}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-muted transition-colors hover:bg-brand-primary-soft hover:text-brand-primary"
                          >
                            <EditIcon />
                          </button>
                        </ProtectedComponent>
                        <ProtectedComponent
                          requiredPermissions={PERMISSIONS.TICKET_DELETE}
                        >
                          <button
                            type="button"
                            onClick={() => void handleDelete(ticket)}
                            aria-label={`Supprimer ${ticket.title}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F21E1E] transition-colors hover:bg-[#FDE8E8]"
                          >
                            <TrashIcon />
                          </button>
                        </ProtectedComponent>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ProtectedComponent>

      <TicketFormModal
        open={formOpen}
        mode={editTarget ? 'edit' : 'create'}
        initial={editTarget ?? undefined}
        canChangeStatus={canUpdate}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default TicketsPage;
