"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RiMore2Fill, RiSearchLine, type RemixiconComponentType } from "@remixicon/react";
import { Focusable } from "react-aria-components";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, PaginationState, RowData, SortingState } from "@tanstack/react-table";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { InputBase } from "@/components/base/input/input";
import { Pagination } from "@/components/base/pagination/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import type { TableSize } from "@/components/base/table/table";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { ChevronSortDown } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Tailwind width class, e.g. `w-[240px]`. */
    width?: string;
  }
}

/**
 * DataTable — the BoardUI data-table grammar (boardui.com/components/data-table)
 * as a reusable block: framed card, toolbar, secondary header, row rules,
 * sort chevrons, optional selection, pagination. Pass your `data` + `columns`.
 *
 * Status / priority = `Chip`. People = `Avatar`. Row menus = `DataTableRowAction`
 * / `DataTableMoreMenu`. Never a hand-built `<table>` or a div-grid of rows.
 *
 * ```tsx
 * <DataTable
 *   data={tasks}
 *   columns={columns}
 *   getRowId={(row) => row.id}
 *   aria-label="Tasks"
 *   selectable
 *   search={{ value: query, onChange: setQuery }}
 * />
 * ```
 *
 * `DataTableExample` in `application/data-table` is the customers demo only.
 */

function SortChevron({ dir }: { dir: false | "asc" | "desc" }) {
  return (
    <ChevronSortDown
      className={cx(
        "size-6 shrink-0 transition-[transform,color] duration-150",
        dir === "asc" && "rotate-180",
        dir ? "text-text-secondary" : "text-text-tertiary",
      )}
    />
  );
}

function columnWidth(meta: unknown): string | undefined {
  return (meta as { width?: string } | undefined)?.width;
}

export interface DataTableSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  getRowId: (row: TData) => string;
  "aria-label": string;
  /** Left side of the toolbar. Default: “N rows”. */
  summary?: ReactNode;
  /** Extra toolbar controls (Selects, Buttons) before search. */
  filters?: ReactNode;
  search?: DataTableSearch;
  pageSize?: number;
  size?: TableSize;
  /** Checkbox in the lead column + row selection. */
  selectable?: boolean;
  /** Column that hosts the checkbox (default: first column). */
  leadColumnId?: string;
  empty?: ReactNode;
  className?: string;
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  "aria-label": ariaLabel,
  summary,
  filters,
  search,
  pageSize = 8,
  size = "md",
  selectable = false,
  leadColumnId,
  empty,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize });
  }, [data, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: selectable,
  });

  const firstId = table.getHeaderGroups()[0]?.headers[0]?.column.id;
  const leadId = leadColumnId ?? firstId;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();

  return (
    <section
      className={cx(
        "flex w-full flex-col rounded-2xl border border-border-table bg-background-primary-default pt-2",
        totalPages > 1 ? "pb-3" : "pb-0",
        className,
      )}
    >
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          {summary ?? (
            <>
              <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
              <p className="text-body-medium whitespace-nowrap text-text-primary">
                {data.length.toLocaleString()} {data.length === 1 ? "row" : "rows"}
              </p>
            </>
          )}
        </div>
        {filters || search ? (
          <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
            {filters}
            {search ? (
              <InputBase
                aria-label={search["aria-label"] ?? "Search"}
                placeholder={search.placeholder ?? "Search"}
                leadingIcon={RiSearchLine}
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
                className="text-body-medium"
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-2">
        <Table aria-label={ariaLabel} size={size} selectionMode="none" className="min-w-[720px]">
          <TableHeader>
            {headers.map((header) => {
              const id = header.column.id;
              const canSort = header.column.getCanSort();
              const label = flexRender(header.column.columnDef.header, header.getContext());
              const isLead = selectable && id === leadId;
              const sortControl = canSort ? (
                <button
                  type="button"
                  onClick={header.column.getToggleSortingHandler()}
                  className="flex cursor-pointer items-center gap-0.5"
                >
                  {label}
                  <SortChevron dir={header.column.getIsSorted()} />
                </button>
              ) : (
                label
              );
              return (
                <TableColumn
                  key={header.id}
                  id={header.id}
                  isRowHeader={isLead}
                  className={columnWidth(header.column.columnDef.meta)}
                >
                  {isLead ? (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        slot={null}
                        aria-label="Select all rows on this page"
                        isSelected={table.getIsAllPageRowsSelected()}
                        isIndeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
                        onChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                      />
                      {sortControl}
                    </div>
                  ) : (
                    sortControl
                  )}
                </TableColumn>
              );
            })}
          </TableHeader>
          <TableBody
            renderEmptyState={() => (
              <div className="flex h-40 items-center justify-center text-body-medium text-text-tertiary">
                {empty ?? "No rows match."}
              </div>
            )}
          >
            {rows.map((row) => {
              const selected = row.getIsSelected();
              return (
                <TableRow
                  key={row.id}
                  id={row.id}
                  style={
                    selected ? { backgroundColor: "var(--color-background-secondary-default)" } : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const isLead = selectable && cell.column.id === leadId;
                    const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
                    return (
                      <TableCell key={cell.id} className={columnWidth(cell.column.columnDef.meta)}>
                        {isLead ? (
                          <div className="flex min-w-0 items-center gap-2">
                            <Checkbox
                              slot={null}
                              aria-label="Select row"
                              isSelected={row.getIsSelected()}
                              onChange={(v) => row.toggleSelected(!!v)}
                            />
                            {rendered}
                          </div>
                        ) : (
                          rendered
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 ? (
        <div className="px-3 pt-3">
          <Pagination
            page={pagination.pageIndex + 1}
            totalPages={totalPages}
            onChange={(p) => table.setPageIndex(p - 1)}
          />
        </div>
      ) : null}
    </section>
  );
}

export function DataTableRowAction({
  icon,
  label,
}: {
  icon: RemixiconComponentType;
  label: string;
}) {
  return (
    <TooltipTrigger delay={200}>
      <Focusable>
        <IconButton icon={icon} size="small" aria-label={label} />
      </Focusable>
      <Tooltip size="md">{label}</Tooltip>
    </TooltipTrigger>
  );
}

export function DataTableMoreMenu({
  ariaLabel,
  items,
}: {
  ariaLabel: string;
  items: { icon: RemixiconComponentType; label: string; onSelect?: () => void }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger
          aria-label={ariaLabel}
          className={cx(
            "relative inline-flex size-8 shrink-0 items-center justify-center rounded-2lg",
            "border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs",
            "transition-[background-color,border-color,box-shadow,color] duration-150 ease",
            "hover:border-border-button-hover hover:bg-background-primary-hover",
            isOpen && "border-border-button-active bg-background-primary-active",
          )}
        >
          <RiMore2Fill className="size-4 shrink-0" aria-hidden />
        </DropdownTrigger>
        <Tooltip size="md">More actions</Tooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label={ariaLabel} placement="bottom end" className="w-[220px] p-2">
        <DropdownGroup>
          {items.map(({ icon: Icon, label, onSelect }) => (
            <DropdownItem
              key={label}
              onSelect={() => {
                setIsOpen(false);
                onSelect?.();
              }}
              className="px-2 py-1.5"
            >
              <Icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{label}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}
