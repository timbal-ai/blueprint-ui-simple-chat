import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/base/buttons/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * Entity form scaffolding — labeled fields with sane widths, plus a
 * ready-made create/edit Sheet.
 *
 * `FormGrid` defaults to a single column (forms read best in one column);
 * pass `columns={2}` only for short paired fields (city/zip). `FormField`
 * owns label + control + help/error wiring, so every form gets consistent
 * spacing and a11y for free. `FormSheet` is the standard create/edit surface:
 * proper width, scrollable body, pinned footer actions.
 */

function FormGrid({
  columns = 1,
  className,
  children,
}: {
  columns?: 1 | 2;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  required,
  help,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  /** One line of guidance under the control. */
  help?: string;
  /** Validation message — replaces `help` and tints the row. */
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : help ? (
        <p className="text-xs text-muted-foreground">{help}</p>
      ) : null}
    </div>
  );
}

/** Standard create/edit surface: right sheet, scrollable body, pinned actions. */
function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Save",
  onSubmit,
  submitting = false,
  size = "lg",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  onSubmit: () => void;
  submitting?: boolean;
  /** Sheet width preset — bump to "xl"/"full" for dense enterprise forms. */
  size?: React.ComponentProps<typeof SheetContent>["size"];
  children: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size={size} className="w-full gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1">
          <form
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {children}
          </form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant="secondary" size="small" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="small" onClick={onSubmit} disabled={submitting}>
            {submitting ? "Saving…" : submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { FormField, FormGrid, FormSheet };
