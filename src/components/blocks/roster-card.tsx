import * as React from "react";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * RosterCard — the "Recent hires" reference grammar: a soft gray tile with
 * a muted label + big count headline (and an action slot for a team
 * selector), a 2-up grid of white person tiles (avatar, name, muted meta,
 * full-width role chip), and built-in Previous/Next pagination.
 *
 * Page turns re-mount the grid with a short cascade so browsing feels
 * alive. Generic beyond hires: on-call rotations, top contributors,
 * assignees, attendees — anything that is "people, few at a time".
 */

interface RosterPerson {
  id: string;
  name: string;
  /** Muted line under the name — "Joined today", "On call until Fri". */
  meta?: string;
  /** The full-width chip under the identity — role, team, status. */
  tag?: string;
  avatarSrc?: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RosterCard({
  title,
  count,
  action,
  people,
  pageSize = 4,
  onSelectPerson,
  className,
}: {
  /** Muted header label — "Recent hires". */
  title: string;
  /** Big headline number. Defaults to people.length. */
  count?: React.ReactNode;
  /** Header-right slot — a team selector dropdown, a "View all" link… */
  action?: React.ReactNode;
  people: RosterPerson[];
  /** Person tiles per page. */
  pageSize?: number;
  onSelectPerson?: (id: string) => void;
  className?: string;
}) {
  const [page, setPage] = React.useState(0);
  const pageCount = Math.max(Math.ceil(people.length / pageSize), 1);
  const current = people.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div
      data-slot="roster-card"
      className={cn("flex flex-col gap-2 rounded-2xl bg-muted/70 p-2", className)}
    >
      <div className="flex items-start justify-between gap-2 px-2 pt-1">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[13px] text-foreground/80">{title}</span>
          <span className="text-[1.7rem] leading-tight font-medium tracking-tight tabular-nums text-foreground">
            {count ?? people.length}
          </span>
        </div>
        {action}
      </div>

      {/* key={page} re-mounts the grid so tiles cascade in on page turns. */}
      <div
        key={page}
        className="grid flex-1 grid-cols-1 gap-2 stagger-children sm:grid-cols-2"
      >
        {current.map((person) => {
          const clickable = onSelectPerson != null;
          const Tile = clickable ? "button" : "div";
          return (
            <Tile
              key={person.id}
              type={clickable ? "button" : undefined}
              onClick={clickable ? () => onSelectPerson(person.id) : undefined}
              className={cn(
                "flex min-w-0 flex-col gap-2.5 rounded-xl border border-border/60 bg-card p-3 text-left",
                "shadow-[0_1px_2px_0_color-mix(in_srgb,black_6%,transparent),0_2px_6px_-2px_color-mix(in_srgb,black_8%,transparent)]",
                clickable &&
                  "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              )}
            >
              <div className="flex items-center gap-2.5">
                <Avatar className="size-10">
                  {person.avatarSrc ? (
                    <AvatarImage src={person.avatarSrc} alt={person.name} />
                  ) : null}
                  <AvatarFallback className="text-xs">
                    {initialsOf(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate text-sm font-medium text-foreground">
                    {person.name}
                  </span>
                  {person.meta ? (
                    <span className="truncate text-xs text-muted-foreground">
                      {person.meta}
                    </span>
                  ) : null}
                </div>
              </div>
              {person.tag ? (
                <span className="w-full truncate rounded-lg bg-muted px-3 py-1.5 text-center text-[13px] text-muted-foreground">
                  {person.tag}
                </span>
              ) : null}
            </Tile>
          );
        })}
      </div>

      {pageCount > 1 ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            <ArrowLeftIcon />
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={page === pageCount - 1}
            onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          >
            Next
            <ArrowRightIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export { RosterCard };
export type { RosterPerson };
