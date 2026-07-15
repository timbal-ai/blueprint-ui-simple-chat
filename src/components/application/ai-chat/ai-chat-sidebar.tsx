"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import {
  RiAddFill,
  RiCustomerServiceLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiGuideLine,
  RiRobot2Line,
  RiSearchLine,
  RiSettings4Line,
  RiSideBarFill,
} from "@remixicon/react";
import { DashboardUserMenu } from "@/components/application/dashboard/dashboard-user-menu";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Kbd } from "@/components/base/kbd/kbd";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → "ai_chat" → Sidebar (node 4030:5910, 260×876).
 *
 * The AI-chat variant of the floating sidebar — same 260px panel (p 12,
 * radius/3xl, white 1px border, sidebar-elevation shadow, bg
 * background/secondary) but with a chat-first nav: primary actions
 * (New agent / Automations / Customize), a "Repositories" tree whose repos
 * expand into recent chats (36px-indented rows with relative-time chips and
 * a curved tree connector), and a footer that swaps the dashboard's team
 * menu for a "Board team · Pro Plan" card with an Upgrade button.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface AiChatThread {
  label: string;
  /** Relative-time chip (e.g. "34m"). */
  time: string;
  isSelected?: boolean;
}

export interface AiChatRepo {
  label: string;
  /** Recent chats listed when the repo is expanded. */
  threads: AiChatThread[];
  /** Expanded on first render (folder-open icon + visible threads). */
  defaultOpen?: boolean;
}

const DEFAULT_REPOS: AiChatRepo[] = [
  {
    label: "boardui",
    threads: [
      { label: "pro badge restyle", time: "2h" },
      { label: "installation docs page", time: "1d" },
    ],
  },
  {
    label: "vibl coding project",
    defaultOpen: true,
    threads: [
      { label: "landing page design", time: "34m", isSelected: true },
      { label: "mobile app for vuejs...", time: "5h" },
      { label: "code refactor dropdo...", time: "18h" },
    ],
  },
  {
    label: "strider landing page work",
    threads: [
      { label: "hero section animation", time: "3d" },
      { label: "pricing table copy", time: "4d" },
    ],
  },
  {
    label: "pirate mini game iOS",
    threads: [
      { label: "cannon physics tuning", time: "1w" },
      { label: "sprite sheet cleanup", time: "2w" },
    ],
  },
];

/** Top-level nav row — icon + label, p 8, radius/2lg (same recipe as the
 *  dashboard sidebar's unselected items). */
function NavItem({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex w-full items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover"
    >
      <Icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
      <span className="text-body-medium whitespace-nowrap text-text-secondary">{label}</span>
    </a>
  );
}

/** Chat row under an open repo — indented 36px (pl aligns with the repo
 *  label), py 5, with a relative-time chip on the right. */
function ThreadItem({
  label,
  time,
  isSelected = false,
  tabIndex,
}: AiChatThread & { tabIndex?: number }) {
  return (
    <a
      href="#"
      tabIndex={tabIndex}
      aria-current={isSelected ? "page" : undefined}
      className={cx(
        "flex w-full items-center gap-2.5 rounded-2lg py-[5px] pr-2 pl-9 transition-colors duration-150 ease",
        isSelected ? "bg-background-secondary-hover" : "hover:bg-background-secondary-hover",
      )}
    >
      <span className="min-w-0 flex-1 truncate text-body-medium text-text-secondary">{label}</span>
      <span className="inline-flex shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default px-1 py-px text-caption-1-medium whitespace-nowrap text-text-secondary">
        {time}
      </span>
    </a>
  );
}

/**
 * Curved tree connector (Figma "Vector 132"): a vertical guide dropping from
 * the repo's folder icon with a rounded elbow into each thread row. Rows are
 * 30px tall with 2px gaps; the trunk sits at the icon's center (x 17.5 within
 * the list) and each elbow lands 8px to the right at the row's center.
 */
