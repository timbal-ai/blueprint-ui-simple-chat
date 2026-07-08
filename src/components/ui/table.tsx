import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      {/* border-separate (spacing 0): the collapsed model makes Chromium
          skip per-cell box-shadow and border-radius, which breaks the
          rounded/shadowed header band. Row separators therefore live on
          the CELLS (tr borders don't paint in the separate model). */}
      <table
        data-slot="table"
        className={cn(
          "w-full border-separate border-spacing-0 caption-bottom text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={className} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child>td]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 font-medium [&_tr>td]:border-t [&_tr>td]:border-border",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      // Hover/selection tint AND the row separator live on the CELLS (a tr
      // can neither round its background nor paint borders under
      // border-separate) with rounded end caps — the house grammar.
      // The radius is applied ONLY with the tint: an always-on radius makes
      // the cell's border-b curve up at the row ends, which reads as a fake
      // card shadow under every row.
      className={cn(
        "transition-colors [&>td]:border-b [&>td]:border-border",
        "[&>td]:transition-colors",
        "hover:[&>td:first-child]:rounded-l-lg hover:[&>td:last-child]:rounded-r-lg",
        "data-[state=selected]:[&>td:first-child]:rounded-l-lg data-[state=selected]:[&>td:last-child]:rounded-r-lg",
        "hover:[&>td]:bg-muted/50 data-[state=selected]:[&>td]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      // The default header underline lives HERE (not on thead) so callers
      // like DataTable can replace it per-cell (border-y band) and
      // tailwind-merge resolves the conflict.
      className={cn(
        "h-10 border-b border-border px-3 text-left align-middle text-[13px] font-normal whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
