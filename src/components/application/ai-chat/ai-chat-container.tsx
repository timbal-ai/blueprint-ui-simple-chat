"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  RiArrowDropDownLine,
  RiArrowUpLine,
  RiFileCopyLine,
  RiFolderLine,
  RiGitMergeLine,
  RiInfinityLine,
  RiLinkM,
  RiMic2Line,
  RiMoreFill,
  RiShare2Line,
  RiThumbDownLine,
  RiThumbUpLine,
} from "@remixicon/react";
import { motion, type Variants } from "motion/react";
import { AddMenu, ModelMenu, ProjectFolderMenu } from "@/components/application/ai-chat/ai-chat-menus";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → "ai_chat" → Chat_container (node 4032:6224,
 * 718×876 at 1440).
 *
 * The center column of the AI chat template: a radius/3xl
 * background/secondary surface with a breadcrumb header (project › chat +
 * share/more actions), the scrollable message thread, the pill composer
 * (attach, input, model picker, mic, send), and the status bar (branch,
 * project, mode, context meter). Flexes to fill the space between the
 * fixed sidebar and the fixed-width code panel.
 */

/* ------------------------------------------------------------------ thread */

/** Each line of a message blurs + fades in as it "streams". */
const LINE_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/** Message container fades in softly while staggering its lines
 *  top-to-bottom. */
const MESSAGE_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.18 },
  },
};

/** A block of a message (paragraph, list, feedback row) that blurs in. */
function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={LINE_VARIANTS} className={className}>
      {children}
    </motion.div>
  );
}

/** 22px square feedback action (p 5 + 12px glyph) on background/tertiary. */
function FeedbackButton({
  icon: Icon,
  label,
}: {
  icon: typeof RiThumbUpLine;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex cursor-pointer items-center rounded-lg bg-background-tertiary-default p-[5px] transition-colors duration-150 ease hover:bg-background-secondary-hover"
    >
      <Icon className="size-3 text-foreground-icon-secondary" aria-hidden />
    </button>
  );
}

function FeedbackRow() {
  return (
    <div className="flex items-center gap-1.5">
      <FeedbackButton icon={RiThumbUpLine} label="Good response" />
      <FeedbackButton icon={RiThumbDownLine} label="Bad response" />
      <FeedbackButton icon={RiFileCopyLine} label="Copy response" />
    </div>
  );
}

/** Assistant turn: 14/20 regular prose + feedback actions. Lines (direct
 *  children, authored as `Line`s) blur in staggered when the message loads. */
function AssistantMessage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={MESSAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex w-full flex-col gap-2 text-body-regular text-text-primary"
    >
      {children}
      <Line>
        <FeedbackRow />
      </Line>
    </motion.div>
  );
}

/** User turn: white radius/2xl card (p 12, card contact shadow). Sizes to its
 *  content, capped at the thread column plus the 6px bleed the composer has. */
function UserMessage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={MESSAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="-mx-1.5 flex w-fit max-w-[calc(100%+12px)] flex-col rounded-2xl bg-background-primary-default px-3 py-[11px] text-body-regular text-text-primary shadow-card"
    >
      {children}
    </motion.div>
  );
}

/** Inline attachment chip inside a user message (indigo link pill). */
function LinkChip({ children }: { children: string }) {
  return (
    <span className="-my-0.5 mr-1 inline-flex items-center justify-center gap-0.5 rounded-lg bg-indigo-100 px-1 py-[3px] align-middle">
      <RiLinkM className="size-4 shrink-0 text-indigo-500" aria-hidden />
      <span className="text-caption-2-medium whitespace-nowrap text-indigo-500">{children}</span>
    </span>
  );
}

/** Bulleted list — an orchestrator in the message stagger, so its items
 *  blur in one after another. */
function Bullets({ children }: { children: ReactNode }) {
  return (
    <motion.ul variants={MESSAGE_VARIANTS} className="flex list-disc flex-col gap-2 pl-[21px]">
      {children}
    </motion.ul>
  );
}

