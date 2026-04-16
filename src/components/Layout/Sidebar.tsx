import { FC, useState } from 'react';
import boazLogo from '@/assets/images/BOAZ  studyy.png';
import {
  BagIcon,
  BuildingIcon,
  ChevronDownIcon,
  ClipboardCheckIcon,
  DashboardIcon,
  EuroIcon,
  GridIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
} from './icons';

type IconComponent = FC<{ className?: string }>;

interface SubItem {
  key: string;
  label: string;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: IconComponent;
  children?: SubItem[];
}

export interface SidebarSection {
  items: MenuItem[];
  separator?: string;
}

const USER_SECTIONS: SidebarSection[] = [
  {
    items: [
      { key: 'accueil', label: 'Acceuil', icon: HomeIcon },
      { key: 'agence', label: 'Mon agence', icon: BuildingIcon, children: [] },
      { key: 'services-top', label: 'Services', icon: GridIcon },
      {
        key: 'suscriptions',
        label: 'Mes suscriptions',
        icon: BagIcon,
        children: [
          { key: 'services', label: 'Services' },
          { key: 'financement', label: 'Financement' },
          { key: 'remboursements', label: 'Remboursements' },
        ],
      },
      { key: 'preuves', label: 'Preuves de versement', icon: ClipboardCheckIcon },
      {
        key: 'wallet',
        label: 'Mon Wallet Boaz',
        icon: EuroIcon,
        children: [
          { key: 'historiques', label: 'Mes historiques' },
          { key: '', label: '' },
        ],
      },
      { key: 'affiliation', label: "Programme d'affiliation", icon: UsersIcon },
    ],
  },
  {
    separator: 'GENERAL',
    items: [
      { key: 'dashboard', label: 'Tableau de bord', icon: DashboardIcon },
      { key: 'parametres', label: 'Paramètres', icon: SettingsIcon },
    ],
  },
];

const AGENT_SECTIONS: SidebarSection[] = [
  {
    items: [
      { key: 'accueil', label: 'Acceuil', icon: HomeIcon },
      { key: 'agence', label: 'Mon agence', icon: BuildingIcon, children: [] },
      { key: 'dashboard', label: 'Tableau de bord', icon: DashboardIcon },
      {
        key: 'demandes-services',
        label: 'Demandes de services',
        icon: GridIcon,
        children: [
          { key: 'avi', label: 'A.V.I' },
          { key: 'attestations-logement', label: 'Attestations de logement' },
          { key: 'assurances', label: 'Assurances' },
          { key: 'admissions', label: 'Admissions' },
          { key: 'envoi-argent', label: "Envoi d'argent" },
        ],
      },
      {
        key: 'financement',
        label: 'Financement',
        icon: BagIcon,
        children: [
          { key: 'ordre-financement', label: 'Ordre de financement' },
          { key: 'demande-financement', label: 'Demande de financement' },
          { key: 'operation-effectuer', label: 'Opération à effectuer' },
        ],
      },
      {
        key: 'operations',
        label: 'Opérations',
        icon: GridIcon,
        children: [
          { key: 'avi-ops', label: 'A.V.I' },
          { key: 'envoi-argent-ops', label: "Envoi d'argent" },
          { key: 'accompagnement', label: 'Accompagnement' },
          { key: 'recherche-admissions', label: "Recherche d'admissions" },
          { key: 'recherche-logements', label: 'Recherche de logements' },
          { key: 'demande-financement-ops', label: 'Demande de financement' },
        ],
      },
      {
        key: 'boaz-wallet',
        label: 'Boaz Wallet',
        icon: DashboardIcon,
        children: [
          { key: 'historique-comptes', label: 'Historique des comptes' },
          { key: 'etats-comptes-bancaires', label: 'Etats comptes Bancaires' },
          { key: 'gestion-banques', label: 'Gestion des Banques' },
        ],
      },
      {
        key: 'statistiques',
        label: 'Statistiques',
        icon: DashboardIcon,
        children: [
          { key: 'stats-services', label: 'Services' },
          { key: 'stats-financements', label: 'Financements' },
        ],
      },
    ],
  },
];

export type SidebarVariant = 'user' | 'agent';

