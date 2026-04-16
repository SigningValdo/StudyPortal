import { FC } from 'react';
import { NotificationPreferences } from '@contracts/api-contracts';
import ToggleSwitch from './ToggleSwitch';

export interface NotificationsTabProps {
  value: NotificationPreferences;
  onChange: (value: NotificationPreferences) => void;
}

interface PreferenceEntry {
  key: keyof NotificationPreferences;
  label: string;
  description: string;
}

const PREFERENCES: PreferenceEntry[] = [
  {
    key: 'emailMarketing',
    label: 'Emails marketing',
    description: 'Recevoir les offres et nouveautés Boaz.',
  },
  {
    key: 'emailSecurity',
    label: 'Emails de sécurité',
    description: 'Alertes de connexion et modifications sensibles.',
  },
  {
    key: 'emailTransactions',
    label: 'Emails de transactions',
    description: 'Notifications liées à vos paiements et services.',
  },
  {
    key: 'smsAlerts',
    label: 'Alertes SMS',
    description: 'Recevoir les alertes importantes par SMS.',
  },
  {
    key: 'pushNotifications',
    label: 'Notifications push',
    description: 'Notifications dans le navigateur ou sur mobile.',
  },
];

export const NotificationsTab: FC<NotificationsTabProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col divide-y divide-brand-border-soft">
      {PREFERENCES.map((pref) => (
        <div key={pref.key} className="py-4 first:pt-0 last:pb-0">
          <ToggleSwitch
            checked={value[pref.key]}
            onChange={(next) => onChange({ ...value, [pref.key]: next })}
            label={pref.label}
            description={pref.description}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationsTab;
