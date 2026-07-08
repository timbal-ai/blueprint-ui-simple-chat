"use no memo";

import * as React from "react";
import { flushSync } from "react-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ColumnSizingState,
  type Header,
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
 * Columns are draggable (drag a header cell to reorder) and resizable
 * (grab the handle at a header cell's right edge; double-click resets)
 * out of the box — the selection column is pinned and fixed-width.
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
  /** Drag header cells to reorder columns. Default true. */
  reorderable?: boolean;
  /** Resize handle on each header cell's right edge (double-click resets). Default true. */
  resizable?: boolean;
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
  reorderable = true,
  resizable = true,
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
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({});
  // The ref is the source of truth for the move (state is only visual
  // feedback — it may not have committed yet when drop fires).
  const dragColumnRef = React.useRef<string | null>(null);
  const [dragColumnId, setDragColumnId] = React.useState<string | null>(null);
  const [dropColumnId, setDropColumnId] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      columnSizing,
      ...(rowSelection !== undefined ? { rowSelection } : {}),
      ...(globalFilter !== undefined ? { globalFilter } : {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: resizable,
    columnResizeMode: "onChange",
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

  // Columns keep browser auto-layout until the FIRST resize. At that moment
  // every current width is measured and seeded into columnSizing (inside
  // flushSync so the resize handler reads the seeded size, not the 150px
  // TanStack default — otherwise the column snaps on grab), and the table
  // switches to fixed layout. Double-click a handle to return to auto.
  const sized = Object.keys(columnSizing).length > 0;

  const startResize = (
    e: React.MouseEvent | React.TouchEvent,
    header: Header<TData, unknown>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sized) {
      const ths = Array.from(
        (e.currentTarget as HTMLElement).closest("tr")?.querySelectorAll("th") ?? [],
      );
      const seeded: ColumnSizingState = {};
      header.headerGroup.headers.forEach((h, i) => {
        const width = ths[i]?.getBoundingClientRect().width;
        if (width) seeded[h.column.id] = Math.round(width);
      });
      flushSync(() => setColumnSizing(seeded));
    }
    header.getResizeHandler()(e);
  };

  const moveColumn = (targetId: string) => {
    const sourceId = dragColumnRef.current;
    if (!sourceId || sourceId === targetId) return;
    const order = table.getAllLeafColumns().map((c) => c.id);
    const from = order.indexOf(sourceId);
    const to = order.indexOf(targetId);
    if (from === -1 || to === -1) return;
    order.splice(to, 0, ...order.splice(from, 1));
    setColumnOrder(order);
  };

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
        <Table
          style={
            sized
              ? {
                  tableLayout: "fixed",
                  width: `max(${table.getCenterTotalSize()}px, 100%)`,
                }
              : undefined
          }
        >
          {/* Header renders as a soft ROUNDED band — softened muted fill
              with a hairline border and a whisper of drop shadow (the
              reference table grammar). Cells carry the fill/border/shadow
              so the first/last corners round cleanly: every cell paints
              top+bottom edges, only the end caps paint the sides. Each
              cell's shadow is CLIPPED to its own horizontal bounds —
              without the clip the sideways blur paints over the neighbor
              cell and reads as a vertical column divider. */}
          <TableHeader
            className={cn(stickyHeader && "sticky top-0 z-10")}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:[&>td]:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const draggable =
                    reorderable && !header.isPlaceholder && header.column.id !== "select";
                  const isDropTarget =
                    dropColumnId === header.column.id &&
                    dragColumnId !== header.column.id;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      draggable={draggable}
                      onDragStart={
                        draggable
                          ? (e) => {
                              e.dataTransfer.effectAllowed = "move";
                              dragColumnRef.current = header.column.id;
                              setDragColumnId(header.column.id);
                            }
                          : undefined
                      }
                      onDragOver={(e) => {
                        if (!dragColumnRef.current || header.column.id === "select")
                          return;
                        e.preventDefault();
                        setDropColumnId(header.column.id);
                      }}
                      onDragLeave={() =>
                        setDropColumnId((id) =>
                          id === header.column.id ? null : id,
                        )
                      }
                      onDrop={(e) => {
                        e.preventDefault();
                        moveColumn(header.column.id);
                        dragColumnRef.current = null;
                        setDragColumnId(null);
                        setDropColumnId(null);
                      }}
                      onDragEnd={() => {
                        dragColumnRef.current = null;
                        setDragColumnId(null);
                        setDropColumnId(null);
                      }}
                      className={cn(
                        "group relative border-y border-border/60 bg-muted/60 shadow-[0_1px_2px_0_color-mix(in_srgb,black_6%,transparent),0_2px_4px_-2px_color-mix(in_srgb,black_6%,transparent)] first:rounded-l-lg first:border-l last:rounded-r-lg last:border-r",
                        "[clip-path:inset(0_0_-8px_0)] first:[clip-path:inset(0_0_-8px_-8px)] last:[clip-path:inset(0_-8px_-8px_0)]",
                        draggable && "cursor-grab select-none active:cursor-grabbing",
                        dragColumnId === header.column.id && "opacity-50",
                        isDropTarget && "bg-muted",
                      )}
                      style={{
                        width: sized
                          ? header.getSize()
                          : header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {resizable && header.column.getCanResize() ? (
                        <div
                          aria-hidden
                          draggable={false}
                          onDragStart={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => startResize(e, header)}
                          onTouchStart={(e) => startResize(e, header)}
                          onDoubleClick={() => setColumnSizing({})}
                          className="absolute inset-y-0 right-0 z-10 flex w-2.5 cursor-col-resize touch-none items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                          <div
                            className={cn(
                              "h-4 w-0.5 rounded-full bg-border",
                              header.column.getIsResizing() && "h-full bg-ring",
                            )}
                          />
                        </div>
                      ) : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="hover:[&>td]:bg-transparent">
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
                    <TableCell
                      key={cell.id}
                      className={cn(sized && "overflow-hidden text-ellipsis")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:[&>td]:bg-transparent">
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
    enableResizing: false,
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
