import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "@/components/icons";

import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 ease-out-strong data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-200 data-[state=closed]:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Width presets for side sheets. `default` matches the classic drawer;
 * `lg`/`xl` fit dense forms and previews; `full` is a near-fullscreen
 * workspace (still floating and rounded).
 */
const SHEET_SIZE: Record<"default" | "sm" | "lg" | "xl" | "full", string> = {
  sm: "sm:max-w-xs",
  default: "sm:max-w-sm",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-2xl",
  full: "sm:max-w-none",
};

function SheetContent({
  className,
  children,
  side = "right",
  size = "default",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  /** Width preset for left/right sheets (ignored for top/bottom). */
  size?: "default" | "sm" | "lg" | "xl" | "full";
}) {
  // On MOBILE every side sheet fills the viewport width (minus the float
  // insets) — a partial-width drawer with a backdrop strip is dead space.
  // From `sm:` up the SHEET_SIZE presets cap the width.
  const width = "w-[calc(100%-1.5rem)]";
  return (
    <SheetPortal>
      <SheetOverlay />
      {/* Sheets FLOAT: inset from every viewport edge, fully rounded, with a
          border + deep shadow — a detached panel, never a flush drawer. */}
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          // iOS-like drawer curve; enter 300ms, exit snaps in 200ms.
          "fixed z-50 flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl ease-drawer data-[state=open]:animate-in data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:duration-200",
          side === "right" &&
            cn(
              "inset-y-3 right-3 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
              width,
              SHEET_SIZE[size],
            ),
          side === "left" &&
            cn(
              "inset-y-3 left-3 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
              width,
              SHEET_SIZE[size],
            ),
          side === "top" &&
            "inset-x-3 top-3 h-auto data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
          side === "bottom" &&
            "inset-x-3 bottom-3 h-auto data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0">
          <XIcon />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
