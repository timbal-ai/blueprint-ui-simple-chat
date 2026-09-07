"use client";

import { useMemo, useState } from "react";
import {
  RiArchiveLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiFileCopyLine,
  RiMore2Fill,
  RiSearchLine,
  RiUserLine,
} from "@remixicon/react";
import { Focusable } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
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
import { Select, SelectItem } from "@/components/base/select/select";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { ChevronSortDown } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";

/**
 * Employees table for the HR template — the customers-table recipe (toolbar
 * with working filters + search, sortable headers, selection, pagination)
 * with people columns: avatar + name and role, work status select,
 * department chip, start date, salary chip, and row actions.
 *
 * The dataset is generated deterministically (stable across renders, so no
 * hydration mismatch). The first eight rows use photo avatars; the rest use
 * initials.
 */

type DepartmentColor = "lime" | "rose" | "yellow" | "cyan" | "blue" | "purple";
type Department = { label: string; color: DepartmentColor };

const DEPARTMENTS: Department[] = [
  { label: "Engineering", color: "blue" },
  { label: "Design", color: "purple" },
  { label: "Sales", color: "lime" },
  { label: "Marketing", color: "yellow" },
  { label: "Support", color: "cyan" },
  { label: "Operations", color: "rose" },
];

const ROLES: Record<string, string[]> = {
  Engineering: ["Backend Engineer", "Frontend Engineer", "DevOps Engineer", "Engineering Manager", "QA Engineer"],
  Design: ["Product Designer", "UI Designer", "User Researcher", "Design Lead"],
  Sales: ["Account Executive", "Sales Engineer", "SDR", "Head of Sales"],
  Marketing: ["Growth Marketer", "Content Lead", "Performance Marketer", "Brand Designer"],
  Support: ["Support Specialist", "Support Lead", "Technical Writer"],
  Operations: ["People Ops", "Finance Ops", "Office Manager", "Legal Counsel"],
};

