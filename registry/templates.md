# Templates (generated — do not edit; `bun run registry:build`)

BoardUI Pro template routes mounted by `src/App.tsx` (dev / `VITE_TEMPLATES`). Each page under `src/pages/templates/` renders exactly one shell from `src/components/application/<domain>/<domain>-shell.tsx`; the shell composes the cards, tables and sidebar listed below and reads its demo data from the domain's `*-data.ts(x)` file. Fork the shell, don't rebuild it. Props for every module are in `props.md`.

| slug | route | domain | what's inside | modules (≤ depth 3 / all) | cards |
|---|---|---|---|---|---|
| ai-chat | `/templates/ai-chat` | ai-chat | BoardUI Pro "AI chat" — VISUAL REFERENCE ONLY (scripted mock thread). | 28 / 48 | 0 |
| ai-image-generation | `/templates/ai-image-generation` | ai-chat | BoardUI Pro "AI image generation" — the AI chat shell on its image-generation scenario (mock). | 28 / 48 | 0 |
| ai-profile | `/templates/ai-profile` | ai-profile | BoardUI Pro "AI profile" — cover card with contributions heatmap, agents bar chart, tokens trend. | 27 / 41 | 4 |
| calendar | `/templates/calendar` | calendar | BoardUI Pro "Calendar" — month grid with event chips, details popover, month switcher, inbox feed. | 27 / 44 | 0 |
| dashboard | `/templates/dashboard` | dashboard | BoardUI Pro "Home Dashboard" — KPI stat cards, revenue trend, earnings, contributions, customers table. | 40 / 46 | 5 |
| finance | `/templates/finance` | finance | BoardUI Pro "Finance" — balance KPIs, cash-flow sankey, spending rings, portfolio bubbles, heatmap, transactions table. | 41 / 48 | 6 |
| hr | `/templates/hr` | hr | BoardUI Pro "HR" — headcount KPIs, recent hires, pipeline, engagement radar, hires vs attrition, employees table. | 43 / 50 | 7 |
| marketing | `/templates/marketing` | marketing | BoardUI Pro "Marketing" — campaign KPIs, acquisition funnel, spend by channel, ROAS, campaigns table. | 43 / 50 | 7 |
| medical | `/templates/medical` | medical | BoardUI Pro "Medical profile" — patient overview: steps, sleep score, activity rings, most-active-days, alerts. | 42 / 48 | 6 |

## ai-chat — `/templates/ai-chat`

BoardUI Pro "AI chat" — VISUAL REFERENCE ONLY (scripted mock thread).

- Page: `src/pages/templates/ai-chat.tsx` (default export `AiChatTemplate`)
- Shell: `AiChatShell` from `@/components/application/ai-chat/ai-chat-shell` — `src/components/application/ai-chat/ai-chat-shell.tsx`, mounted as `<AiChatShell />`
- Shell doc: Full AI chat app: sidebar, resizable code panel, composer with model/effort controls.
- Shell props: `className?: string`, `contained?: boolean = false`, `defaultScenario?: AiChatScenario = "coding-scenario"`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button` — component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tabs/pill-tab` → `PillTab`, `PillTabList` — component (depth 2)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/agent-progress/agent-progress-loading-text` → `AgentProgressLoadingText` — component (depth 2)
- `@/components/application/agent-progress/agent-progress` → `AgentProgress` — component (depth 2)
- `@/components/application/agent-thinking/agent-thinking` → `AgentThinking` — component (depth 2)
- `@/components/application/ai-chat/ai-chat-code-panel` → `AI_CHAT_CODE_THEME`, `AiChatCodePanel` — data/component
- `@/components/application/ai-chat/ai-chat-composer` → `GlassComposer`, `StatusBar` — component (depth 2)
- `@/components/application/ai-chat/ai-chat-container` → `AiChatContainer`, `AiChatScenario` — type/component
- `@/components/application/ai-chat/ai-chat-gallery-panel` → `AiChatGalleryPanel`, `Generation` — type/component
- `@/components/application/ai-chat/ai-chat-menus` → `AddMenu`, `ModelMenu`, `ProjectFolderMenu` — component (depth 3)
- `@/components/application/ai-chat/ai-chat-sidebar` → `AiChatSidebar` — component
- `@/components/application/composer-loader/composer-loader` → `ComposerLoader` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/landing/liquid-glass` → `LIQUID_GLASS_RESET`, `LiquidGlassChip`, `LiquidGlassSurface` — component/util (depth 3)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle`, `useThemeMode` — hook/component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 3)

_20 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- No `*-data` file: the demo rows live inside the domain modules (`@/components/application/ai-chat/ai-chat-code-panel`, `@/components/application/ai-chat/ai-chat-composer`, `@/components/application/ai-chat/ai-chat-container`, `@/components/application/ai-chat/ai-chat-gallery-panel`, `@/components/application/ai-chat/ai-chat-menus`, `@/components/application/ai-chat/ai-chat-sidebar`). Their exported types: `AiChatScenario` (`@/components/application/ai-chat/ai-chat-container`), `Generation` (`@/components/application/ai-chat/ai-chat-gallery-panel`), `AiChatThread` (`@/components/application/ai-chat/ai-chat-sidebar`), `AiChatRepo` (`@/components/application/ai-chat/ai-chat-sidebar`).

### How to adapt

1. Copy `src/components/application/ai-chat/ai-chat-shell.tsx` into `src/pages/<yours>.tsx` (rename `AiChatShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the demo constants inside the domain modules above with real data — keep the exported types listed under Data.
3. Swap the nav items in the sidebar: `src/components/application/ai-chat/ai-chat-sidebar.tsx`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## ai-image-generation — `/templates/ai-image-generation`

