# Time Tracker Implementation Plan

## Overview
A sophisticated web-based time tracking application with project management and reporting capabilities. Designed for personal use with a focus on "Soft & Organic" aesthetics and high usability.

- **Project Type**: WEB (Next.js)
- **Design Philosophy**: Soft Organic (Rounded 24px+, glassmorphism elements, gentle pastel/muted palette, fluid Framer Motion animations).

## Success Criteria
- [ ] Active timer visible at the top of the page.
- [ ] Task entry with autocomplete from previous tasks.
- [ ] Project/Client selection with color-coding.
- [ ] Project management page (Add/Edit/Color).
- [ ] Grouping entries by project with total time calculation.
- [ ] Reports for day/week/month with CSV export.
- [ ] Deployed on Netlify with Supabase integration.
- [ ] Prompt log maintained in `PROMPTS.md`.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **State Management**: React Context / Hooks for UI state, TanStack Query for server state.
- **Database**: Supabase (PostgreSQL).
- **Animations**: Framer Motion (for the "Soft" feel).
- **Deployment**: Netlify.
- **Testing**: Playwright for E2E.

## File Structure
```text
├── .agent/               # Agent configuration
├── app/                  # Next.js App Router
│   ├── (dashboard)/      # Main timer and task list
│   ├── projects/         # Project management section
│   ├── reports/          # Reporting and exports
│   └── layout.tsx        # Shell with persistent global timer
├── components/           # Reusable UI components
│   ├── ui/               # Primary design system atoms
│   ├── timer/            # Timer-specific components
│   └── charts/           # Visualization components
├── lib/                  # Utilities and Supabase client
│   ├── supabase/         # Client and types
│   └── utils/            # Time calculations, CSV export
├── types/                # Domain entities (TimeEntry, Project)
├── PROMPTS.md            # Prompt history (Required by TЗ)
└── time-tracker.md       # This plan
```

## Task Breakdown

### Phase 1: Foundation & Infrastructure
| ID | Task | Agent | Skills | Dependencies |
|---|---|---|---|---|
| 1.1 | Initialize `PROMPTS.md` with the first prompt | `@orchestrator` | `clean-code` | None |
| 1.2 | Setup Next.js project with Tailwind | `@frontend-specialist` | `app-builder` | 1.1 |
| 1.3 | Create Supabase project and database schema (Projects & TimeEntries) | `@backend-specialist` | `database-design` | 1.2 |
| 1.4 | Generate TypeScript types from Supabase | `@backend-specialist` | `api-patterns` | 1.3 |

### Phase 2: Design System (Soft Organic)
| ID | Task | Agent | Skills | Dependencies |
|---|---|---|---|---|
| 2.1 | Implement global CSS tokens (rounded corners, soft shadows, palettes) | `@frontend-specialist` | `frontend-design` | 1.2 |
| 2.2 | Create core UI Layout with persistent top Timer Bar | `@frontend-specialist` | `frontend-design` | 2.1 |

### Phase 3: Core Functionality
| ID | Task | Agent | Skills | Dependencies |
|---|---|---|---|---|
| 3.1 | Implement Project Management (CRUD + Colors) | `@frontend-specialist` | `react-best-practices` | 1.4, 2.2 |
| 3.2 | Implement Main Timer logic (Start/Stop, Autocomplete Task Name) | `@frontend-specialist` | `react-best-practices` | 3.1 |
| 3.3 | Implement Daily List with manual time editing and grouping | `@frontend-specialist` | `react-best-practices` | 3.2 |

### Phase 4: Reports & Polish
| ID | Task | Agent | Skills | Dependencies |
|---|---|---|---|---|
| 4.1 | Create Reports page (Daily/Weekly/Monthly filtering) | `@frontend-specialist` | `react-best-practices` | 3.3 |
| 4.2 | Implement CSV Export functionality | `@backend-specialist` | `api-patterns` | 4.1 |
| 4.3 | Add Framer Motion transitions and micro-interactions | `@frontend-specialist` | `frontend-design` | 4.1 |

### Phase 5: Verification & Deployment
| ID | Task | Agent | Skills | Dependencies |
|---|---|---|---|---|
| 5.1 | Run UX Audit and Security Scan | `@qa-automation-engineer` | `lint-and-validate` | 4.3 |
| 5.2 | Deploy to Netlify via MCP | `@devops-engineer` | `deployment-patterns` | 5.1 |

## Phase X: Verification Checklist
- [ ] No purple hex codes in any CSS or component.
- [ ] Corners use `rounded-2xl` or `rounded-3xl` for "Soft" effect.
- [ ] All database actions use Supabase client.
- [ ] Prompt log in `PROMPTS.md` is up-to-date.
- [ ] CSV export produces valid data matching the period.
- [ ] All linting and TypeScript checks pass (`npm run lint && tsc`).
