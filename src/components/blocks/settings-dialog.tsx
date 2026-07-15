import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CloseButton } from "@/components/base/buttons/close-button";

/**
 * Settings DIALOG — the two-pane preferences modal (Cursor / Linear style):
 * a left rail with grouped section nav on the gray surface, and a white
 * content pane that swaps per section. Complements `blocks/settings-page`
 * (full-page settings): use the dialog when settings open OVER the app
 * (keyboard shortcut, avatar menu), the page when settings ARE a route.
 *
 * Everything is data-driven so agents can re-skin it by editing arrays:
 *
 *   <SettingsDialog
 *     trigger={<Button variant="secondary">Settings</Button>}
 *     groups={[
 *       { items: [{ id: "general", label: "General", icon: SettingsIcon,
 *                   content: <GeneralPane /> }] },
 *       { label: "Workspace", items: [...] },
 *     ]}
 *   />
 *
 * Pane content composes from the exported pieces: `SettingsDialogGroup`
 * (labelled cluster), `SettingsDialogRow` (gray row — title + description
 * left, ONE control right), `SettingsPlanCard` (current-plan banner with an
 * artwork slot). Controls come from `base/*` (Switch, Select, Button).
 *
 * On mobile the rail collapses to a horizontally scrollable pill row above
 * the pane, so 375px works without a nested drawer.
 */

type IconComponent = React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

interface SettingsDialogSection {
  /** Stable id — also the value for `sectionId`/`defaultSectionId`. */
  id: string;
  label: string;
  icon?: IconComponent;
  /** The pane rendered when this section is active. */
  content: React.ReactNode;
}

interface SettingsDialogNavGroup {
  /** Optional muted heading above the group ("Desktop app", "Customize"). */
  label?: string;
  items: SettingsDialogSection[];
}

function SettingsDialog({
  trigger,
  open,
  onOpenChange,
  groups,
  defaultSectionId,
  sectionId: controlledSectionId,
  onSectionChange,
  railTitle = "Settings",
  className,
}: {
  /** Optional element that opens the dialog (rendered via DialogTrigger). */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups: SettingsDialogNavGroup[];
  defaultSectionId?: string;
  /** Controlled active section (optional — uncontrolled by default). */
  sectionId?: string;
  onSectionChange?: (id: string) => void;
  railTitle?: string;
  /** Extra classes on the dialog panel (e.g. a width/height override). */
  className?: string;
}) {
  const sections = groups.flatMap((g) => g.items);
  const firstId = sections[0]?.id;
  const [uncontrolledId, setUncontrolledId] = React.useState(defaultSectionId ?? firstId);
  const activeId = controlledSectionId ?? uncontrolledId;
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  const selectSection = (id: string) => {
    setUncontrolledId(id);
    onSectionChange?.(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex h-[min(85dvh,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl sm:flex-row",
          className,
        )}
      >
        {/* Nav rail — gray surface; vertical on desktop, pill row on mobile. */}
        <div className="flex shrink-0 flex-col gap-2 border-b border-border-button-default bg-background-secondary-default p-3 sm:w-56 sm:border-r sm:border-b-0 sm:p-4">
          <span className="hidden px-2 text-body-medium text-text-secondary sm:block">
            {railTitle}
          </span>
          <div
            className={cn(
              "flex gap-1 overflow-x-auto sm:flex-col sm:gap-4 sm:overflow-y-auto",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {groups.map((group, gi) => (
              <div key={gi} className="flex shrink-0 gap-1 sm:flex-col">
                {group.label ? (
                  <span className="hidden px-2 pt-1 pb-0.5 text-caption-1-medium whitespace-nowrap text-text-tertiary sm:block">
                    {group.label}
                  </span>
                ) : null}
                {group.items.map((item) => {
                  const isSelected = item.id === active?.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={isSelected ? "true" : undefined}
                      onClick={() => selectSection(item.id)}
                      className={cn(
                        "flex shrink-0 cursor-pointer items-center gap-2 rounded-2lg p-2 text-left",
                        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                        "transition-colors duration-150",
                        isSelected
                          ? "bg-background-tertiary-default text-text-primary"
                          : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                      )}
                    >
                      {item.icon ? (
                        <item.icon
                          className={cn(
                            "size-4.5 shrink-0",
                            isSelected ? "text-foreground-icon-primary" : "text-foreground-icon-secondary",
                          )}
                          aria-hidden
                        />
                      ) : null}
                      <span className="text-body-medium whitespace-nowrap">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Content pane — white, own scroll, per-section header. */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 px-6 pt-5 pb-3">
            <DialogTitle className="text-lg font-medium tracking-tight">
              {active?.label}
            </DialogTitle>
            <DialogClose asChild>
              <CloseButton size="sm" aria-label="Close settings" />
            </DialogClose>
          </div>
          {/* Scroll container separate from the flex stack — a flex column
              that also scrolls lets children SHRINK to fit (clipped cards). */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            <div className="flex flex-col gap-5">{active?.content}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Labelled cluster of rows ("Pull Requests", "Notifications"). Rows sit in a
 * gap-1 column so each keeps its own rounded gray surface.
 */
function SettingsDialogGroup({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <span className="px-1 text-body-2-medium text-text-tertiary">{label}</span>
      ) : null}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

/**
 * One settings row: title + optional description on the left, ONE control on
 * the right (Switch, Select, Button — from `base/*`). Gray rounded surface,
 * matching the reference modal.
 */
function SettingsDialogRow({
  title,
  description,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The control. Keep it a single control per row. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl bg-background-secondary-default px-4 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-body-medium text-text-primary">{title}</span>
        {description ? (
          <span className="text-body-regular text-text-secondary">{description}</span>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
  );
}

/**
 * The "Current plan" banner: chip + plan name + description + CTA on the
 * left, an optional decorative `artwork` slot bleeding off the right edge.
 * Keep artwork decorative (aria-hidden) — the text carries the meaning.
 */
function SettingsPlanCard({
  chip,
  title,
  description,
  action,
  artwork,
  className,
}: {
  /** Small eyebrow chip, e.g. "Current plan". */
  chip?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** CTA slot, e.g. a secondary Button ("Upgrade to Max"). */
  action?: React.ReactNode;
  /** Decorative visual on the right edge (image, gradient block). */
  artwork?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl bg-background-secondary-default p-4",
        className,
      )}
    >
      <div className="relative z-10 flex min-w-0 flex-col items-start gap-2">
        {chip}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-medium tracking-tight text-text-primary">{title}</span>
          {description ? (
            <span className="text-body-regular text-text-secondary">{description}</span>
          ) : null}
        </div>
        {action ? <div className="pt-1">{action}</div> : null}
      </div>
      {artwork ? (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-2/5">
          {artwork}
        </div>
      ) : null}
    </div>
  );
}

export { SettingsDialog, SettingsDialogGroup, SettingsDialogRow, SettingsPlanCard };
export type { SettingsDialogNavGroup, SettingsDialogSection };