function TreeConnector({ count }: { count: number }) {
  const rowPitch = 32; // 30px row + 2px gap
  const firstCenter = 15;
  const height = firstCenter + rowPitch * (count - 1) + 1;
  return (
    <svg
      aria-hidden
      width="12"
      height={height}
      viewBox={`0 0 12 ${height}`}
      fill="none"
      className="pointer-events-none absolute top-0 left-[16.5px] text-border-button-default"
    >
      {Array.from({ length: count }, (_, i) => {
        const y = firstCenter + rowPitch * i;
        return (
          <path
            key={y}
            d={`M0.5 0 V${y - 5} Q0.5 ${y} 5.5 ${y} H11.5`}
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

/** Expandable repo folder: clicking the row toggles its recent chats
 *  (folder → folder-open, threads slide in below with the tree connector).
 *  Expansion animates via the grid-rows 0fr→1fr trick so the list height
 *  eases smoothly without measuring content. */
function RepoItem({ repo }: { repo: AiChatRepo }) {
  const [open, setOpen] = useState(repo.defaultOpen ?? false);
  const Icon = open ? RiFolderOpenLine : RiFolderLine;

  return (
    <div className="flex w-full flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 transition-colors duration-150 ease hover:bg-background-secondary-hover"
      >
        <Icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <span className="truncate text-body-medium whitespace-nowrap text-text-secondary">
          {repo.label}
        </span>
      </button>
      <div
        aria-hidden={!open}
        className={cx(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="relative flex w-full flex-col gap-0.5 pt-0.5">
            <TreeConnector count={repo.threads.length} />
            {repo.threads.map((thread) => (
              <ThreadItem key={thread.label} {...thread} tabIndex={open ? undefined : -1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AiChatSidebar({
  repos = DEFAULT_REPOS,
  className,
}: {
  repos?: AiChatRepo[];
  className?: string;
} = {}) {
  return (
    <aside
      className={cx(
        "flex h-full w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl",
        "border border-border-button-white bg-background-secondary-default p-3 shadow-sidebar",
        className,
      )}
    >
      <div className="flex min-h-0 w-full flex-col gap-3">
        {/* Workspace switcher + panel toggle */}
        <div className="flex w-full flex-row items-center justify-between">
          <DashboardUserMenu />
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="cursor-pointer text-foreground-icon-secondary"
          >
            <RiSideBarFill className="size-5 -scale-x-100" aria-hidden />
          </button>
        </div>

        {/* Quick search */}
        <button
          type="button"
          aria-label="Quick Search"
          className="flex w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default p-2"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium whitespace-nowrap text-text-secondary">
              Quick Search
            </span>
          </span>
          <Kbd>⌘L</Kbd>
        </button>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto [scrollbar-width:none]">
          {/* Primary actions */}
          <nav className="flex w-full shrink-0 flex-col gap-1">
            <NavItem icon={RiAddFill} label="New agent" />
            <NavItem icon={RiRobot2Line} label="Automations" />
            <NavItem icon={RiGuideLine} label="Customize" />
          </nav>

          {/* Repositories tree */}
          <div className="flex w-full flex-col gap-2.5">
            <span className="text-body-medium text-text-secondary">Repositories</span>
            <nav className="flex w-full flex-col gap-1">
              {repos.map((repo) => (
                <RepoItem key={repo.label} repo={repo} />
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 pt-3">
        {/* Secondary nav */}
        <nav className="flex w-full flex-col gap-1">
          <NavItem icon={RiCustomerServiceLine} label="Support" />
          <NavItem icon={RiSettings4Line} label="Settings" />
        </nav>

        {/* Plan card */}
        <div className="flex w-full items-center justify-between rounded-xl bg-neutral-200 py-2 pr-3 pl-2.5">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar
              size="md"
              color="blue"
              initials="B"
              className="text-[18.824px] leading-[22.588px] font-medium"
            />
            <span className="flex min-w-0 flex-col items-start justify-center">
              <span className="text-body-medium whitespace-nowrap text-text-primary">Board team</span>
              <span className="text-body-regular whitespace-nowrap text-text-secondary">
                Pro Plan
              </span>
            </span>
          </span>
          <Button variant="secondary" size="small">
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  );
}
