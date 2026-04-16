# StudyPortal — Test Technique Frontend BOAZ-STUDY

**Portail multi-espace de gestion étudiante** — React 18 + TypeScript strict + Vite + Tailwind + Zustand + Keycloak.

Ce dépôt est la réponse au test technique BOAZ-STUDY (Spécification v1.0, Cahier de Recette v1.0 — 110 points / 33 scénarios).

---

## Table des matières

1. [Démarrage rapide](#démarrage-rapide)
2. [Profils mock disponibles](#profils-mock-disponibles)
3. [Ce que le test évalue](#ce-que-le-test-évalue)
4. [Pages & modules implémentés](#pages--modules-implémentés)
5. [Architecture](#architecture)
6. [Système de permissions (critique)](#système-de-permissions-critique)
7. [Mocks & indépendance backend](#mocks--indépendance-backend)
8. [Keycloak](#keycloak)
9. [Scripts](#scripts)
10. [Tests](#tests)
11. [Responsive](#responsive)
12. [Technologies](#technologies)

---

## Démarrage rapide

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation & lancement (< 2 min)

```bash
# 1. Installer les dépendances
npm install

# 2. (optionnel) Copier le fichier d'environnement
cp .env.example .env

# 3. Lancer l'application en mode dev
npm run dev
```

L'application est alors disponible sur **http://localhost:5173**.

> **Important** : le projet fonctionne **sans backend ni Keycloak** grâce au mode mock forcé (`VITE_FORCE_MOCK=true`). L'intercepteur Axios bascule automatiquement vers les fixtures locales en cas d'indisponibilité backend. Tu peux lancer l'évaluation directement, sans démarrer de serveur Keycloak.

---

## Profils mock disponibles

Le sélecteur de profils sur la page de login pré-remplit les credentials. Chaque profil a un tableau `authorities[]` distinct — c'est ce qui détermine **tout** le rendu conditionnel de l'UI.

> ⚠️ **Credentials de démonstration uniquement.** Ces identifiants simulent Keycloak via le mode mock. Jamais en production.

| Profil | Email | Mot de passe | Permissions principales |
|---|---|---|---|
| **Administrateur** | `admin@boaz.cm` | `Admin2025!` | Toutes — crée/modifie/supprime tickets et documents, gère notifications |
| **Agent** | `agent@boaz.cm` | `Agent2025!` | `ticket:create/read/update/comment`, `document:upload/read/download`, `notification:read` (pas de `*:delete`) |
| **Utilisateur** | `signing@gmail.com` | pré-rempli dans le sélecteur | `ticket:read/comment`, `document:read/download`, `notification:read` (lecture seule) |

### Comment vérifier la protection par permissions ?

1. Se connecter en **Administrateur** → tous les boutons sont visibles (Créer ticket, Modifier statut, Joindre fichier, Télécharger, badge notifications, etc.)
2. Se déconnecter, se reconnecter en **Utilisateur** → les boutons interdits sont **absents du DOM** (pas d'erreur affichée, juste masqués comme requis par PERM-002)

Source de vérité des permissions : [src/services/mock/auth.mock.ts](src/services/mock/auth.mock.ts)

---

## Ce que le test évalue

| Critère (cahier de recette) | Max | Implémentation |
|---|---|---|
| Authentification Keycloak + login personnalisé | 15 | `keycloak-js` + [LoginPage.tsx](src/portals/auth-portal/pages/LoginPage.tsx) aux couleurs Figma |
| Protection par permissions (authorities, pas roles) | 20 | [usePermissions.ts](src/hooks/usePermissions.ts) + [ProtectedComponent.tsx](src/components/ProtectedComponent.tsx) |
| Mocks + contrats TypeScript + intercepteur Axios | 20 | [api-contracts.ts](src/contracts/api-contracts.ts) + [services/mock/](src/services/mock/) + [api.service.ts](src/services/api.service.ts) |
| Architecture modulaire multi-portail | 15 | [portals/auth-portal](src/portals/auth-portal) + [portals/main-portal](src/portals/main-portal) (feature folders) |
| Qualité visuelle + Figma + responsive | 15 | Tailwind + sidebar drawer mobile + Stepper responsive |
| State management | 10 | Zustand `authStore` + `notificationsStore` |
| Tests unitaires | 10 | 20 tests Vitest (usePermissions, ProtectedComponent, NotificationBadge, store) |
| Qualité code (TS strict, ESLint, README) | 5 | `strict: true`, 0 `any`, ESLint + Prettier |

### Parcours de validation rapide pour l'examinateur

1. `npm install && npm run dev` → login sur `/login`
2. Sélectionner **Administrateur** → voir tous les boutons et modules
3. Naviguer sur `/tickets`, `/documents`, `/notifications` → protégés par permissions
4. Clic sur la cloche du header → centre de notifications avec badge compteur
5. Se déconnecter, se reconnecter en **Utilisateur** → boutons "Créer", "Modifier", "Joindre fichier" absents
6. Redimensionner la fenêtre < 1024px → sidebar mobile (burger dans le header), design compact
7. `npm test` → 20 tests passent

---

## Pages & modules implémentés

**16 pages** réparties dans **2 portails** (`auth-portal`, `main-portal`) et **10 features** isolées. Chaque ligne du tableau est un point de test pour l'examinateur.

### Portail d'authentification (`auth-portal`)

| Page | Route | Quoi tester |
|---|---|---|
| **LoginPage** | `/login` | Design Figma (logo, charte), sélecteur de profils mock (3 boutons), champs email/password, toggle show/hide password, bouton "Mot de passe oublié", bouton "Créer mon compte" |

### Portail principal (`main-portal`) — feature par feature

#### 🏠 Home — `features/home/`
| Page | Route | Permissions | Quoi tester |
|---|---|---|---|
| **HomePage** (utilisateur) | `/` | — | Grille de 4 cartes services (AVI, Logement, Assurance, Financement) cliquables vers leur parcours |
| **AgentHomePage** (agent) | `/` | `ticket:update` détermine le variant | Tableau de bord agent avec illustration pie chart |

> L'URL `/` affiche automatiquement `AgentHomePage` si l'utilisateur a `ticket:update`, sinon `HomePage` utilisateur (voir [AppRouter.tsx:98-101](src/router/AppRouter.tsx#L98-L101)).

#### 🎫 Tickets — `features/tickets/` (OBLIGATOIRE cahier de recette)
| Page | Route | Permissions | Quoi tester |
|---|---|---|---|
| **TicketsPage** | `/tickets` | `ticket:read` (liste), `ticket:create` (bouton), `ticket:update` (bouton par ligne) | **PERM-003** : se connecter en Admin → voir les 3 boutons. Se reconnecter en User → bouton "Créer" et "Modifier le statut" **absents du DOM** |

#### 📄 Documents — `features/documents/` (OBLIGATOIRE cahier de recette)
| Page | Route | Permissions | Quoi tester |
|---|---|---|---|
| **DocumentsPage** | `/documents` | `document:read` (liste), `document:upload` (bouton), `document:download` (par ligne) | Mêmes vérifs de permissions que Tickets |

#### 🔔 Notifications — `features/notifications/`
| Page | Route | Permissions | Quoi tester |
|---|---|---|---|
| **NotificationsPage** | `/notifications` | `notification:read` | Centre complet avec filtres (toutes / non lues), "Tout marquer comme lu", action "Ouvrir" qui navigue vers l'URL de la notif et la marque comme lue |
| **Badge compteur** (header) | — | `notification:read` | Cloche dans le header avec badge rouge du nombre de non lues, plafonné à `99+`. Hydraté automatiquement au login |

#### 💰 Wallet — `features/wallet/`
| Page | Route | Quoi tester |
|---|---|---|
| **WalletDashboardPage** | `/wallet` | BalanceHeroCard (solde + boutons actions), BalanceStatCards (entrées/sorties), aperçu des dernières transactions |
| **TransactionHistoryPage** | `/wallet/historiques` | Tableau filtrable des transactions, modale de détails (`TransactionDetailsModal`) avec bouton de téléchargement de reçu |

#### 💼 Financement — `features/financement/`
| Page | Route | Quoi tester |
|---|---|---|
| **FinancementListPage** | `/financement` | Liste paginée des demandes, filtres par statut, tableau scrollable en mobile |
| **FinancementWizardPage** | `/financement/nouvelle` | **Wizard 6 étapes** : Identité → Personnel → Détails → Justifications → Calendrier → Suivi. Signature électronique (`SignaturePadModal`), upload de proforma (`ProformaModal`), validation inter-étapes |

#### 🛂 AVI (Attestation de Virement Irrévocable) — `features/avi/`
| Page | Route | Quoi tester |
|---|---|---|
| **AviParcoursPage** | `/services/avi` | Cartes d'entrée dans le parcours AVI |
| **AviInstructionsPage** | `/services/avi/instructions` | Liste des instructions / étapes utilisateur avant souscription |
| **AviWizardPage** | `/services/avi/nouvelle` | **Wizard 8 étapes** : Personnel → Formation → Financier → Principe de paiement → Mode de paiement → Infos bancaires → Proforma → Contrat. Signature électronique finale |
| **AviSubscriptionsPage** | `/services/avi/souscriptions` | Liste des souscriptions AVI de l'utilisateur |

#### 🏠 Logement — `features/housing/`
| Page | Route | Quoi tester |
|---|---|---|
| **HousingApplicationPage** | `/services/attestation-logement` | **Wizard 3 étapes** : Personnel → Formation → Financier, avec `SuccessPanel` en fin de parcours |

#### 📎 Preuves de financement — `features/preuves/`
| Page | Route | Quoi tester |
|---|---|---|
| **PreuvesFinancementPage** | `/preuves-de-financement` | Liste + upload des preuves de versement |

#### 👤 Profil — `features/profile/`
| Page | Route | Quoi tester |
|---|---|---|
| **ProfilePage** | `/profile` | 4 onglets : **Infos personnelles** (avec `AvatarEditor`), **Sécurité** (changement mot de passe via `PasswordField`), **2FA** (`TwoFactorTab`), **Notifications** (préférences via `ToggleSwitch`) |

### Composants transverses testables

| Composant | Emplacement | Quoi tester |
|---|---|---|
| **MainLayout** | `components/Layout/MainLayout.tsx` | Shell principal. Sidebar figée ≥ 1024px, drawer mobile avec overlay < 1024px. Préserve le scroll du contenu |
| **Header** | `components/Layout/Header.tsx` | Titre dynamique par route, burger visible < 1024px, badge notifications, menu utilisateur (Paramètres, Déconnexion) |
| **Sidebar** | `components/Layout/Sidebar.tsx` | Variant `user` ou `agent` selon permissions, menus accordéons (Services, Suscriptions, Wallet), bouton fermer en mode drawer mobile |
| **ProtectedComponent** | `components/ProtectedComponent.tsx` | Modes : `requiredPermissions="x"`, `["x","y"]` (any), `requireAll` (all), `fallback` optionnel. **Jamais d'erreur affichée** si permission absente |
| **Stepper** | `components/shared/Stepper.tsx` | Horizontal scrollable en mobile, labels visibles dès `sm:` (640px), descriptions complètes en `lg:` (1024px). Orientation verticale possible |
| **Modal / FeedbackModal** | `components/shared/` | Bottom-sheet en mobile, centré en desktop. Escape key, click outside |

---

## Architecture

```
src/
├── contracts/
│   └── api-contracts.ts          ⚠️ CRITIQUE — AuthUser, Ticket, Document, Notification, ApiResponse<T>, PERMISSIONS
│
├── services/
│   ├── mock/                     ⚠️ CRITIQUE — fixtures + services in-memory
│   │   ├── auth.mock.ts          → 3 profils (ADMIN_USER, AGENT_USER, BASIC_USER)
│   │   ├── tickets.mock.ts
│   │   ├── documents.mock.ts
│   │   ├── notifications.mock.ts
│   │   ├── financement.mock.ts, avi.mock.ts, housing.mock.ts, wallet.mock.ts, profile.mock.ts, preuves.mock.ts
│   │   └── index.ts
│   ├── api.service.ts            ⚠️ CRITIQUE — Axios + intercepteurs (Bearer + fallback mock)
│   └── keycloak.service.ts       ⚠️ CRITIQUE — init keycloak-js, refresh auto, logout
│
├── hooks/
│   ├── usePermissions.ts         ⚠️ CRITIQUE — hasPermission, hasAnyPermission, hasAllPermissions
│   └── useAuth.ts
│
├── components/
│   ├── ProtectedComponent.tsx    ⚠️ CRITIQUE — wrapper qui cache (jamais d'erreur)
│   ├── Layout/                   → MainLayout, Header (burger mobile), Sidebar (drawer < lg)
│   └── shared/                   → Button, Modal, Stepper, ServiceCard, StatusPill, FeedbackModal
│
├── portals/
│   ├── auth-portal/              → Login (Figma + sélecteur de profils mock)
│   └── main-portal/
│       └── features/             → Chaque feature = dossier autonome (pages/, components/, routes.tsx)
│           ├── home/             → HomePage (user) + AgentHomePage
│           ├── tickets/          → liste + création + update (ticket:*)
│           ├── documents/        → liste + upload + download (document:*)
│           ├── notifications/    → centre + badge compteur (notification:read)
│           ├── financement/, avi/, housing/, wallet/, profile/, preuves/
│
├── store/
│   ├── authStore.ts              → user + authorities, persisté dans localStorage
│   └── notificationsStore.ts     → liste + unreadCount + markAsRead, pushLocal (temps réel)
│
├── router/
│   ├── AppRouter.tsx             → React Router v6 + React.lazy sur toutes les pages
│   └── ProtectedRoute.tsx
│
├── tests/                        → 20 tests Vitest
│   ├── hooks/usePermissions.test.ts
│   ├── components/ProtectedComponent.test.tsx
│   ├── components/NotificationBadge.test.tsx
│   └── store/notificationsStore.test.ts
│
├── App.tsx, main.tsx, index.css
```

### Principe : isolation par feature

Chaque feature (`tickets`, `documents`, `notifications`, etc.) possède ses propres `pages/`, `components/`, `routes.tsx`. Aucune feature n'importe d'une autre. Les composants partagés vivent dans [`components/shared/`](src/components/shared).

---

## Système de permissions (critique)

**Règle d'or** : toute la protection UI se fait sur `authorities[]` du JWT. **Jamais** sur `realm_access.roles` (interdit par le cahier de recette). Ce comportement est d'ailleurs couvert par un test dédié ([`usePermissions.test.ts`](src/tests/hooks/usePermissions.test.ts)).

### Hook `usePermissions`

```tsx
import { usePermissions } from '@hooks/usePermissions';
import { PERMISSIONS } from '@contracts/api-contracts';

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

if (hasPermission(PERMISSIONS.TICKET_CREATE)) {
  // ...
}
```

### Composant `ProtectedComponent`

```tsx
import { ProtectedComponent } from '@/components/ProtectedComponent';
import { PERMISSIONS } from '@contracts/api-contracts';

<ProtectedComponent requiredPermissions={PERMISSIONS.TICKET_CREATE}>
  <button>Créer un ticket</button>
</ProtectedComponent>

// Modes avancés
<ProtectedComponent requiredPermissions={['ticket:read', 'ticket:update']}>
  ... {/* visible si AU MOINS UNE permission */}
</ProtectedComponent>

<ProtectedComponent requireAll requiredPermissions={['ticket:read', 'ticket:update']}>
  ... {/* visible si TOUTES les permissions */}
</ProtectedComponent>
```

Quand l'utilisateur n'a pas la permission : le composant est simplement **absent du DOM** (aucun message d'erreur — conformément à PERM-002).

### Mapping des scopes UI

| Scope | Élément UI conditionné |
|---|---|
| `ticket:create` | Bouton "Créer un ticket" |
| `ticket:read` | Liste des tickets, détails |
| `ticket:update` | Bouton "Modifier le statut" |
| `ticket:comment` | Zone de commentaire |
| `document:upload` | Bouton "Joindre un fichier" |
| `document:read` | Liste des documents |
| `document:download` | Bouton "Télécharger" |
| `notification:read` | Badge compteur + centre de notifications |

---

## Mocks & indépendance backend

Le projet démontre la méthode standard "contrats first" :

1. **Contrats** ([api-contracts.ts](src/contracts/api-contracts.ts)) — `AuthUser`, `Ticket`, `Document`, `Notification`, `ApiResponse<T>`, enum `PERMISSIONS`, types stricts partout.
2. **Fixtures** ([services/mock/](src/services/mock/)) — données in-memory pour chaque entité + 3 profils utilisateurs distincts + délais simulés (`setTimeout`).
3. **Intercepteur Axios** ([api.service.ts](src/services/api.service.ts)) :
   - **Request** : injecte automatiquement `Authorization: Bearer <token>`.
   - **Response** : si le backend renvoie une erreur réseau (ou `VITE_FORCE_MOCK=true`), bascule sur les mocks correspondants via `handleMockFallback()`.
   - Gestion transparente du refresh token (401 → retry automatique).

Résultat : le front tourne à 100% offline, mais le jour où le backend existe, il suffira de mettre `VITE_FORCE_MOCK=false` — zéro refactor.

---

## Keycloak

Intégration via **keycloak-js** ([keycloak.service.ts](src/services/keycloak.service.ts)) :

- Configuration lisible via les variables `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID` ([.env.example](.env.example))
- Refresh token automatique toutes les 60s (renouvelle si expire dans < 70s)
- Token stocké côté client et injecté dans chaque requête Axios
- Logout propre (reset store + redirect)
- Page de login **personnalisée** aux couleurs Figma (mode direct grant) — pas de theme Keycloak externe requis

> En mode mock, la page de login bypass Keycloak : on génère un JWT factice via `generateMockToken()` pour les 3 profils prédéfinis. Le flux JWT → `authorities[]` → UI est 100% identique au flux réel.

---

## Scripts

```bash
npm run dev       # Vite dev server (HMR) sur :5173
npm run build     # tsc (strict) + build prod optimisé
npm run preview   # preview du build prod
npm test          # Vitest watch mode
npm run test:ui   # Vitest avec UI graphique
npx vitest run    # Vitest single-run (CI)
npm run lint      # ESLint (zéro warning autorisé)
npm run format    # Prettier
```

---

## Tests

**20 tests unitaires Vitest** couvrant les points critiques du cahier de recette :

| Fichier | Cible | Tests |
|---|---|---|
| [`tests/hooks/usePermissions.test.ts`](src/tests/hooks/usePermissions.test.ts) | Hook permissions | 6 — dont **test dédié "ignore realm_access.roles"** |
| [`tests/components/ProtectedComponent.test.tsx`](src/tests/components/ProtectedComponent.test.tsx) | Wrapper conditionnel | 5 — rendu/absence, array any/requireAll, fallback |
| [`tests/components/NotificationBadge.test.tsx`](src/tests/components/NotificationBadge.test.tsx) | Badge compteur | 4 — permission, count, plafond 99+ |
| [`tests/store/notificationsStore.test.ts`](src/tests/store/notificationsStore.test.ts) | Store Zustand | 5 — hydratation, markAsRead optimiste, pushLocal |

```bash
npx vitest run
# Test Files  4 passed (4)
#      Tests  20 passed (20)
```

---

## Responsive

Stratégie mobile-first. Breakpoint de bascule : **`lg:` (1024px)**.

- **< 1024px** (mobile + tablette) : sidebar cachée, **burger** dans le header, paddings réduits, grilles `grid-cols-1`, Stepper en scroll horizontal avec labels compacts dès 640px.
- **≥ 1024px** (desktop) : sidebar figée comme le Figma, Stepper avec labels et descriptions complètes, paddings Figma exacts.

Filet de sécurité : `html, body { overflow-x: hidden }` dans [`index.css`](src/index.css) pour neutraliser tout débordement résiduel.

---

## Technologies

| Rôle | Techno |
|---|---|
| Framework | React 18 |
| Langage | TypeScript 5 (strict, `noImplicitAny`, `strictNullChecks`) |
| Build | Vite 5 (+ alias `@/`, `@hooks/`, `@contracts/`, `@services/`, `@store/`, `@portals/`) |
| Styles | Tailwind 3 (+ palette brand, Manrope/Nunito/Onest) |
| Auth | keycloak-js 23 |
| HTTP | Axios 1.6 + intercepteurs |
| State | Zustand 4 + middleware `persist` |
| Routing | React Router 6 + `React.lazy` (code splitting par route) |
| Tests | Vitest + Testing Library + happy-dom |
| Quality | ESLint + Prettier, `@typescript-eslint/no-explicit-any: error` |

---

## Contact

Développé pour le test technique BOAZ-STUDY — recrutement@boaz-study.com.
