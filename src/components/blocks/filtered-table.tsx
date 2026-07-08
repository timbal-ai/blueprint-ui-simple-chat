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
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Row } from "@tanstack/react-table";

/**
 * FilteredTable — search + faceted filters + DataTable, wired together.
 *
 * The toolbar wraps instead of overflowing, search is debounced into the
 * table's global filter, and facet filtering happens here so column defs stay
 * presentation-only. Fork when you need server-side filtering — keep the
 * toolbar structure.
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
  const [active, setActive] = React.useState<Record<string, string>>({});

  const allFacets = React.useMemo(
    () => [...facets, ...moreFilters],
    [facets, moreFilters],
  );

  const filtered = React.useMemo(() => {
    const entries = Object.entries(active).filter(([, v]) => v !== "");
    if (entries.length === 0) return data;
    return data.filter((row) =>
      entries.every(([facetId, value]) => {
        const facet = allFacets.find((f) => f.id === facetId);
        return facet ? facet.getValue(row) === value : true;
      }),
    );
  }, [data, active, allFacets]);

  const hasFilters = search !== "" || Object.values(active).some((v) => v !== "");
  const moreFiltersActive = moreFilters.filter(
    (f) => (active[f.id] ?? "") !== "",
  ).length;

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
            <PopoverContent align="start" className="w-64 space-y-3">
              {moreFilters.map((facet) => (
                <div key={facet.id} className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {facet.label}
                  </Label>
                  <Select
                    value={active[facet.id] ?? ""}
                    onValueChange={(value) =>
                      setActive((prev) => ({ ...prev, [facet.id]: value }))
                    }
                  >
                    <SelectTrigger className="w-full" aria-label={facet.label}>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      {facet.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

const CHIP_TONES = [
  "bg-chart-1/15 text-chart-1",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-4/15 text-chart-4",
  "bg-chart-5/15 text-chart-5",
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
          "flex size-5 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-semibold uppercase",
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