BoardUI Pro "AI image generation" — the AI chat shell on its image-generation scenario (mock).

- Page: `src/pages/templates/ai-image-generation.tsx` (default export `AiImageGenerationTemplate`)
- Shell: `AiChatShell` from `@/components/application/ai-chat/ai-chat-shell` — `src/components/application/ai-chat/ai-chat-shell.tsx`, mounted as `<AiChatShell defaultScenario="image-generation" />`
- Shell doc: Full AI chat app: sidebar, resizable code panel, composer with model/effort controls.
- Shell props: `className?: string`, `contained?: boolean = false`, `defaultScenario?: AiChatScenario = "coding-scenario"`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button` — component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tabs/pill-tab` → `PillTab`, `PillTabList` — component (depth 2)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/agent-progress/agent-progress-loading-text` → `AgentProgressLoadingText` — component (depth 2)
- `@/components/application/agent-progress/agent-progress` → `AgentProgress` — component (depth 2)
- `@/components/application/agent-thinking/agent-thinking` → `AgentThinking` — component (depth 2)
- `@/components/application/ai-chat/ai-chat-code-panel` → `AI_CHAT_CODE_THEME`, `AiChatCodePanel` — data/component
- `@/components/application/ai-chat/ai-chat-composer` → `GlassComposer`, `StatusBar` — component (depth 2)
- `@/components/application/ai-chat/ai-chat-container` → `AiChatContainer`, `AiChatScenario` — type/component
- `@/components/application/ai-chat/ai-chat-gallery-panel` → `AiChatGalleryPanel`, `Generation` — type/component
- `@/components/application/ai-chat/ai-chat-menus` → `AddMenu`, `ModelMenu`, `ProjectFolderMenu` — component (depth 3)
- `@/components/application/ai-chat/ai-chat-sidebar` → `AiChatSidebar` — component
- `@/components/application/composer-loader/composer-loader` → `ComposerLoader` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/landing/liquid-glass` → `LIQUID_GLASS_RESET`, `LiquidGlassChip`, `LiquidGlassSurface` — component/util (depth 3)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle`, `useThemeMode` — hook/component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 3)

_20 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- No `*-data` file: the demo rows live inside the domain modules (`@/components/application/ai-chat/ai-chat-code-panel`, `@/components/application/ai-chat/ai-chat-composer`, `@/components/application/ai-chat/ai-chat-container`, `@/components/application/ai-chat/ai-chat-gallery-panel`, `@/components/application/ai-chat/ai-chat-menus`, `@/components/application/ai-chat/ai-chat-sidebar`). Their exported types: `AiChatScenario` (`@/components/application/ai-chat/ai-chat-container`), `Generation` (`@/components/application/ai-chat/ai-chat-gallery-panel`), `AiChatThread` (`@/components/application/ai-chat/ai-chat-sidebar`), `AiChatRepo` (`@/components/application/ai-chat/ai-chat-sidebar`).

### How to adapt

1. Copy `src/components/application/ai-chat/ai-chat-shell.tsx` into `src/pages/<yours>.tsx` (rename `AiChatShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the demo constants inside the domain modules above with real data — keep the exported types listed under Data.
3. Swap the nav items in the sidebar: `src/components/application/ai-chat/ai-chat-sidebar.tsx`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## ai-profile — `/templates/ai-profile`

BoardUI Pro "AI profile" — cover card with contributions heatmap, agents bar chart, tokens trend.

- Page: `src/pages/templates/ai-profile.tsx` (default export `AiProfileTemplate`)
- Shell: `AiProfileShell` from `@/components/application/ai-profile/ai-profile-shell` — `src/components/application/ai-profile/ai-profile-shell.tsx`, mounted as `<AiProfileShell />`
- Shell doc: Same floating sidebar / mobile-drawer shell as `MedicalShell` — the content is a single centered 680px column: profile card, agents bar chart, tokens line chart, stacked with a 16px gap.
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar` — component (depth 3)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/buttons/button` → `Button` — component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component
- `@/components/base/date-picker/shared` → `ChevronLeft16`, `ChevronRight16`, `DateChipInput`, `MonthPanel`, `formatTriggerDate`, `popoverClassName`, `triggerButtonClassName` — component/util (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/segmented-control/segmented-control` → `SegmentedControl`, `SegmentedControlItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 3)