/** Bullet that blurs in as its own line within the message stagger. */
function Bullet({ children }: { children: ReactNode }) {
  return <motion.li variants={LINE_VARIANTS}>{children}</motion.li>;
}

/** The conversation, one entry per turn — revealed in 2s batches on mount. */
const MESSAGES: { id: string; node: ReactNode }[] = [
  {
    id: "a1",
    node: (
      <AssistantMessage>
        <Line>
          <p>Both changes are in:</p>
        </Line>
        <Bullets>
          <Bullet>
            <span className="font-medium">Sidebar PRO badge</span> — swapped the blue gradient
            for the minimal treatment: grey bg-background-tertiary-default with
            text-text-secondary. Since ProBadge is only used in the docs sidebar (the gallery
            cards have their own tier styling), this was a safe global restyle.
          </Bullet>
        </Bullets>
        <Line>
          <p>
            One implementation note: the framework tabs needed a small client wrapper
            (app/installation/framework-tabs.tsx) because icon components can&apos;t be passed
            from a server page across the client boundary — the step content itself stays
            server-rendered so componentSource still works.
          </p>
        </Line>
        <Line>
          <p>
            Verified: the page returns 200 on the dev server, the redirect works, and the full
            production build passes cleanly. Happy to push when you&apos;re ready.
          </p>
        </Line>
      </AssistantMessage>
    ),
  },
  {
    id: "u1",
    node: (
      <UserMessage>
        <Line>
          <p>
            make detail screens like this for home and medical profile templates:{" "}
            <LinkChip>figma.com/project/hse82s...</LinkChip> you can increase max width of the
            detail page for this case otherwise dashboard page wouldn&apos;t fit
          </p>
        </Line>
      </UserMessage>
    ),
  },
  {
    id: "a2",
    node: (
      <AssistantMessage>
        <Line>
          <p className="text-text-secondary">Worked for 5m 32s</p>
        </Line>
        <Line>
          <p>Both template detail pages are live, in the style defined in Figma.</p>
        </Line>
        <Bullets>
          <Bullet>
            <span className="font-medium">New pages</span> — /components/home-dashboard and
            /components/medical-profile, built with ComponentDetail: title and description, a
            scaled live preview of the full template (the actual DashboardShell / MedicalShell
            rendered at 80% inside a bordered frame, fully interactive), a &quot;Live
            template&quot; section linking to the full-size page under /templates/…, a
            &quot;What&apos;s included&quot; section listing everything in the package, and a
            Pro callout instead of install instructions.
          </Bullet>
          <Bullet>
            <span className="font-medium">Wider layout</span> — ComponentDetail now takes a
            wide prop that bumps the page shell from 1200px to 1560px (main column 900px →
            1220px), so the dashboards fit without heavy downscaling. Regular component pages
            are unchanged.
          </Bullet>
        </Bullets>
        <Line>
          <p>
            Both pages return 200 on the dev server and lints are clean. Take a look — happy to
            adjust the preview scale or frame height, and to push when you&apos;re ready.
          </p>
        </Line>
      </AssistantMessage>
    ),
  },
  {
    id: "u2",
    node: (
      <UserMessage>
        <Line>
          <p>
            looks great! add both templates to the docs sidebar under a new Templates group and
            push everything to main
          </p>
        </Line>
      </UserMessage>
    ),
  },
  {
    id: "a3",
    node: (
      <AssistantMessage>
        <Line>
          <p className="text-text-secondary">Worked for 1m 48s</p>
        </Line>
        <Line>
          <p>
            Done — the docs sidebar now has a <span className="font-medium">Templates</span> group
            listing Home Dashboard and Medical Profile with PRO badges, and the components gallery
            got a matching section. Everything is committed and pushed to main; the Vercel build
            went through cleanly.
          </p>
        </Line>
      </AssistantMessage>
    ),
  },
];

/** Scrollable thread that soft-loads the conversation: the first message
 *  mounts immediately, then one more every 2s, each blurring in line by
 *  line. Follows the newest message with a smooth scroll. */
