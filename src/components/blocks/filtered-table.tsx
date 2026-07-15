import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type Row,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  FilterIcon,
  SearchIcon,
  XIcon,
  type IconComponent,
} from "@/components/icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/base/badges/badge";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { InputBase } from "@/components/base/input/input";
import { Pagination } from "@/components/base/pagination/pagination";
import { Select, SelectItem } from "@/components/base/select/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { ChevronSortDown } from "@/components/foundations/icons/chevrons";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * FilteredTable — search + faceted filters + data table, wired together.
 *
 * Rebuilt on the BoardUI table grammar (2026-07-14): the React Aria `Table`
 * primitive (`@/components/base/table`) rendered from a TanStack instance,
 * BoardUI Selects as facet triggers, the rounded-full secondary search
 * field, and the BoardUI Pagination footer — the same recipe as BoardUI's
 * Data Table block, generalized to column defs.
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
  pagination = true,
  pageSize = 20,
  itemsLabel = "results",
  rowSelection,
  onRowSelectionChange,
  className,
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
  /** Client-side pagination. Default true; disable for short lists. */
  pagination?: boolean;
  pageSize?: number;
  /** Noun for the pagination summary, e.g. "invoices" → "Showing 1 to 10 of 24 invoices". */
  itemsLabel?: string;
  /** Controlled row selection (pair with `selectionColumn()`). */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  className?: string;
}) {
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
    // The native BoardUI Data Table card (application/data-table grammar):
    // one bordered rounded section owning the count header, the filter
    // cluster + round search on the right, the full-bleed table, and the
    // Pagination footer.
    <section
      className={cn(
        // pb only when the pagination footer renders — without it the card
        // border is the bottom rule (last row border is dropped in
        // globals.css) and extra padding would read as a stray blank band.
        "flex w-full min-w-0 flex-col rounded-2xl border border-border-button-default bg-card pt-2 pb-0 has-[[data-slot=table-pagination]]:pb-3",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
          <p className="text-body-medium whitespace-nowrap text-text-primary">
            {filtered.length.toLocaleString()} {itemsLabel}
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          {facets.map((facet) => (
            <Select
              key={facet.id}
              aria-label={facet.label}
              placeholder={facet.label}
              className="shrink-0"
              popoverClassName="min-w-40"
              selectedKey={active[facet.id] ?? null}
              onSelectionChange={(key) =>
                setActive((prev) => ({ ...prev, [facet.id]: String(key) }))
              }
            >
              {facet.options.map((opt) => (
                <SelectItem key={opt.value} id={opt.value} textValue={opt.label}>
                  {opt.label}
                </SelectItem>
              ))}
            </Select>
          ))}
          {moreFilters.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="medium" leadingIcon={FilterIcon} className="shrink-0">
                  Filters
                  {moreFiltersActive > 0 ? (
                    <Badge color="neutral" className="ml-1">
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
                    <p className="px-1.5 pb-1 text-caption-1-medium text-text-tertiary">
                      {facet.label}
                    </p>
                    <div className="flex flex-col">
                      {facet.options.map((opt) => {
                        const isOn = (checked[facet.id] ?? []).includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-body-medium text-text-primary transition-colors hover:bg-background-primary-hover"
                          >
                            <Checkbox
                              aria-label={opt.label}
                              isSelected={isOn}
                              onChange={() => toggleChecked(facet.id, opt.value)}
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
              size="medium"
              leadingIcon={XIcon}
              className="shrink-0"
              onClick={() => {
                setSearch("");
                setActive({});
                setChecked({});
              }}
            >
              Clear
            </Button>
          ) : null}
          {/* Native BoardUI search: the rounded-full gray pill, last in the cluster. */}
          <InputBase
            aria-label="Search"
            placeholder={searchPlaceholder}
            leadingIcon={SearchIcon}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
            className="text-body-medium"
          />
          {toolbarEnd ? <div className="flex shrink-0 items-center gap-2">{toolbarEnd}</div> : null}
        </div>
      </div>
      <DataTable
        className="mt-2"
        columns={columns}
        data={filtered}
        globalFilter={search}
        onRowClick={onRowClick}
        loading={loading}
        empty={empty}
        pagination={pagination}
        pageSize={pageSize}
        itemsLabel={itemsLabel}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
      />
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * DataTable — TanStack instance rendered through the BoardUI React Aria
 * Table primitive (fork of BoardUI's Data Table block, generalized to
 * column defs). Sorting, pagination, row selection, and the global text
 * filter come from TanStack; the visuals are the `.bui-table` grammar.
 * ------------------------------------------------------------------------- */

function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  empty,
  pagination = true,
  pageSize = 20,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  itemsLabel = "results",
  className,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  empty?: React.ReactNode;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: Row<TData>) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  globalFilter?: string;
  itemsLabel?: string;
  className?: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(rowSelection !== undefined ? { rowSelection } : {}),
      ...(globalFilter !== undefined ? { globalFilter } : {}),
    },
    onSortingChange: setSorting,
    ...(onRowSelectionChange ? { onRowSelectionChange, enableRowSelection: true } : {}),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }
      : {}),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0].headers;
  const columnCount = table.getVisibleLeafColumns().length || columns.length;
  const pageCount = table.getPageCount();
  const { pageIndex } = table.getState().pagination;

  return (
    <div data-slot="data-table" className={cn("flex w-full min-w-0 flex-col", className)}>
      <Table aria-label={itemsLabel} selectionMode="none">
        <TableHeader>
          {headers.map((header, i) => {
            const width = header.getSize() !== 150 ? header.getSize() : undefined;
            return (
              <TableColumn
                key={header.id}
                id={header.id}
                isRowHeader={i === 0}
                style={width ? { width } : undefined}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody
          renderEmptyState={
            loading
              ? undefined
              : () =>
                  empty ?? (
                    <EmptyState
                      title="No results"
                      description="Nothing matches yet. Adjust filters or add data."
                      className="min-h-32 rounded-none border-0"
                    />
                  )
          }
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} id={`skeleton-${i}`}>
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => {
                const selected = row.getIsSelected();
                return (
                  <TableRow
                    key={row.id}
                    id={row.id}
                    onAction={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-background-primary-hover",
                    )}
                    style={
                      selected
                        ? { backgroundColor: "var(--color-background-secondary-default)" }
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      {/* Native BoardUI footer: Previous | numbered pages | Next, inside the card. */}
      {pagination && !loading && pageCount > 1 ? (
        <div data-slot="table-pagination" className="px-3 pt-3">
          <Pagination
            page={pageIndex + 1}
            totalPages={pageCount}
            onChange={(p) => table.setPageIndex(p - 1)}
          />
        </div>
      ) : null}
    </div>
  );
}

/** Sortable column header — use in column defs: `header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />`. */
function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn("flex cursor-pointer items-center gap-0.5", className)}
    >
      {title}
      <ChevronSortDown
        className={cn(
          "size-6 shrink-0 transition-[transform,color] duration-150",
          sorted === "asc" && "rotate-180",
          sorted ? "text-text-secondary" : "text-text-tertiary",
        )}
      />
    </button>
  );
}

/**
 * Ready-made leading checkbox column — pair with `rowSelection` +
 * `onRowSelectionChange` on `FilteredTable`.
 */
function selectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    size: 36,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        slot={null}
        aria-label="Select all"
        isSelected={table.getIsAllPageRowsSelected()}
        isIndeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        slot={null}
        aria-label="Select row"
        isSelected={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  };
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
    <span className={cn("flex items-center gap-1.5 text-text-primary", className)}>
      <Icon className="size-3.5 shrink-0 text-foreground-icon-tertiary" />
      {children}
    </span>
  );
}

// Vibrant identity tones — saturated fill + a darker outline of the same
// tone so chips pop like the reference avatars (not washed-out pastels).
// `--chart-*` now maps to the BoardUI categorical ramp (see dna.json).
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

/** Stable vibrant tone classes for a name — reuse anywhere identity color is needed. */
function chipTone(name: string): string {
  return CHIP_TONES[
    Math.abs(
      [...name].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7),
    ) % CHIP_TONES.length
  ];
}

/** Colored initial tile — standalone identity avatar (sheets, headers, lists). */
function AvatarChip({
  name,
  size = "sm",
  className,
}: {
  name: string;
  /** sm = table cell (20px), lg = detail headers (44px). */
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold uppercase ring-1 ring-inset",
        size === "sm"
          ? "size-5 rounded-[5px] text-[10px]"
          : "size-11 rounded-xl text-base",
        chipTone(name),
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}

/** Colored initial tile + name — the reference "customer" cell. Tone is stable per name. */
function AvatarChipCell({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <AvatarChip name={name} />
      <span className="truncate">{name}</span>
    </span>
  );
}

export {
  AvatarChip,
  AvatarChipCell,
  DataTable,
  DataTableColumnHeader,
  FilteredTable,
  IconCell,
  selectionColumn,
};
export type { ColumnDef, TableFacet };