const SALARY_BUCKETS: { id: string; label: string; test: (n: number) => boolean }[] = [
  { id: "all", label: "All salaries", test: () => true },
  { id: "under-60", label: "Under $60K", test: (n) => n < 60_000 },
  { id: "60-90", label: "$60K – $90K", test: (n) => n >= 60_000 && n <= 90_000 },
  { id: "90-120", label: "$90K – $120K", test: (n) => n > 90_000 && n <= 120_000 },
  { id: "over-120", label: "Over $120K", test: (n) => n > 120_000 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Employee = {
  id: number;
  name: string;
  avatar?: string;
  initialsColor?: "neutral" | "blue";
  role: string;
  department: Department;
  status: "active" | "leave" | "contract";
  salary: number;
  started: string;
  selected?: boolean;
};

const PHOTO_PEOPLE: { name: string; avatar: string }[] = [
  { name: "John Clarkson", avatar: "/avatars/john-clarkson.webp" },
  { name: "Aspen Lubin", avatar: "/avatars/aspen-lubin.webp" },
  { name: "Michael Ekstrom", avatar: "/avatars/michael-ekstrom.webp" },
  { name: "Kianna Vaccaro", avatar: "/avatars/kianna-vaccaro.webp" },
  { name: "Livia Saris", avatar: "/avatars/livia-saris.webp" },
  { name: "Jaydon Aminoff", avatar: "/avatars/jaydon-aminoff.webp" },
  { name: "Maria Lubin", avatar: "/avatars/maria-lubin.webp" },
  { name: "Ann Press", avatar: "/avatars/ann-press.webp" },
];

const FIRST_NAMES = ["Marcus", "Cheyenne", "Alfredo", "Talan", "Roger", "Cristofer", "Emery", "Kadin", "Nolan", "Ruben", "Skylar", "Hanna", "Corey", "Miracle", "Zaire", "Cooper", "Leilani", "Alena", "Terry", "Jaxson", "Kaiya", "Omar", "Phoenix", "Adison", "Gretchen", "Nova", "Ellis", "Dulce", "Wilson"];
const LAST_NAMES = ["Culhane", "Herwitz", "Septimus", "Bergson", "Curtis", "Vetrovs", "Rhiel", "Dokidis", "Kenter", "Stanton", "Baptista", "Workman", "Torff", "Calzoni", "Rosser", "Geidt", "Bator", "Vaccaro", "Lipshutz", "Botosh"];

/** mulberry32 — tiny deterministic PRNG so the demo data is stable. */
function makeRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatSalary(n: number) {
  return `$${Math.round(n / 1000)}K`;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const EMPLOYEES: Employee[] = (() => {
  const rng = makeRng(23);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
  const total = 248;

  return Array.from({ length: total }, (_, i) => {
    const department = pick(DEPARTMENTS);
    const role = pick(ROLES[department.label]);
    const status: Employee["status"] = rng() < 0.82 ? "active" : rng() < 0.55 ? "leave" : "contract";
    const salary = 42_000 + Math.floor(rng() * 118) * 1000;
    const month = pick(MONTHS);
    const day = 1 + Math.floor(rng() * 28);
    const year = 2020 + Math.floor(rng() * 7);

    const base = {
      id: i,
      role,
      department,
      status,
      salary,
      started: `${month} ${String(day).padStart(2, "0")}, ${year}`,
    };

    if (i < PHOTO_PEOPLE.length) {
      return { ...base, name: PHOTO_PEOPLE[i].name, avatar: PHOTO_PEOPLE[i].avatar, selected: i === 1 || i === 2 };
    }
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    return { ...base, name, initialsColor: rng() > 0.5 ? "blue" : ("neutral" as const) };
  });
})();

const PER_PAGE = 10;

function WorkStatusSelect({ defaultValue, name }: { defaultValue: Employee["status"]; name: string }) {
  return (
    <Select
      aria-label={`Work status for ${name}`}
      defaultSelectedKey={defaultValue}
      className="w-[130px]"
    >
      <SelectItem id="active" textValue="Active">
        <StatusDot color="green" />
        Active
      </SelectItem>
      <SelectItem id="leave" textValue="On leave">
        <StatusDot color="yellow" />
        On leave
      </SelectItem>
      <SelectItem id="contract" textValue="Contract">
        <StatusDot color="indigo" />
        Contract
      </SelectItem>
    </Select>
  );
}

type SortKey = "name" | "started" | "salary";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey?: SortKey;
  sort?: SortState;
  onSort?: (key: SortKey) => void;
}) {
  const active = !!sortKey && sort?.key === sortKey;
  const content = (
    <>
      <span
        className={cx(
          "text-body-medium whitespace-nowrap",
          active ? "text-text-primary" : "text-text-tertiary",
        )}
      >
        {label}
      </span>
      <span className="flex size-6 shrink-0 items-center justify-center">
        {sortKey && (
          <ChevronSortDown
            className={cx(
              "size-6 transition-[transform,color] duration-150 ease",
              active ? "text-text-secondary" : "text-text-tertiary",
              active && sort?.dir === "asc" && "rotate-180",
            )}
          />
        )}
      </span>
    </>
  );

  if (!sortKey) {
    return <div className="flex items-center gap-0.5">{content}</div>;
  }

  return (
    <button
      type="button"
      aria-label={`Sort by ${label}`}
      onClick={() => onSort?.(sortKey)}
      className="flex cursor-pointer items-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring rounded-sm"
    >
      {content}
    </button>
  );
}

/** Icon-only row action with a tooltip label — `IconButton` (a plain
 *  `<button>`) is wrapped in `Focusable` so react-aria's `TooltipTrigger`
 *  can attach hover/focus behavior, same pattern as the customers table. */
function RowActionButton({
  icon,
  label,
}: {
  icon: typeof RiEditLine;
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

const MORE_MENU_ACTIONS = [
  { icon: RiUserLine, label: "View profile" },
  { icon: RiFileCopyLine, label: "Copy email" },
  { icon: RiDownload2Line, label: "Download contract" },
  { icon: RiArchiveLine, label: "Archive employee" },
] as const;

/** The "⋮" action: tooltip on hover, contextual dropdown menu on click. The
 *  trigger is styled to match `IconButton`'s small secondary recipe (nesting
 *  the real IconButton inside DropdownTrigger would nest <button>s). */
function RowMoreMenu({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger
          aria-label={`More actions for ${name}`}
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
      <DropdownPopover aria-label={`More actions for ${name}`} placement="bottom end" className="w-[220px] p-2">
        <DropdownGroup>
          {MORE_MENU_ACTIONS.map(({ icon: Icon, label }) => (
            <DropdownItem key={label} onSelect={() => setIsOpen(false)} className="px-2 py-1.5">
              <Icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{label}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

function EmployeeRow({
  employee,
  isSelected,
  onToggle,
  showBorder = true,
}: {
  employee: Employee;
  isSelected: boolean;
  onToggle: (id: number, selected: boolean) => void;
  showBorder?: boolean;
}) {
  return (
    <div className={cx("flex w-full items-center", showBorder && "border-b border-separator-border")}>
      <div className="flex min-w-0 flex-[1.4] items-center gap-2 py-2.5">
        <Checkbox
          isSelected={isSelected}
          onChange={(selected) => onToggle(employee.id, selected)}
          aria-label={`Select ${employee.name}`}
        />
        <div className="flex min-w-0 items-center gap-2">
          {employee.avatar ? (
            <Avatar size="sm" src={employee.avatar} alt="" />
          ) : (
            <Avatar size="sm" color={employee.initialsColor} initials={initialsOf(employee.name)} />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{employee.name}</span>
            <span className="truncate text-body-2-medium text-text-secondary">{employee.role}</span>
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <WorkStatusSelect defaultValue={employee.status} name={employee.name} />
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <Chip variant="bold" color={employee.department.color}>
          {employee.department.label}
        </Chip>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <span className="text-body-medium whitespace-nowrap text-text-primary">
          {employee.started}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <Chip variant="subtle" color="gray">
          {formatSalary(employee.salary)}
        </Chip>
      </div>
      <div className="flex w-[140px] shrink-0 items-center justify-end gap-2.5 px-3 py-2.5">
        <RowActionButton icon={RiDeleteBin6Line} label="Delete" />
        <RowActionButton icon={RiEditLine} label="Edit" />
        <RowMoreMenu name={employee.name} />
      </div>
    </div>
  );
}

export function EmployeesTable() {
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(EMPLOYEES.filter((e) => e.selected).map((e) => e.id)),
  );

  const onSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const toggleRow = (id: number, isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const bucket = SALARY_BUCKETS.find((b) => b.id === salaryFilter) ?? SALARY_BUCKETS[0];
    const q = query.trim().toLowerCase();
    return EMPLOYEES.filter(
      (e) =>
        bucket.test(e.salary) &&
        (departmentFilter === "all" || e.department.label === departmentFilter) &&
        (statusFilter === "all" || e.status === statusFilter) &&
        (q === "" || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)),
    );
  }, [departmentFilter, statusFilter, salaryFilter, query]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      let cmp = 0;
      if (key === "name") cmp = a.name.localeCompare(b.name);
      else if (key === "salary") cmp = a.salary - b.salary;
      else cmp = Date.parse(a.started) - Date.parse(b.started);
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectedOnPage = rows.filter((e) => selected.has(e.id)).length;
  const allOnPageSelected = rows.length > 0 && selectedOnPage === rows.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  const toggleAllOnPage = (isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const e of rows) {
        if (isSelected) next.add(e.id);
        else next.delete(e.id);
      }
      return next;
    });
  };

  const resetPage = () => setPage(1);

  const hasPagination = totalPages > 1;

  return (
    <section
      className={cx(
        "flex w-full flex-col rounded-2xl border border-border-table pt-2",
        hasPagination ? "pb-3" : "pb-0",
      )}
    >
      {/* Toolbar */}
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
          <p className="text-body-medium whitespace-nowrap text-text-primary">
            {filtered.length.toLocaleString()} employees
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          <Select
            aria-label="Filter by department"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={departmentFilter}
            onSelectionChange={(k) => {
              setDepartmentFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All departments">
              All departments
            </SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d.label} id={d.label} textValue={d.label}>
                {d.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by work status"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={statusFilter}
            onSelectionChange={(k) => {
              setStatusFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All statuses">
              All statuses
            </SelectItem>
            <SelectItem id="active" textValue="Active">
              Active
            </SelectItem>
            <SelectItem id="leave" textValue="On leave">
              On leave
            </SelectItem>
            <SelectItem id="contract" textValue="Contract">
              Contract
            </SelectItem>
          </Select>
          <Select
            aria-label="Filter by salary"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={salaryFilter}
            onSelectionChange={(k) => {
              setSalaryFilter(String(k));
              resetPage();
            }}
          >
            {SALARY_BUCKETS.map((b) => (
              <SelectItem key={b.id} id={b.id} textValue={b.label}>
                {b.label}
              </SelectItem>
            ))}
          </Select>
          <InputBase
            aria-label="Search employees"
            placeholder="Search"
            leadingIcon={RiSearchLine}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
            className="text-body-medium"
          />
        </div>
      </div>

      {/* Table grid: headers + rows share a min width and scroll horizontally together */}
      <div className="mt-2 w-full overflow-x-auto">
        <div className="flex min-w-[900px] flex-col">
          {/* Column headers */}
          <div className="flex w-full items-center border-y border-separator-border bg-background-secondary-default pl-3">
            <div className="flex min-w-0 flex-[1.4] items-center gap-2 py-2.5">
              <Checkbox
                isSelected={allOnPageSelected}
                isIndeterminate={someOnPageSelected}
                onChange={toggleAllOnPage}
                aria-label="Select all employees on this page"
              />
              <SortableHeader label="Employee" sortKey="name" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Status" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Department" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Start date" sortKey="started" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Salary" sortKey="salary" sort={sort} onSort={onSort} />
            </div>
            <div className="flex w-[140px] shrink-0 items-center px-3 py-2.5">
              <span className="text-body-medium whitespace-nowrap text-text-tertiary">Actions</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex w-full flex-col pl-3">
            {rows.length > 0 ? (
              rows.map((employee, index) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  isSelected={selected.has(employee.id)}
                  onToggle={toggleRow}
                  showBorder={hasPagination || index < rows.length - 1}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-10 pr-3">
                <span className="text-body-medium text-text-tertiary">
                  No employees match your filters.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination footer — only when the results actually paginate */}
      {hasPagination && (
        <div className="px-3 pt-3">
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  );
}
