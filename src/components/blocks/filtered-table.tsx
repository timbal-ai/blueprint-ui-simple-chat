import * as React from "react";
import {
  FilterIcon,
  SearchIcon,
  XIcon,
  type IconComponent,
} from "@/components/icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Row } from "@tanstack/react-table";

/**
 * FilteredTable — search + faceted filters + DataTable, wired together.
 *
 * The toolbar wraps instead of overflowing, search is debounced into the
 * table's global filter, and facet filtering happens here so column defs stay
 * presentation-only. Fork when you need server-side filtering — keep the
 * toolbar structure.
 *
 * Overlay discipline: the "Filters" popover renders checkbox option rows —
 * NEVER nest a Select (or any second overlay) inside a popover; stacked
 * overlays overlap and fight for focus.
 */

interface TableFacet<TData> {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  /** Returns the row's value for this facet. */
  getValue: (row: TData) => string;
}

function FilteredTable<TData, TValue>({
  columns,
  data,
  facets = [],
  moreFilters = [],
  searchPlaceholder = "Search…",
  toolbarEnd,
  onRowClick,
  loading,
  empty,
  className,
  ...tableProps
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  facets?: TableFacet<TData>[];
  /** Secondary facets tucked behind the "Filters" popover (funnel button). */
  moreFilters?: TableFacet<TData>[];
  searchPlaceholder?: string;
  /** Right side of the toolbar — primary action ("New invoice"), export, etc. */
  toolbarEnd?: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  loading?: boolean;
  empty?: React.ReactNode;
  className?: string;
} & Pick<
  React.ComponentProps<typeof DataTable<TData, TValue>>,
  | "pagination"
  | "pageSize"
  | "maxHeight"
  | "stickyHeader"
  | "bordered"
  | "itemsLabel"
  | "rowSelection"
  | "onRowSelectionChange"
>) {
  const [search, setSearch] = React.useState("");
  // Primary facets are single-value (Select); popover facets are
  // multi-value (checkbox rows). Both filter with AND across facets.
  const [active, setActive] = React.useState<Record<string, string>>({});
  const [checked, setChecked] = React.useState<Record<string, string[]>>({});

  const filtered = React.useMemo(() => {
    const single = Object.entries(active).filter(([, v]) => v !== "");
    const multi = Object.entries(checked).filter(([, v]) => v.length > 0);
    if (single.length === 0 && multi.length === 0) return data;
    return data.filter(
      (row) =>
        single.every(([facetId, value]) => {
          const facet = facets.find((f) => f.id === facetId);
          return facet ? facet.getValue(row) === value : true;
        }) &&
        multi.every(([facetId, values]) => {
          const facet = moreFilters.find((f) => f.id === facetId);
          return facet ? values.includes(facet.getValue(row)) : true;
        }),
    );
  }, [data, active, checked, facets, moreFilters]);

  const hasFilters =
    search !== "" ||
    Object.values(active).some((v) => v !== "") ||
    Object.values(checked).some((v) => v.length > 0);
  const moreFiltersActive = Object.values(checked).reduce(
    (n, values) => n + values.length,
    0,
  );

  const toggleChecked = (facetId: string, value: string) =>
    setChecked((prev) => {
      const current = prev[facetId] ?? [];
      return {
        ...prev,
        [facetId]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });

  return (
    <div className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-64 min-w-40">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8"
            aria-label="Search"
          />
        </div>
        {facets.map((facet) => (
          <Select
            key={facet.id}
            value={active[facet.id] ?? ""}
            onValueChange={(value) =>
              setActive((prev) => ({ ...prev, [facet.id]: value }))
            }
          >
            <SelectTrigger className="w-auto min-w-28" aria-label={facet.label}>
              <SelectValue placeholder={facet.label} />
            </SelectTrigger>
            <SelectContent>
              {facet.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {moreFilters.length > 0 ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1.5">
                <FilterIcon className="size-3.5" />
                Filters
                {moreFiltersActive > 0 ? (
                  <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
                    {moreFiltersActive}
                  </Badge>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-2">
              {/* Checkbox rows, never a nested Select — a popover must be
                  the only overlay open. */}
              {moreFilters.map((facet, fi) => (
                <div key={facet.id}>
                  {fi > 0 ? <Separator className="my-2" /> : null}
                  <p className="px-1.5 pb-1 text-xs font-medium text-muted-foreground">
                    {facet.label}
                  </p>
                  <div className="flex flex-col">
                    {facet.options.map((opt) => {
                      const isOn = (checked[facet.id] ?? []).includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
                        >
                          <Checkbox
                            checked={isOn}
                            onCheckedChange={() =>
                              toggleChecked(facet.id, opt.value)
                            }
                          />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        ) : null}
        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setActive({});
              setChecked({});
            }}
          >
            <XIcon />
            Clear
          </Button>
        ) : null}
        {toolbarEnd ? <div className="ml-auto flex items-center gap-2">{toolbarEnd}</div> : null}
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        globalFilter={search}
        onRowClick={onRowClick}
        loading={loading}
        empty={empty}
        {...tableProps}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Cell helpers — the reference table grammar. Use these in column defs so
 * every table gets the same visual language for ids, dates, and people.
 * ------------------------------------------------------------------------- */

/** Muted leading icon + value, e.g. `#` + invoice id, calendar + date. */
function IconCell({
  icon: Icon,
  children,
  className,
}: {
  icon: IconComponent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1.5 text-foreground", className)}>
      <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
      {children}
    </span>
  );
}

// Vibrant identity tones — saturated fill + a darker outline of the same
// tone so chips pop like the reference avatars (not washed-out pastels).
const CHIP_TONES = [
  "bg-chart-1/20 text-chart-1 ring-chart-1/30",
  "bg-chart-2/20 text-chart-2 ring-chart-2/30",
  "bg-chart-3/25 text-chart-3 ring-chart-3/35",
  "bg-chart-4/20 text-chart-4 ring-chart-4/30",
  "bg-chart-5/20 text-chart-5 ring-chart-5/30",
  "bg-chart-6/20 text-chart-6 ring-chart-6/30",
  "bg-chart-7/20 text-chart-7 ring-chart-7/30",
  "bg-chart-8/20 text-chart-8 ring-chart-8/30",
];

/** Colored initial tile + name — the reference "customer" cell. Tone is stable per name. */
function AvatarChipCell({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const tone =
    CHIP_TONES[
      Math.abs(
        [...name].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7),
      ) % CHIP_TONES.length
    ];
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-semibold uppercase ring-1 ring-inset",
          tone,
        )}
      >
        {name.charAt(0)}
      </span>
      <span className="truncate">{name}</span>
    </span>
  );
}

export { AvatarChipCell, FilteredTable, IconCell };
export type { TableFacet };
