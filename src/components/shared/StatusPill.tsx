import { FC } from 'react';
import {
  AviSubscriptionStatus,
  FinancementRowStatus,
  FinancementStatus,
} from '@contracts/api-contracts';

type AnyStatus = FinancementStatus | FinancementRowStatus | AviSubscriptionStatus;

const COLOR_MAP: Record<AnyStatus, { bg: string; fg: string }> = {
  'En préparation': { bg: '#FFF1E0', fg: '#FFA600' },
  'En attente de paiement': { bg: '#FFF8DC', fg: '#FFDC44' },
  'Paiement en attente': { bg: '#E6EEFF', fg: '#2196F3' },
  Clôturée: { bg: '#EDEDED', fg: '#9E9E9E' },
  Payée: { bg: '#DFF7E6', fg: '#4CAF50' },
  Livré: { bg: '#E6EEFF', fg: '#3F51B5' },

  'En cours': { bg: 'transparent', fg: '#FDD216' },
  'En remboursement': { bg: 'transparent', fg: '#0140FF' },
  Clôturé: { bg: 'transparent', fg: '#27AE60' },
  'Echéance ratée': { bg: 'transparent', fg: '#FFA600' },
  Rejeté: { bg: 'transparent', fg: '#E21A30' },
  Accepté: { bg: 'transparent', fg: '#9244FF' },
};

export interface StatusPillProps {
  status: AnyStatus;
  variant?: 'chip' | 'badge';
  active?: boolean;
  onClick?: () => void;
}

const CHIP_SHADOW = [
  '1px 2px 6px 0 rgba(0, 0, 0, 0.05)',
  '6px 9px 11px 0 rgba(0, 0, 0, 0.04)',
  '13px 20px 14px 0 rgba(0, 0, 0, 0.03)',
  '23px 36px 17px 0 rgba(0, 0, 0, 0.01)',
  '36px 56px 19px 0 rgba(0, 0, 0, 0)',
].join(', ');

export const StatusPill: FC<StatusPillProps> = ({
  status,
  variant = 'badge',
  active = false,
  onClick,
}) => {
  const colors = COLOR_MAP[status];

  if (variant === 'chip') {
    const Tag = onClick ? 'button' : 'span';
    return (
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className="inline-flex items-center gap-3 rounded-full border px-4 py-3 font-bold"
        style={{
          borderColor: colors.fg,
          color: active ? '#FFFFFF' : colors.fg,
          backgroundColor: active ? colors.fg : 'white',
          boxShadow: CHIP_SHADOW,
        }}
      >
        <span
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: active ? '#FFFFFF' : colors.fg }}
        />
        {status}
      </Tag>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-md px-3 py-1 font-bold"
      style={{ backgroundColor: colors.bg, color: colors.fg }}
    >
      {status}
    </span>
  );
};

export default StatusPill;
