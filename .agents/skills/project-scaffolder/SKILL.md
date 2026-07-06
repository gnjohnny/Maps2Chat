---
name: project-scaffolder
description: Scaffolds a set of comprehensive configuration, architecture, build plan, and design files for a new project. Use this skill when initiating a new project from scratch.
---

# Project Scaffolder Skill

Use this skill when starting a new project. It guides you to build the 10 core markdown files that define the project overview, database/app architecture, styling rules, tokens, code standards, library references, implementation schedule, and component registry.

## Scaffolding Checklist

When starting a new project, create the following files in the workspace root or a designated `context/` or `docs/` folder:

1. **`project-overview.md`** - Clear definition of the app's scope, core user flows, and page routing.
2. **`architecture.md`** - Full technical stack description, folder layout, data schema, and key code boundaries/invariants.
3. **`progress-tracker.md`** - Current development phase, completed features, and the next features to implement.
4. **`build-plan.md`** - Granular, sequential feature implementation plan, following the "UI-first with mock data, then backend wiring" principle.
5. **`code-standards.md`** - Rules for languages, framework conventions, API response shapes, and file organization.
6. **`library-docs.md`** - Project-specific integration patterns and boilerplate code for all major third-party libraries.
7. **`ui-rules.md`** - Layout settings, grids, cards, buttons, inputs, tables, and typography hierarchy.
8. **`ui-tokens.md`** - Design tokens mapped to CSS variables or custom utility configuration (e.g., Tailwind v4 `@theme`).
9. **`ui-registry.md`** - A component inventory tracking built components and their exact applied styles.

---

## File Creation Guidelines

### 1. Project Overview (`project-overview.md`)
* **Objective**: Define what the application is, who it is for, and what is strictly in-scope and out-of-scope.
* **Sections**:
  * **About the Project**: One-paragraph description of the core value proposition.
  * **The Problem It Solves**: Clear statement of the user pain point.
  * **Pages / Routing**: Complete URL route list.
  * **Core User Flows**: Step-by-step walk-throughs of main operations.
  * **Features In Scope**: Bulleted list of every planned feature.
  * **Features Out of Scope**: Bulleted list of explicitly excluded items (crucial for preventing scope creep).
  * **Success Criteria**: Clear metrics for validating the completed project.

### 2. Architecture (`architecture.md`)
* **Objective**: Define the technology stack, data flow patterns, and hard boundaries.
* **Sections**:
  * **Stack Table**: Layer, Tool, and Purpose.
  * **Folder Structure**: Tree diagram of the directory layout.
  * **System Boundaries**: Owner table showing which directories own what logic.
  * **Data Flow Diagrams**: Step-by-step sequence paths for mutations and agent tasks.
  * **Database Schema**: Table descriptions with column names, types, and constraints.
  * **Invariants**: Hard rules the codebase must never violate (e.g., UI components never query database directly).

### 3. Progress Tracker (`progress-tracker.md`)
* **Objective**: Provide a quick status update for developers or agents returning to the project.
* **Sections**:
  * **Current Status**: Active Phase, Last completed item, Next item.
  * **Progress Checklist**: Hierarchical list of features grouped by phase (e.g., `Phase 1 — Foundation`, `Phase 2 — Profile`) with `[x]` and `[ ]` checkboxes.
  * **Decisions Made During Build**: List of design pivot points or architectural adjustments.

### 4. Build Plan (`build-plan.md`)
* **Objective**: Provide a logical development sequence.
* **Core Principle**: Always build the complete UI with mock data first. Ensure it is visually validated by the user before writing any server side database logic, API routes, or complex services.
* **Sections**:
  * Step-by-step implementation descriptions for every checkbox in the `progress-tracker.md`. Each step must describe the **UI components/behavior** and the **Backend/logic** needed.

### 5. Code Standards (`code-standards.md`)
* **Objective**: Enforce consistent formatting and coding practices to avoid code smell or style drift.
* **Sections**:
  * **General Rules**: Design principles (e.g., "Think before writing", "Clean over clever").
  * **Language Conventions**: Specific TypeScript/JavaScript settings (e.g., strict mode, no `any`, types vs interfaces).
  * **Framework Style**: Specific framework rules (e.g., Next.js App Router rules, React 19 API usage).
  * **File/Folder Naming**: kebab-case for folders, PascalCase for components, camelCase for helper files.
  * **API/Action Shapes**: Standard response schemas (e.g., returning `{ success, data, error }`).

### 6. Library Docs (`library-docs.md`)
* **Objective**: Document exact usage and initialization patterns for third-party libraries.
* **Sections**:
  * For each main library (e.g., Database client, Auth SDK, Browser automation, AI SDK, Analytics):
    * Code snippets for initialization.
    * Common query patterns (read, write, update).
    * Integration rules (e.g., closing sessions, flushing events).

### 7. UI Rules (`ui-rules.md`)
* **Objective**: Document spacing, sizing, layout and typography guidelines.
* **Sections**:
  * **Layout**: Standard page max-width, grid layout, padding size.
  * **Cards, Buttons, and Inputs**: Color, borders, radiuses, shadows, padding.
  * **Typography Hierarchy**: Font size, font weight, line height, and color rules for headings, body, and labels.
  * **Invariants**: Strict styling guidelines (e.g., "Never use raw hex colors in components", "Never use built-in Tailwind colors directly").

### 8. UI Tokens (`ui-tokens.md`)
* **Objective**: Define the central theme system.
* **Sections**:
  * **globals.css / theme definition**: The complete CSS variables/custom theme variables file content.
  * **Color Usage Guide**: Contextual color assignments for pages, components, text, status badges, and alerts.

### 9. UI Registry (`ui-registry.md`)
* **Objective**: Keep a running inventory of designed components to foster reuse and visual consistency.
* **Sections**:
  * Bullet list of built components. Each component must contain:
    * File path.
    * Date last updated.
    * Table mapping UI properties (Background, Border, Radius, Spacing, Accent) to exact CSS/Tailwind classes.
    * Pattern notes on design details.
