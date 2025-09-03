# iRepair v2 PRO — README pour Cursor Agent (Vite / React Router)

> Projet front e‑commerce & réparation iPhone avec design inspiré Apple, estimation de devis, suivi et recherche unifiée.
> ⚠️ Le dépôt contient **un petit exemple frontend déjà “vibe‑codé”** (sections d’accueil, wizard réparations, header/footer, recherche, chatbot).
> L’agent doit le **détecter**, le **préserver**, le **refactorer** et l’**améliorer** (ne pas supprimer).

## 🎯 Objectifs (cohérents avec le code existant)
- Conserver **Vite + React Router** (alias `@` déjà en place), **shadcn/ui**, **Framer Motion**, **Tailwind** (tokens Apple-like déjà définis).
- Ajouter **Zustand** pour la gestion globale, **hooks** personnalisés, **composants UI métier** et **animations réutilisables**.
- Uniformiser la **locale Maroc** : **prix en DH**, formats FR, **téléphone +212**, mentions dans les pages & données mock.
- Renforcer accessibilité (WCAG 2.2 AA) et perf (Core Web Vitals).

## 🧭 Plan d’exécution
1) Dépendances & scripts  
2) Tailwind (compléments, pas de duplication)  
3) Utils & Types  
4) Animations Core (réutilisables)  
5) Hooks personnalisés  
6) Store Zustand + refactor Wizard  
7) UI métier (shadcn + Motion)  
8) Page d’accueil (intégrer animations proposées)  
9) Locale Maroc (DH / +212) + perf  
10) Config Dev & Qualité (Prettier + tests)

## 🧱 Stack détectée
- Vite + React 18 + alias `@`, plugin SWC.
- Tailwind + `tailwindcss-animate` + `@tailwindcss/typography`.
- shadcn/ui (button, card, etc.), framer-motion.
- Pages existantes: Home (sections), Réparations (wizard), Boutique, FAQ.
- Recherche unifiée mock + widget chatbot.

## 🧩 Prompts pour Cursor (synchronisés avec le repo)

### Prompt A — Dépendances & scripts (ajouts minimaux)
Installe **zustand**, **@tailwindcss/forms**, **prettier**.  
Ne réinstalle pas les libs déjà présentes (framer-motion, react-hook-form, zod, typography, react-query).  
Mets à jour `package.json` :
- `"format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""`
Laisse **vite**, **lovable-tagger**, **@vitejs/plugin-react-swc** intacts.

### Prompt B — Tailwind (compléter sans dupliquer)
Active le plugin **`@tailwindcss/forms`** dans `tailwind.config.ts`.  
**Ne pas** écraser les tokens/animations existants (couleurs HSL via CSS vars, keyframes fade/slide/float, shadows, gradients).  
Expose `/playground/tokens` pour visualiser palette/typographies/utilitaires déjà en place.

### Prompt C — Utils & Types
Étends `src/lib/utils.ts` (conserver `cn`) avec :
- `formatPriceDH(amount:number): string` → `"1 490 DH"`
- `formatDateFR(date:Date|string): string`
- `debounce<T>()`, `throttle<T>()`
Crée `src/types/index.ts`: `RepairOrder`, `CustomerInfo`, `RepairStatus = 'recu'|'diagnostic'|'en_attente'|'en_reparation'|'pret'|'livre'`, `ApiResponse<T>`, `PaginationParams`, `NotificationOptions`.  
Ajoute tests unitaires simples.

### Prompt D — Composants d’animation (réutilisables)
Crée `src/components/animations/` :
- `FadeInUp.tsx`, `StaggerContainer.tsx`, `SlideIn.tsx`, `CountUp.tsx`
Puis **refactor** `StatsSection` pour utiliser `CountUp` (à la place du compteur inline).

### Prompt E — Hooks personnalisés
Crée dans `src/hooks/` :
- `useRepairQuote.ts` (plage de prix indicative à partir du modèle/panne)
- `useRepairTracking.ts` (statuts mockés, polling)
- `useLocalStorage.ts`, `useIntersectionObserver.ts`, `useDebounce.ts`
Couvre la logique pure par des tests.

### Prompt F — Store Zustand + refactor Wizard
Crée `src/store/repairStore.ts` (persist des `orders`):
- État: `selectedModel`, `selectedServices[]`, `orders[]`, `loading`, `error?`
- Actions: `setModel`, `toggleService`, `clearSelection`, `computeTotal`, `createOrder`, `updateStatus`
**Refactor** `src/pages/Reparations.tsx` pour consommer le store + `useRepairQuote`.

### Prompt G — UI métier (shadcn + Motion)
Crée `src/components/ui/` :
- `ServiceCard.tsx`, `PhoneSelector.tsx`, `PriceEstimator.tsx`, `StatusBadge.tsx`
Ajoute `/playground/ui` pour la démo.

### Prompt H — Accueil (animations dynamiques)
Intègre les animations proposées (Orbit Gallery Hero, Magnetic Cards, Scroll‑Linked Reveal, Price Pulse, Carousel Depth, Shimmered Glass Header) en **Framer Motion**, respect `prefers-reduced-motion`.

### Prompt I — Locale Maroc + Performance
- Remplace monnaie **€ → DH** (datasets, UI, formatters), téléphone **+212**, mentions géo (Footer, contenus).
- Lazy‑load images (hero, carrousels), code splitting, prefetch routes principales.

### Prompt J — Config Dev & Qualité
- Ajoute **Prettier** et script `format`.
- ESLint TS strict déjà présent → garder.
- Playwright E2E (wizard réparation & panier mock), axe‑core a11y.

## 🎬 Animations dynamiques (rappel)
- Orbit Gallery Hero, Magnetic Cards, Scroll‑Reveal 4 étapes, Price Pulse, Depth Carousel, Shimmered Glass Header (toutes Motion, sobres, accessibles).

## 🗂️ Structure cible
```
src/
  components/
    animations/
    layout/
    sections/
    ui/
  hooks/
  store/
  lib/
  types/
  data/
  pages/
  assets/
  examples/vibe-sample/   # <- déplacer ici les bouts sauvegardés si besoin
```

## 🔒 Garde‑fous
- **Préserver** le vibe‑code existant (sections, wizard, header/footer, recherche, chatbot).
- **Ne pas dupliquer** tokens/animations tailwind déjà définis.
- Pas de logo/propriété Apple. WCAG 2.2 AA.

## ✅ Definition of Done
- Store Zustand + hooks en place et consommés par le wizard.
- Composants d’animation & UI métier livrés + pages playground.
- Locale Maroc (DH / +212) propagée dans UI + données mock.
- Lint/Format/Build OK, tests unitaires verts, E2E de base OK.
