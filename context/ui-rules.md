# UI Design Rules - Maps2Chat

To ensure the CRM user interface looks stunning, modern, and highly premium, all developers and agents must adhere to the design guidelines described below.

---

## 1. Design Aesthetics & Colors
- **Vibe**: Clean, dark-mode-first slate aesthetics, combined with a vibrant **Emerald green** accent to evoke freshness and growth.
- **Default Theme**: Suppport both dark and light modes using shadcn/ui custom color variables.
- **Palette Rules**:
  - Primary Accent: `Emerald 600` (`#059669`) for light mode, `Emerald 500` (`#10b981`) for dark mode.
  - Backgrounds: Dark Mode -> deep slate (`#0b0f19`); Light Mode -> soft slate/gray (`#f8fafc`).
  - Cards: Dark Mode -> slightly lighter slate (`#111827`); Light Mode -> pure white (`#ffffff`) with subtle borders.

---

## 2. Layout & Spacing System
- **Grid Layout**: 12-column grid system for complex dash layouts.
- **Max Width**: Main dashboard content must be constrained to a maximum width of `1600px` (`max-w-7xl` or `max-w-8xl`).
- **Sidebar**: Sticky left panel with a width of `260px` (`w-64` or `w-68`).
- **Spacing Scale**: Always use tailwind spacing increments:
  - Small Spacing (padding, gaps): `8px` (`p-2` / `gap-2`) or `12px` (`p-3` / `gap-3`).
  - Medium Spacing (card paddings, margins): `16px` (`p-4`) or `24px` (`p-6`).
  - Large Spacing (section splits): `32px` (`my-8` or `space-y-8`).

---

## 3. Typography Hierarchy
- **Font Face**: Use **Geist** or **Inter** font family via system fonts or Google Fonts.
- **Styles**:
  - **App Title**: `24px` (`text-2xl`), semi-bold/bold, tracking tight (`tracking-tight`).
  - **Section Headings (H1/H2)**: `20px` (`text-xl`) or `18px` (`text-lg`), semi-bold.
  - **Card Headers**: `16px` (`text-base`), medium/semi-bold.
  - **Body Text**: `14px` (`text-sm`), regular.
  - **Secondary Labels**: `12px` (`text-xs`), medium, color muted (`text-muted-foreground`).

---

## 4. UI Elements

### State Badges & Indicators
Always map lead pipeline states to distinct, context-relevant colors:
- **`PENDING`**: Amber background with dark amber text (`bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400`).
- **`CONTACTED`**: Emerald/Green background and text (`bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400`).
- **`ARCHIVED`**: Gray/Slate muted background and text (`bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400`).

### Interactive Cards
- **Structure**: Render lead data using structured card overlays.
- **Borders**: Thin borders (`border border-slate-200 dark:border-slate-800`). Never use thick heavy borders.
- **Corners**: Rounded corners using standard `0.5rem` to `0.75rem` radius (`rounded-lg` or `rounded-xl`).
- **Shadows**: Soft, diffuse shadows (`shadow-sm` or `shadow-md`). No hard drop shadows.
- **Hover Effects**: Elevate card slightly on hover (`hover:translate-y-[-2px] transition-transform duration-200`).

### Buttons & Hyperlinks
- **WhatsApp Action Button**: Explicitly styled using Emerald shades (`bg-emerald-600 hover:bg-emerald-700 text-white`). Must render the WhatsApp SVG icon.
- **Archive Button**: Red or gray outline styling to communicate destructive action or storage (`text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20`).

---

## 5. UI Invariants
- **Never use hard-coded hex codes in React components**. Always map styles to Tailwind classes or CSS variables.
- **Responsive design**: The dashboard must remain fully functional and responsive on mobile screen widths (collapsing the sidebar into a drawer or hamburger overlay).
- **Loading Skeleton States**: When query transactions are resolving, components must render a gray pulsing outline loading state skeleton rather than generic loading text.
