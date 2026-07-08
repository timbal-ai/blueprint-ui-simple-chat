import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Settings page scaffolding — sectioned cards with aligned label/control
 * rows, plus a visually distinct danger zone.
 *
 * `SettingsSection` is one card per topic ("Profile", "Notifications").
 * `SettingsRow` puts the label + description on the left and the control on
 * the right, stacking on narrow screens so controls never get crushed.
 */

function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("max-w-3xl", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col">{children}</CardContent>
    </Card>
  );
}

function SettingsRow({
  label,
  description,
  children,
  className,
}: {
  label: string;
  description?: string;
  /** The control — Switch, Select, Input, Button. Keep it a single control. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
        "not-last:border-b not-last:border-border",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

/** Destructive actions, visually quarantined at the bottom of the page. */
function DangerZone({
  title = "Danger zone",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("max-w-3xl border-destructive/40", className)}>
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">{children}</CardContent>
    </Card>
  );
}

/** Vertical stack of settings sections with page-level rhythm. */
function SettingsStack({ className, children }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-6", className)}>{children}</div>;
}

export { DangerZone, SettingsRow, SettingsSection, SettingsStack };
