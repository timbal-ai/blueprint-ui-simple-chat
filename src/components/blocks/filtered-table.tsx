import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
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
  searchPlaceholder?: string;
  /** Right side of the toolbar — primary action ("New invoice"), export, etc. */
  toolbarEnd?: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  loading?: boolean;
  empty?: React.ReactNode;
  className?: string;
} & Pick<
  React.ComponentProps<typeof DataTable<TData, TValue>>,
  "pagination" | "pageSize" | "maxHeight" | "stickyHeader"
>) {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<Record<string, string>>({});

  const filtered = React.useMemo(() => {
    const entries = Object.entries(active).filter(([, v]) => v !== "");
    if (entries.length === 0) return data;
    return data.filter((row) =>
      entries.every(([facetId, value]) => {
        const facet = facets.find((f) => f.id === facetId);
        return facet ? facet.getValue(row) === value : true;
      }),
    );
  }, [data, active, facets]);

  const hasFilters = search !== "" || Object.values(active).some((v) => v !== "");

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

export { FilteredTable };
export type { TableFacet };