function Thread() {
  const [visibleCount, setVisibleCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount >= MESSAGES.length) return;
    const timer = setTimeout(() => setVisibleCount((count) => count + 1), 2000);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && visibleCount > 1) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [visibleCount]);

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-4 pt-4 [scrollbar-width:thin]"
    >
      {MESSAGES.slice(0, visibleCount).map((message) => (
        <div key={message.id}>{message.node}</div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- composer */

function Composer() {
  return (
    <div className="flex h-[52px] w-full items-center gap-2.5 rounded-full bg-background-primary-default py-2 pr-2 pl-2 shadow-xs">
      <AddMenu />

      <input
        type="text"
        aria-label="Message"
        placeholder="Ask me anything"
        className="h-5 min-w-0 flex-1 bg-transparent text-body-regular text-text-primary caret-blue-500 outline-none placeholder:text-text-tertiary"
      />

      <ModelMenu />

      <div className="flex shrink-0 items-center gap-2 pl-1.5">
        <button
          type="button"
          aria-label="Voice input"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-button-default bg-background-primary-default p-2 shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover"
        >
          <RiMic2Line className="size-5 text-foreground-icon-primary" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Send message"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-button-primary p-2"
        >
          <RiArrowUpLine className="size-5 text-white" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- status bar */

/** 16px circular context meter at `pct` percent. */
function ContextRing({ pct }: { pct: number }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="shrink-0 -rotate-90">
      <circle cx="8" cy="8" r={r} fill="none" stroke="var(--color-neutral-300)" strokeWidth="2.5" />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        stroke="var(--color-neutral-500)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
      />
    </svg>
  );
}

function StatusItem({
  icon,
  label,
  dropdown = false,
}: {
  icon: ReactNode;
  label: string;
  dropdown?: boolean;
}) {
  return (
    <button type="button" className="flex cursor-pointer items-center gap-1">
      {icon}
      <span className="flex items-center">
        <span className="text-body-2-medium whitespace-nowrap text-text-secondary">{label}</span>
        {dropdown && (
          <RiArrowDropDownLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
        )}
      </span>
    </button>
  );
}

function StatusBar() {
  return (
    <div className="flex h-[26px] w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <StatusItem
          icon={<RiGitMergeLine className="size-4 shrink-0 -scale-y-100 text-foreground-icon-secondary" aria-hidden />}
          label="Main"
        />
        <ProjectFolderMenu />
      </div>
      <div className="flex items-center gap-3">
        <StatusItem
          icon={<RiInfinityLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />}
          label="Agent"
          dropdown
        />
        <div className="flex items-center gap-1 rounded-[40px] bg-background-tertiary-default py-1 pr-2 pl-1.5">
          <ContextRing pct={57} />
          <span className="text-body-2-medium whitespace-nowrap text-text-secondary">57%</span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- container */

export function AiChatContainer({ className }: { className?: string } = {}) {
  return (
    <section
      className={cx(
        "flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-3xl bg-background-secondary-default",
        className,
      )}
    >
      {/* Header — project › chat breadcrumb + share/more */}
      <header className="flex w-full items-center justify-between gap-2 px-4 pt-4">
        <Breadcrumb aria-label="Chat location" className="min-w-0 flex-1">
          <BreadcrumbItem icon={RiFolderLine}>vibl coding project</BreadcrumbItem>
          <BreadcrumbItem current>landing page design</BreadcrumbItem>
        </Breadcrumb>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Share chat" className="cursor-pointer">
            <RiShare2Line className="size-4 text-foreground-icon-secondary" aria-hidden />
          </button>
          <button type="button" aria-label="More options" className="cursor-pointer">
            <RiMoreFill className="size-4 text-foreground-icon-secondary" aria-hidden />
          </button>
        </div>
      </header>

      {/* Thread */}
      <Thread />

      {/* Composer + status bar */}
      <div className="flex w-full flex-col gap-2.5 px-2.5 pt-3 pb-2.5">
        <Composer />
        <div className="px-1.5">
          <StatusBar />
        </div>
      </div>
    </section>
  );
}
