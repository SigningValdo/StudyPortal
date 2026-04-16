import { FC } from 'react';
import Modal from './Modal';

export interface ProformaModalProps {
  open: boolean;
  onClose: () => void;
  applicantName?: string;
  reference?: string;
}

const SAMPLE_LINES: { label: string; qty: number; unit: number }[] = [
  { label: 'Montant de la caution bancaire/AVI', qty: 1, unit: 6_812_000 },
  { label: 'Frais de transfert de Fonds', qty: 1, unit: 170_300 },
  { label: 'Frais AVI', qty: 1, unit: 230_000 },
  { label: 'Frais ACS Assurance France', qty: 1, unit: 50_435 },
  { label: 'Frais recherche logement', qty: 0, unit: 0 },
];

const formatCurrency = (n: number) => `${n.toLocaleString('fr-FR')} FCFA`;

const ToolbarIcon: FC<{ d: string }> = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d={d} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ProformaModal: FC<ProformaModalProps> = ({
  open,
  onClose,
  applicantName = 'YONKE TONY VALDEZ',
  reference,
}) => {
  const total = SAMPLE_LINES.reduce((sum, line) => sum + line.qty * line.unit, 0);

  return (
    <Modal open={open} onClose={onClose} width={760} className="!p-0 overflow-hidden">
      <div className="flex items-center gap-3 bg-[#3F3F46] px-4 py-2 text-xs text-white">
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
          aria-label="Fermer"
        >
          <ToolbarIcon d="M6 6L18 18M6 18L18 6" />
        </button>
        <span className="flex-1 text-center font-semibold">Proforma service</span>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
          aria-label="Télécharger"
        >
          <ToolbarIcon d="M12 3V15M12 15L7 10M12 15L17 10M5 21H19" />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"
          aria-label="Imprimer"
        >
          <ToolbarIcon d="M6 9V3H18V9M6 18H4C3 18 2 17 2 16V12C2 11 3 10 4 10H20C21 10 22 11 22 12V16C22 17 21 18 20 18H18M6 14H18V22H6V14Z" />
        </button>
      </div>

      <div className="bg-[#F5F6FA] p-6">
        <div className="mx-auto max-w-xl rounded-md bg-white p-6 shadow-sm">
          <div className="text-right text-[10px] text-brand-text-muted">Aperçu</div>
          <h3 className="text-lg font-bold text-brand-dark">Ma Proforma</h3>
          <div className="mt-1 flex gap-4 text-xs text-brand-text-muted">
            <span className="border-b border-brand-primary text-brand-primary">Proforma</span>
            <span>Preuve de paiement</span>
          </div>

          <div className="mt-3 flex items-start justify-between">
            <div>
              <div className="text-sm font-bold text-brand-primary">BOAZ-STUDY</div>
              <div className="mt-2 text-[10px] text-brand-dark">
                Boaz Study Cameroun SAS
                <br />
                Yaoundé - Total Ecole de Police
                <br />
                +(237) 658 870 473
                <br />
                389 Rue Toyota Bonapriso
                <br />
                B.P. 1230 Douala
                <br />
                +(237) 656 186 936
                <br />
                info@boaz-study.com
              </div>
            </div>
            <div className="text-right text-[10px] text-brand-dark">
              Date : 11/03/2026
              {reference && <div>Réf : {reference}</div>}
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between text-[10px] text-brand-dark">
            <div>
              Payable à BOAZ STUDY CAMEROUN
              <br />
              Banque : Société Générale Cameroun
              <br />
              Code Banque : 10003
              <br />
              Code Agence : 00100
              <br />
              N° Compte : 06011073195
              <br />
              Clé : 26
              <br />
              IBAN : CM21 1000 3001-0006-0510-7319-526
            </div>
            <div className="text-right">
              <div className="font-semibold">{applicantName}</div>
              <div>CAMEROUN</div>
            </div>
          </div>

          <div className="overflow-x-auto"><table className="mt-4 w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#F1F3FF] text-brand-dark">
                <th className="border border-brand-border px-2 py-1 text-left">Description</th>
                <th className="border border-brand-border px-2 py-1">Qté</th>
                <th className="border border-brand-border px-2 py-1">Prix unitaire</th>
                <th className="border border-brand-border px-2 py-1">Montant</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LINES.map((line) => (
                <tr key={line.label}>
                  <td className="border border-brand-border px-2 py-1">{line.label}</td>
                  <td className="border border-brand-border px-2 py-1 text-center">
                    {line.qty}
                  </td>
                  <td className="border border-brand-border px-2 py-1 text-right">
                    {formatCurrency(line.unit)}
                  </td>
                  <td className="border border-brand-border px-2 py-1 text-right">
                    {formatCurrency(line.qty * line.unit)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan={3} className="border border-brand-border px-2 py-1 text-right">
                  Total HT
                </td>
                <td className="border border-brand-border px-2 py-1 text-right">
                  {formatCurrency(total)}
                </td>
              </tr>
              <tr className="font-semibold">
                <td colSpan={3} className="border border-brand-border px-2 py-1 text-right">
                  Total TTC
                </td>
                <td className="border border-brand-border px-2 py-1 text-right">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tbody>
          </table></div>

          <p className="mt-3 text-[10px] text-brand-dark">
            PS: RECOMMANDEZ-NOUS ET RECEVEZ 25000 FCFA
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ProformaModal;
