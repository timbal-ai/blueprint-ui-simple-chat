"use no memo";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
} from "@/components/icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Project-owned data table on TanStack Table (headless) — column sizing,
 * sticky headers, and overflow are handled by the table engine + a bounded
 * scroll container, never by hand-tuned widths.
 *
 * This is a starting composition, not a monolith: fork it per screen when a
 * table needs server-side data, virtualization, row expansion, etc. Column
 * defs stay in the page that owns the data.
 */
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Rows are being fetched — renders skeleton rows instead of `data`. */
  loading?: boolean;
  /** Shown when there are no rows (and not loading). */
  empty?: React.ReactNode;
  /** Sticky header stays visible while the container scrolls. Default true. */
  stickyHeader?: boolean;
  /** Bound the table height so the sticky header has a scroll context. */
  maxHeight?: string;
  /** Client-side pagination. Default true; disable for short lists. */
  pagination?: boolean;
  pageSize?: number;
  /** Row click handler — also adds hover/cursor affordances. */
  onRowClick?: (row: Row<TData>) => void;
  /** Controlled row selection (enables the selection column pattern). */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  /** Global text filter value (wire to a SearchInput above the table). */
  globalFilter?: string;
  /**
   * Outer border + card background. Default OFF — the house style renders
   * tables directly on the content surface with no background of their own.
   * Enable only for a standalone table on the gray canvas.
   */
  bordered?: boolean;
  /** Noun for the pagination summary, e.g. "invoices" → "Showing 1 to 10 of 24 invoices". */
  itemsLabel?: string;
  className?: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  empty,
  stickyHeader = true,
  maxHeight,
  pagination = true,
  pageSize = 20,
  onRowClick,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  bordered = false,
  itemsLabel,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(rowSelection !== undefined ? { rowSelection } : {}),
      ...(globalFilter !== undefined ? { globalFilter } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
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
  const columnCount = table.getVisibleLeafColumns().length || columns.length;

  return (
    <div data-slot="data-table" className={cn("flex w-full flex-col gap-3", className)}>
      <div
        className={cn(
          "w-full overflow-auto",
          bordered && "rounded-lg border border-border bg-card",
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Table>
          {/* Header renders as a soft ROUNDED band (muted fill, no border
              line) — the reference table grammar. Cells carry the fill so
              the first/last corners round cleanly. */}
          <TableHeader
            className={cn(
              "[&_tr]:border-0",
              stickyHeader && "sticky top-0 z-10",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="bg-muted first:rounded-l-lg last:rounded-r-lg"
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-32 p-0">
                  {empty ?? (
                    <EmptyState
                      title="No results"
                      description="Nothing matches yet. Adjust filters or add data."
                      className="min-h-32 rounded-none border-0"
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && !loading && table.getPageCount() > 1 ? (
        <DataTablePagination table={table} itemsLabel={itemsLabel} />
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
  column: import("@tanstack/react-table").Column<TData, TValue>;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      // Rounded hover pill inside the header band — never a square highlight.
      className={cn("-ml-2 h-7 gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-[sorted=true]:text-foreground", className)}
      data-sorted={sorted !== false}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUpIcon className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ChevronsUpDownIcon className="size-3.5 opacity-50" />
      )}
    </Button>
  );
}

/** Windowed page-number list: always first/last, ellipsis for gaps. */
function pageWindow(current: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);
  const pages = new Set<number>([0, count - 1, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 0 && p < count).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

function DataTablePagination<TData>({
  table,
  itemsLabel = "results",
}: {
  table: TanstackTable<TData>;
  itemsLabel?: string;
}) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <p className="text-[13px] text-muted-foreground">
        Showing {from} to {to} of {total} {itemsLabel}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-3.5" />
          Prev
        </Button>
        {pageWindow(pageIndex, pageCount).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === pageIndex ? "default" : "ghost"}
              size="icon-sm"
              className="h-8 w-8 text-[13px]"
              onClick={() => table.setPageIndex(p)}
              aria-current={p === pageIndex ? "page" : undefined}
            >
              {p + 1}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRightIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Ready-made leading checkbox column — pair with `rowSelection` +
 * `onRowSelectionChange` on `DataTable`.
 */
function selectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    size: 36,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => e.stopPropagation()}
        aria-label="Select row"
      />
    ),
  };
}

export { DataTable, DataTableColumnHeader, DataTablePagination, selectionColumn };
export type { ColumnDef };