interface SidebarProps {
  variant?: SidebarVariant;
  activeKey?: string;
  onSelect?: (key: string) => void;
  showFooterSettings?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const VARIANT_SECTIONS: Record<SidebarVariant, SidebarSection[]> = {
  user: USER_SECTIONS,
  agent: AGENT_SECTIONS,
};

const DEFAULT_EXPANDED: Record<SidebarVariant, Record<string, boolean>> = {
  user: { suscriptions: true, wallet: true },
  agent: {
    'demandes-services': true,
    financement: true,
    operations: true,
    'boaz-wallet': true,
    statistiques: true,
  },
};

const DEFAULT_ACTIVE_SUB: Record<SidebarVariant, string | null> = {
  user: 'historiques',
  agent: 'demande-financement-ops',
};

export const Sidebar: FC<SidebarProps> = ({
  variant = 'user',
  activeKey,
  onSelect,
  showFooterSettings,
  onClose,
  isMobile = false,
}) => {
  const sections = VARIANT_SECTIONS[variant];
  const [expanded, setExpanded] = useState<Record<string, boolean>>(DEFAULT_EXPANDED[variant]);
  const [activeSub, setActiveSub] = useState<string | null>(DEFAULT_ACTIVE_SUB[variant]);

  const resolvedActiveKey = activeKey ?? (variant === 'user' ? 'accueil' : 'accueil');
  const showSettings = showFooterSettings ?? variant === 'agent';

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpanded((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
    }
    onSelect?.(item.key);
  };

  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = resolvedActiveKey === item.key;
    const hasChildren = !!item.children;
    const isExpanded = expanded[item.key];

    return (
      <div key={item.key}>
        <button
          type="button"
          onClick={() => handleItemClick(item)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left font-bold transition-colors rounded-lg"
          style={{
            backgroundColor: active ? '#F1F3FF' : 'transparent',
            color: active ? '#0140FF' : '#646464',
          }}
        >
          <span className="flex items-center gap-2">
            {Icon && (
              <Icon
                className="shrink-0"
                // @ts-expect-error currentColor inherited
                style={{ color: active ? '#0140FF' : '#646464' }}
              />
            )}
            <span>{item.label}</span>
          </span>
          {hasChildren && (
            <ChevronDownIcon
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                color: '#646464',
              }}
            />
          )}
        </button>

        {hasChildren && isExpanded && item.children!.length > 0 && (
          <div
            className="mt-1 overflow-hidden"
            style={{
              backgroundColor: '#CFD6DC75',
              boxShadow: 'inset 0 0 10.7px -2px rgba(0,0,0,0.25)',
            }}
          >
            {item.children!.map((sub, subIdx) => {
              const subActive = activeSub === sub.key;
              return (
                <div key={sub.key}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSub(sub.key);
                      onSelect?.(sub.key);
                    }}
                    className="block w-full px-4 sm:px-6 lg:px-10 py-2.5 text-left text-sm transition-colors"
                    style={{
                      color: subActive ? '#FFA600' : '#646464',
                      fontWeight: 700,
                    }}
                  >
                    {sub.label}
                  </button>
                  {subIdx < item.children!.length - 1 && (
                    <div className="mx-4 border-t" style={{ borderColor: '#D8D8D8' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: SidebarSection, sectionIdx: number) => (
    <div key={sectionIdx}>
      {section.separator && (
        <div className="my-6 flex items-center gap-3">
          <div className="h-[2px] flex-1" style={{ backgroundColor: '#D8D8D8' }} />
          <span className="font-bold tracking-wider" style={{ color: '#646464' }}>
            {section.separator}
          </span>
          <div className="h-[2px] flex-1" style={{ backgroundColor: '#D8D8D8' }} />
        </div>
      )}
      <nav className="flex flex-col gap-1">
        {section.items.map((item, idx) => (
          <div key={item.key}>
            {renderItem(item)}
            {idx < section.items.length - 1 && (
              <div
                className="border-t"
                style={{
                  borderColor: '#D8D8D8',
                  marginTop: idx === 0 ? '28px' : '4px',
                  marginBottom: '4px',
                }}
              />
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <aside
      className={`flex h-full flex-col overflow-y-auto border bg-white px-4 py-6 ${
        isMobile
          ? 'w-[85vw] max-w-xs rounded-r-3xl shadow-xl'
          : 'w-60 rounded-3xl lg:w-72'
      }`}
      style={{ borderColor: '#E5E7EB' }}
    >
      <div className="mb-8 flex items-center justify-between lg:mb-14 lg:justify-center">
        <img src={boazLogo} alt="Boaz Study" className="h-10 w-auto lg:h-12" />
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-border-soft text-brand-text-muted hover:bg-brand-primary-soft"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex-1">{sections.map((section, idx) => renderSection(section, idx))}</div>

        {showSettings && (
          <div className="mt-6 flex items-center justify-center gap-2 pt-4">
            <SettingsIcon style={{ color: '#0140FF' }} />
            <span className="font-bold" style={{ color: '#0140FF' }}>
              Paramètres
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
