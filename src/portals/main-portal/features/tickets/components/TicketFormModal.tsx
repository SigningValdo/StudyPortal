import { FC, useEffect, useState } from 'react';
import Modal from '@/components/shared/Modal';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '@contracts/api-contracts';

const STATUSES: TicketStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export interface TicketFormValues {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
}

export interface TicketFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initial?: Ticket;
  canChangeStatus?: boolean;
  onClose: () => void;
  onSubmit: (values: TicketFormValues) => Promise<void> | void;
}

export const TicketFormModal: FC<TicketFormModalProps> = ({
  open,
  mode,
  initial,
  canChangeStatus = true,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>('OPEN');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? '');
    setDescription(initial?.description ?? '');
    setStatus(initial?.status ?? 'OPEN');
    setPriority(initial?.priority ?? 'MEDIUM');
  }, [open, initial]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width={520}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-brand-dark">
            {mode === 'create' ? 'Créer un ticket' : 'Modifier le ticket'}
          </h3>
          <p className="mt-1 text-xs text-brand-text-muted">
            {mode === 'create'
              ? 'Décrivez précisément votre demande.'
              : 'Mettez à jour les informations du ticket.'}
          </p>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="ticket-title"
            className="text-xs font-semibold text-brand-dark"
          >
            Titre
          </label>
          <input
            id="ticket-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
            className="w-full rounded-lg border border-brand-border-soft bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Ex. Problème de connexion"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="ticket-description"
            className="text-xs font-semibold text-brand-dark"
          >
            Description
          </label>
          <textarea
            id="ticket-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-brand-border-soft bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Détails supplémentaires…"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="ticket-priority"
              className="text-xs font-semibold text-brand-dark"
            >
              Priorité
            </label>
            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full rounded-lg border border-brand-border-soft bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {canChangeStatus && (
            <div className="space-y-1.5">
              <label
                htmlFor="ticket-status"
                className="text-xs font-semibold text-brand-dark"
              >
                Statut
              </label>
              <select
                id="ticket-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TicketStatus)}
                className="w-full rounded-lg border border-brand-border-soft bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="min-w-[110px] rounded-xl bg-[#B7BCC6] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="min-w-[110px] rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? '...'
              : mode === 'create'
                ? 'Créer'
                : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TicketFormModal;
