# UI Design Tokens - Maps2Chat

This file defines the theme variables, CSS custom properties, and design tokens mapped to the Tailwind CSS configurations.

---

## 1. CSS Theme Variables (`client/src/index.css`)

Copy this boilerplate directly into the client's global stylesheet to initialize the theme variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;      /* Slate 50 */
    --foreground: 222 47% 11%;      /* Slate 900 */
    
    --card: 0 0% 100%;              /* White */
    --card-foreground: 222 47% 11%; /* Slate 900 */
    
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    
    --primary: 162 84% 39%;         /* Emerald 600 */
    --primary-foreground: 210 40% 98%;
    
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222 47% 11.2%;
    
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    
    --accent: 210 40% 96.1%;
    --accent-foreground: 222 47% 11%;
    
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 162 84% 39%;            /* Emerald 600 */

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;   /* Deep Slate */
    --foreground: 210 40% 98%;      /* Slate 50 */
    
    --card: 222.2 84% 7%;           /* Slate 950 */
    --card-foreground: 210 40% 98%;
    
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    
    --primary: 162 76% 45%;         /* Emerald 500 */
    --primary-foreground: 222.2 84% 4.9%;
    
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 162 76% 45%;            /* Emerald 500 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 2. Tailwind Configuration Map (`client/tailwind.config.js`)

Map these custom variables directly to the Tailwind configuration utility:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 3. UI Colors & Palette Definitions

- **Primary Brand (Emerald)**:
  - Default Active state: `bg-emerald-600` (light) / `bg-emerald-500` (dark).
  - Hover/Focus state: `hover:bg-emerald-700` (light) / `hover:bg-emerald-600` (dark).
  - Subtle backing background: `bg-emerald-500/10` (used for highlight tags or borders).
- **Secondary Actions**:
  - Bordered default action button: `border border-input bg-background hover:bg-accent`.
- **Alert & States**:
  - `PENDING`: `#f59e0b` (Amber 500) base.
  - `CONTACTED`: `#10b981` (Emerald 500) base.
  - `ARCHIVED`: `#64748b` (Slate 500) base.
