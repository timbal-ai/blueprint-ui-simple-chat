# Component props index (generated — do not edit; `bun run registry:build`)

BoardUI 0.5.3 · 271 components · 17 hooks · generated 2026-09-07

How to read: import path, one-line summary, then props (name · type · default · doc). Props with `?` are optional. Types are source text (≤ 160 chars, `…` = truncated); same-file union aliases are inlined. `Extends:` lists external interfaces the props inherit from (not expanded — e.g. every `ButtonHTMLAttributes` prop is accepted); a `—` type with `(inherited)` is a prop the component destructures from one of those. Components whose props type comes from another package show `Props:` with the destructured names instead of a table. After the tables: `Local types` (same-file, not exported), `Types:` (exported type shapes), `Data:` (demo datasets), `Other exports:` (helpers), `Re-exports:`. Machine-readable twin: `registry.json` (same items, plus `templates`).

## base

### announcement — `@/components/base/announcement/announcement`

**Announcement** — Dismissible announcement card used in the sidebar footer.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, "title" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd">`
| prop | type | default | doc |
|---|---|---|---|
| title | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` | `RiShieldStarFill` | Leading icon. Defaults to the shield-star from the Figma frame. |
| actionLabel? | `ReactNode` |  | CTA label. When set, a full-width secondary button is rendered. |
| onAction? | `() => void` |  |  |
| dismissible? | `boolean` | `false` | Show a dismiss button in the top-right corner. |
| onClose? | `() => void` |  | Called once the dismiss exit animation finishes. |
| closeLabel? | `string` | `"Dismiss"` | Accessible name for the dismiss button. |
| introDelay? | `number` |  | Seconds to wait before playing the blur/fade/scale-up entrance. Omit to skip the entrance entirely (card just appears). |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `AnnouncementProps` (props of Announcement)

### avatar — `@/components/base/avatar/avatar`

**Avatar** — Image or initials avatar in multiple sizes and tints.
Extends: `HTMLAttributes<HTMLSpanElement>`
| prop | type | default | doc |
|---|---|---|---|
| size? | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` |  |
| color? | `"neutral" \| "blue" \| "lime" \| "pink"` | `"neutral"` |  |
| src? | `string` |  | Photo URL. Wins over `initials`. |
| alt? | `string` |  |  |
| initials? | `string` |  | Fallback initials, e.g. "M". |
| ref? | `Ref<HTMLSpanElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `AvatarProps` (props of Avatar)

### badges — `@/components/base/badges/badge`

**Badge** — Counter pills and the Kbd shortcut hint.
Extends: `HTMLAttributes<HTMLSpanElement>`
| prop | type | default | doc |
|---|---|---|---|
| color? | `"primary" \| "neutral"` | `"neutral"` |  |
| ref? | `Ref<HTMLSpanElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `BadgeProps` (props of Badge)

### badges — `@/components/base/badges/chip`

**Chip** — Status/delta chips in bold and soft variants across the accent palette.
Extends: `HTMLAttributes<HTMLSpanElement>`
| prop | type | default | doc |
|---|---|---|---|
| variant? | `"bold" \| "subtle" \| "caption"` | `"bold"` |  |
| color? | `"lime" \| "rose" \| "yellow" \| "cyan" \| "blue" \| "purple" \| "neutral" \| "gray" \| "soft"` | `"neutral"` |  |
| ref? | `Ref<HTMLSpanElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `ChipProps` (props of Chip)

### badges — `@/components/base/badges/status-dot`

**StatusDot** — 12×12 status indicator: a 6px solid dot centered on a tinted halo.
Extends: `HTMLAttributes<HTMLSpanElement>`
| prop | type | default | doc |
|---|---|---|---|
| color? | `"green" \| "yellow" \| "indigo"` | `"green"` |  |
| ref? | `Ref<HTMLSpanElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `StatusDotProps` (props of StatusDot)

### breadcrumb — `@/components/base/breadcrumb/breadcrumb`

**Breadcrumb** — Icon-capable breadcrumb trail.
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| aria-label? | `string` | `"Breadcrumb"` |  |
| className? | `string` |  |  |
| ref? | `Ref<HTMLElement>` |  |  |

**BreadcrumbItem**
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  | Optional leading icon (16px), inherits the item color. |
| href? | `string` |  |  |
| onClick? | `() => void` |  |  |
| current? | `boolean` | `false` | Marks the active page: not interactive, darker text. |
| className? | `string` |  |  |

Other exports: `BreadcrumbProps` (props of Breadcrumb) · `BreadcrumbItemProps` (props of BreadcrumbItem)

### buttons — `@/components/base/buttons/button-group`

**ButtonGroup** — Row of secondary-style buttons fused into one bordered control with hairline dividers and selectable items.
| prop | type | default | doc |
|---|---|---|---|
| size? | `"medium" \| "small"` | `"medium"` |  |
| children | `ReactNode` |  | ButtonGroupItem children. |
| className? | `string` |  |  |
| aria-label? | `string` |  |  |
| ref? | `Ref<HTMLDivElement>` |  |  |

**ButtonGroupItem**
Extends: `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| size? | `"medium" \| "small"` | `"medium"` |  |
| selected? | `boolean` | `false` | Highlights the item like its hover state; sets aria-pressed. |
| iconOnly? | `boolean` | `false` |  |
| leadingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| trailingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| children? | `ReactNode` |  |  |
| ref? | `Ref<HTMLButtonElement>` |  |  |
| className | — |  | (inherited) |
| type? | — | `"button"` | (inherited) |

Other exports: `ButtonGroupProps` (props of ButtonGroup) · `ButtonGroupItemProps` (props of ButtonGroupItem)

### buttons — `@/components/base/buttons/button`

**Button** — Primary, secondary, ghost, and danger buttons in three sizes with icon support.
Extends: `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| variant? | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` |  |
| size? | `"medium" \| "small" \| "xs"` | `"medium"` |  |
| iconOnly? | `boolean` | `false` |  |
| leadingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| trailingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| children? | `ReactNode` |  |  |
| ref? | `Ref<HTMLButtonElement>` |  |  |
| className | — |  | (inherited) |
| type? | — | `"button"` | (inherited) |

**ButtonLink** — Anchor counterpart to Button for navigational actions.
Extends: `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| variant? | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` |  |
| size? | `"medium" \| "small" \| "xs"` | `"medium"` |  |
| iconOnly? | `boolean` | `false` |  |
| leadingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| trailingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| children? | `ReactNode` |  |  |
| ref? | `Ref<HTMLAnchorElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `ButtonProps` (props of Button) · `ButtonLinkProps` (props of ButtonLink) · `buttonStyles`: `typeof styles`

### buttons — `@/components/base/buttons/close-button`

**CloseButton** — Compact dismiss button for banners, modals, and chips.
Extends: `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| size? | `"2xs" \| "xs" \| "sm" \| "md"` | `"xs"` |  |
| aria-label | `string` |  | Accessible name — required since there is no visible label. |
| ref? | `Ref<HTMLButtonElement>` |  |  |
| className | — |  | (inherited) |
| type? | — | `"button"` | (inherited) |

Other exports: `CloseButtonProps` (props of CloseButton)

### buttons — `@/components/base/buttons/icon-button`

**IconButton** — Square icon-only button in two sizes.
Extends: `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| icon | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| size? | `"medium" \| "small"` | `"medium"` |  |
| aria-label | `string` |  | Accessible name — required since there is no visible label. |
| ref? | `Ref<HTMLButtonElement>` |  |  |
| className | — |  | (inherited) |
| type? | — | `"button"` | (inherited) |

**IconLinkButton** — Anchor counterpart to IconButton for external and navigational actions.
Extends: `Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| icon | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| size? | `"medium" \| "small"` | `"medium"` |  |
| aria-label | `string` |  | Accessible name — required since there is no visible label. |
| ref? | `Ref<HTMLAnchorElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `IconButtonProps` (props of IconButton) · `IconLinkButtonProps` (props of IconLinkButton)

### buttons — `@/components/base/buttons/link-button`

**LinkButton** — Inline text action styled like a link — primary/secondary variants, three sizes, icon support, renders <a> or <button>.
Extends: `LinkButtonAnchorProps | LinkButtonButtonProps`
| prop | type | default | doc |
|---|---|---|---|
| variant? | — | `"primary"` | (inherited) |
| size? | — | `"medium"` | (inherited) |
| leadingIcon | — |  | (inherited) |
| trailingIcon | — |  | (inherited) |
| children | — |  | (inherited) |
| className | — |  | (inherited) |
| disabled? | — | `false` | (inherited) |

Types: `LinkButtonAnchorProps` = `{ href: string; ref?: Ref<HTMLAnchorElement>; variant?: LinkButtonVariant; size?: LinkButtonSize; leadingIcon?: IconComponent; trailingIcon?: IconComponent; children?: ReactNode; className?: string; disabled?: boolean } & Omit<AnchorHTMLAt…` · `LinkButtonButtonProps` = `{ href?: undefined; ref?: Ref<HTMLButtonElement>; variant?: LinkButtonVariant; size?: LinkButtonSize; leadingIcon?: IconComponent; trailingIcon?: IconComponent; children?: ReactNode; className?: string; disabled?: boolean } & Omit<ButtonHT…`
Other exports: `LinkButtonProps` (props of LinkButton) · `linkButtonStyles`: `typeof styles`

### carousel — `@/components/base/carousel/carousel`

**CarouselItem** — One card, filling the track so exactly one is in view per slide.
Extends: `HTMLAttributes<HTMLDivElement>`
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**Carousel** — Gallery carousel built on CSS scroll-snap: swipe, arrows and a position indicator.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, "children" | "onScroll">`
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| aria-label | `string` |  | Names the carousel for assistive tech. |
| showArrows? | `boolean` | `true` | Prev/next buttons above the track. |
| showDots? | `boolean` | `true` | Position indicator below the track. |
| align? | `"start" \| "center"` | `"start"` | Where a card comes to rest when it snaps. |
| gap? | `number` | `16` | Gap between cards, in px. |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `CarouselProps` (props of Carousel) · `CarouselItemProps` (props of CarouselItem)

### checkbox — `@/components/base/checkbox/checkbox-card`

**CheckboxCard** — Selectable card: title + description on the left, checkbox on the right. card radius/2lg (10px), 1px border/button/default, pl 16 pr 20 py 12 hover bg background/primary/hover (#f7f7f7) title Body 1/…
Extends: `Omit<AriaCheckboxProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| title | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `CheckboxCardProps` (props of CheckboxCard)

### checkbox — `@/components/base/checkbox/checkbox-glyph`

**CheckboxGlyph** — The 16px (or 14px) checkbox box + tick/indeterminate glyph.
| prop | type | default | doc |
|---|---|---|---|
| state | `CheckboxGlyphState` |  |  |
| size? | `CheckboxSize` | `"md"` |  |

Types: `CheckboxSize` = `"sm" | "md"` · `CheckboxGlyphState` = `{ isSelected: boolean; isIndeterminate: boolean; isFocusVisible: boolean; isDisabled: boolean; isHovered: boolean }`
Other exports: `checkboxSizes`: `Record<CheckboxSize, { box: string; glyph: string; label: string; gap: string }>`

### checkbox — `@/components/base/checkbox/checkbox`

