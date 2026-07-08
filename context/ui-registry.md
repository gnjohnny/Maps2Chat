# UI Registry - Maps2Chat

This registry lists the central reusable component primitives to construct the Maps2Chat operator dashboard.

---

## 1. Application Layout (`client/src/components/layout/AppLayout.tsx`)
- **Structure**: High-level wrapper mapping responsive grid. Includes collapsible sidebar, header panel, and the primary active layout viewport.
- **Tokens/Styles**:
  - Grid: `flex min-h-screen w-full bg-background`
  - Content Wrapper: `flex flex-col flex-1 overflow-hidden`

---

## 2. Navigation Sidebar (`client/src/components/layout/SidebarNav.tsx`)
- **Structure**: Sticky left panel showcasing navigation options, status filters, user session control, and the dark/light mode toggle.
- **Tokens/Styles**:
  - Background: `w-64 border-r bg-card text-card-foreground`
  - Active State Class: `bg-accent text-accent-foreground`
  - Toggle Accent: Muted icons displaying the sun/moon state.

---

## 3. Lead Card (`client/src/components/dashboard/LeadCard.tsx`)
- **Structure**: Visual card representing individual business records. Exposes business name, address, E.164 phone details, fetched time tag, and pipeline control buttons.
- **Tokens/Styles**:
  - Border: `rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow`
  - Status Badge: Standard status indicators mapping the Lead state.
  - Action Controls: Grid of buttons positioned on the right or bottom for mobile views. Disables controls and displays spinning inline loaders (`Loader2`) when active contact/archive mutations are pending.

---

## 4. Status Badge (`client/src/components/ui/StatusBadge.tsx`)
- **Structure**: Multi-state badge showing the current lead lifecycle tag (`PENDING`, `CONTACTED`, `ARCHIVED`).
- **Styles Mapping**:
  | State | Tailwind Class mapping |
  |---|---|
  | `PENDING` | `bg-amber-100/80 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50` |
  | `CONTACTED` | `bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/50` |
  | `ARCHIVED` | `bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400 border-slate-200/50` |

---

## 5. Contact Action Link (`client/src/components/ui/ContactLink.tsx`)
- **Structure**: The native `wa.me` anchor layout. It is configured to construct the hyperlink, open it in a new window, and invoke the TanStack Query patch request to silently transfer lead states.
- **Tokens/Styles**:
  - Button styling: `inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow`
  - WhatsApp Icon: Emerald/white SVG inline icon.
  - Loading State: Dynamically swaps to a disabled button layout rendering a spinning `Loader2` loader and "Opening WhatsApp..." to prevent multiple clicks and communicate state updates.

---

## 6. Manual Ingestion Trigger (`client/src/components/dashboard/ScraperTrigger.tsx`)
- **Structure**: Top header trigger button to manually schedule a run of the background Places scraping daemon.
- **Tokens/Styles**:
  - Trigger Button: `bg-primary text-primary-foreground hover:bg-primary/90`
  - Loading State: Integrates a spinning lucide Loader icon when action is executing.

---

## 7. Confirm Dialog (`client/src/components/ui/ConfirmDialog.tsx`)
- **Structure**: Reusable modal constructed from Dialog primitives to confirm destructive or critical actions (e.g. permanent lead deletion).
- **Tokens/Styles**:
  - Dialog Content: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:max-w-[425px] sm:rounded-lg`
  - Title Text: `text-lg font-semibold leading-none tracking-tight`
  - Description Text: `text-sm text-muted-foreground mt-2`
  - Buttons: Gap-2, Cancel -> `variant="outline"`, Confirm -> `variant="destructive"` (default) or custom variants. Disables interaction and displays a spinning `Loader2` during mutations.

