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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
        className="w-full overflow-auto rounded-lg border border-border bg-card"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Table>
          <TableHeader
            className={cn(
              stickyHeader && "sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_0_var(--border)]",
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
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
        <DataTablePagination table={table} />
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
      className={cn("-ml-2 h-7 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground data-[sorted=true]:text-foreground", className)}
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

function DataTablePagination<TData>({ table }: { table: TanstackTable<TData> }) {
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const selected = table.getSelectedRowModel().rows.length;
  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <p className="text-xs text-muted-foreground">
        {selected > 0
          ? `${selected} of ${table.getFilteredRowModel().rows.length} selected`
          : `Page ${pageIndex + 1} of ${pageCount}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}

export { DataTable, DataTableColumnHeader, DataTablePagination };
export type { ColumnDef };