**Checkbox** — React Aria checkbox with animated tick and indeterminate state.
Extends: `Omit<AriaCheckboxProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| size? | `CheckboxSize` | `"md"` |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `CheckboxProps` (props of Checkbox)

### date-picker — `@/components/base/date-picker/date-picker`

**DatePicker** — Single-date picker with month navigation, built on React Aria.
| prop | type | default | doc |
|---|---|---|---|
| value? | `CalendarDate \| null` |  |  |
| defaultValue? | `CalendarDate \| null` | `null` |  |
| onChange? | `(value: CalendarDate \| null) => void` |  |  |
| isDisabled? | `boolean` |  |  |
| className? | `string` |  |  |
| aria-label? | `string` | `"Date"` |  |
| triggerRef? | `RefObject<HTMLElement \| null>` |  | Anchor the popover to an external element instead of DatePicker's own trigger button (which is hidden when this is provided). Pair with `isOpen`/`onOpenChange` for full external control. |
| isOpen? | `boolean` |  |  |
| onOpenChange? | `(isOpen: boolean) => void` |  |  |

Other exports: `DatePickerProps` (props of DatePicker)

### date-picker — `@/components/base/date-picker/date-range-picker`

**DateRangePicker** — Two-month range picker sharing the date-picker chrome.
| prop | type | default | doc |
|---|---|---|---|
| value? | `DateRangeValue \| null` |  |  |
| defaultValue? | `DateRangeValue \| null` | `null` |  |
| onChange? | `(value: DateRangeValue \| null) => void` |  |  |
| isDisabled? | `boolean` |  |  |
| className? | `string` |  |  |
| aria-label? | `string` | `"Date range"` |  |
| placeholder? | `string` | `"Select date range"` | Trigger text shown when no range is committed yet. Default "Select date range". |

Types: `DateRangeValue` = `{ start: CalendarDate; end: CalendarDate }`
Other exports: `DateRangePickerProps` (props of DateRangePicker)

### date-picker — `@/components/base/date-picker/meeting-scheduler`

**MeetingScheduler** — A Calendly/Cal.com-style booking panel: host card + meeting summary on the left, a single-month calendar in the middle (reusing `MonthPanel` from `./shared`), and a timezone / hour-format / time-slot…
| prop | type | default | doc |
|---|---|---|---|
| host? | `MeetingSchedulerHost` | `DEFAULT_HOST` |  |
| meeting? | `MeetingSchedulerDetails` | `DEFAULT_MEETING` |  |
| timezone? | `string` | `"Amsterdam"` |  |
| value? | `MeetingSchedulerValue \| null` |  |  |
| defaultValue? | `MeetingSchedulerValue \| null` | `null` |  |
| onChange? | `(value: MeetingSchedulerValue \| null) => void` |  |  |
| defaultOpen? | `boolean` | `false` | Render the panel open on mount. Default `false`. |
| className? | `string` |  |  |
| aria-label? | `string` | `"Schedule meeting"` |  |
| triggerLabel? | `string` | `"Schedule a meeting"` | Trigger button text. Default "Schedule a meeting". |

Types: `MeetingSchedulerHost` = `{ name: string; email: string; avatarInitial: string }` · `MeetingSchedulerDetails` = `{ title: string; description?: string; durationMinutes: number; language?: string; conferencing?: string }` · `MeetingSchedulerValue` = `{ date: CalendarDate; time: string | null }`
Other exports: `MeetingSchedulerProps` (props of MeetingScheduler)

### date-picker — `@/components/base/date-picker/shared`

**ChevronLeft16** — Exact paths from Figma's month-nav chevrons (node 3869:5461 / 3869:5528) — a 16×16 glyph, 2px round-capped stroke, mirrored around x=8.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

**ChevronRight16**
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

**DayCell**
Extends: `CalendarCellRenderProps`
| prop | type | default | doc |
|---|---|---|---|
| isRange | `boolean` |  |  |

**MonthPanel**
| prop | type | default | doc |
|---|---|---|---|
| offset | `number` |  |  |
| showPrev? | `boolean` |  |  |
| showNext? | `boolean` |  |  |
| bare? | `boolean` | `false` | Skip the panel's own card chrome (width, bg, padding, shadow) so it can be embedded directly inside a caller-styled container instead — used by the calendar template's inline month switcher, which supplies its own card (matching a different surface's border/shadow). |
| hideHeader? | `boolean` | `false` | Skip the title + prev/next row entirely — used when a caller already renders its own single month title/nav (the calendar template's month switcher pill) and only needs the day grid underneath it. |

**DateChipInput** — One editable "DD/MM/YYYY" chip.
| prop | type | default | doc |
|---|---|---|---|
| date | `CalendarDate` |  |  |
| label | `string` |  |  |
| onCommit | `(date: CalendarDate) => void` |  |  |

Other exports: `formatTriggerDate(date: CalendarDate)` · `formatChipDate(date: CalendarDate)` · `parseChipDate(text: string) => CalendarDate | null` · `triggerButtonClassName`: `cx(…)` · `popoverClassName`: `cx(…)`

### divider — `@/components/base/divider/divider`

**Divider** — Horizontal content divider with three BoardUI surface treatments.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| variant? | `DividerVariant` | `"single"` | Single hairline, two framing hairlines, or a soft filled strip. |
| align? | `DividerAlign` | `"center"` | Positions the divider content while keeping the remaining line flexible. |
| children? | `ReactNode` |  | Text, a button, or any compact control placed in the divider. |
| contentClassName? | `string` |  | Extra classes for the content wrapper. |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

Types: `DividerVariant` = `"single" | "double" | "fill"` · `DividerAlign` = `"start" | "center" | "end"`
Other exports: `DividerProps` (props of Divider)

### dropdown — `@/components/base/dropdown/dropdown`

**Dropdown** — The popover is `isNonModal`: react-aria's modal scroll lock puts `overflow: hidden` on <html>, which collapses the page scroll position and visibly yanks sticky layout (e.g. the docs sidebar) wheneve…
| prop | type | default | doc |
|---|---|---|---|
| isOpen? | `boolean` |  |  |
| onOpenChange? | `(isOpen: boolean) => void` |  |  |
| children | `ReactNode` |  | Trigger (a DropdownTrigger) followed by a DropdownPopover. |

**DropdownTrigger** — The element that opens the menu.
Props: `ComponentProps<typeof AriaButton>` from `react` (external — members not indexed); destructured: `className`

**DropdownPopover**
Extends: `Pick<ComponentProps<typeof AriaPopover>, "placement" | "offset" | "crossOffset">`
| prop | type | default | doc |
|---|---|---|---|
| aria-label | `string` |  |  |
| className? | `string` |  | Extra classes on the panel — e.g. a width override (default w-[266px]). |
| dialogClassName? | `string` |  | Classes on the inner dialog (the flex column), e.g. gap between groups. |
| children | `ReactNode` |  |  |
| placement? | — | `"bottom start"` | (inherited) |
| offset? | — | `4` | (inherited) |
| crossOffset | — |  | (inherited) |

**DropdownGroup**
| prop | type | default | doc |
|---|---|---|---|
| label? | `string` |  | Muted body-medium heading above the rows. |
| className? | `string` |  |  |
| children | `ReactNode` |  |  |

**DropdownItem** — A menu row.
| prop | type | default | doc |
|---|---|---|---|
| selected? | `boolean` |  | Highlights the row like the hover state (current selection). |
| onSelect? | `() => void` |  |  |
| className? | `string` |  | Row padding defaults to p-2 — override for denser rows (px-2 py-1.5). |
| children | `ReactNode` |  |  |

**DropdownDivider** — Full-bleed 1px divider between groups (bleeds through the panel's p-2.5). my-1.5 + the dialog's gap-1 on both sides = the original 10px breathing room.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

Other exports: `DropdownProps` (props of Dropdown) · `DropdownPopoverProps` (props of DropdownPopover) · `DropdownGroupProps` (props of DropdownGroup) · `DropdownItemProps` (props of DropdownItem)

### dropdown — `@/components/base/dropdown/menu-styles`

Other exports: `MENU_POPOVER_SURFACE`: `[ "max-w-[calc(100vw-32px)] overflow-y-auto", "rounded-2xl border border-border…` · `MENU_POPOVER_WIDTH`: `string` · `MENU_ITEMS_CONTAINER`: `string` · `MENU_ITEM`: `[ "flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 text-left", "t…` · `MENU_ITEM_ACTIVE`: `string` · `MENU_ITEM_INTERACTIVE`: `string`

### file-upload — `@/components/base/file-upload/file-upload`

**FileUpload** — Drag-and-drop file upload with validation, animated progress, and a completion callback.
| prop | type | default | doc |
|---|---|---|---|
| onUploadComplete? | `(file: File) => void` |  | Called after the progress and success states finish. |
| allowedExtensions? | `readonly string[]` | `DEFAULT_EXTENSIONS` | Accepted filename extensions without dots. |
| maxBytes? | `number` | `DEFAULT_MAX_BYTES` | Maximum accepted file size in bytes. |
| renderFileIcon? | `(file: File) => ReactNode` |  | Overrides the icon shown while a file uploads. |
| className? | `string` |  |  |

Other exports: `FileUploadProps` (props of FileUpload) · `formatFileSize(bytes: number)`

### input-otp — `@/components/base/input-otp/input-otp`

**InputOtp** — One-time-code field with a monospace box per digit, paste distribution and autofill support.
| prop | type | default | doc |
|---|---|---|---|
| length? | `number` | `6` | Number of digit boxes. |
| value? | `string` |  | Controlled value. Longer strings are truncated to `length`. |
| defaultValue? | `string` | `""` |  |
| onChange? | `(value: string) => void` |  |  |
| onComplete? | `(value: string) => void` |  | Fires once the last box is filled. |
| isDisabled? | `boolean` | `false` |  |
| isInvalid? | `boolean` | `false` |  |
| groupEvery? | `number` |  | Renders a gap between groups, e.g. `3` gives 000 000. |
| aria-label? | `string` | `"One-time code"` |  |
| className? | `string` |  |  |
| ref? | `Ref<HTMLDivElement>` |  |  |

Other exports: `InputOtpProps` (props of InputOtp)

### input — `@/components/base/input/hint-text`

**HintText** — Caption text rendered below a field.
Extends: `AriaTextProps`
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| isInvalid? | `boolean` | `false` |  |
| ref? | `Ref<HTMLElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `HintTextProps` (props of HintText)

### input — `@/components/base/input/input`

**TextField**
Extends: `Omit<AriaTextFieldProps, "className">`
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children? | `ReactNode \| ((state: { isRequired: boolean; isInvalid: boolean; isDisabled: boolean; isReadOnly: boolean }) => ReactNode)` |  |  |
| size? | `"medium" \| "small"` | `"medium"` |  |
| fieldClassName? | `string` |  |  |
| inputClassName? | `string` |  |  |

**InputBase**
Extends: `Omit<AriaInputProps, "size" | "className">`
| prop | type | default | doc |
|---|---|---|---|
| size? | `"medium" \| "small"` |  |  |
| className? | `string` |  |  |
| leadingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| trailingIcon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| leadingAddon? | `ReactNode` |  | Custom element rendered in the leading slot (Phone basic uses this). |
| fieldClassName? | `string` |  | Class for the field shell. |
| ref? | `Ref<HTMLInputElement>` |  | Ref to the <input> element. |
| groupRef? | `Ref<HTMLDivElement>` |  | Ref to the field shell wrapper. |

**Input** — Text input with label, hint text, error states, and leading icon support.
Extends: `Omit<TextFieldProps, "children">`, `Pick<InputBaseProps, | "leadingIcon" | "trailingIcon" | "leadingAddon" | "fieldClassName" | "groupRef" | "ref">`
| prop | type | default | doc |
|---|---|---|---|
| label? | `ReactNode` |  |  |
| hint? | `ReactNode` |  |  |
| tooltip? | `boolean \| string` |  | Show an info icon next to the label. Replace with tooltip when Tooltip lands. |
| placeholder? | `string` |  |  |
| leadingIcon | — |  | (inherited) |
| trailingIcon | — |  | (inherited) |
| leadingAddon | — |  | (inherited) |
| fieldClassName | — |  | (inherited) |
| ref | — |  | (inherited) |
| groupRef | — |  | (inherited) |
| className | — |  | (inherited) |

Other exports: `TextFieldProps` (props of TextField) · `InputBaseProps` (props of InputBase) · `InputProps` (props of Input)

### input — `@/components/base/input/label`

**Label** — Field label.
Extends: `AriaLabelProps`
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| isRequired? | `boolean` | `false` |  |
| isInvalid? | `boolean` |  | Reserved for invalid-aware styling (asterisk color, etc.) once we need it. |
| tooltip? | `boolean \| string` |  | Show the info icon next to the label. |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `LabelProps` (props of Label)

### kbd — `@/components/base/kbd/kbd`

**Kbd** — Keyboard shortcut hint: 12/16 semibold on a fully-rounded neutral pill. - semantic neutral background and foreground for theme-safe contrast - px 4, py 2, radius full
Extends: `HTMLAttributes<HTMLElement>`
| prop | type | default | doc |
|---|---|---|---|
| ref? | `Ref<HTMLElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `KbdProps` (props of Kbd)

### notification — `@/components/base/notification/notification`

**Notification** — Dismissible notification with status icons, avatars, action buttons, and timed countdown.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, | "title" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd">`
| prop | type | default | doc |
|---|---|---|---|
| title | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| timestamp? | `ReactNode` |  |  |
| status? | `NotificationStatus` | `"neutral"` |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  | Custom leading icon. Defaults to the icon associated with `status`. |
| avatar? | `NotificationAvatar` |  | Avatar leading visual. When set, it takes precedence over `icon`. |
| actions? | `NotificationAction[]` |  | Optional small BoardUI action buttons rendered below the message. |
| dismissible? | `boolean` | `true` |  |
| closeLabel? | `string` | `"Dismiss notification"` |  |
| onDismiss? | `() => void` |  | Called after the dismiss animation completes. |
| autoDismissDuration? | `number` |  | Automatically dismiss after this many milliseconds. A 3px blue countdown bar is rendered along the full bottom edge for the same duration. |
| introDelay? | `number` |  | Optional entrance delay in seconds. |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |
| role | — |  | (inherited) |

**NotificationViewport** — Viewport-level notification region.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, | "children" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| position? | `NotificationPosition` |  | Edge or corner where the notification stack is anchored. |
| placement? | `Extract<NotificationPosition, "bottom-left" \| "bottom-right">` |  |  |
| className | — |  | (inherited) |
| aria-label? | — | `"Notifications"` | (inherited) |

Types: `NotificationStatus` = `"neutral" | "information" | "success" | "error"` · `NotificationPosition` = `"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"` · `NotificationAvatar` = `{ presence?: "online" | "busy" | "offline" } & Omit<AvatarProps, "size">` · `NotificationAction` = `{ label: ReactNode; onClick?: () => void; variant?: ButtonProps["variant"] }`
Other exports: `NotificationProps` (props of Notification) · `NotificationViewportProps` (props of NotificationViewport)

### pagination — `@/components/base/pagination/pagination`

**Pagination** — Numbered pagination with prev/next and ellipsis collapsing.
| prop | type | default | doc |
|---|---|---|---|
| page | `number` |  |  |
| totalPages | `number` |  |  |
| onChange | `(page: number) => void` |  |  |
| siblingCount? | `number` | `1` | Page numbers shown on each side of the current page. Default 1. |
| className? | `string` |  |  |

Other exports: `PaginationProps` (props of Pagination)

### radio — `@/components/base/radio/radio-card`

**RadioCard** — Selectable radio card — the radio flavor of CheckboxCard (Figma checkbox items, node 3793:2966): title + optional description on the left, the radio dot on the right. card radius/2lg (10px), 1px bord…
Extends: `Omit<AriaRadioProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| title | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `RadioCardProps` (props of RadioCard)

### radio — `@/components/base/radio/radio`

**RadioDot** — The bare radio glyph — presentation only, no interaction or semantics.
| prop | type | default | doc |
|---|---|---|---|
| selected? | `boolean` | `false` |  |
| size? | `RadioSize` | `"sm"` |  |
| focusVisible? | `boolean` | `false` | Draws the keyboard focus ring around the glyph. |
| className? | `string` |  |  |

**RadioGroup** — Wraps a set of Radios: arrow-key navigation, single selection, form value.
Extends: `Omit<AriaRadioGroupProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**Radio** — React Aria radio group with the gradient selected dot, two sizes, and the bare RadioDot glyph for menu rows.
Extends: `Omit<AriaRadioProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| size? | `RadioSize` | `"md"` |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Types: `RadioSize` = `"sm" | "md"`
Other exports: `RadioDotProps` (props of RadioDot) · `RadioGroupProps` (props of RadioGroup) · `RadioProps` (props of Radio)

### segmented-control — `@/components/base/segmented-control/segmented-control`

**SegmentedControl** — Pill-style segmented control (Weekly / Monthly / Yearly switchers).
Extends: `Omit<AriaToggleButtonGroupProps, "selectionMode" | "disallowEmptySelection">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| variant? | `SegmentedControlVariant` | `"solid"` |  |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**SegmentedControlItem**
Extends: `Omit<AriaToggleButtonProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| ref? | `Ref<HTMLButtonElement>` |  |  |
| className | — |  | (inherited) |

Types: `SegmentedControlVariant` = `"solid" | "plain"`
Other exports: `SegmentedControlProps` (props of SegmentedControl) · `SegmentedControlItemProps` (props of SegmentedControlItem)

### select — `@/components/base/select/select`

**Select** — React Aria select with styled trigger, non-modal popover, and free-form item content.
generic `<T extends object>`
Extends: `Omit<AriaSelectProps<T>, "children">`
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  | Trigger width. Defaults to hug content; the menu uses the shared 266px width. |
| triggerClassName? | `string` |  |  |
| popoverClassName? | `string` |  | Classes for the open popover (e.g. constrain its width). |
| size? | `SelectSize` | `"md"` | `md` (default) or `sm` for compact/dense contexts (e.g. compact tables). |
| children | `ReactNode` |  |  |
| items? | `Iterable<T>` |  |  |
| renderValue? | `ReactNode \| ((values: AriaSelectValueRenderProps<T>) => ReactNode)` |  | Customise the trigger's rendered value (e.g. a compact flag + dial code). Falls back to the selected item's own content when omitted. |
| ref? | `Ref<HTMLDivElement>` |  |  |

**SelectItem**
Extends: `Omit<AriaListBoxItemProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| className | — |  | (inherited) |

Types: `SelectSize` = `"sm" | "md"`
Other exports: `SelectProps` (props of Select) · `SelectItemProps` (props of SelectItem)

### slider — `@/components/base/slider/slider`

**Slider** — A single-value slider with an exact-value bubble above the thumb.
Extends: `Omit<AriaSliderProps<T>, "children" | "className" | "orientation">`
| prop | type | default | doc |
|---|---|---|---|
| label? | `ReactNode` |  | Optional visible label associated with every thumb. |
| showTooltip? | `boolean` |  | Show the exact value in a persistent bubble above each thumb. Default `true`. |
| formatValue? | `(value: number, index: number) => ReactNode` |  | Custom visual formatter for the value bubbles. |
| className? | `string` |  |  |
| thumbLabel? | `string` | `"Value"` | Accessible name for the single thumb. |

**RangeSlider** — A two-thumb slider for selecting a minimum and maximum value.
Extends: `Omit<AriaSliderProps<T>, "children" | "className" | "orientation">`
| prop | type | default | doc |
|---|---|---|---|
| label? | `ReactNode` |  | Optional visible label associated with every thumb. |
| showTooltip? | `boolean` |  | Show the exact value in a persistent bubble above each thumb. Default `true`. |
| formatValue? | `(value: number, index: number) => ReactNode` |  | Custom visual formatter for the value bubbles. |
| className? | `string` |  |  |
| thumbLabels? | `[string, string]` | `["Minimum", "Maximum"]` | Accessible names for the lower and upper thumbs. |

Other exports: `SliderProps` (props of Slider) · `RangeSliderProps` (props of RangeSlider)

### social-button — `@/components/base/social-button/social-button`

**SocialButton** — Sign-in buttons for 24 providers, with brand logos, three colour treatments and an icon-only form.
Props: `SocialButtonProps | SocialButtonLinkProps` (external — members not indexed); destructured: `href`

Types: `SocialBrand` = `SocialProvider | "custom"` · `SocialButtonSize` = `"medium" | "small"` · `SocialButtonAppearance` = `"colorful" | "black" | "white"` · `SocialBrandConfig` = `{ icon: ReactNode; label?: string; color?: string }` · `SocialButtonProps` = `{ href?: never; ref?: Ref<HTMLButtonElement>; brand: SocialBrand; config?: SocialBrandConfig; size?: SocialButtonSize; appearance?: SocialButtonAppearance; iconOnly?: boolean; fullWidth?: boolean; children?: ReactNode; className?: string }…` · `SocialButtonLinkProps` = `{ href: string; ref?: Ref<HTMLAnchorElement>; brand: SocialBrand; config?: SocialBrandConfig; size?: SocialButtonSize; appearance?: SocialButtonAppearance; iconOnly?: boolean; fullWidth?: boolean; children?: ReactNode; className?: string }…`
Re-exports: from `@/components/base/social-button/social-providers`: `SOCIAL_PROVIDERS`, `SocialProvider`

### social-button — `@/components/base/social-button/social-color-logos`

Data: `SOCIAL_COLOR_LOGOS`: `Partial<Record<SocialProvider, { viewBox: string; body: string }>>`

### social-button — `@/components/base/social-button/social-providers`

Types: `SocialProvider` = `keyof typeof SOCIAL_PROVIDERS`
Data: `SOCIAL_PROVIDERS`: `object`

### switch — `@/components/base/switch/switch-card`

**SwitchCard** — Selectable settings card: title + description on the left, Switch on the right.
Extends: `Omit<AriaSwitchProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| title | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  | Optional 24×24 leading icon — pass a Remix Icon component (`RiMailLine`, not `<RiMailLine />`). |
| size? | `SwitchSize` | `"md"` |  |
| shape? | `SwitchShape` | `"pill"` |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `SwitchCardProps` (props of SwitchCard)

### switch — `@/components/base/switch/switch`

**SwitchTrack** — The track + thumb + chip visual.
| prop | type | default | doc |
|---|---|---|---|
| state | `SwitchVisualState` |  |  |
| size? | `SwitchSize` | `"md"` |  |
| shape? | `SwitchShape` | `"pill"` |  |

**Switch** — Skeuomorphic toggle switch in two sizes.
Extends: `Omit<AriaSwitchProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| size? | `SwitchSize` | `"md"` |  |
| shape? | `SwitchShape` | `"pill"` |  |
| ref? | `Ref<HTMLLabelElement>` |  |  |
| className | — |  | (inherited) |

Types: `SwitchSize` = `"sm" | "md" | "lg"` · `SwitchShape` = `"pill" | "rectangle"` · `SwitchVisualState` = `{ isSelected: boolean; isDisabled: boolean; isFocusVisible: boolean }`
Other exports: `SwitchProps` (props of Switch) · `switchSizes`: `sortCx(…)`

### table — `@/components/base/table/table`

**Table** — Static table primitives matching the dashboard tables.
Extends: `Omit<AriaTableProps, "className">`
| prop | type | default | doc |
|---|---|---|---|
| size? | `TableSize` | `"md"` |  |
| className? | `string` |  |  |
| containerClassName? | `string` |  | Class for the scroll container that wraps the table. |
| ref? | `Ref<HTMLTableElement>` |  |  |

Types: `TableSize` = `"sm" | "md"`
Other exports: `TableProps` (props of Table)
Re-exports: from `react-aria-components`: `TableHeader`, `TableColumn` (= `Column`), `TableBody`, `TableRow` (= `Row`), `TableCell` (= `Cell`)

### tabs — `@/components/base/tabs/pill-tab`

**PillTabList**
Extends: `HTMLAttributes<HTMLDivElement>`
| prop | type | default | doc |
|---|---|---|---|
| ref? | `Ref<HTMLDivElement>` |  |  |
| children | — |  | (inherited) |
| className | — |  | (inherited) |

**PillTab** — `PillTab` remains a plain button (not a React Aria Tabs collection): these switchers drive local view state, not routed tab panels.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `PillTabVariant` | `"blue"` |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| isSelected | `boolean` |  |  |
| onSelect | `() => void` |  |  |
| children | `ReactNode` |  |  |
| className? | `string` |  |  |

Types: `PillTabVariant` = `"blue" | "gray"`
Other exports: `PillTabListProps` (props of PillTabList)

### tabs — `@/components/base/tabs/tabs`

**Tabs** — Underline and pill tab variants built on React Aria.
Extends: `AriaTabsProps`
| prop | type | default | doc |
|---|---|---|---|
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**TabList**
generic `<T extends object>`
Extends: `AriaTabListProps<T>`
| prop | type | default | doc |
|---|---|---|---|
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**Tab**
Extends: `Omit<AriaTabProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  | Optional leading icon (16px). Inherits the label color. |
| count? | `ReactNode` |  | Optional trailing count badge. |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

**TabPanel**
Extends: `AriaTabPanelProps`
| prop | type | default | doc |
|---|---|---|---|
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

Other exports: `TabsProps` (props of Tabs) · `TabListProps` (props of TabList) · `TabProps` (props of Tab) · `TabPanelProps` (props of TabPanel)

### tooltip — `@/components/base/tooltip/tooltip`

**Tooltip** — Light-surface tooltip built on React Aria.
Extends: `Omit<AriaTooltipProps, "children">`
| prop | type | default | doc |
|---|---|---|---|
| children? | `ReactNode` |  |  |
| size? | `TooltipSize` | `"sm"` | Surface size. `sm` → 12px Caption 1, `md` → 14px Body 1. Default `sm`. |
| showArrow? | `boolean` | `true` | Show the little caret pointing at the trigger. Default `true`. |
| className | — |  | (inherited) |
| offset? | — | `10` | (inherited) |

**TooltipTrigger**
Extends: `ComponentProps<typeof AriaTooltipTrigger>`
| prop | type | default | doc |
|---|---|---|---|
| delay? | — | `0` | (inherited) |
| closeDelay? | — | `0` | (inherited) |

Types: `TooltipSize` = `"sm" | "md"`
Other exports: `TooltipProps` (props of Tooltip) · `TooltipTriggerProps` (props of TooltipTrigger) · `TOOLTIP_CARETS`: `sortCx(…)`

## application

### agent-limits — `@/components/application/agent-limits/agent-limits-card`

**AgentLimitsCard** — Context window usage bar with an expandable token breakdown, collapsible groups, and plan usage limits with reset times.
| prop | type | default | doc |
|---|---|---|---|
| context? | `{ /** Window size in tokens (e.g. 1_000_000). */ max: number; segments: ContextSegment[]; groups?: ContextGroup[] }` | `DEFAULT_CONTEXT` |  |
| plan? | `string` | `"Max (5x)"` | Plan name shown after "Plan usage limits ·". |
| planHref? | `string` |  | Where the plan arrow points (omit to hide the arrow). |
| limits? | `UsageLimit[]` | `DEFAULT_LIMITS` |  |
| defaultExpanded? | `boolean` | `false` | Start with the context breakdown open. |
| onExpandedChange? | `(expanded: boolean) => void` |  |  |
| className? | `string` |  |  |

Types: `ContextSegment` = `{ label: string; tokens: number; color?: string; deferred?: boolean }` · `ContextGroup` = `{ label: string; tokens: number; items: { label: string; tokens: number }[] }` · `UsageLimit` = `{ label: string; used: number; resets: string }`
Other exports: `AgentLimitsCardProps` (props of AgentLimitsCard) · `formatTokens(n: number)`

### agent-log — `@/components/application/agent-log/agent-log`

**useRevealMask()** — The soft edge only earns its keep while a unit is growing.
| param | type | default | doc |
|---|---|---|---|
| reduce | `boolean` |  |  |

**ShimmerText** — A line the agent is still working on, with a highlight travelling across it.
| prop | type | default | doc |
|---|---|---|---|
| children | `string` |  |  |

**useRevealTicker()** — Paces the log, one unit per tick, and fires `onComplete` once the last one lands.
returns `number`
| param | type | default | doc |
|---|---|---|---|
| total | `number` |  | How many units the log has in total. |
| run? | `boolean` | `true` | Pauses and resumes. Toggling back resumes; change `key` to replay. |
| stepInterval? | `number` | `850` |  |
| startDelay? | `number` | `320` |  |
| revealed? | `number` |  | Drive it yourself from real events; disables the internal timer. |
| delayFor? | `(index: number) => number` |  | Per-unit pacing: given the index about to be revealed, how long to wait first. Overrides `startDelay` and `stepInterval` when supplied, so a log can dwell on the units that would genuinely have taken longer instead of marching at a fixed tempo. |
| onComplete? | `() => void` |  |  |

**RowConnector** — Curved tree guide, matching the docs sidebar and the AI Chat repository submenus, drawn per row rather than as one measured SVG for the whole list.
| prop | type | default | doc |
|---|---|---|---|
| first | `boolean` |  |  |
| last | `boolean` |  |  |
| reduce | `boolean` |  |  |

**GuideBridge** — Drops from a parent row's glyph into a nested list's trunk.
| prop | type | default | doc |
|---|---|---|---|
| height | `number` |  |  |
| offset? | `number` | `8` | Distance from the wrapper's left edge to the nested trunk. |
| reduce | `boolean` |  |  |

**WorkingRow** — The tail indicator, while the log is still running.
| prop | type | default | doc |
|---|---|---|---|
| label | `string` |  |  |
| reduce | `boolean` |  |  |
| className? | `string` |  |  |

**useLogMotion()** — Reads `prefers-reduced-motion` once for a whole log.
No parameters.

**LogRow** — One row of a log: the blur-in, the clipping edge that keeps it from being cut as it grows, and the length of guide that belongs to it.
| prop | type | default | doc |
|---|---|---|---|
| first | `boolean` |  |  |
| last | `boolean` |  |  |
| reduce | `boolean` |  |  |
| className? | `string` |  |  |
| children | `ReactNode` |  |  |

Data: `SOFT_EASE`: `array(4)` · `UNIT_INITIAL`: `object` · `UNIT_ANIMATE`: `object` · `UNIT_TRANSITION`: `object`
Other exports: `RevealTickerOptions` (props of useRevealTicker)

### agent-progress — `@/components/application/agent-progress/agent-progress-loading-text`

**AgentProgressLoadingText** — Reusable loading label with a soft highlight traveling across the text.
| prop | type | default | doc |
|---|---|---|---|
| children | `string` |  |  |
| className? | `string` |  |  |

### agent-progress — `@/components/application/agent-progress/agent-progress`

**AgentProgress** — Collapsible multi-step AI task progress with animated active, pending, and completed states.
| prop | type | default | doc |
|---|---|---|---|
| steps? | `readonly string[]` | `DEFAULT_AGENT_PROGRESS_STEPS` | Ordered task labels. The built-in coding workflow is used by default. |
| stepDuration? | `number` | `DEFAULT_STEP_DURATION_MS` | Time spent on each step, in milliseconds. |
| completionDelay? | `number` | `DEFAULT_COMPLETION_DELAY_MS` | Time to keep the completed state visible before calling `onFinished`. |
| onFinished? | `() => void` |  |  |
| paused? | `boolean` | `false` | Freezes the demo clock: no step advances and `onFinished` doesn't fire while true. The module keeps its current state and resumes when it flips back — for holding a showcase instance that has scrolled out of view. |
| className? | `string` |  |  |

Data: `DEFAULT_AGENT_PROGRESS_STEPS`: `array(5)`
Other exports: `AgentProgressProps` (props of AgentProgress)

### agent-thinking — `@/components/application/agent-thinking/agent-thinking`

**AgentThinking** — Agent thinking indicator for chat composers — dot wave, dot spin, stars, and infinity variants with a shimmering label and elapsed timer.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `AgentThinkingVariant` | `"wave"` |  |
| label? | `string` | `"Thinking"` | Status label, e.g. "Thinking" or "Searching the docs". |
| tone? | `AgentThinkingTone` |  | Tone of the indicator + label. Defaults per variant (`stars` is subtle). |
| shimmer? | `boolean` | `true` | Animated highlight traveling across the label. |
| showTimer? | `boolean` | `true` | Elapsed seconds since mount, rendered after the label. |
| className? | `string` |  |  |

Types: `AgentThinkingVariant` = `"wave" | "spin" | "stars" | "infinity"` · `AgentThinkingTone` = `"subtle" | "default" | "primary" | "accent"`
Other exports: `AgentThinkingProps` (props of AgentThinking)

### ai-chat — `@/components/application/ai-chat/ai-chat-code-panel`
Template: /templates/ai-chat (see templates.md)

**AiChatCodePanel** — Fixed-width right panel of the AI chat template, sitting directly on the page background: pill tab switcher (Changes / Browser) with terminal / expand / sidebar actions, an uncommitted-changes summar…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| width? | `CSSProperties["width"]` | `410` |  |

Data: `AI_CHAT_CODE_THEME`: `PrismTheme`

### ai-chat — `@/components/application/ai-chat/ai-chat-composer`
Template: /templates/ai-chat (see templates.md)

**Composer**
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| value? | `string` |  | Controlled field value. Left out, the input manages its own text. |
| onValueChange? | `(value: string) => void` |  |  |
| onSubmit? | `(value: string) => void` |  | Fires on the send button and on Enter. Without it the composer is inert, which is what the marketing surfaces want. |
| disabled? | `boolean` | `false` | Greys out send while a turn is in flight. |
| glassControls? | `boolean` | `false` | Puts the add and model controls on liquid glass, the same chips the landing header uses. Opt-in: the filter is not free, and the flat treatment is the right default everywhere the composer sits on a plain surface. |
| inputRef? | `RefObject<HTMLInputElement \| null>` |  | The field itself, for focus or a scripted demo. |

**GlassComposer** — The composer with liquid-glass chips measured under its add / model / mic controls.
| prop | type | default | doc |
|---|---|---|---|
| glass | `boolean` |  |  |

**StatusBar**
No props.

**AiChatComposerPreview** — The production composer and status row as a standalone block for compact previews and embedded agent surfaces.
No props.

Other exports: `ComposerProps` (props of Composer)

### ai-chat — `@/components/application/ai-chat/ai-chat-container`
Template: /templates/ai-chat (see templates.md)

**Line** — A block of a message (paragraph, list, feedback row) that blurs in.
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| className? | `string` |  |  |

**AssistantMessage** — Assistant turn: 14/20 regular prose + feedback actions.
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |

**UserMessage** — User turn: white radius/2xl card (p 12, card contact shadow), pushed to the right of the thread.
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |

**ImageGenerationResponse**
| prop | type | default | doc |
|---|---|---|---|
| onGenerated? | `() => void` |  |  |
| hideHeader? | `boolean` | `false` |  |
| generatedImageSrc? | `string` | `"/ai-chat/generated-footballer.jpg"` |  |
| generatedImageAlt? | `string` | `"Vintage-style illustration of a football player in Argentina's striped kit"` |  |

**AiChatContainer** — The center column of the AI chat template: a radius/3xl background/secondary surface with a breadcrumb header (project › chat + share/more actions), the scrollable message thread, the pill composer (…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| scenario? | `AiChatScenario` | `"landing-page-design"` |  |
| mobileHeader? | `ReactNode` |  |  |
| onImageGenerated? | `() => void` |  | Fires when the image-generation thread finishes rendering its image, so the shell can add it to the gallery panel. |

Types: `AiChatScenario` = `"landing-page-design" | "image-generation" | "coding-scenario"`

### ai-chat — `@/components/application/ai-chat/ai-chat-gallery-panel`
Template: /templates/ai-chat (see templates.md)

**AiChatGalleryPanel** — Right-hand panel for the image-generation template — the gallery counterpart to `AiChatCodePanel`.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| width? | `CSSProperties["width"]` | `410` |  |
| generated? | `Generation[]` |  | Freshly generated images, newest first — they land at the top-left of the wall and push the rest of that column down. |

Types: `Generation` = `{ id: string; prompt: string; src?: string; tint: string; ratio: string }`

### ai-chat — `@/components/application/ai-chat/ai-chat-menus`
Template: /templates/ai-chat (see templates.md)

**ProjectFolderMenu** — Status-bar trigger + "Local Folders" popover (Figma node 4035:6313).
No props.

**EffortSlider** — Effort slider (Figma node 4037:4885): 27px-tall neutral track with six 3×13 tick marks, a light-grey fill up to the 21×27 bordered thumb.
| prop | type | default | doc |
|---|---|---|---|
| value | `number` |  |  |
| onChange | `(v: number) => void` |  |  |

**ModelSettingsPanel** — The Models + Effort panel itself, extracted from the popover so other surfaces (the landing collage) can render the exact same component as a standalone card.
| prop | type | default | doc |
|---|---|---|---|
| model | `string` |  |  |
| onModelChange | `(model: string) => void` |  |  |
| effort | `number` |  |  |
| onEffortChange | `(effort: number) => void` |  |  |

**ModelMenu** — Composer trigger + "Models / Effort" popover (Figma node 4035:6925).
No props.

**AddMenu** — Composer plus-button + "Add / Plugins" popover (Figma node 4040:5414).
| prop | type | default | doc |
|---|---|---|---|
| triggerSurface? | `string` | `"bg-ai-chat-composer-add-background hover:bg-ai-chat-composer-add-hover-backgro…` | Background + hover classes of the plus button. The pill composer paints it a step lighter than the Composer Panel does, so each surface passes its own pair instead of merging over a default. |

Data: `EFFORT_LEVELS`: `array(6)`

### ai-chat — `@/components/application/ai-chat/ai-chat-shell`
Template: /templates/ai-chat (see templates.md)

**AiChatShell** — Full AI chat app: sidebar, resizable code panel, composer with model/effort controls.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| contained? | `boolean` | `false` |  |
| defaultScenario? | `AiChatScenario` | `"coding-scenario"` |  |

### ai-chat — `@/components/application/ai-chat/ai-chat-sidebar`
Template: /templates/ai-chat (see templates.md)

**AiChatSidebar** — The AI-chat variant of the floating sidebar — same 260px panel (p 12, radius/3xl, white 1px border, sidebar-elevation shadow, bg background/secondary) but with a chat-first nav: primary actions (New…
| prop | type | default | doc |
|---|---|---|---|
| repos? | `AiChatRepo[]` | `DEFAULT_REPOS` |  |
| className? | `string` |  |  |
| activeThreadId? | `string` |  |  |
| onThreadSelect? | `(id: string) => void` |  |  |
| onClose? | `() => void` |  |  |
| flat? | `boolean` | `false` |  |

Types: `AiChatThread` = `{ id?: string; label: string; time: string; isSelected?: boolean }` · `AiChatRepo` = `{ label: string; threads: AiChatThread[]; defaultOpen?: boolean }`

### ai-profile — `@/components/application/ai-profile/agents-chart-card`
Template: /templates/ai-profile (see templates.md)

**AgentsChartCard** — Active days use the semantic agents-bar color; zero-agent days collapse to a 4px neutral stub (nodes 4065:8629 etc.) x axis "Jun 14" … "Today" (11px medium, text/tertiary, +0.2 tracking) Hovering a b…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### ai-profile — `@/components/application/ai-profile/ai-profile-card`
Template: /templates/ai-profile (see templates.md)

**AiProfileCard** — Figma source: Board UI → ai profile → profile card (node 4063:5759). card 680w, radius/3xl (24px), 1px border/button/default, px 16, pb 16, pt 124 — the cover photo overlays the top 165px and the 80p…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### ai-profile — `@/components/application/ai-profile/ai-profile-data`
Template: /templates/ai-profile (see templates.md)

Data: `MONTH_NAMES`: `array(12)` · `AGENTS_TRACK_HEIGHT`: `number` · `AGENTS_MAX_BAR`: `number` · `AGENTS_ZERO_BAR`: `number` · `TOKENS_SERIES`: `[ 34.2, 28.6, 6.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31.4, 4.8, 2.2, 1.1, 5.6, 1.4, 0.…`
Other exports: `agentBarsFor(month: number) => number[]` · `agentCountFor(month: number) => number`

### ai-profile — `@/components/application/ai-profile/ai-profile-shell`
Template: /templates/ai-profile (see templates.md)

**AiProfileShell** — Same floating sidebar / mobile-drawer shell as `MedicalShell` — the content is a single centered 680px column: profile card, agents bar chart, tokens line chart, stacked with a 16px gap.
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### ai-profile — `@/components/application/ai-profile/tokens-chart-card`
Template: /templates/ai-profile (see templates.md)

**TokensChartCard** — The design draws smoothed joins, but the implementation intentionally uses sharp linear segments (per spec). x axis "Jun 14" … "Today" (11px medium, text/tertiary, +0.2 tracking) Hovering the plot ro…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### auth — `@/components/application/auth/auth-card`

**AuthCard** — Sign-in and sign-up cards with social providers stacked with labels or inline as icons, plus email fields and a CTA.
| prop | type | default | doc |
|---|---|---|---|
| mode? | `AuthMode` | `"signin"` | `signin` (default), `signup`, or `verify` for the one-time-code step. `verify` swaps the email fields for OTP boxes and drops the providers: the visitor has already chosen how they are signing in. |
| email? | `string` |  | `verify` only: the address the code went to, shown in the description. |
| codeLength? | `number` | `6` | `verify` only: how many digits. Defaults to 6. |
| onComplete? | `(code: string) => void` |  | `verify` only: fires once the last box is filled. |
| onResend? | `() => void` |  | `verify` only: the resend action. |
| layout? | `AuthLayout` | `"stacked"` | How the provider buttons are arranged. Defaults to `stacked`. |
| providers? | `SocialProvider[]` | `["google", "apple", "github"]` |  |
| title? | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| media? | `ReactNode` |  | Artwork for the right half. Passing it turns the card into the split layout: form on the left, media on the right, which drops to the form alone below `md` rather than stacking a tall image above the fields. |
| logo? | `ReactNode` |  | Mark above the title — a wordmark, an app icon, anything. Deliberately a node rather than a src, so the card stays brand-agnostic and an installed copy pulls none of BoardUI's own artwork with it. |
| centered? | `boolean` | `false` | Centre the heading, as the split layout usually wants. |
| confirmPassword? | `boolean` | `false` | Sign-up only: adds a stacked confirm-password field. |
| footnote? | `ReactNode` |  | Small print under the card, outside its border. |
| onSubmit? | `(data: FormData) => void` |  | Fires with the form's own FormData; wire it to your auth library. |
| onProvider? | `(provider: SocialProvider) => void` |  |  |
| switchHref? | `string` | `"#"` | Footer link target, e.g. to the opposite mode. |
| className? | `string` |  |  |

Types: `AuthLayout` = `"stacked" | "inline" | "grid"` · `AuthMode` = `"signin" | "signup" | "verify"`
Other exports: `AuthCardProps` (props of AuthCard)
Re-exports: from `@/components/application/auth/auth-media-carousel`: `AuthMediaCarousel`, `AuthMediaSlide`

### auth — `@/components/application/auth/auth-media-carousel`

**AuthMediaCarousel** — Auto-advancing artwork for the auth card's `media` slot.
| prop | type | default | doc |
|---|---|---|---|
| slides | `AuthMediaSlide[]` |  |  |
| interval? | `number` | `3200` | Milliseconds a slide rests at full bleed, before the transition begins. |
| className? | `string` |  |  |

Types: `AuthMediaSlide` = `{ src: string; alt?: string }`

### calendar — `@/components/application/calendar/calendar-data`
Template: /templates/calendar (see templates.md)

Types: `CalendarEventColor` = `"blue" | "pink" | "lime" | "purple" | "emerald"` · `ParticipantColor` = `"neutral" | "lime" | "pink" | "blue"` · `EventParticipant` = `{ email: string; initials: string; color: ParticipantColor }` · `CalendarEvent` = `{ id: string; title: string; time?: string; endTime?: string; color: CalendarEventColor; meetingCode?: string; participants?: EventParticipant[]; reminder?: string; image?: string }` · `ResolvedEventDetails` = `{ endTime: string | null; meetingCode: string | null; participants: EventParticipant[]; reminder: string | null }`
Data: `CALENDAR_EVENTS`: `Record<string, CalendarEvent[]>` · `CALENDAR_SHOWCASE_MONTH`: `CalendarDate` · `WEEKDAY_LABELS`: `array(7)`
Other exports: `eventDetails(event: CalendarEvent) => ResolvedEventDetails` · `eventsForDate(date: CalendarDate) => CalendarEvent[]` · `monthGrid(monthStart: CalendarDate) => CalendarDate[]`

### calendar — `@/components/application/calendar/calendar-header`
Template: /templates/calendar (see templates.md)

**CalendarHeader** — Breadcrumb (Board team → Mertcan → Calendar) + a title/actions row: month label, notification bell (unread badge, same recipe as `DashboardHeader`), inbox, the month switcher (`CalendarMonthSwitcher`…
| prop | type | default | doc |
|---|---|---|---|
| month | `CalendarDate` |  |  |
| monthLabel | `string` |  |  |
| onPrevMonth | `() => void` |  |  |
| onNextMonth | `() => void` |  |  |
| onSelectDate | `(date: CalendarDate) => void` |  |  |
| unreadCount? | `number` | `5` |  |
| onMenuClick? | `() => void` |  |  |
| onNewEvent? | `() => void` |  |  |
| showBreadcrumb? | `boolean` | `true` | Hide the workspace breadcrumb — used by the docs preview, which shows the calendar standalone without the surrounding app shell. |
| showNotification? | `boolean` | `true` | Hide the notification action in compact embedded previews. |
| monthSwitcherWidth? | `number` |  | Override the month selector width in compact embedded previews. |
| monthSwitcherClassName? | `string` |  | Override the month selector layout in compact embedded previews. |
| controlClassName? | `string` |  | Normalize action heights in compact embedded previews. |

### calendar — `@/components/application/calendar/calendar-inbox-menu`
Template: /templates/calendar (see templates.md)

**CalendarInboxMenu** — The calendar template's inbox icon opens this subscribed-feeds dropdown — anchored to the icon via the same external `triggerRef`/`isOpen` pattern used by the other calendar header pieces.
| prop | type | default | doc |
|---|---|---|---|
| triggerClassName? | `string` |  |  |

### calendar — `@/components/application/calendar/calendar-month-grid`
Template: /templates/calendar (see templates.md)

**CalendarMonthGrid** — Weekday header row (7 grey rounded-xl pills) + a Sun-start month grid of day cells, each up to 115.33px tall in Figma (148.57px wide) — reproduced here as a fluid `grid-cols-7` so it fills any card w…
| prop | type | default | doc |
|---|---|---|---|
| month | `CalendarDate` |  |  |
| highlightedDate? | `CalendarDate \| null` | `null` | Pulses this day's ring for ~3s then fades it out (not a persistent selection state — see `DayCell`). |
| compact? | `boolean` | `false` | Uses short, fixed day rows for embedded previews instead of viewport-responsive rows. |
| onHighlightEnd? | `() => void` |  |  |

### calendar — `@/components/application/calendar/calendar-month-switcher`
Template: /templates/calendar (see templates.md)

**CalendarMonthSwitcher** — Card chrome (border/button/default border, shadow/dropdown, white — not the other pickers' grey background/secondary/default) matches `DashboardTeamMenu`'s dropdown.
| prop | type | default | doc |
|---|---|---|---|
| month | `CalendarDate` |  |  |
| monthLabel | `string` |  |  |
| onPrevMonth | `() => void` |  |  |
| onNextMonth | `() => void` |  |  |
| onSelectDate | `(date: CalendarDate) => void` |  |  |
| width? | `number` | `PANEL_WIDTH` | Optional compact width for embedded previews. |
| className? | `string` |  | Optional layout override for compact embedded previews. |

### calendar — `@/components/application/calendar/calendar-shell`
Template: /templates/calendar (see templates.md)

**CalendarShell** — Same responsive shell as `DashboardShell` (floating sidebar in-flow at `lg`+, slide-in drawer with backdrop below it) — mirrored here rather than shared, since the two templates' main content differs…
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### calendar — `@/components/application/calendar/event-details-modal`
Template: /templates/calendar (see templates.md)

**EventDetailsModal** — A `Popover` (`isNonModal`, no backdrop — only the panel's own shadow, same overlay pattern as `CalendarInboxMenu`) anchored to the right of the day it belongs to, so the event stays visible beside it…
| prop | type | default | doc |
|---|---|---|---|
| isOpen | `boolean` |  | Drives the popover's open/exit-animation state. Kept separate from `event`/`date` — the caller keeps those around (not nulled) while this goes false, so the panel still has content to blur/scale out instead of going blank the instant it starts closing. |
| event | `CalendarEvent \| null` |  |  |
| date | `CalendarDate \| null` |  |  |
| triggerRef | `React.RefObject<HTMLElement \| null>` |  | The day cell that was clicked — the popover anchors to the right of this element. |
| onClose | `() => void` |  |  |

### charts — `@/components/application/charts/area-chart-card`

**AreaChartCard** — Multi-series area chart with stacked, overlapping and 100% variants, gradient fills, period dropdown and stat tiles.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `AreaVariant` | `"stacked"` |  |
| shape? | `AreaShape` | `"curved"` | Monotone spline (default) or straight segments between points. |
| title? | `string` | `"Visitors"` | Header label; swaps to the hovered category while hovering. |
| data? | `AreaPoint[]` |  |  |
| series? | `AreaSeries[]` |  |  |
| headline? | `number` |  | Headline number at rest; defaults to the total across every series. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Jan – Jun 2024"). Ignored when `ranges` is set. |
| ranges? | `AreaRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| tiles? | `boolean` | `false` | Stat tiles under the chart, one per series (its total, or the hovered category's value). The card grows to fit. |
| className? | `string` |  |  |

Types: `AreaPoint` = `{ label: string } & Record<string, number | string>` · `AreaSeries` = `{ key: string; label: string; color?: string; activeColor?: string }` · `AreaVariant` = `"stacked" | "overlap" | "percent"` · `AreaShape` = `"curved" | "sharp"` · `AreaRange` = `ChartRange<{ data: AreaPoint[]; series: AreaSeries[]; delta: number; headline: number }>`
Other exports: `AreaChartCardProps` (props of AreaChartCard)

### charts — `@/components/application/charts/bar-list-card`

**BarListCard** — Analytics breakdown list: ranked rows with share bars behind the labels, tabbed lists, metric caption, and a show-more pill.
| prop | type | default | doc |
|---|---|---|---|
| tabs? | `BarListTab[]` |  | Tabbed lists. When only one list is needed, use `items` + `title`. |
| items? | `BarListItem[]` |  |  |
| title? | `string` |  | Heading for a single (untabbed) list. |
| metricLabel? | `string` | `"Visitors"` | Column caption over the values ("Visitors"). |
| metric? | `"share" \| "value"` | `"share"` | Show each row's share of the tab total (default) or its raw value. |
| format? | `(n: number) => string` | `formatNumber` |  |
| color? | `string` |  | Tint for the bars; any CSS colour, defaults to chart-6 (blue). |
| mono? | `boolean` | `false` | Single-ink tint (mid grey on light, near-white on dark). |
| limit? | `number` | `5` | Rows shown before the "more" pill (default 5). |
| defaultTab? | `string` |  |  |
| onTabChange? | `(id: string) => void` |  |  |
| className? | `string` |  |  |

Types: `BarListItem` = `{ label: string; value: number; color?: string; icon?: ReactNode }` · `BarListTab` = `{ id: string; label: string; items: BarListItem[] }`
Other exports: `BarListCardProps` (props of BarListCard)

### charts — `@/components/application/charts/chart-card`

**ChartCard** — Shared chrome for the radar / radial / funnel / sankey chart cards: the card shell, the label + count-up headline + delta chip header, the optional range pill, an absolutely centred readout for the r…
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children | `ReactNode` |  |  |

**ChartHeader**
| prop | type | default | doc |
|---|---|---|---|
| label | `string` |  | Secondary line above the headline - swaps to the hovered item's name. |
| value? | `number` |  | Headline number; animates between values with `useCountUp`. Omit for a single-line header (the ring charts keep their number in the centre). |
| format? | `(n: number) => string` | `formatNumber` |  |
| delta? | `{ label: string; color: DeltaColor }` |  | Delta chip beside the headline; hidden while `hovering` so the hovered value stands alone, matching the other chart cards. |
| hovering? | `boolean` | `false` |  |
| fadeKey? | `string` |  | Changing this key restarts the headline's fade, e.g. `String(activeIndex)`. |
| range? | `string` |  | Static period pill on the right ("Jan – Jun 2024"). Ignored when `ranges` is set. |
| ranges? | `ChartRangeOption[]` |  | Selectable periods - renders the pill as a dropdown. |
| rangeId? | `string` |  |  |
| onRangeChange? | `(id: string) => void` |  |  |
| trailing? | `ReactNode` |  | Any other trailing control (rendered instead of / next to `range`). |
| className? | `string` |  |  |

**ChartRangePill**
| prop | type | default | doc |
|---|---|---|---|
| label | `string` |  |  |
| className? | `string` |  |  |

**useChartRange()** — Selection state for `ranges`.
generic `<T extends object>`
| param | type | default | doc |
|---|---|---|---|
| ranges | `ChartRange<T>[] \| undefined` |  |  |
| defaultId? | `string` |  |  |
| onChange? | `(id: string) => void` |  |  |

**ChartRangeSelect** — The period pill as a dropdown: same chrome as `ChartRangePill` plus a chevron that flips while open, and a menu of ranges with a check on the current one - the BoardUI Dropdown recipe, sized to the p…
| prop | type | default | doc |
|---|---|---|---|
| ranges | `ChartRangeOption[]` |  |  |
| value? | `string` |  |  |
| onChange? | `(id: string) => void` |  |  |
| className? | `string` |  |  |

**ChartCenterReadout** — The number inside a ring chart.
| prop | type | default | doc |
|---|---|---|---|
| value | `number` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| caption? | `string` |  |  |
| fadeKey? | `string` |  |  |
| size? | `"display" \| "title"` | `"display"` | `display` (32px) for the big single-value gauges, `title` (24px) where the hole is smaller. |
| className? | `string` |  | Override the centring, e.g. `justify-end` to sit on a half gauge's base. |

**ChartStatTiles** — The stat tile row under a chart: swatch · name over value per item (the activity rings tile recipe), on a six-column grid - three per row, with the last row's remainder stretched to full width (5 → 3…
| prop | type | default | doc |
|---|---|---|---|
| items | `StatTile[]` |  |  |
| activeIndex? | `number \| null` | `null` |  |
| onActiveChange? | `(index: number \| null) => void` |  |  |
| className? | `string` |  |  |

**ChartLegend**
| prop | type | default | doc |
|---|---|---|---|
| items | `LegendItem[]` |  |  |
| activeIndex? | `number \| null` | `null` |  |
| onActiveChange? | `(index: number \| null) => void` |  | Hovering a legend row focuses its series/segment, like the chart itself. |
| className? | `string` |  |  |

Types: `ChartTone` = `{ color: string; activeColor: string }` · `DeltaColor` = `"lime" | "rose" | "neutral"` · `ChartRangeOption` = `{ id: string; label: string }` · `ChartRange` = `{ id: string; label: string } & Partial<T>` · `StatTile` = `{ label: string; value: string; color?: string; activeColor?: string }` · `LegendItem` = `{ label: string; color: string; value?: string }`
Data: `CHART_TONES`: `ChartTone[]` · `MONO_TONE`: `ChartTone`
Other exports: `resolveTone(index: number, color?: string, activeColor?: string) => ChartTone` · `describeDelta(delta: number) => { label: string; color: DeltaColor }` · `formatNumber(n: number)`

### charts — `@/components/application/charts/combo-chart-card`

**ComboChartCard** — Bar-plus-line combo chart with independent left and right axes, hover dimming, and a pulsing active dot.
| prop | type | default | doc |
|---|---|---|---|
| title? | `string` | `"Sessions"` | Header label; swaps to the hovered category while hovering. |
| data? | `ComboPoint[]` |  |  |
| bar? | `ComboSeries` |  | Bar series, read against the left axis. |
| line? | `ComboSeries` |  | Line series, read against the right axis. |
| headline? | `number` |  | Headline number at rest; defaults to the bar series' total. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("This year"). Ignored when `ranges` is set. |
| ranges? | `ComboRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| tiles? | `boolean` | `false` | Stat tiles under the chart: the bar total and the line average. |
| headlineFrom? | `"bar" \| "line"` | `"bar"` | Which series the big number reads from. Defaults to the bars. Switch it to `line` when the line is the headline metric and the bars are the supporting count: traffic against conversions, say, where the reader wants the traffic figure large and the conversions beside it. |
| caption? | `(row?: ComboPoint) => string` |  | Replaces the header caption. Receives the hovered row, or `undefined` at rest, so a caption can name several of a row's fields rather than only the one series the card would otherwise show. |
| className? | `string` |  |  |

Types: `ComboPoint` = `{ label: string } & Record<string, number | string>` · `ComboSeries` = `{ key: string; label: string; color?: string; activeColor?: string; format?: (n: number) => string }` · `ComboRange` = `ChartRange<{ data: ComboPoint[]; delta: number; headline: number }>`
Other exports: `ComboChartCardProps` (props of ComboChartCard)

### charts — `@/components/application/charts/funnel-chart-card`

**FunnelChartCard** — Horizontal flow funnel with curved or sharp tapers, centred conversion pills, mono option, and a value/name footer under every column.
| prop | type | default | doc |
|---|---|---|---|
| shape? | `FunnelShape` | `"curved"` | S-curve taper with layered edges (default) or a plain straight-edged trapezoid. |
| mono? | `boolean` | `false` | Single-ink look: bands in one grey, no per-stage hues. |
| title? | `string` | `"Sign-up funnel"` | Header label; swaps to the hovered stage's name while hovering. |
| stages? | `FunnelStage[]` |  |  |
| headline? | `number` |  | Headline number at rest; defaults to the first stage's value. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Last 30 days"). Ignored when `ranges` is set. |
| ranges? | `FunnelRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| className? | `string` |  |  |

Types: `FunnelStage` = `{ label: string; value: number; color?: string; activeColor?: string }` · `FunnelShape` = `"curved" | "sharp"` · `FunnelRange` = `ChartRange<{ stages: FunnelStage[]; delta: number; headline: number }>`
Other exports: `FunnelChartCardProps` (props of FunnelChartCard)

### charts — `@/components/application/charts/heatmap-chart-card`

**HeatmapChartCard** — Matrix heatmap card (rows × columns) with a theme-following ramp, hover-linked headline, and Less → More legend.
| prop | type | default | doc |
|---|---|---|---|
| title? | `string` | `"Active users"` | Header label; swaps to "Row · Column" while hovering a cell. |
| rows? | `HeatmapRow[]` |  |  |
| columns? | `string[]` |  |  |
| color? | `string` |  | Accent for the ramp; any CSS colour, defaults to chart-6 (blue). |
| activeColor? | `string` |  |  |
| max? | `number` |  | Value that maps to the fully saturated cell; defaults to the largest value. |
| headline? | `number` |  | Headline number at rest; defaults to the sum of all cells. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Last 7 days"). Ignored when `ranges` is set. |
| ranges? | `HeatmapRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| columnLabelEvery? | `number` |  | Show every n-th column label (default fits ~12 labels). |
| className? | `string` |  |  |

Types: `HeatmapRow` = `{ label: string; values: number[] }` · `HeatmapRange` = `ChartRange<{ rows: HeatmapRow[]; columns: string[]; max: number; delta: number; headline: number }>`
Other exports: `HeatmapChartCardProps` (props of HeatmapChartCard)

### charts — `@/components/application/charts/radar-chart-card`

**RadarChartCard** — Radar chart card with filled, dotted, lines-only, and centre-score variants, hover-linked headline, and multi-series legend.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `RadarVariant` | `"filled"` |  |
| title? | `string` |  | Header label ("Visitors"); swaps to the hovered category while hovering. |
| data? | `RadarPoint[]` |  |  |
| series? | `RadarSeries[]` |  |  |
| max? | `number` |  | Radius axis ceiling; defaults to the largest value across all series (100 for `score`). |
| headline? | `number` |  | Headline number at rest; defaults to the primary series' total. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Jan – Jun 2024"). Ignored when `ranges` is set. |
| ranges? | `RadarRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| alertBelow? | `number` |  | `score` only: axis values below this are painted rose. |
| scoreCaption? | `string \| ((score: number) => string)` |  | `score` only: caption under the centre score. Defaults to a qualitative label (Excellent / Strong / Fair / Needs work). |
| tiles? | `boolean` | `false` | Stat tiles under the chart, one per axis (primary series value): three per row, the last row stretched full width. The card grows to fit. |
| radiusScale? | `number` | `1` | Scales the plotted polygon inside the same chart area - `1.15` draws it 15% larger without touching the card, header or tiles. Axis labels move outward with it, so leave headroom above ~1.2. |
| plotOffsetY? | `number` | `0` | Nudges the plot (and the `score` disc that sits on it) within the chart area, in px - negative moves it up. Everything else stays put. |
| legend? | `"bottom" \| "top" \| "overlay"` | `"bottom"` | Where the multi-series legend sits: under the chart (default, adds a row), in the header beside the period pill, or overlaid along the bottom edge of the chart area (the radar nudges up to make room) - the last two keep the card the same height as a single-series one. |
| className? | `string` |  |  |

Types: `RadarPoint` = `{ label: string } & Record<string, number | string>` · `RadarSeries` = `{ key: string; label: string; color?: string; activeColor?: string }` · `RadarVariant` = `"filled" | "dots" | "lines" | "score"` · `RadarRange` = `ChartRange<{ data: RadarPoint[]; series: RadarSeries[]; delta: number; headline: number; max: number }>`
Other exports: `RadarChartCardProps` (props of RadarChartCard)

### charts — `@/components/application/charts/radial-chart-card`

**RadialChartCard** — Radial bar chart card: concentric rings (plain, labelled, or over a grid), single-value gauges, and a stacked half gauge.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `RadialVariant` | `"rings"` |  |
| title? | `string` | `"Visitors"` | Header label; swaps to the hovered item's name while hovering. |
| data? | `RadialDatum[]` |  |  |
| max? | `number` |  | The full-circle value. Rings default to 110% of the largest item so the biggest ring stops just short of closing; gauges default to the item total (so `stacked` fills the whole arc unless you pass a bigger goal). |
| headline? | `number` |  | Headline number at rest; defaults to the total of all items. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Jan – Jun 2024"). Ignored when `ranges` is set. |
| ranges? | `RadialRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| centerCaption? | `string` |  | Caption under the centre percentage of the gauge variants (default "of goal" for gauge/solid, the segment name for stacked). |
| tiles? | `boolean` | `false` | Stat tiles under the chart, one per item: three per row, the last row stretched full width (5 items → 3 + 2). The card grows to fit. |
| className? | `string` |  |  |

Types: `RadialDatum` = `{ label: string; value: number; color?: string; activeColor?: string }` · `RadialVariant` = `"rings" | "labels" | "grid" | "gauge" | "solid" | "stacked"` · `RadialRange` = `ChartRange<{ data: RadialDatum[]; max: number; delta: number; headline: number }>`
Other exports: `RadialChartCardProps` (props of RadialChartCard)

### charts — `@/components/application/charts/sankey-chart-card`

**SankeyChartCard** — Sankey flow card with pill nodes, target-tinted links, source and share labels, and hover isolation.
| prop | type | default | doc |
|---|---|---|---|
| title? | `string` | `"Tracked time"` | Header label; swaps to the hovered node / link while hovering. |
| nodes? | `SankeyNodeDatum[]` |  |  |
| links? | `SankeyLinkDatum[]` |  |  |
| headline? | `number` |  | Headline number at rest; defaults to the total flowing out of the source nodes. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("This week"). Ignored when `ranges` is set. |
| ranges? | `SankeyRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `defaultHours` |  |
| axisLabels? | `[string, string]` |  | Small captions under the left and right columns. |
| linkColor? | `"source" \| "target"` | `"source"` | Which end's colour a ribbon takes. `source` (default) makes every flow out of a node share that node's colour. |
| className? | `string` |  |  |

Types: `SankeyNodeDatum` = `{ name: string; color?: string; activeColor?: string }` · `SankeyLinkDatum` = `{ source: string | number; target: string | number; value: number }` · `SankeyRange` = `ChartRange<{ nodes: SankeyNodeDatum[]; links: SankeyLinkDatum[]; delta: number; headline: number }>`
Other exports: `SankeyChartCardProps` (props of SankeyChartCard)

### charts — `@/components/application/charts/scatter-chart-card`

**ScatterChartCard** — Scatter and bubble chart with grouped series, an optional size measure, hover isolation and stat tiles.
| prop | type | default | doc |
|---|---|---|---|
| title? | `string` | `"Revenue per account"` | Header label; swaps to the hovered point while hovering. |
| series? | `ScatterSeries[]` |  |  |
| axisLabels? | `[string, string]` |  | Captions under the plot: `[x, y]`. |
| bubble? | `boolean` |  | Force bubbles on/off; by default any `z` in the data turns them on. |
| headline? | `number` |  | Headline number at rest; defaults to the average y across every point. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("This quarter"). Ignored when `ranges` is set. |
| ranges? | `ScatterRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` | Formats the y measure (headline, axis, tiles). |
| formatX? | `(n: number) => string` | `compactNumber` | Formats the x measure (axis ticks, hovered point caption). |
| tiles? | `boolean` | `false` | Stat tiles under the chart, one per series (its average y). |
| className? | `string` |  |  |

Types: `ScatterPoint` = `{ x: number; y: number; z?: number; label?: string }` · `ScatterSeries` = `{ label: string; points: ScatterPoint[]; color?: string; activeColor?: string }` · `ScatterRange` = `ChartRange<{ series: ScatterSeries[]; delta: number; headline: number }>`
Other exports: `ScatterChartCardProps` (props of ScatterChartCard)

### charts — `@/components/application/charts/stage-bars-card`

**StageBarsCard** — Funnel stages as rounded horizontal pills with name, value, and share per stage, animated widths, and a mono option.
| prop | type | default | doc |
|---|---|---|---|
| title? | `string` | `"Pipeline"` | Header label; swaps to the hovered stage's name while hovering. |
| stages? | `StageBar[]` |  |  |
| mono? | `boolean` | `false` | Single-ink look: every pill in one grey, no per-stage hues. |
| showIcons? | `boolean` | `true` | Draw each stage's `icon` inside its bar (default). Set false to hide them without stripping the icons from your data. |
| headline? | `number` |  | Headline number at rest; defaults to the first stage's value. |
| delta? | `number` |  | Delta ratio for the chip, e.g. `0.052` → "+5.2%". |
| range? | `string` |  | Static period pill ("Last 30 days"). Ignored when `ranges` is set. |
| ranges? | `StageBarsRange[]` |  | Selectable periods - the pill becomes a dropdown and the selected range's fields override the top-level props. |
| defaultRange? | `string` |  | Initially selected range id (defaults to the first). |
| onRangeChange? | `(id: string) => void` |  |  |
| format? | `(n: number) => string` | `formatNumber` |  |
| className? | `string` |  |  |

Types: `StageBar` = `{ label: string; value: number; color?: string; activeColor?: string; icon?: ReactNode }` · `StageBarsRange` = `ChartRange<{ stages: StageBar[]; delta: number; headline: number }>`
Other exports: `StageBarsCardProps` (props of StageBarsCard)

### composer-loader — `@/components/application/composer-loader/composer-loader`

**ComposerLoader** — Loading state that wraps a chat composer — an iridescent light band orbiting the rim with a soft inward bloom, fading in while the agent works.
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| active? | `boolean` | `true` | Show the light. Fades in/out — flip it while awaiting a response. |
| colors? | `[string, string, string, string]` | `DEFAULT_COLORS` | Four gradient colors, spread across the pill left → right. |
| speed? | `number` | `4.5` | Seconds per full lap. |
| intensity? | `number` | `0.7` | Overall light opacity. |
| bloom? | `number` | `16` | How far the bloom bleeds inward from the rim, px. |
| bloomStrength? | `number` | `0.3` | Bloom layer opacity. |
| arc? | `number` | `120` | How much of the perimeter the band occupies, degrees (of 360). |
| reverse? | `boolean` | `false` | Reverse the travel direction. |
| radius? | `number` |  | Corner radius, px. Defaults to a full pill. |
| line? | `number` | `2.5` | Width of the crisp line, px; the tight glow scales with it. |
| bloomOnly? | `boolean` | `false` | Draw the wide bloom alone, no line or tight glow: a soft wash for a beam to lead. |
| surface? | `boolean` | `true` | Paint the pill surface behind the light (on by default). |
| taper? | `number` | `0` | Fade the band's two ends instead of cutting them, 0–1: the fraction of the band's length that ramps. Each layer is stacked as shorter, centred copies at a fraction of its opacity; the blur melts the steps together. |
| blend? | `CSSProperties["mixBlendMode"]` |  | How the light composites over what's beneath, e.g. `screen` to read as light on a surface. |
| offset? | `number` | `0` | Moves the band forward along the lap, as a fraction of the perimeter (0–1). Lets two loaders on one pill line up: a short beam with `offset` equal to the difference of the two arcs (as fractions) leads a wider glow tip to tip. |
| className? | `string` |  |  |

Other exports: `ComposerLoaderProps` (props of ComposerLoader)

### composer-panel — `@/components/application/composer-panel/composer-attachments`

**ComposerWithAttachments** — The Composer Panel carrying attachments: image and document tiles above the prompt, landing one after another with the upload ring drawing around each.
Extends: `Omit<ComposerPanelProps, "attachments" | "onRemoveAttachment">`
| prop | type | default | doc |
|---|---|---|---|
| attachments | `ComposerAttachment[]` |  | Files to show. `progress: 0` queues one for the simulated upload. |
| uploadDuration? | `number` | `1100` | How long one simulated upload takes, in milliseconds. |
| uploadGap? | `number` | `240` | Pause before a queued file starts drawing its ring, in milliseconds. |
| onAttachmentsChange? | `(attachments: ComposerAttachment[]) => void` |  | The list after a dismiss. |
| onUploadComplete? | `(attachment: ComposerAttachment) => void` |  |  |
| onAllUploaded? | `() => void` |  | Fires once every queued file has landed. |

Other exports: `ComposerWithAttachmentsProps` (props of ComposerWithAttachments)

### composer-panel — `@/components/application/composer-panel/composer-panel`

**PermissionMenu** — The permission picker: a pill that only paints its surface on hover, press, or while its menu is open, and a 323px panel with the four modes that opens upward like the add and model menus.
| prop | type | default | doc |
|---|---|---|---|
| value? | `ComposerPermission` |  | Controlled mode. Left out, the picker keeps its own selection. |
| defaultValue? | `ComposerPermission` | `"auto"` |  |
| onChange? | `(permission: ComposerPermission) => void` |  |  |
| learnMoreHref? | `string` |  | Where the panel's "Learn more" link button goes. |
| onLearnMore? | `() => void` |  | Handler for "Learn more" when it is a button rather than a link. |
| className? | `string` |  |  |

**ComposerStatusTab** — The grey tab on the card's top edge: 34px tall, inset 28px on each side, rounded 16 at the top only.
| prop | type | default | doc |
|---|---|---|---|
| branch? | `string` | `"Main"` |  |
| project? | `string` | `"project-sea"` |  |
| context? | `number` | `57` | Context window used, in percent. |
| className? | `string` |  |  |

**ComposerAttachmentTile** — One 56px tile: the thumbnail for images, otherwise the 24px plugin icon with the file name in 9px underneath.
| prop | type | default | doc |
|---|---|---|---|
| attachment | `ComposerAttachment` |  |  |
| onRemove? | `() => void` |  | Renders the dismiss in the top-right corner once the file has landed. |
| className? | `string` |  |  |

**ComposerAttachmentStrip** — The tile row, 8px apart, wrapping when it runs out of width.
| prop | type | default | doc |
|---|---|---|---|
| attachments | `ComposerAttachment[]` |  |  |
| onRemove? | `(id: string) => void` |  |  |
| className? | `string` |  |  |

**ComposerPanel** — The two-row AI chat composer: prompt on top, add, permission, model, mic and send controls below, and a status tab with branch, project folder and context meter hanging off the card.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| value? | `string` |  | Controlled draft. Left out, the field manages its own text. |
| onValueChange? | `(value: string) => void` |  |  |
| onSubmit? | `(value: string) => void` |  | Fires on the send button and on Enter (Shift+Enter breaks the line). |
| disabled? | `boolean` | `false` | Greys out send while a turn is in flight. |
| placeholder? | `string` | `"Hi, what do you need today?"` |  |
| permission? | `ComposerPermission` |  | Controlled permission mode; see `PermissionMenu`. |
| defaultPermission? | `ComposerPermission` |  | Starting mode when uncontrolled. Auto by default. |
| onPermissionChange? | `(permission: ComposerPermission) => void` |  |  |
| learnMoreHref? | `string` |  |  |
| onLearnMore? | `() => void` |  |  |
| model? | `string` |  | Controlled model id; see `ModelPicker` and `MODEL_PROVIDERS`. |
| defaultModel? | `string` |  |  |
| onModelChange? | `(modelId: string) => void` |  |  |
| effort? | `number` |  | Controlled effort stop, 0 to 5. |
| defaultEffort? | `number` |  |  |
| onEffortChange? | `(effort: number) => void` |  |  |
| providers? | `ModelProvider[]` |  | Your own catalogue for the picker's rail and rows. |
| attachments? | `ComposerAttachment[]` |  | Tiles above the prompt. Each one's `progress` drives its upload ring. |
| onRemoveAttachment? | `(id: string) => void` |  |  |
| status? | `ReactNode` |  | The tab on the card's top edge. Defaults to `ComposerStatusTab`; pass your own, or `null` to drop it. |
| inputRef? | `RefObject<HTMLTextAreaElement \| null>` |  | The field itself, for focus or a scripted demo. |

Types: `ComposerPermission` = `"auto" | "manual" | "plan" | "bypass"` · `ComposerPermissionOption` = `{ id: ComposerPermission; label: string; description: string; icon: typeof RiSpeedUpFill; flip?: boolean }` · `ComposerAttachmentKind` = `"image" | "document" | "spreadsheet" | "presentation" | "code" | "video"` · `ComposerAttachment` = `{ id: string; name: string; kind: ComposerAttachmentKind; src?: string; progress?: number }`
Data: `COMPOSER_PERMISSIONS`: `ComposerPermissionOption[]`
Other exports: `PermissionMenuProps` (props of PermissionMenu) · `ComposerStatusTabProps` (props of ComposerStatusTab) · `ComposerAttachmentTileProps` (props of ComposerAttachmentTile) · `ComposerAttachmentStripProps` (props of ComposerAttachmentStrip) · `ComposerPanelProps` (props of ComposerPanel)

### composer-panel — `@/components/application/composer-panel/model-picker`

**ModelPicker** — The Composer Panel's model picker.
| prop | type | default | doc |
|---|---|---|---|
| value? | `string` |  | Controlled model id. Left out, the picker keeps its own. |
| defaultValue? | `string` | `DEFAULT_MODEL` |  |
| onChange? | `(modelId: string) => void` |  |  |
| effort? | `number` |  | Controlled effort stop, 0 to 5 across `EFFORT_LEVELS`. |
| defaultEffort? | `number` | `DEFAULT_EFFORT` |  |
| onEffortChange? | `(effort: number) => void` |  |  |
| providers? | `ModelProvider[]` | `MODEL_PROVIDERS` |  |
| className? | `string` |  |  |

Types: `ModelOption` = `{ id: string; name: string }` · `ModelProvider` = `{ id: string; name: string; logo: string; logoSize?: 18 | 20; models: ModelOption[] }`
Data: `MODEL_PROVIDERS`: `ModelProvider[]`
Other exports: `ModelPickerProps` (props of ModelPicker) · `DEFAULT_MODEL`: `string` · `DEFAULT_EFFORT`: `number`

### dashboard — `@/components/application/dashboard/contributions-card`
Template: /templates/dashboard (see templates.md)

**ContributionsGrid** — The bare heatmap grid — hash-scattered tiers, accent color ramp, and a tooltip per cell.
| prop | type | default | doc |
|---|---|---|---|
| columns? | `number` | `GRID_COLUMNS` | 37 (dashboard card) or 38 (AI profile) — must exist in COLUMN_CLASSES. |
| accent? | `Accent` | `"violet"` |  |
| animateIn? | `boolean` | `false` | Pop the colored cells in softly on mount, in scattered (hashed) order. |
| className? | `string` |  |  |

**ContributionsCard** — GitHub-style contributions heat grid with swappable accent family.
| prop | type | default | doc |
|---|---|---|---|
| accent? | `Accent` | `"violet"` |  |
| className? | `string` |  |  |

Types: `Accent` = `(typeof ACCENTS)[number]`
Data: `ACCENTS`: `array(9)`

### dashboard — `@/components/application/dashboard/customers-table`
Template: /templates/dashboard (see templates.md)

**CustomersTable** — Customers table: toolbar (total + working filter selects + search), sortable column header row, rows with selection checkbox, avatar, status select, status chip, date, price chip, row actions — and a…
No props.

### dashboard — `@/components/application/dashboard/dashboard-header`
Template: /templates/dashboard (see templates.md)

**DashboardHeader** — Breadcrumb trail + page title row with header actions (notifications with unread count, Filters, Create ticket).
| prop | type | default | doc |
|---|---|---|---|
| onMenuClick? | `() => void` |  |  |

### dashboard — `@/components/application/dashboard/dashboard-shell`
Template: /templates/dashboard (see templates.md)

**DashboardShell** — Responsive layout host for the dashboard template. lg+ sidebar sits in-flow (collapsible via its own control) below lg sidebar is hidden; the header shows a hamburger that opens it as a slide-in draw…
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### dashboard — `@/components/application/dashboard/dashboard-sidebar`
Template: /templates/dashboard (see templates.md)

**DashboardSidebar** — The floating dashboard sidebar with team menu, nav, announcement, and user menu.
| prop | type | default | doc |
|---|---|---|---|
| mobile? | `boolean` | `false` | Rendered inside the mobile drawer: always expanded, close button instead of collapse. |
| onClose? | `() => void` |  |  |
| fluid? | `boolean` | `false` | Expanded width fills its container below `lg` instead of the fixed 260px (e.g. the landing page, where the sidebar isn't in a drawer). Collapsed width stays the fixed 60px rail at every breakpoint — the whole point of collapsing is to shrink, so it must never get overridden back… |
| showThemeToggle? | `boolean` | `true` | Hide the app-level theme control when the sidebar is used as marketing artwork. |
| selected? | `DashboardNavKey` | `"home"` | Which nav item shows the selected (filled blue) state. |
| items? | `DashboardNavItem[]` | `DASHBOARD_NAV` | Primary navigation rows. The Pro dashboard's set unless a screen brings its own. |
| flat? | `boolean` | `false` | Removes the floating panel treatment for a sidebar revealed beneath mobile content. |
| className? | `string` |  |  |

Types: `DashboardNavItem` = `{ key: string; label: string; icon: IconComponent; href?: string; badge?: string | number }` · `DashboardNavKey` = `string`
Data: `DASHBOARD_NAV`: `DashboardNavItem[]`

### dashboard — `@/components/application/dashboard/dashboard-team-menu`
Template: /templates/dashboard (see templates.md)

**DashboardTeamMenu** — Dropdown opened from the sidebar's "Board team" card.
| prop | type | default | doc |
|---|---|---|---|
| collapsed? | `boolean` | `false` |  |
| className? | `string` |  |  |

### dashboard — `@/components/application/dashboard/dashboard-user-menu`
Template: /templates/dashboard (see templates.md)

**AccountMenuContent** — The dropdown's contents — users-with-access list + Add user/Manage actions — split out so other triggers (e.g. the calendar template's inbox icon) can open the same panel without duplicating it.
| prop | type | default | doc |
|---|---|---|---|
| onSelect | `() => void` |  |  |

**DashboardUserMenu** — Dropdown opened from the sidebar's workspace switcher (avatar + name + chevron) at the top.
| prop | type | default | doc |
|---|---|---|---|
| collapsed? | `boolean` | `false` |  |
| suppressHover? | `boolean` | `false` | Prevents expansion from creating a hover state under a stationary pointer. |
| onHoverSuppressionEnd? | `() => void` |  | Re-arms hover after the pointer fully leaves the trigger. |
| avatarClassName? | `string` |  |  |

### dashboard — `@/components/application/dashboard/earnings-chart-card`
Template: /templates/dashboard (see templates.md)

**EarningsChartCard** — Bar chart card with period switcher, count-up headline, and hover outline.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### dashboard — `@/components/application/dashboard/line-chart-card`
Template: /templates/dashboard (see templates.md)

**LineChartCard** — Line/area chart card with gradient fill, curved or sharp interpolation, and animated active dot.
| prop | type | default | doc |
|---|---|---|---|
| shape? | `LineChartShape` | `"curved"` |  |
| className? | `string` |  |  |

Types: `LineChartShape` = `"curved" | "sharp"`

### dashboard — `@/components/application/dashboard/orders-chart-card`

**OrdersChartCard** — Free chart card: a year of monthly orders as bars, this year beside last year for every month, with a count-up headline, delta chip and hover readout.
| prop | type | default | doc |
|---|---|---|---|
| data? | `OrdersPoint[]` | `ORDERS_DATA` | Twelve points, one per month; defaults to the demo year. |
| title? | `string` | `"Orders"` | Headline label when no month is hovered. |
| className? | `string` |  |  |

Types: `OrdersPoint` = `{ label: string; current: number; previous: number }`
Data: `ORDERS_DATA`: `OrdersPoint[]`

### dashboard — `@/components/application/dashboard/recent-hires-card`
Template: /templates/dashboard (see templates.md)

**RecentHiresCard** — "Recent hires" card: metric header, 2×2 grid of people cards, pagination.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### dashboard — `@/components/application/dashboard/revenue-chart-card`

**RevenueChartCard** — Free chart card: a year of monthly revenue as an area against the year before, with a count-up headline, delta chip and hover readout per month.
| prop | type | default | doc |
|---|---|---|---|
| data? | `RevenuePoint[]` | `REVENUE_DATA` | Twelve points, one per month; defaults to the demo year. |
| title? | `string` | `"Revenue"` | Headline label when no month is hovered. |
| className? | `string` |  |  |

Types: `RevenuePoint` = `{ label: string; current: number; previous: number }`
Data: `REVENUE_DATA`: `RevenuePoint[]`

### dashboard — `@/components/application/dashboard/stat-cards`
Template: /templates/dashboard (see templates.md)

**StatCards** — KPI stat card row with delta chips.
| prop | type | default | doc |
|---|---|---|---|
| variant? | `StatCardsVariant` | `"plain"` |  |
| stats? | `Stat[]` |  | KPI cards to render; defaults to demo metrics matching the variant. |
| count? | `number` |  | How many KPI cards to render (from the start of the list). |
| columns? | `1 \| 2 \| 4` | `4` | Columns at the widest breakpoint - 2 keeps the grid two-up for narrower hosts (docs previews, split layouts), 1 pins a single column at every width. |
| className? | `string` |  |  |

Types: `StatCardsVariant` = `"plain" | "footer"` · `StatTone` = `"blue" | "orange" | "purple" | "pink" | "sky" | "emerald"` · `Stat` = `{ icon: IconComponent; label: string; value: string; delta: string; deltaColor: "lime" | "rose" | "neutral"; tone?: StatTone; caption?: string; hint?: string }`

### data-table — `@/components/application/data-table/data-table`

**DataTableExample** — TanStack-powered data table with sorting, selection, and pagination.
| prop | type | default | doc |
|---|---|---|---|
| showSizeToggle? | `boolean` | `true` | Show the Normal / Compact density control below the table. |
| pageSize? | `number` | `PER_PAGE` | Rows per page - the landing collage shows the 5-row crop from Figma. |

### finance — `@/components/application/finance/finance-data`
Template: /templates/finance (see templates.md)

Data: `FINANCE_STATS`: `Stat[]` · `CASH_FLOW_NODES`: `SankeyNodeDatum[]` · `CASH_FLOW_RANGES`: `SankeyRange[]` · `SPENDING_RANGES`: `RadialRange[]` · `PORTFOLIO_SERIES`: `ScatterSeries[]` · `PORTFOLIO_RANGES`: `ScatterRange[]` · `SPENDING_WEEK_COLUMNS`: `Array.from(…)` · `SPENDING_HEAT_RANGES`: `HeatmapRange[]`
Other exports: `currency(n: number)` · `percent(n: number)`

### finance — `@/components/application/finance/finance-header`
Template: /templates/finance (see templates.md)

**FinanceHeader** — Finance template header — the same breadcrumb + title + action-row recipe as `DashboardHeader` and `MedicalHeader`, with money-flavored actions.
| prop | type | default | doc |
|---|---|---|---|
| onMenuClick? | `() => void` |  |  |

### finance — `@/components/application/finance/finance-shell`
Template: /templates/finance (see templates.md)

**FinanceShell** — Finance template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### finance — `@/components/application/finance/transactions-table`
Template: /templates/finance (see templates.md)

**TransactionsTable** — Transactions table for the finance template — the customers-table recipe (toolbar with working filters + search, sortable headers, selection, pagination) with ledger columns: category icon tile + pay…
No props.

### hr — `@/components/application/hr/employees-table`
Template: /templates/hr (see templates.md)

**EmployeesTable** — Employees table for the HR template — the customers-table recipe (toolbar with working filters + search, sortable headers, selection, pagination) with people columns: avatar + name and role, work sta…
No props.

### hr — `@/components/application/hr/hr-data`
Template: /templates/hr (see templates.md)

Data: `HR_STATS`: `Stat[]` · `PIPELINE_RANGES`: `StageBarsRange[]` · `ENGAGEMENT_RANGES`: `RadarRange[]` · `HIRES_BAR`: `ComboSeries` · `ATTRITION_LINE`: `ComboSeries` · `GROWTH_RANGES`: `ComboRange[]` · `TEAM_TABS`: `BarListTab[]`

### hr — `@/components/application/hr/hr-header`
Template: /templates/hr (see templates.md)

**HrHeader** — HR template header — the same breadcrumb + title + action-row recipe as `DashboardHeader` and `MedicalHeader`, with people-flavored actions.
| prop | type | default | doc |
|---|---|---|---|
| onMenuClick? | `() => void` |  |  |

### hr — `@/components/application/hr/hr-shell`
Template: /templates/hr (see templates.md)

**HrShell** — HR management template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### landing — `@/components/application/landing/liquid-glass-config`

**useGlassConfig()** — The glass config for whichever theme is showing.
returns `GlassConfig`
No parameters.

Types: `GlassConfig` = `{ frost: number; saturate: number; refraction: number; depth: number; splay: number; dispersion: number; tintColor: string; tintOpacity: number; sheenColor: string; sheenOpacity: number; sheenAngle: number; rimWidth: number; rimAngle: numb…`
Data: `GLASS_DEFAULTS`: `GlassConfig` · `GLASS_PRESETS`: `Record<string, GlassConfig>` · `GLASS_DARK_DEFAULTS`: `GlassConfig`
Other exports: `glassLightStore`: `createTuningStore<GlassConfig>(…)` · `glassDarkStore`: `createTuningStore<GlassConfig>(…)` · `glassTuningSection(theme: "light" | "dark", values: GlassConfig) => TuningSection` · `rgba(hex: string, alpha: number)`

### landing — `@/components/application/landing/liquid-glass`

**LiquidGlassSurface** — The Apple Liquid Glass material, as a layer you drop into any positioned box.
Extends: `Partial<GlassConfig>`
| prop | type | default | doc |
|---|---|---|---|
| radius? | `number \| "full"` | `10` | Corner radius of the lens core, in px — match the host's own radius. `"full"` tracks half the measured height, for pills. |
| interactive? | `boolean` | `false` | Respond to hover on an ancestor marked `group`. The surface cannot detect hover itself (it is `pointer-events-none`), so hosts opt in and the CSS in globals.css does the swap. Named `interactive` rather than `hover*` to stay clear of the config's own `hoverLift` distance. |
| refract? | `boolean` | `true` | Render the SVG displacement (refraction) layer. Disable inside scaled frames: `backdrop-filter: url()` uses userSpaceOnUse coordinates that Chromium mismatches under ancestor transforms, painting the square map region over the rounded surface. Frost, tint, sheen, and rim remain. |
| className? | `string` |  |  |

**useLiquidGlassHost()** — Chrome for the element that *hosts* a glass surface: the drop shadow, and the lift/scale on hover.
| param | type | default | doc |
|---|---|---|---|
| overrides? | `LiquidGlassSettings` |  |  |

**LiquidGlassChip**
Extends: `Partial<GlassConfig>`
| prop | type | default | doc |
|---|---|---|---|
| children | `ReactNode` |  |  |
| className? | `string` |  |  |
| radius? | `number \| "full"` | `10` |  |

Types: `LiquidGlassSettings` = `Partial<GlassConfig>`
Other exports: `LiquidGlassSurfaceProps` (props of LiquidGlassSurface) · `LIQUID_GLASS_RESET`: `string`

### landing — `@/components/application/landing/tuning/tuning-panel`

**TuningPanel** — TEMPORARY tuning panel, shared by the ray shader and the glass material.
| prop | type | default | doc |
|---|---|---|---|
| sections | `TuningSection[]` |  |  |

Types: `TuningSection` = `{ id: string; label: string; groups: TuningGroup[]; values: TuningValues; order: string[]; presets?: Record<string, TuningValues>; constName: string; typeName: string; onChange: (patch: TuningValues) => void; onReset: () => void }`
Re-exports: from `@/components/application/landing/tuning/tuning-types`: `TuningControl`, `TuningGroup`

### landing — `@/components/application/landing/tuning/tuning-store`

Types: `TuningValues` = `Record<string, number | string>` · `TuningStore` = `{ subscribe: (listener: () => void) => () => void; get: () => T; getDefaults: () => T; update: (patch: Partial<T>) => void; reset: () => void }`
Other exports: `createTuningStore<T extends TuningValues>(storageKey: string, defaults: T) => TuningStore<T>` · `isTuningEnabled() => boolean` · `isTuningEnabledOnServer() => boolean` · `subscribeToNothing()`

### landing — `@/components/application/landing/tuning/tuning-types`

Types: `TuningControl` = `{ key: string; label: string; type: "range"; min: number; max: number; step: number; hint: string } | { key: string; label: string; type: "color"; hint: string…` · `TuningGroup` = `{ title: string; controls: TuningControl[] }`

### marketing — `@/components/application/marketing/campaigns-table`
Template: /templates/marketing (see templates.md)

**CampaignsTable** — Campaigns table for the marketing template — the customers-table recipe (toolbar with working filters + search, sortable headers, selection, pagination) with campaign columns: channel icon tile + nam…
No props.

### marketing — `@/components/application/marketing/marketing-data`
Template: /templates/marketing (see templates.md)

Data: `MARKETING_STATS`: `Stat[]` · `FUNNEL_RANGES`: `FunnelRange[]` · `SPEND_RANGES`: `RadialRange[]` · `TRAFFIC_TABS`: `BarListTab[]` · `SPEND_BAR`: `ComboSeries` · `ROAS_LINE`: `ComboSeries` · `SPEND_ROAS_RANGES`: `ComboRange[]` · `VISITOR_SERIES`: `AreaSeries[]` · `VISITOR_RANGES`: `AreaRange[]`
Other exports: `currency(n: number)` · `compactCurrency(n: number)` · `compactNumber(n: number)` · `multiplier(n: number)`

### marketing — `@/components/application/marketing/marketing-header`
Template: /templates/marketing (see templates.md)

**MarketingHeader** — Marketing template header — the same breadcrumb + title + action-row recipe as `DashboardHeader` and `MedicalHeader`, with campaign-flavored actions.
| prop | type | default | doc |
|---|---|---|---|
| onMenuClick? | `() => void` |  |  |

### marketing — `@/components/application/marketing/marketing-shell`
Template: /templates/marketing (see templates.md)

**MarketingShell** — Marketing analytics template — same floating sidebar / mobile-drawer shell as `DashboardShell` and `MedicalShell`.
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### medical — `@/components/application/medical/activity-rings-card`
Template: /templates/medical (see templates.md)

**ActivityRingsCard** — Apple Watch-style concentric goal rings with stat tiles.
| prop | type | default | doc |
|---|---|---|---|
| selectedDay? | `SelectedDay \| null` | `null` |  |
| className? | `string` |  |  |

### medical — `@/components/application/medical/important-alerts-card`
Template: /templates/medical (see templates.md)

**ImportantAlertsCard** — Alert feed: tinted icon circle, title + description, and a soft date pill absolutely pinned to the row's top-right corner.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### medical — `@/components/application/medical/medical-data`
Template: /templates/medical (see templates.md)

Types: `DayActivity` = `{ move: { pct: number; value: string }; exercise: { pct: number; value: string }; running: { pct: number; value: string } }` · `SelectedDay` = `{ month: number; day: number }`
Data: `YEAR`: `number` · `MONTHS`: `array(12)`
Other exports: `ringPct(month: number, day: number, ring: number)` · `dayActivity(month: number, day: number) => DayActivity`

### medical — `@/components/application/medical/medical-header`
Template: /templates/medical (see templates.md)

**MedicalHeader** — Figma source: Board UI → medical profile dashboard → Frame 60 (node 3950:5627, "Medical Profile" breadcrumb icon is Remix `asterisk`) + Frame 50 (node 3950:5645) for the title/actions row — same brea…
| prop | type | default | doc |
|---|---|---|---|
| onMenuClick? | `() => void` |  |  |

### medical — `@/components/application/medical/medical-shell`
Template: /templates/medical (see templates.md)

**MedicalShell** — Same floating sidebar / mobile-drawer shell as `DashboardShell` and `CalendarShell` — two rows of three 330px-tall cards (node 3950:5655), then the patients table.
| prop | type | default | doc |
|---|---|---|---|
| contained? | `boolean` | `false` |  |

### medical — `@/components/application/medical/most-active-days-card`
Template: /templates/medical (see templates.md)

**MostActiveDaysCard** — Continuous vertical month calendar with per-day mini activity rings.
| prop | type | default | doc |
|---|---|---|---|
| selectedDay? | `SelectedDay \| null` | `null` |  |
| onSelectDay? | `(day: SelectedDay) => void` |  |  |
| className? | `string` |  |  |

### medical — `@/components/application/medical/patient-info-card`
Template: /templates/medical (see templates.md)

**PatientInfoCard** — Patient photo, name, and a stack of label/value rows.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### medical — `@/components/application/medical/patients-table`
Template: /templates/medical (see templates.md)

**PatientsTable** — Figma source: Board UI → medical profile dashboard → Frame 89 (node 3950:5981) — Figma reuses the dashboard's customers table verbatim (same "Purchase / Status / Last updated / Price" columns, "1,262…
No props.

### medical — `@/components/application/medical/sleep-score-card`
Template: /templates/medical (see templates.md)

**SleepScoreCard** — Segmented score ring with hover-focused sub-scores and metric rows.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### medical — `@/components/application/medical/steps-card`
Template: /templates/medical (see templates.md)

**StepsCard** — Weekly steps bar chart with week switcher, count-up headline, and hover outline.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |

### medical — `@/components/application/medical/week-range-pill`
Template: /templates/medical (see templates.md)

**WeekRangePill** — Pass `onPrev`/`onNext` to make the chevrons real buttons (the Most active days month switcher); omit them for the decorative static pill used by the other cards, where Figma shows the same fixed rang…
| prop | type | default | doc |
|---|---|---|---|
| label | `string` |  |  |
| onPrev? | `() => void` |  |  |
| onNext? | `() => void` |  |  |
| className? | `string` |  | Override the default 151px width (e.g. the narrower month switcher). |

### notification-center — `@/components/application/notification-center/notification-center`

**NotificationCenter** — Tabbed activity inbox with grouped notifications, unread state, avatars, status icons, and inline actions.
Extends: `Omit<HTMLAttributes<HTMLDivElement>, "onChange">`
| prop | type | default | doc |
|---|---|---|---|
| notifications | `NotificationCenterItem[]` |  |  |
| defaultTab? | `NotificationCenterTab` | `"all"` |  |
| tab? | `NotificationCenterTab` |  |  |
| onTabChange? | `(tab: NotificationCenterTab) => void` |  |  |
| onAction? | `(notificationId: string, actionId: string) => void` |  |  |
| title? | `string` | `"Notifications"` |  |
| emptyMessage? | `string` | `"You’re all caught up."` |  |
| ref? | `Ref<HTMLDivElement>` |  |  |
| className | — |  | (inherited) |

Types: `NotificationCenterTab` = `"all" | "mentions" | "system"` · `NotificationCenterCategory` = `Exclude<NotificationCenterTab, "all"> | "activity"` · `NotificationCenterStatus` = `"neutral" | "information" | "success" | "error"` · `NotificationCenterAction` = `{ id: string; label: string; variant?: ButtonProps["variant"] }` · `NotificationCenterItem` = `{ id: string; category: NotificationCenterCategory; group: string; title: string; description: string; timestamp: string; unread?: boolean; status?: NotificationCenterStatus; icon?: IconComponent; avatar?: Pick<AvatarProps, "src" | "alt" |…`
Other exports: `NotificationCenterProps` (props of NotificationCenter)

### notification-center — `@/components/application/notification-center/template-notification-center-menu`

**TemplateNotificationCenterMenu**
| prop | type | default | doc |
|---|---|---|---|
| notifications? | `NotificationCenterItem[]` | `TEMPLATE_NOTIFICATIONS` |  |
| unreadCount? | `number` |  |  |

### questionnaire — `@/components/application/questionnaire/questionnaire`

**Questionnaire** — Plan-mode questions as a chat card: one question per step with checkbox or numbered rows, a free-text Other row, step pills and Previous / Next, sliding between questions as the card animates to each…
| prop | type | default | doc |
|---|---|---|---|
| questions | `QuestionnaireQuestion[]` |  |  |
| select? | `QuestionnaireSelect` | `"multiple"` | Selection mode for questions that do not set their own. |
| step? | `number` |  | Zero-based index of the visible question (controlled). |
| defaultStep? | `number` | `0` |  |
| onStepChange? | `(step: number) => void` |  |  |
| answers? | `QuestionnaireAnswers` |  |  |
| defaultAnswers? | `QuestionnaireAnswers` |  |  |
| onAnswersChange? | `(answers: QuestionnaireAnswers) => void` |  |  |
| onComplete? | `(answers: QuestionnaireAnswers) => void` |  | Fires with every answer once the last question is answered. |
| onDismiss? | `() => void` |  | Shows the dismiss control in the corner and receives its press. |
| advanceDelay? | `number` | `180` | How long a single-select pick stays visible before the next question slides in (ms). |
| labels? | `QuestionnaireLabels` |  |  |
| className? | `string` |  |  |

Types: `QuestionnaireSelect` = `"single" | "multiple"` · `QuestionnaireOption` = `{ value: string; label: ReactNode; description?: ReactNode }` · `QuestionnaireQuestion` = `{ id: string; question: string; select?: QuestionnaireSelect; options: QuestionnaireOption[]; other?: boolean | { label?: string; placeholder?: string }; stepLabel?: string }` · `QuestionnaireAnswer` = `{ values: string[]; other?: string }` · `QuestionnaireAnswers` = `Record<string, QuestionnaireAnswer>` · `QuestionnaireLabels` = `{ previous?: string; next?: string; complete?: string; other?: string; otherPlaceholder?: string }`
Other exports: `QuestionnaireProps` (props of Questionnaire)

### settings — `@/components/application/settings/plan-art-flame`

**PlanArtFlame** — The "Current plan" artwork (settings-plan-art.png) rendered through a WebGL fragment shader as a burning, wind-torn flag: wave the image UVs ripple with two crossed sine waves plus low-freq fbm turbu…
| prop | type | default | doc |
|---|---|---|---|
| src? | `string` |  |  |
| className? | `string` |  |  |

### settings — `@/components/application/settings/settings-general`

**SettingsGeneral** — Taller than the 614px modal, so the pane scrolls within the shell.
| prop | type | default | doc |
|---|---|---|---|
| planArtSrc? | `string` |  |  |

### settings — `@/components/application/settings/settings-modal`

**SettingsModal** — Controlled multi-page settings dialog with General, Profile, Tools, and Storage views.
| prop | type | default | doc |
|---|---|---|---|
| isOpen | `boolean` |  | Controlled open state, owned by the host page, sidebar, or menu. |
| onClose | `() => void` |  | Called by the backdrop, close button, and Escape key. |
| defaultPage? | `SettingsPage` | `"general"` | Page selected each time the modal opens. |
| planArtSrc? | `string` |  | Optional product artwork used by the animated Current plan card. |

Types: `SettingsPage` = `"general" | "profile" | "storage" | "tools"`
Other exports: `SettingsModalProps` (props of SettingsModal)

### settings — `@/components/application/settings/settings-profile`

**SettingsProfile** — Two cards, 24px apart: 1. identity Email / First name / Last name as editable design-system Inputs (small, 202px — mail icon on Email), Date of birth (white date-picker trigger, 202px) 2. account Boa…
| prop | type | default | doc |
|---|---|---|---|
| onSaved? | `() => void` |  |  |

### settings — `@/components/application/settings/settings-rows`

**SettingsCard** — Grouped card — rows divide themselves with borders that respect pl-12.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children | `ReactNode` |  |  |

**SettingsSectionLabel** — Muted 13px section heading above a card ("Pull Requests", "Notifications").
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children | `ReactNode` |  |  |

**SettingsRow** — One label + control row.
| prop | type | default | doc |
|---|---|---|---|
| label | `string` |  |  |
| description? | `string` |  |  |
| children? | `ReactNode` |  |  |

**SettingsValueField** — The grey read-only value field (Figma "Input" instances — bg background/tertiary, h 32, radius/2lg, 202px wide).
| prop | type | default | doc |
|---|---|---|---|
| icon? | `ComponentType<{ className?: string; "aria-hidden"?: boolean \| "true" \| "false" }>` |  |  |
| children | `ReactNode` |  |  |
| muted? | `boolean` | `false` | Secondary text color (e.g. the truncated Device ID). |
| className? | `string` |  |  |

### settings — `@/components/application/settings/settings-storage`

**SettingsStorage** — Dropzone (533×164, radius/2xl): default bg background/secondary, 2px DASHED border/checkbox/default, 40px background/quaternary circle with a white 24px upload-cloud-2-line, "Drag and drop to upload…
No props.

### settings — `@/components/application/settings/settings-tools`

**SettingsTools** — The settings modal's Tools page — MCP server management, structured after the classic tools/servers settings layout: a scope switcher (per-project pills), an Authentication toggle, the selected scope…
No props.

### task-list — `@/components/application/task-list/task-list`

**TaskList** — Streaming agent task log: tasks reveal step by step with soft height, blur, and a shimmering running title.
| prop | type | default | doc |
|---|---|---|---|
| tasks | `TaskListTask[]` |  |  |
| run? | `boolean` | `true` | Pauses and resumes the reveal. Hold it false to keep the log from starting on mount, then flip it true when the user sends. Toggling it back resumes where it stopped; to replay from the top, change the element `key`. |
| stepInterval? | `number` | `850` | Milliseconds between reveals. Default 850. |
| startDelay? | `number` | `320` | Milliseconds before the first reveal. Default 320. |
| revealed? | `number` |  | Drive the reveal yourself from real agent events. Counts units, where each task contributes one header plus one per step. Disables the internal timer. |
| collapseOnComplete? | `boolean \| "all"` | `false` | Collapse finished tasks down to their headers. `true` collapses each task the moment its own steps have landed, so the log tidies itself as it runs. `"all"` instead holds every task open until the whole run lands, then collapses them together as one motion. Default false. |
| working? | `string \| false` | `"Working"` | The indicator that sits at the tail of the log while it is still running, so it always ends on the thing being worked on rather than on the last thing finished. Pass a label to change it, or `false` to drop it. |
| onComplete? | `() => void` |  | Fires once, after the last step lands. |
| className? | `string` |  |  |

Types: `TaskListChip` = `{ label: string; icon?: ReactNode }` · `TaskListStep` = `{ label: string; chips?: TaskListChip[] }` · `TaskListTask` = `{ title: string; runningTitle?: string; icon?: ComponentType<{ className?: string }>; steps: TaskListStep[] }`
Other exports: `TaskListProps` (props of TaskList)

### theme — `@/components/application/theme/theme-toggle`

**useThemeMode()**
returns `ThemeMode`
No parameters.

**ThemeToggle** — Manual light/dark control.
| prop | type | default | doc |
|---|---|---|---|
| collapsed? | `boolean` | `false` | Compact icon-only treatment for a collapsed sidebar rail. |
| appearance? | `"sidebar" \| "segmented" \| "sidebar-segmented" \| "glass-segmented"` | `"sidebar"` | Visual treatment for the control. `glass-segmented` is the landing nav's skin: literal black/white rather than theme tokens, because it sits on the hero shader's near-white band in both themes and a token that follows the page would invert out of sight in dark mode. |
| className? | `string` |  |  |
| transitionDuration? | `number` | `THEME_TRANSITION_DURATION` | Circular reveal duration in milliseconds. |

Types: `ThemeMode` = `"light" | "dark"`
Other exports: `ThemeToggleProps` (props of ThemeToggle) · `THEME_STORAGE_KEY`: `string` · `THEME_CHANGE_EVENT`: `string` · `applyTheme(theme: ThemeMode, { persist = true }: { persist?: boolean } = {})` · `applyThemeWithTransition(theme: ThemeMode, { origin = null, element = null, duration = THEME_TRANSITION_DURATION, }: { origin?: ThemeTransitionOrigin | null; element?: HTMLElement | n…`

### web-search — `@/components/application/web-search/web-search`

**WebSearch** — Streaming research trail: the queries an agent ran and the sources it opened, with real site marks.
| prop | type | default | doc |
|---|---|---|---|
| steps | `WebSearchStep[]` |  |  |
| run? | `boolean` | `true` | Pauses and resumes. Change the element `key` to replay from the top. |
| stepInterval? | `number` | `850` | Milliseconds between reveals. Default 850. |
| startDelay? | `number` | `320` | Milliseconds before the first reveal. Default 320. |
| revealed? | `number` |  | Drive the reveal from real events; disables the internal timer. |
| working? | `string \| false` | `"Working"` | The indicator that sits at the tail of the trail while the search is still running, so the log always ends on the thing being worked on rather than on the last thing finished. Pass a label to change it, or `false` to drop it. |
| onComplete? | `() => void` |  | Fires once, after the last step lands. |
| className? | `string` |  |  |

Types: `WebSearchBrand` = `SocialProvider` · `WebSearchSource` = `{ title: string; domain: string; href?: string; brand?: WebSearchBrand; icon?: ReactNode }` · `WebSearchStep` = `{ label: string; query?: string; brand?: WebSearchBrand; icon?: ComponentType<{ className?: string }>; meta?: string; dwell?: number; sources?: WebSearchSource[]; heading?: boolean }`
Other exports: `WebSearchProps` (props of WebSearch)

## timbal

### assistant-pill — `@/components/timbal/assistant-pill`

**AssistantPill**
Extends: `Omit<AppCopilotProps, "workforceId" | "hideTrigger" | "triggerLabel">`
| prop | type | default | doc |
|---|---|---|---|
| workforceId? | `string` |  |  |
| label? | `string` | `"Assistant"` | Pill text + panel label. Default "Assistant". |
| className? | `string` |  | Extra classes on the pill (e.g. lift it above a bottom bar). |
| open | — |  | (inherited) |
| defaultOpen? | — | `false` | (inherited) |
| onOpenChange | — |  | (inherited) |
| components | — |  | (inherited) |

Other exports: `AssistantPillProps` (props of AssistantPill)

### chat — `@/components/timbal/chat/attachment-tiles`

**useTileAttachments()** — Projects the runtime's composer attachments (assistant-ui `Attachment[]`) onto BoardUI's `ComposerAttachment` tiles. - `kind` comes from the MIME type first, the extension second, so the tile picks t…
returns `ComposerAttachment[]`
| param | type | default | doc |
|---|---|---|---|
| attachments | `readonly Attachment[]` |  |  |

Other exports: `attachmentKind(attachment: Attachment) => ComposerAttachmentKind`

### chat — `@/components/timbal/chat/chrome`

Other exports: `boardChatComponents`: `ThreadComponents` · `boardChatComponentsLite`: `ThreadComponents`

### chat — `@/components/timbal/chat/composer-panel`

**BoardComposerPanel** — BoardUI Pro `ComposerPanel` mounted as the `Composer` slot of `TimbalChat`.
Props: `ComposerProps` from `@timbal-ai/timbal-react` (external — members not indexed); destructured: `placeholder` = `"Ask me anything"`, `showAttachments`, `noAutoFocus`, `className`

### chat — `@/components/timbal/chat/composer`

**BoardComposer** — BoardUI composer pill mounted as the `Composer` slot of `TimbalChat`.
Props: `ComposerProps` from `@timbal-ai/timbal-react` (external — members not indexed); destructured: `placeholder` = `"Ask me anything"`, `showAttachments`, `toolbar`, `noAutoFocus`, `className`

### chat — `@/components/timbal/chat/context`

**BoardChatProvider**
| prop | type | default | doc |
|---|---|---|---|
| value | `BoardChatWorkforces` |  |  |
| children | `ReactNode` |  |  |

**useBoardChatWorkforces()** — The page-level workforce selection, or `null` when no provider is mounted.
No parameters.

Types: `BoardChatWorkforces` = `Pick<UseWorkforcesResult, "workforces" | "selectedId" | "setSelectedId" | "selected">`

### chat — `@/components/timbal/chat/frame`

**ChatFrame** — ChatFrame — the BoardUI Pro `ai-chat` container grammar (Figma "ai_chat" → Chat_container) as the surface every Timbal chat sits on.
| prop | type | default | doc |
|---|---|---|---|
| header? | `ReactNode` |  |  |
| children | `ReactNode` |  |  |
| className? | `string` |  |  |

**ChatFrameHeader** — The container's header row: `project › chat` breadcrumb on the left, icon actions on the right (px-4 pt-4, the template's measurements).
| prop | type | default | doc |
|---|---|---|---|
| crumbs | `ChatFrameCrumb[]` |  |  |
| actions? | `ReactNode` |  |  |
| className? | `string` |  |  |

Types: `ChatFrameCrumb` = `{ label: string; icon?: RemixiconComponentType; href?: string; current?: boolean }`

### chat — `@/components/timbal/chat/history-rail`

**ChatHistoryRail**
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| workforceId? | `string` |  | Scope the list to this workforce (recommended; the API lists everything otherwise). |
| activeId? | `string` |  | The conversation currently open, if any. |
| newChatPath? | `string` | `"/chat"` |  |
| conversationPath? | `(id: string) => string` | `` (id) => `/chat/${encodeURIComponent(id)}` `` |  |
| user? | `ShellUser` |  |  |
| mobile? | `boolean` | `false` | Rendered inside the phone drawer: full width, close control. |
| onClose? | `() => void` |  |  |
| onNavigate? | `() => void` |  | Fired when a row is clicked (drawers close on it). |
| refreshKey? | `number` | `0` | Bump to re-list from the first page (e.g. after a new thread gets its id). |
| className? | `string` |  |  |

Other exports: `ChatHistoryRailProps` (props of ChatHistoryRail) · `conversationLabel(run: RunPreview) => string` · `relativeTime(iso?: string) => string`

### chat — `@/components/timbal/chat/messages`

**BoardUserMessage** — BoardUI Pro message chrome for the Timbal thread (`UserMessage` / `AssistantMessage` slots).
No props.

**BoardAssistantMessage**
No props.

### chat — `@/components/timbal/chat/tools`

**TimbalToolPart** — `tools.Override` for the BoardUI assistant message: tool calls rendered with BoardUI's agent log components on top of the Timbal runtime. - A result that parses as a registered Timbal artifact (chart…
No props.

Other exports: `humanizeToolName(name: string)` · `summarizeArgs(args: unknown, argsText?: string) => string | undefined` · `previewResult(result: unknown) => string | undefined` · `collectSources(result: unknown) => WebSearchSource[]`

### chat — `@/components/timbal/chat/welcome`

**BoardWelcome** — BoardUI welcome (empty state) for the Timbal thread — the `Welcome` slot.
Props: `ThreadWelcomeProps` from `@timbal-ai/timbal-react` (external — members not indexed); destructured: `config`, `suggestions`, `showWelcomeSuggestions` = `true`, `Suggestions` = `BoardSuggestions`

**BoardSuggestions** — Suggestion prompts as BoardUI secondary pills.
Props: `SuggestionsSlotProps` from `@timbal-ai/timbal-react` (external — members not indexed); destructured: `suggestions`, `className`

### embedded-chat — `@/components/timbal/embedded-chat`

**EmbeddedChat**
Extends: `Omit<TimbalChatProps, "workforceId">`
| prop | type | default | doc |
|---|---|---|---|
| workforceId? | `string` |  |  |
| header? | `ReactNode` |  | Optional `ChatFrameHeader` (breadcrumb + actions) on the frame's top edge. |
| className | — |  | (inherited) |
| components | — |  | (inherited) |

Other exports: `EmbeddedChatProps` (props of EmbeddedChat)

### login — `@/components/timbal/login`

**Login** — Login — BoardUI auth-card grammar (rounded-3xl card, title-2, stacked social buttons under an "or continue with" divider) driven by the Timbal session.
| prop | type | default | doc |
|---|---|---|---|
| redirectUri? | `string` |  | Where to land after OAuth (`?redirect_uri=`). Defaults to the server default. |
| title? | `string` | `"Welcome back"` |  |
| description? | `string` |  |  |
| logo? | `React.ReactNode` | `<TimbalMark size={28} />` | Mark above the title. Defaults to the Timbal mark — swap for the product logo. |
| className? | `string` |  |  |

Other exports: `LoginProps` (props of Login)

### overlays — `@/components/timbal/overlays/index`

Re-exports: from `react-aria-components`: `Pressable` · from `@/components/timbal/overlays/modal`: `Modal`, `ModalBody`, `ModalFooter`, `ModalHeader`, `ModalTrigger`, `ModalProps`, `ModalSize` · from `@/components/timbal/overlays/sheet`: `Sheet`, `SheetBody`, `SheetFooter`, `SheetHeader`, `SheetTrigger`, `SheetProps`, `SheetSide`, `SheetSize` · from `@/components/timbal/overlays/popover`: `Popover`, `PopoverTrigger`, `PopoverProps` · from `@/components/timbal/overlays/overlay-parts`: `OverlayBody`, `OverlayFooter`, `OverlayHeader`, `OverlayBodyProps`, `OverlayFooterProps`, `OverlayHeaderProps` · from `@/components/timbal/overlays/toast`: `Toaster`, `ToasterProps` · from `@/components/timbal/overlays/toast-store`: `toast`, `useToasts`, `ToastAction`, `ToastItem`, `ToastKind`, `ToastOptions`

### overlays — `@/components/timbal/overlays/modal`

**Modal** — Modal — a centered dialog on React Aria's `ModalOverlay` / `Modal` / `Dialog` (focus trap, Escape, outside press, focus restore, scroll lock).
Extends: `Pick<AriaModalOverlayProps, "isOpen" | "defaultOpen" | "onOpenChange" | "isDismissable" | "isKeyboardDismissDisabled" | "shouldCloseOnInteractOutside">`
| prop | type | default | doc |
|---|---|---|---|
| size? | `ModalSize` | `"md"` |  |
| role? | `AriaDialogProps["role"]` |  | Dialog role. `alertdialog` for destructive confirmations. |
| aria-label? | `string` |  | Accessible name when the modal has no `ModalHeader` title. |
| className? | `string` |  | Extra classes on the panel. |
| backdropClassName? | `string` |  | Extra classes on the backdrop (e.g. a lighter scrim). |
| children | `AriaDialogProps["children"]` |  |  |
| isDismissable? | — | `true` | (inherited) |

Types: `ModalSize` = `"sm" | "md" | "lg" | "xl" | "full"`
Other exports: `ModalProps` (props of Modal)
Re-exports: from `react-aria-components`: `ModalTrigger` (= `DialogTrigger`) · from `@/components/timbal/overlays/overlay-parts`: `ModalHeader` (= `OverlayHeader`), `ModalBody` (= `OverlayBody`), `ModalFooter` (= `OverlayFooter`)

### overlays — `@/components/timbal/overlays/overlay-parts`

**OverlayHeader**
| prop | type | default | doc |
|---|---|---|---|
| title? | `ReactNode` |  |  |
| description? | `ReactNode` |  |  |
| closeLabel? | `string` | `"Close"` | Accessible name of the close control. |
| hideClose? | `boolean` | `false` | Drop the close control (e.g. a confirm dialog that must be answered). |
| className? | `string` |  |  |
| children? | `ReactNode` |  | Extra content under the title/description (tabs, a search field…). |

**OverlayBody** — The scrolling region: `min-h-0 flex-1` so the header/footer stay pinned.
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children? | `ReactNode` |  |  |

**OverlayFooter** — Right-aligned action row (Cancel / Confirm).
| prop | type | default | doc |
|---|---|---|---|
| className? | `string` |  |  |
| children? | `ReactNode` |  |  |

Other exports: `OverlayHeaderProps` (props of OverlayHeader) · `OverlayBodyProps` (props of OverlayBody) · `OverlayFooterProps` (props of OverlayFooter)

### overlays — `@/components/timbal/overlays/popover`

**Popover** — Popover — a free-form anchored panel (React Aria `Popover` + `Dialog`) on the BoardUI dropdown skin (`MENU_POPOVER_SURFACE`: white panel, hairline border, radius 16, p 10, `shadow-dropdown`, the 150m…
Extends: `Pick<AriaPopoverProps, | "placement" | "offset" | "crossOffset" | "shouldFlip" | "triggerRef" | "isOpen" | "defaultOpen" | "onOpenChange" | "isNonModal" | "isK…`
| prop | type | default | doc |
|---|---|---|---|
| aria-label | `string` |  | Accessible name of the dialog. |
| className? | `string` |  | Extra classes on the panel — width, padding overrides (default p-2.5). |
| dialogClassName? | `string` |  | Classes on the inner dialog (a flex column). |
| children | `AriaDialogProps["children"]` |  |  |
| placement? | — | `"bottom start"` | (inherited) |
| offset? | — | `4` | (inherited) |

Other exports: `PopoverProps` (props of Popover)
Re-exports: from `react-aria-components`: `PopoverTrigger` (= `DialogTrigger`)

### overlays — `@/components/timbal/overlays/sheet`

**Sheet** — Sheet — a side panel on the same React Aria stack as `Modal` (focus trap, Escape, outside press, focus restore).
Extends: `Pick<AriaModalOverlayProps, "isOpen" | "defaultOpen" | "onOpenChange" | "isDismissable" | "isKeyboardDismissDisabled" | "shouldCloseOnInteractOutside">`
| prop | type | default | doc |
|---|---|---|---|
| side? | `SheetSide` | `"right"` |  |
| size? | `SheetSize` | `"md"` |  |
| aria-label? | `string` |  | Accessible name when the sheet has no `SheetHeader` title. |
| className? | `string` |  | Extra classes on the panel (surface overrides, padding). |
| backdropClassName? | `string` |  | Extra classes on the backdrop (e.g. `bg-black/10` for a nav drawer). |
| children | `AriaDialogProps["children"]` |  |  |
| isDismissable? | — | `true` | (inherited) |

Types: `SheetSide` = `"right" | "left" | "bottom"` · `SheetSize` = `"sm" | "md" | "lg" | "xl" | "full"`
Other exports: `SheetProps` (props of Sheet)
Re-exports: from `react-aria-components`: `SheetTrigger` (= `DialogTrigger`) · from `@/components/timbal/overlays/overlay-parts`: `SheetHeader` (= `OverlayHeader`), `SheetBody` (= `OverlayBody`), `SheetFooter` (= `OverlayFooter`)

### overlays — `@/components/timbal/overlays/toast-store`

**useToasts()** — Live list of open toasts (`<Toaster />` reads it; use it for a custom region).
returns `ToastItem[]`
No parameters.

Types: `ToastKind` = `"success" | "error" | "info" | "warning"` · `ToastAction` = `{ label: ReactNode; onClick?: () => void }` · `ToastOptions` = `{ description?: ReactNode; action?: ToastAction; duration?: number | null; id?: string }` · `ToastItem` = `{ id: string; kind: ToastKind; title: ReactNode; description?: ReactNode; action?: ToastAction; duration: number | null }`
Other exports: `toast`: `object`

### overlays — `@/components/timbal/overlays/toast`

**Toaster** — Toaster — the toast region.
| prop | type | default | doc |
|---|---|---|---|
| position? | `NotificationPosition` | `"top-right"` | Corner the stack hangs from. Default `top-right`. |
| max? | `number` | `4` | Most toasts shown at once; older ones are dropped from view. Default 4. |
| className? | `string` |  | Extra classes on the viewport (e.g. to clear a bottom bar). |

Other exports: `ToasterProps` (props of Toaster)

### shells — `@/components/timbal/shells/index`

Re-exports: from `@/components/timbal/shells/sidebar-shell`: `SidebarShell`, `SidebarShellProps` · from `@/components/timbal/shells/topbar-shell`: `TopbarShell`, `TopbarShellProps` · from `@/components/timbal/shells/shell-chrome`: `Collapsible`, `ShellBrandMark`, `ShellHeader`, `ShellNavRow`, `ShellSidebar`, `ShellUserMenu`, `ShellSidebarProps`, `ShellUserMenuProps` · from `@/components/timbal/shells/shell-nav`: `SHELL_DESKTOP_QUERY`, `SHELL_FRAME_INSET_CLASS`, `SHELL_INSET_CLASS`, `initialsOf`, `resolveActiveNavItem`, `useActiveNavItem`, `useMediaQuery`, `useShellUser`, `RemixIcon`, `ShellBrand`, `ShellNavItem`, `ShellUser`

### shells — `@/components/timbal/shells/shell-chrome`

**Collapsible** — Label/badge slot that blurs + fades + shrinks away as the rail collapses.
| prop | type | default | doc |
|---|---|---|---|
| collapsed | `boolean` |  |  |
| children | `ReactNode` |  |  |
| className? | `string` |  |  |

**ShellBrandMark** — The brand's mark: `brand.logo` in a fixed box, else an initials avatar.
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| size? | `keyof typeof MARK_SIZE` | `"md"` |  |
| className? | `string` |  |  |

**ShellNavRow** — One sidebar row: the DashboardSidebar `NavItem` recipe on a router `Link`.
| prop | type | default | doc |
|---|---|---|---|
| item | `ShellNavItem` |  |  |
| isSelected | `boolean` |  |  |
| collapsed? | `boolean` | `false` |  |
| onNavigate? | `() => void` |  | Fired on click (the drawers close themselves with it). |

**ShellUserMenu** — Account trigger + menu (name/email header, destructive Sign out).
| prop | type | default | doc |
|---|---|---|---|
| user | `ShellUser` |  |  |
| variant? | `"sidebar" \| "topbar"` | `"sidebar"` | `sidebar` = the team-card trigger (full row, collapses to the avatar); `topbar` = avatar + name pill. |
| collapsed? | `boolean` | `false` |  |
| placement? | `DropdownPopoverProps["placement"]` | `"right bottom"` | Where the menu opens relative to the trigger. |
| className? | `string` |  |  |

**ShellSidebar** — The sidebar panel: brand + collapse control, primary rows, then theme toggle, secondary rows and the account card pinned to the bottom.
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| nav | `ShellNavItem[]` |  |  |
| secondaryNav? | `ShellNavItem[]` |  |  |
| user? | `ShellUser` |  |  |
| collapsed? | `boolean` | `false` | Collapsed 60px icon rail (desktop only). |
| onToggleCollapsed? | `() => void` |  |  |
| mobile? | `boolean` | `false` | Rendered inside the phone drawer: always expanded, close control instead of collapse. |
| onClose? | `() => void` |  |  |
| onNavigate? | `() => void` |  | Fired when a nav row is clicked (drawers close on it). |
| className? | `string` |  |  |

**ShellHeader** — Default page header — the DashboardHeader grammar: brand › current page breadcrumb, then the title row with the consumer's `actions` on the right.
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| homePath | `string` |  |  |
| active? | `ShellNavItem` |  |  |
| actions? | `ReactNode` |  |  |
| className? | `string` |  |  |

Other exports: `ShellUserMenuProps` (props of ShellUserMenu) · `ShellSidebarProps` (props of ShellSidebar)

### shells — `@/components/timbal/shells/shell-nav`

**useActiveNavItem()** — The nav item the current URL lights up (main + secondary groups).
returns `ShellNavItem | undefined`
| param | type | default | doc |
|---|---|---|---|
| groups | `(ShellNavItem[] \| undefined)[]` |  |  |

**useShellUser()** — The user to show: an explicit `user` prop wins; otherwise the runtime session (`SessionProvider`) when someone is signed in; otherwise nothing.
returns `ShellUser | undefined`
| param | type | default | doc |
|---|---|---|---|
| user? | `ShellUser` |  |  |

**useMediaQuery()** — Subscribe to a CSS media query (false during SSR / first hydration).
returns `boolean`
| param | type | default | doc |
|---|---|---|---|
| query | `string` |  |  |

Types: `RemixIcon` = `RemixiconComponentType` · `ShellNavItem` = `{ path: string; label: string; icon: RemixIcon; badge?: string | number; end?: boolean; bare?: boolean }` · `ShellBrand` = `{ name: string; logo?: ReactNode; subtitle?: string }` · `ShellUser` = `{ name: string; email?: string; avatarUrl?: string; onSignOut?: () => void }`
Other exports: `SHELL_INSET_CLASS`: `string` · `SHELL_FRAME_INSET_CLASS`: `string` · `resolveActiveNavItem(items: ShellNavItem[], pathname: string) => ShellNavItem | undefined` · `SHELL_DESKTOP_QUERY`: `string` · `initialsOf(name: string) => string`

### shells — `@/components/timbal/shells/sidebar-shell`

**SidebarShell** — SidebarShell — the default multi-page app frame: BoardUI's floating sidebar (dashboard-template grammar) driven by react-router, a header row in the dashboard-header grammar, and the page through `<O…
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| nav | `ShellNavItem[]` |  |  |
| secondaryNav? | `ShellNavItem[]` |  | Footer group (Support / Settings style), above the account card. |
| user? | `ShellUser` |  |  |
| header? | `ReactNode \| false` |  | Header above the page. Default: breadcrumb + title + `actions`; `false` hides it. |
| actions? | `ReactNode` |  | Right side of the default header (buttons). |
| dock? | `ReactNode` |  | Floating chrome rendered once, e.g. `<AssistantPill />`. |
| children? | `ReactNode` |  | Defaults to the router `<Outlet />`. |
| className? | `string` |  |  |

Other exports: `SidebarShellProps` (props of SidebarShell)

### shells — `@/components/timbal/shells/topbar-shell`

**TopbarShell** — TopbarShell — the frame for consumer / marketing-style products that shouldn't all get a left rail: a sticky 56px bar (brand, inline nav pills, `actions`, theme toggle, account menu) over a centred `…
| prop | type | default | doc |
|---|---|---|---|
| brand | `ShellBrand` |  |  |
| nav | `ShellNavItem[]` |  |  |
| user? | `ShellUser` |  |  |
| header? | `ReactNode \| false` |  | Row above the page. Default: the active page's title; `false` hides it. |
| actions? | `ReactNode` |  | Right side of the bar, before the theme toggle and account menu. |
| dock? | `ReactNode` |  | Floating chrome rendered once, e.g. `<AssistantPill />`. |
| children? | `ReactNode` |  | Defaults to the router `<Outlet />`. |
| className? | `string` |  |  |

Other exports: `TopbarShellProps` (props of TopbarShell)

## foundations

### brand — `@/components/foundations/brand/logo`

**Logo** — BoardUI mark.
| prop | type | default | doc |
|---|---|---|---|
| size? | `number` | `32` |  |
| mono? | `boolean` | `false` |  |
| className? | `string` |  |  |

**ProLogo** — Theme-aware metallic BoardUI Pro mark.
| prop | type | default | doc |
|---|---|---|---|
| size? | `number` | `36` |  |
| className? | `string` |  |  |
| decorative? | `boolean` | `false` |  |
| priority? | `boolean` | `false` |  |

### icons — `@/components/foundations/icons/chevrons`

**ChevronDownSmall** — 16×16 rounded 2px-stroke chevron.
Extends: `SVGProps<SVGSVGElement>`
No own props — accepts everything in Extends.

**ChevronRightSmall** — 12×12 rounded 1.5px-stroke chevron.
Extends: `SVGProps<SVGSVGElement>`
No own props — accepts everything in Extends.

**ChevronUpDownSmall** — 16×16 stacked up/down chevrons.
Extends: `SVGProps<SVGSVGElement>`
No own props — accepts everything in Extends.

**ChevronSortDown** — 24×24 filled rounded triangle chevron.
Extends: `SVGProps<SVGSVGElement>`
No own props — accepts everything in Extends.

## pages

### templates — `@/pages/templates/ai-chat`
Template: /templates/ai-chat (see templates.md)

**AiChatTemplate** — BoardUI Pro "AI chat" — VISUAL REFERENCE ONLY (scripted mock thread).
default export
No props.

### templates — `@/pages/templates/ai-image-generation`
Template: /templates/ai-image-generation (see templates.md)

**AiImageGenerationTemplate** — BoardUI Pro "AI image generation" — the AI chat shell on its image-generation scenario (mock).
default export
No props.

### templates — `@/pages/templates/ai-profile`
Template: /templates/ai-profile (see templates.md)

**AiProfileTemplate** — BoardUI Pro "AI profile" — cover card with contributions heatmap, agents bar chart, tokens trend.
default export
No props.

### templates — `@/pages/templates/calendar`
Template: /templates/calendar (see templates.md)

**CalendarTemplate** — BoardUI Pro "Calendar" — month grid with event chips, details popover, month switcher, inbox feed.
default export
No props.

### templates — `@/pages/templates/dashboard`
Template: /templates/dashboard (see templates.md)

**DashboardTemplate** — BoardUI Pro "Home Dashboard" — KPI stat cards, revenue trend, earnings, contributions, customers table.
default export
No props.

### templates — `@/pages/templates/finance`
Template: /templates/finance (see templates.md)

**FinanceTemplate** — BoardUI Pro "Finance" — balance KPIs, cash-flow sankey, spending rings, portfolio bubbles, heatmap, transactions table.
default export
No props.

### templates — `@/pages/templates/hr`
Template: /templates/hr (see templates.md)

**HrTemplate** — BoardUI Pro "HR" — headcount KPIs, recent hires, pipeline, engagement radar, hires vs attrition, employees table.
default export
No props.

### templates — `@/pages/templates/marketing`
Template: /templates/marketing (see templates.md)

**MarketingTemplate** — BoardUI Pro "Marketing" — campaign KPIs, acquisition funnel, spend by channel, ROAS, campaigns table.
default export
No props.

### templates — `@/pages/templates/medical`
Template: /templates/medical (see templates.md)

**MedicalTemplate** — BoardUI Pro "Medical profile" — patient overview: steps, sleep score, activity rings, most-active-days, alerts.
default export
No props.