**application**
- `@/components/application/ai-profile/agents-chart-card` → `AgentsChartCard` — component
- `@/components/application/ai-profile/ai-profile-card` → `AiProfileCard` — component
- `@/components/application/ai-profile/ai-profile-data` → `AGENTS_TRACK_HEIGHT`, `AGENTS_ZERO_BAR`, `MONTH_NAMES`, `TOKENS_SERIES`, `agentBarsFor`, `agentCountFor` — data/util (depth 2)
- `@/components/application/ai-profile/tokens-chart-card` → `TokensChartCard` — component
- `@/components/application/dashboard/contributions-card` → `ContributionsGrid` — component (depth 2)
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/medical/week-range-pill` → `WeekRangePill` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 3)

_14 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/ai-profile/ai-profile-data.ts` — Mock data for the AI contributions profile template (Figma node 4063:5675).
  - data: `MONTH_NAMES: array(12)`, `AGENTS_TRACK_HEIGHT: number`, `AGENTS_MAX_BAR: number`, `AGENTS_ZERO_BAR: number`, `TOKENS_SERIES: [ 34.2, 28.6, 6.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31.4, 4.8, 2.2, 1.1, 5.6, 1.4, 0.…`
  - helpers: `agentBarsFor(month: number) => number[]`, `agentCountFor(month: number) => number`

### How to adapt

