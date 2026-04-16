import { FC } from 'react';
import { BellIcon, CheckShieldIcon, ShieldIcon, UserIcon } from './ProfileIcons';

export type ProfileTabKey = 'informations' | 'security' | 'notifications' | 'two-factor';

interface TabDef {
  key: ProfileTabKey;
  label: string;
  Icon: FC<React.SVGProps<SVGSVGElement>>;
}

const TABS: TabDef[] = [
  { key: 'informations', label: 'Mes informations', Icon: UserIcon },
  { key: 'security', label: 'Sécurité', Icon: ShieldIcon },
  { key: 'notifications', label: 'Notifications', Icon: BellIcon },
  {
    key: 'two-factor',
    label: 'Identification à double facteur',
    Icon: CheckShieldIcon,
  },
];

export interface ProfileTabsProps {
  active: ProfileTabKey;
  onChange: (key: ProfileTabKey) => void;
}

export const ProfileTabs: FC<ProfileTabsProps> = ({ active, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-8  pb-4">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex items-center gap-2 text-xs font-semibold transition-colors"
            style={{
              color: isActive ? '#0140FF' : '#646464',
            }}
          >
            <Icon />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
