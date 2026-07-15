import { useState, type ReactNode } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { ChevronDownSmall } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → dashboard 1 → Frame 125 (node 3731:3042).
 *
 * "Recent hires" card: metric header, 2×2 grid of people cards, pagination.
 *
 * THE canonical people-roster card (the house `RosterCard` replica was
 * retired in its favor). All props default to the Figma demo content —
 * pass `people` (any length; Previous/Next page through them 4-up),
 * `title`, `count`, and an optional `action` node for the header's
 * top-right slot.
 */

export interface RosterPerson {
  name: string;
  /** Secondary line under the name — "Joined today". */
  meta: string;
  /** Bottom chip — role, team, tag. */
  tag: string;
  avatarSrc?: string;
}

const DEMO_HIRES: RosterPerson[] = [
  { name: "Livia Saris", meta: "Joined today", tag: "Backend Engineer", avatarSrc: "https://i.pravatar.cc/80?img=47" },
  { name: "Jaydon Aminoff", meta: "2 days ago", tag: "UI Designer", avatarSrc: "https://i.pravatar.cc/80?img=12" },
  { name: "Maria Lubin", meta: "5 days ago", tag: "User Researcher", avatarSrc: "https://i.pravatar.cc/80?img=32" },
  { name: "Ann Press", meta: "A week ago", tag: "DevOps Engineer", avatarSrc: "https://i.pravatar.cc/80?img=25" },
];

const PAGE_SIZE = 4;

export function RecentHiresCard({
  title = "Recent hires",
  count = 56,
  people = DEMO_HIRES,
  action,
  className,
}: {
  /** Muted header label. */
  title?: string;
  /** Headline number under the title. */
  count?: number;
  people?: RosterPerson[];
  /** Header top-right slot. Defaults to the demo "Board team" switcher. */
  action?: ReactNode;
  className?: string;
} = {}) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(people.length / PAGE_SIZE));
  const visible = people.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className={cx("relative flex h-[329px] min-w-0 flex-1 flex-col rounded-2xl bg-background-secondary-default p-2", className)}>
      {/* Header */}
      <div className="flex items-start justify-between px-2 pt-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">{title}</p>
          <p className="text-title-1-medium whitespace-nowrap text-text-primary">{count}</p>
        </div>
        {action ?? (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-2lg px-0.5"
          >
            <span className="text-body-medium whitespace-nowrap text-text-primary">
              Board team
            </span>
            <ChevronDownSmall className="size-4 shrink-0 text-text-secondary" />
          </button>
        )}
      </div>

      {/* People grid */}
      <div className="mt-[11px] grid flex-1 grid-cols-2 grid-rows-2 gap-2">
        {visible.map((person) => (
          <div
            key={person.name}
            className="flex min-w-0 flex-col items-start justify-between rounded-2lg bg-background-primary-default p-2.5 shadow-card"
          >
            <div className="flex w-full min-w-0 items-center gap-2">
              <Avatar
                size="lg"
                src={person.avatarSrc}
                initials={person.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                alt={person.name}
              />
              <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                <p className="w-full truncate text-body-medium text-text-primary">
                  {person.name}
                </p>
                <p className="w-full truncate text-body-2-medium text-text-secondary">
                  {person.meta}
                </p>
              </div>
            </div>
            <Chip variant="caption" color="soft" className="w-full">
              {person.tag}
            </Chip>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-2 flex w-full items-center gap-2">
        <Button
          variant="secondary"
          size="small"
          leadingIcon={RiArrowLeftLine}
          className="flex-1"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="small"
          trailingIcon={RiArrowRightLine}
          className="flex-1"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