1. Copy `src/components/application/ai-profile/ai-profile-shell.tsx` into `src/pages/<yours>.tsx` (rename `AiProfileShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/ai-profile/ai-profile-data.ts` with real data (fetch or props) — keep the shapes.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="profile"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## calendar — `/templates/calendar`

BoardUI Pro "Calendar" — month grid with event chips, details popover, month switcher, inbox feed.

- Page: `src/pages/templates/calendar.tsx` (default export `CalendarTemplate`)
- Shell: `CalendarShell` from `@/components/application/calendar/calendar-shell` — `src/components/application/calendar/calendar-shell.tsx`, mounted as `<CalendarShell />`
- Shell doc: Same responsive shell as `DashboardShell` (floating sidebar in-flow at `lg`+, slide-in drawer with backdrop below it) — mirrored here rather than shared, since the two templates' main content differs…
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/date-picker/shared` → `DateChipInput`, `MonthPanel`, `formatTriggerDate`, `popoverClassName`, `triggerButtonClassName` — util/component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)

**application**
- `@/components/application/calendar/calendar-data` → `CALENDAR_SHOWCASE_MONTH`, `CalendarEvent`, `CalendarEventColor`, `WEEKDAY_LABELS`, `eventDetails`, `eventsForDate`, `monthGrid` — type/util/data
- `@/components/application/calendar/calendar-header` → `CalendarHeader` — component
- `@/components/application/calendar/calendar-inbox-menu` → `CalendarInboxMenu` — component (depth 2)
- `@/components/application/calendar/calendar-month-grid` → `CalendarMonthGrid` — component
- `@/components/application/calendar/calendar-month-switcher` → `CalendarMonthSwitcher` — component (depth 2)
- `@/components/application/calendar/event-details-modal` → `EventDetailsModal` — component (depth 2)
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 3)

_17 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/calendar/calendar-data.ts` — Event data for the calendar template.
  - data: `CALENDAR_EVENTS: Record<string, CalendarEvent[]>`, `CALENDAR_SHOWCASE_MONTH: CalendarDate`, `WEEKDAY_LABELS: array(7)`
  - helpers: `eventDetails(event: CalendarEvent) => ResolvedEventDetails`, `eventsForDate(date: CalendarDate) => CalendarEvent[]`, `monthGrid(monthStart: CalendarDate) => CalendarDate[]`
  - exported types: `CalendarEventColor`, `ParticipantColor`, `EventParticipant`, `CalendarEvent`, `ResolvedEventDetails`
  - shapes to keep: `CalendarEvent` (`@/components/application/calendar/calendar-data`), `CalendarEventColor` (`@/components/application/calendar/calendar-data`), `ParticipantColor` (`@/components/application/calendar/calendar-data`), `EventParticipant` (`@/components/application/calendar/calendar-data`), `ResolvedEventDetails` (`@/components/application/calendar/calendar-data`)

### How to adapt

1. Copy `src/components/application/calendar/calendar-shell.tsx` into `src/pages/<yours>.tsx` (rename `CalendarShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/calendar/calendar-data.ts` with real data (fetch or props) — keep the shapes: `CalendarEvent`, `CalendarEventColor`, `ParticipantColor`, `EventParticipant`, `ResolvedEventDetails`.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="calendar"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## dashboard — `/templates/dashboard`

BoardUI Pro "Home Dashboard" — KPI stat cards, revenue trend, earnings, contributions, customers table.

- Page: `src/pages/templates/dashboard.tsx` (default export `DashboardTemplate`)
- Shell: `DashboardShell` from `@/components/application/dashboard/dashboard-shell` — `src/components/application/dashboard/dashboard-shell.tsx`, mounted as `<DashboardShell />`
- Shell doc: Responsive layout host for the dashboard template. lg+ sidebar sits in-flow (collapsible via its own control) below lg sidebar is hidden; the header shows a hamburger that opens it as a slide-in draw…
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/badges/status-dot` → `StatusDot` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/checkbox/checkbox-glyph` → `CheckboxGlyph`, `CheckboxSize`, `checkboxSizes` — type/util/component (depth 3)
- `@/components/base/checkbox/checkbox` → `Checkbox` — component (depth 2)
- `@/components/base/dropdown/dropdown` → `Dropdown`, `DropdownGroup`, `DropdownItem`, `DropdownPopover`, `DropdownTrigger` — component (depth 2)
- `@/components/base/dropdown/menu-styles` → `MENU_ITEM`, `MENU_ITEMS_CONTAINER`, `MENU_ITEM_ACTIVE`, `MENU_ITEM_INTERACTIVE`, `MENU_POPOVER_SURFACE`, `MENU_POPOVER_WIDTH` — util (depth 3)
- `@/components/base/input/hint-text` → `HintText` — component (depth 3)
- `@/components/base/input/input` → `Input`, `InputBase` — component (depth 2)
- `@/components/base/input/label` → `Label` — component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/pagination/pagination` → `Pagination` — component (depth 2)
- `@/components/base/segmented-control/segmented-control` → `SegmentedControl`, `SegmentedControlItem` — component (depth 2)
- `@/components/base/select/select` → `Select`, `SelectItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/dashboard/contributions-card` → `ContributionsCard` — component
- `@/components/application/dashboard/customers-table` → `CustomersTable` — component
- `@/components/application/dashboard/dashboard-header` → `DashboardHeader` — component
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/dashboard/earnings-chart-card` → `EarningsChartCard` — component
- `@/components/application/dashboard/line-chart-card` → `LineChartCard` — component
- `@/components/application/dashboard/recent-hires-card` → `RecentHiresCard` — component
- `@/components/application/dashboard/stat-cards` → `StatCards` — component
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 2)

_6 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- No `*-data` file: the demo rows live inside the domain modules (`@/components/application/dashboard/contributions-card`, `@/components/application/dashboard/customers-table`, `@/components/application/dashboard/dashboard-header`, `@/components/application/dashboard/dashboard-sidebar`, `@/components/application/dashboard/dashboard-team-menu`, `@/components/application/dashboard/dashboard-user-menu`, `@/components/application/dashboard/earnings-chart-card`, `@/components/application/dashboard/line-chart-card`, `@/components/application/dashboard/recent-hires-card`, `@/components/application/dashboard/stat-cards`). Their exported types: `Accent` (`@/components/application/dashboard/contributions-card`), `DashboardNavItem` (`@/components/application/dashboard/dashboard-sidebar`), `DashboardNavKey` (`@/components/application/dashboard/dashboard-sidebar`), `LineChartShape` (`@/components/application/dashboard/line-chart-card`), `StatCardsVariant` (`@/components/application/dashboard/stat-cards`), `StatTone` (`@/components/application/dashboard/stat-cards`), `Stat` (`@/components/application/dashboard/stat-cards`).

### How to adapt

1. Copy `src/components/application/dashboard/dashboard-shell.tsx` into `src/pages/<yours>.tsx` (rename `DashboardShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the demo constants inside the domain modules above with real data — keep the exported types listed under Data.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## finance — `/templates/finance`

BoardUI Pro "Finance" — balance KPIs, cash-flow sankey, spending rings, portfolio bubbles, heatmap, transactions table.

- Page: `src/pages/templates/finance.tsx` (default export `FinanceTemplate`)
- Shell: `FinanceShell` from `@/components/application/finance/finance-shell` — `src/components/application/finance/finance-shell.tsx`, mounted as `<FinanceShell />`
- Shell doc: Finance template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/badges/status-dot` → `StatusDot` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/checkbox/checkbox-glyph` → `CheckboxGlyph`, `CheckboxSize`, `checkboxSizes` — type/util/component (depth 3)
- `@/components/base/checkbox/checkbox` → `Checkbox` — component (depth 2)
- `@/components/base/dropdown/dropdown` → `Dropdown`, `DropdownGroup`, `DropdownItem`, `DropdownPopover`, `DropdownTrigger` — component (depth 2)
- `@/components/base/dropdown/menu-styles` → `MENU_ITEM`, `MENU_ITEMS_CONTAINER`, `MENU_ITEM_ACTIVE`, `MENU_ITEM_INTERACTIVE`, `MENU_POPOVER_SURFACE`, `MENU_POPOVER_WIDTH` — util (depth 3)
- `@/components/base/input/hint-text` → `HintText` — component (depth 3)
- `@/components/base/input/input` → `Input`, `InputBase` — component (depth 2)
- `@/components/base/input/label` → `Label` — component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/pagination/pagination` → `Pagination` — component (depth 2)
- `@/components/base/select/select` → `Select`, `SelectItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/charts/chart-card` → `ChartCard`, `ChartCenterReadout`, `ChartHeader`, `ChartLegend`, `ChartRange`, `ChartStatTiles`, `ChartTone`, `describeDelta`, `formatNumber`, `resolveTone`, `useChartRange` — type/util/component/hook (depth 2)
- `@/components/application/charts/heatmap-chart-card` → `HeatmapChartCard`, `HeatmapRange`, `HeatmapRow` — type/component
- `@/components/application/charts/radial-chart-card` → `RadialChartCard`, `RadialRange` — type/component
- `@/components/application/charts/sankey-chart-card` → `SankeyChartCard`, `SankeyLinkDatum`, `SankeyNodeDatum`, `SankeyRange` — type/component
- `@/components/application/charts/scatter-chart-card` → `ScatterChartCard`, `ScatterRange`, `ScatterSeries` — type/component
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/dashboard/stat-cards` → `Stat`, `StatCards` — type/component
- `@/components/application/finance/finance-data` → `CASH_FLOW_RANGES`, `FINANCE_STATS`, `PORTFOLIO_RANGES`, `SPENDING_HEAT_RANGES`, `SPENDING_RANGES`, `currency`, `percent` — util/data
- `@/components/application/finance/finance-header` → `FinanceHeader` — component
- `@/components/application/finance/transactions-table` → `TransactionsTable` — component
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 2)

_7 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/finance/finance-data.tsx` — Demo datasets for the finance template — the cash-flow sankey, spending rings, portfolio scatter, and spending heatmap all read from here so the numbers stay consistent (the sankey's income matches t…
  - data: `FINANCE_STATS: Stat[]`, `CASH_FLOW_NODES: SankeyNodeDatum[]`, `CASH_FLOW_RANGES: SankeyRange[]`, `SPENDING_RANGES: RadialRange[]`, `PORTFOLIO_SERIES: ScatterSeries[]`, `PORTFOLIO_RANGES: ScatterRange[]`, `SPENDING_WEEK_COLUMNS: Array.from(…)`, `SPENDING_HEAT_RANGES: HeatmapRange[]`
  - helpers: `currency(n: number)`, `percent(n: number)`
  - shapes to keep: `Stat` (`@/components/application/dashboard/stat-cards`), `SankeyNodeDatum` (`@/components/application/charts/sankey-chart-card`), `SankeyRange` (`@/components/application/charts/sankey-chart-card`), `RadialRange` (`@/components/application/charts/radial-chart-card`), `ScatterSeries` (`@/components/application/charts/scatter-chart-card`), `ScatterRange` (`@/components/application/charts/scatter-chart-card`), `HeatmapRange` (`@/components/application/charts/heatmap-chart-card`)

### How to adapt

1. Copy `src/components/application/finance/finance-shell.tsx` into `src/pages/<yours>.tsx` (rename `FinanceShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/finance/finance-data.tsx` with real data (fetch or props) — keep the shapes: `Stat`, `SankeyNodeDatum`, `SankeyRange`, `RadialRange`, `ScatterSeries`, `ScatterRange`, `HeatmapRange`.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="finance"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## hr — `/templates/hr`

BoardUI Pro "HR" — headcount KPIs, recent hires, pipeline, engagement radar, hires vs attrition, employees table.

- Page: `src/pages/templates/hr.tsx` (default export `HrTemplate`)
- Shell: `HrShell` from `@/components/application/hr/hr-shell` — `src/components/application/hr/hr-shell.tsx`, mounted as `<HrShell />`
- Shell doc: HR management template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/badges/status-dot` → `StatusDot` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/checkbox/checkbox-glyph` → `CheckboxGlyph`, `CheckboxSize`, `checkboxSizes` — type/util/component (depth 3)
- `@/components/base/checkbox/checkbox` → `Checkbox` — component (depth 2)
- `@/components/base/dropdown/dropdown` → `Dropdown`, `DropdownGroup`, `DropdownItem`, `DropdownPopover`, `DropdownTrigger` — component (depth 2)
- `@/components/base/dropdown/menu-styles` → `MENU_ITEM`, `MENU_ITEMS_CONTAINER`, `MENU_ITEM_ACTIVE`, `MENU_ITEM_INTERACTIVE`, `MENU_POPOVER_SURFACE`, `MENU_POPOVER_WIDTH` — util (depth 3)
- `@/components/base/input/hint-text` → `HintText` — component (depth 3)
- `@/components/base/input/input` → `Input`, `InputBase` — component (depth 2)
- `@/components/base/input/label` → `Label` — component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/pagination/pagination` → `Pagination` — component (depth 2)
- `@/components/base/select/select` → `Select`, `SelectItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tabs/tabs` → `Tab`, `TabList`, `TabPanel`, `Tabs` — component (depth 2)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/charts/bar-list-card` → `BarListCard`, `BarListTab` — type/component
- `@/components/application/charts/chart-card` → `ChartCard`, `ChartHeader`, `ChartLegend`, `ChartRange`, `ChartStatTiles`, `MONO_TONE`, `describeDelta`, `formatNumber`, `resolveTone`, `useChartRange` — util/data/component/type/hook (depth 2)
- `@/components/application/charts/combo-chart-card` → `ComboChartCard`, `ComboPoint`, `ComboRange`, `ComboSeries` — type/component
- `@/components/application/charts/radar-chart-card` → `RadarChartCard`, `RadarPoint`, `RadarRange` — type/component
- `@/components/application/charts/stage-bars-card` → `StageBar`, `StageBarsCard`, `StageBarsRange` — type/component
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/dashboard/recent-hires-card` → `RecentHiresCard` — component
- `@/components/application/dashboard/stat-cards` → `Stat`, `StatCards` — type/component
- `@/components/application/hr/employees-table` → `EmployeesTable` — component
- `@/components/application/hr/hr-data` → `ATTRITION_LINE`, `ENGAGEMENT_RANGES`, `GROWTH_RANGES`, `HIRES_BAR`, `HR_STATS`, `PIPELINE_RANGES`, `TEAM_TABS` — data
- `@/components/application/hr/hr-header` → `HrHeader` — component
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 2)

_7 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/hr/hr-data.tsx` — Demo datasets for the HR template — the hiring pipeline, engagement radar, hires-vs-attrition combo, and team breakdown lists all read from here so the numbers stay consistent (the pipeline's hires m…
  - data: `HR_STATS: Stat[]`, `PIPELINE_RANGES: StageBarsRange[]`, `ENGAGEMENT_RANGES: RadarRange[]`, `HIRES_BAR: ComboSeries`, `ATTRITION_LINE: ComboSeries`, `GROWTH_RANGES: ComboRange[]`, `TEAM_TABS: BarListTab[]`
  - shapes to keep: `Stat` (`@/components/application/dashboard/stat-cards`), `StageBarsRange` (`@/components/application/charts/stage-bars-card`), `RadarRange` (`@/components/application/charts/radar-chart-card`), `ComboSeries` (`@/components/application/charts/combo-chart-card`), `ComboRange` (`@/components/application/charts/combo-chart-card`), `BarListTab` (`@/components/application/charts/bar-list-card`)

### How to adapt

1. Copy `src/components/application/hr/hr-shell.tsx` into `src/pages/<yours>.tsx` (rename `HrShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/hr/hr-data.tsx` with real data (fetch or props) — keep the shapes: `Stat`, `StageBarsRange`, `RadarRange`, `ComboSeries`, `ComboRange`, `BarListTab`.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="hr"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## marketing — `/templates/marketing`

BoardUI Pro "Marketing" — campaign KPIs, acquisition funnel, spend by channel, ROAS, campaigns table.

- Page: `src/pages/templates/marketing.tsx` (default export `MarketingTemplate`)
- Shell: `MarketingShell` from `@/components/application/marketing/marketing-shell` — `src/components/application/marketing/marketing-shell.tsx`, mounted as `<MarketingShell />`
- Shell doc: Marketing analytics template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/badges/status-dot` → `StatusDot` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/checkbox/checkbox-glyph` → `CheckboxGlyph`, `CheckboxSize`, `checkboxSizes` — type/util/component (depth 3)
- `@/components/base/checkbox/checkbox` → `Checkbox` — component (depth 2)
- `@/components/base/dropdown/dropdown` → `Dropdown`, `DropdownGroup`, `DropdownItem`, `DropdownPopover`, `DropdownTrigger` — component (depth 2)
- `@/components/base/dropdown/menu-styles` → `MENU_ITEM`, `MENU_ITEMS_CONTAINER`, `MENU_ITEM_ACTIVE`, `MENU_ITEM_INTERACTIVE`, `MENU_POPOVER_SURFACE`, `MENU_POPOVER_WIDTH` — util (depth 3)
- `@/components/base/input/hint-text` → `HintText` — component (depth 3)
- `@/components/base/input/input` → `Input`, `InputBase` — component (depth 2)
- `@/components/base/input/label` → `Label` — component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/pagination/pagination` → `Pagination` — component (depth 2)
- `@/components/base/select/select` → `Select`, `SelectItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tabs/tabs` → `Tab`, `TabList`, `TabPanel`, `Tabs` — component (depth 2)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/charts/area-chart-card` → `AreaChartCard`, `AreaPoint`, `AreaRange`, `AreaSeries` — type/component
- `@/components/application/charts/bar-list-card` → `BarListCard`, `BarListTab` — type/component
- `@/components/application/charts/chart-card` → `ChartCard`, `ChartCenterReadout`, `ChartHeader`, `ChartLegend`, `ChartRange`, `ChartStatTiles`, `MONO_TONE`, `describeDelta`, `formatNumber`, `resolveTone`, `useChartRange` — util/data/component/type/hook (depth 2)
- `@/components/application/charts/combo-chart-card` → `ComboChartCard`, `ComboPoint`, `ComboRange`, `ComboSeries` — type/component
- `@/components/application/charts/funnel-chart-card` → `FunnelChartCard`, `FunnelRange` — type/component
- `@/components/application/charts/radial-chart-card` → `RadialChartCard`, `RadialDatum`, `RadialRange` — type/component
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/dashboard/stat-cards` → `Stat`, `StatCards` — type/component
- `@/components/application/marketing/campaigns-table` → `CampaignsTable` — component
- `@/components/application/marketing/marketing-data` → `FUNNEL_RANGES`, `MARKETING_STATS`, `ROAS_LINE`, `SPEND_BAR`, `SPEND_RANGES`, `SPEND_ROAS_RANGES`, `TRAFFIC_TABS`, `VISITOR_RANGES`, `VISITOR_SERIES`, `compactNumber`, `currency` — util/data
- `@/components/application/marketing/marketing-header` → `MarketingHeader` — component
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 2)

_7 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/marketing/marketing-data.tsx` — Demo datasets for the marketing template — every chart card on the screen reads from here, so the numbers stay consistent with each other (the funnel ends where the KPI conversions start, spend match…
  - data: `MARKETING_STATS: Stat[]`, `FUNNEL_RANGES: FunnelRange[]`, `SPEND_RANGES: RadialRange[]`, `TRAFFIC_TABS: BarListTab[]`, `SPEND_BAR: ComboSeries`, `ROAS_LINE: ComboSeries`, `SPEND_ROAS_RANGES: ComboRange[]`, `VISITOR_SERIES: AreaSeries[]`, `VISITOR_RANGES: AreaRange[]`
  - helpers: `currency(n: number)`, `compactCurrency(n: number)`, `compactNumber(n: number)`, `multiplier(n: number)`
  - shapes to keep: `Stat` (`@/components/application/dashboard/stat-cards`), `FunnelRange` (`@/components/application/charts/funnel-chart-card`), `RadialRange` (`@/components/application/charts/radial-chart-card`), `BarListTab` (`@/components/application/charts/bar-list-card`), `ComboSeries` (`@/components/application/charts/combo-chart-card`), `ComboRange` (`@/components/application/charts/combo-chart-card`), `AreaSeries` (`@/components/application/charts/area-chart-card`), `AreaRange` (`@/components/application/charts/area-chart-card`)

### How to adapt

1. Copy `src/components/application/marketing/marketing-shell.tsx` into `src/pages/<yours>.tsx` (rename `MarketingShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/marketing/marketing-data.tsx` with real data (fetch or props) — keep the shapes: `Stat`, `FunnelRange`, `RadialRange`, `BarListTab`, `ComboSeries`, `ComboRange`, `AreaSeries`, `AreaRange`.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="marketing"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.

## medical — `/templates/medical`

BoardUI Pro "Medical profile" — patient overview: steps, sleep score, activity rings, most-active-days, alerts.

- Page: `src/pages/templates/medical.tsx` (default export `MedicalTemplate`)
- Shell: `MedicalShell` from `@/components/application/medical/medical-shell` — `src/components/application/medical/medical-shell.tsx`, mounted as `<MedicalShell />`
- Shell doc: Same floating sidebar / mobile-drawer shell as `DashboardShell` and `CalendarShell` — two rows of three 330px-tall cards (node 3950:5655), then the patients table.
- Shell props: `contained?: boolean = false`

### Component subtree (imports walked to depth 3)

**base**
- `@/components/base/avatar/avatar` → `Avatar`, `AvatarProps` — type/component (depth 2)
- `@/components/base/badges/badge` → `Badge` — component (depth 2)
- `@/components/base/badges/chip` → `Chip` — component (depth 2)
- `@/components/base/breadcrumb/breadcrumb` → `Breadcrumb`, `BreadcrumbItem` — component (depth 2)
- `@/components/base/buttons/button` → `Button`, `ButtonProps` — type/component (depth 2)
- `@/components/base/buttons/close-button` → `CloseButton` — component (depth 2)
- `@/components/base/buttons/icon-button` → `IconButton` — component (depth 2)
- `@/components/base/checkbox/checkbox-glyph` → `CheckboxGlyph`, `CheckboxSize`, `checkboxSizes` — type/util/component (depth 3)
- `@/components/base/checkbox/checkbox` → `Checkbox` — component (depth 2)
- `@/components/base/date-picker/shared` → `ChevronLeft16`, `ChevronRight16`, `DateChipInput`, `MonthPanel`, `formatTriggerDate`, `popoverClassName`, `triggerButtonClassName` — component/util (depth 3)
- `@/components/base/dropdown/dropdown` → `Dropdown`, `DropdownGroup`, `DropdownItem`, `DropdownPopover`, `DropdownTrigger` — component (depth 2)
- `@/components/base/dropdown/menu-styles` → `MENU_ITEM`, `MENU_ITEMS_CONTAINER`, `MENU_ITEM_ACTIVE`, `MENU_ITEM_INTERACTIVE`, `MENU_POPOVER_SURFACE`, `MENU_POPOVER_WIDTH` — util (depth 3)
- `@/components/base/input/hint-text` → `HintText` — component (depth 3)
- `@/components/base/input/input` → `Input`, `InputBase` — component (depth 2)
- `@/components/base/input/label` → `Label` — component (depth 3)
- `@/components/base/kbd/kbd` → `Kbd` — component (depth 2)
- `@/components/base/pagination/pagination` → `Pagination` — component (depth 2)
- `@/components/base/select/select` → `Select`, `SelectItem` — component (depth 2)
- `@/components/base/switch/switch` → `Switch`, `SwitchTrack` — component (depth 3)
- `@/components/base/tooltip/tooltip` → `Tooltip`, `TooltipTrigger` — component (depth 2)

**application**
- `@/components/application/dashboard/dashboard-sidebar` → `DashboardSidebar` — component
- `@/components/application/dashboard/dashboard-team-menu` → `DashboardTeamMenu` — component (depth 2)
- `@/components/application/dashboard/dashboard-user-menu` → `DashboardUserMenu` — component (depth 2)
- `@/components/application/medical/activity-rings-card` → `ActivityRingsCard` — component
- `@/components/application/medical/important-alerts-card` → `ImportantAlertsCard` — component
- `@/components/application/medical/medical-data` → `MONTHS`, `SelectedDay`, `YEAR`, `dayActivity`, `ringPct` — data/util/type
- `@/components/application/medical/medical-header` → `MedicalHeader` — component
- `@/components/application/medical/most-active-days-card` → `MostActiveDaysCard` — component
- `@/components/application/medical/patient-info-card` → `PatientInfoCard` — component
- `@/components/application/medical/patients-table` → `PatientsTable` — component
- `@/components/application/medical/sleep-score-card` → `SleepScoreCard` — component
- `@/components/application/medical/steps-card` → `StepsCard` — component
- `@/components/application/medical/week-range-pill` → `WeekRangePill` — component (depth 2)
- `@/components/application/notification-center/notification-center` → `NotificationCenter`, `NotificationCenterItem` — type/component (depth 3)
- `@/components/application/notification-center/template-notification-center-menu` → `TemplateNotificationCenterMenu` — component (depth 2)
- `@/components/application/settings/settings-general` → `SettingsGeneral` — component (depth 3)
- `@/components/application/settings/settings-modal` → `SettingsModal` — component (depth 2)
- `@/components/application/settings/settings-profile` → `SettingsProfile` — component (depth 3)
- `@/components/application/settings/settings-storage` → `SettingsStorage` — component (depth 3)
- `@/components/application/settings/settings-tools` → `SettingsTools` — component (depth 3)
- `@/components/application/theme/theme-toggle` → `ThemeToggle` — component (depth 2)

**foundations**
- `@/components/foundations/icons/chevrons` → `ChevronDownSmall`, `ChevronRightSmall`, `ChevronSortDown`, `ChevronUpDownSmall` — component (depth 2)

_6 more module(s) below depth 3 — see `registry.json` → templates[].modules._

### Data

- `src/components/application/medical/medical-data.ts` — Shared mock-activity data for the medical profile template — the Most active days calendar and the Activity rings card both read from here so a day's mini rings and the big Activity chart always show…
  - data: `YEAR: number`, `MONTHS: array(12)`
  - helpers: `ringPct(month: number, day: number, ring: number)`, `dayActivity(month: number, day: number) => DayActivity`
  - exported types: `DayActivity`, `SelectedDay`
  - shapes to keep: `DayActivity` (`@/components/application/medical/medical-data`), `SelectedDay` (`@/components/application/medical/medical-data`)

### How to adapt

1. Copy `src/components/application/medical/medical-shell.tsx` into `src/pages/<yours>.tsx` (rename `MedicalShell`), register a `<Route>` for it in `src/App.tsx`.
2. Replace the exports of `src/components/application/medical/medical-data.ts` with real data (fetch or props) — keep the shapes: `DayActivity`, `SelectedDay`.
3. Swap the nav items in the sidebar: `DASHBOARD_NAV` (`DashboardNavItem[]`) in `src/components/application/dashboard/dashboard-sidebar.tsx`; the shell marks the active entry with `selected="medical"`.
4. Delete the template routes you don't use: their entries in the `templates` map of `src/App.tsx` and the matching `src/pages/templates/*.tsx`.
