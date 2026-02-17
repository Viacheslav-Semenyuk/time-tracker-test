# Prompt Log

## 2026-02-17
**Prompt 1**: "установи https://github.com/vudovn/antigravity-kit"
- **Result**: Antigravity Kit initialized in `.agent/`.

**Prompt 2**: "прочитай @[AI Developer Test Task.pdf] и сделай план"
- **Result**: Analyzed PDF, created `time-tracker.md` implementation plan.

**Prompt 5**: "добавил Supabase Personal Access Token для MCP"
- **Result**: Successfully authenticated MCP server. Automatically discovered project `derzhyznlprxcoxbuyeq` (time-tracker-test) and applied `schema.sql` via `apply_migration`.

**Prompt 6**: "реализуй основной функционал трекера, отчеты и дизайн"
- **Result**: Built complete dashboard, reports page, and database state management.
- **Action**:
  - Implemented `src/hooks/use-time-tracker.ts` for unified state management.
  - Implemented Soft Organic UI with `framer-motion` in `src/app/page.tsx`.
  - Implemented full Reports with CSV export in `src/app/reports/page.tsx`.
  - Added CRUD for both Tasks and Projects.
  - Adhered to "Indigo" brand color and avoided clichés.

**Prompt 7**: "Fixing React Hooks Error and Project Deletion"
- **Result**: Refactored `Home` component to eliminate hook order violation. Implemented inline project deletion with confirmation.
- **Action**: Divided `Page` into `DashboardView` and `Loading` state logic.

**Prompt 8**: "нельзя редактировать имя project"
- **Result**: Replaced `prompt()` with inline editing for project name and color. Improved UX and stability.
- **Action**: Added `DashboardView` states for project editing and circular color picker UI.

**Prompt 9**: "dropdown в select project кривой шеврон"
- **Result**: Replaced native select arrow with custom `ChevronDown` icon from Lucide. Improved visual consistency and alignment.

**Prompt 10**: "когда редактируешь Recent Tasks item то подтягивать время + запретить ред. если running"
- **Result**: Fixed time reset bug during edit. Disabled editing operations for active timers to prevent data corruption. Improved UX by automatically populating duration fields with exact seconds (hh:mm:ss).

**Prompt 11**: "кнопка reports в интуитивно не понятном месте"
- **Result**: Moved Reports navigation to the header of the Projects section. This more clearly associates analytics with the projects being tracked.

**Prompt 12**: "export csv файл не в формате csv"
- **Result**: Improved CSV generation logic. Added escaping for special characters (commas, quotes) and UTF-8 BOM for better Microsoft Excel compatibility.

**Prompt 13**: "сделай деплой на netlify"
- **Result**: Successfully deployed the application to Netlify as a static export. Initial live URL: `https://time-tracker-test-viacheslav.netlify.app`.
- **Action**: Enabled `output: 'export'` in `next.config.ts`, built the project, and used Netlify MCP tools for deployment.

**Prompt 14**: "удали viacheslav в названии (Netlify)"
- **Result**: Renamed the Netlify site. New URL: `https://time-tracker-test-arctic-web.netlify.app`.

**Prompt 15**: "убедись, что README содержит описание и инструкции + проверь PROMPTS.md"
- **Result**: Completely rewrote `README.md` with features, tech stack, and setup steps. Verified and synchronized `PROMPTS.md`.
