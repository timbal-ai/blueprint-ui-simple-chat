import { RiArrowDownSLine, RiGlobalLine, RiSearchLine, RiToolsLine } from "@remixicon/react";
import { useAuiState, type ToolCallMessagePartComponent, type ToolCallMessagePartProps } from "@assistant-ui/react";
import { Component, useState, type ComponentType, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ToolArtifactFallback,
  ToolFallback,
  parseArtifactFromToolResult,
  useArtifactRegistry,
  useToolRunning,
} from "@timbal-ai/timbal-react";

import { LogRow, SOFT_EASE, ShimmerText, useLogMotion } from "@/components/application/agent-log/agent-log";
import {
  WebSearch,
  type WebSearchBrand,
  type WebSearchSource,
  type WebSearchStep,
} from "@/components/application/web-search/web-search";
import { cx } from "@/utils/cx";

/**
 * `tools.Override` for the BoardUI assistant message: tool calls rendered with
 * BoardUI's agent log components on top of the Timbal runtime.
 *
 * Every tool call is ONE collapsed row (`ToolDisclosure`): icon, humanised
 * tool name (shimmering while it runs) and a chevron. It mounts closed —
 * while running and once settled — and only the reader opens it, so a reply
 * never arrives with its tool log unfolded above the answer.
 *
 * - A result that parses as a registered Timbal artifact (chart, table, ui,
 *   html, json, question) is delegated to the runtime's `ToolArtifactFallback`,
 *   so artifacts render exactly as with the stock message (content, not log).
 * - A search-shaped tool (`/search|browse|fetch|crawl|web/i`) whose result
 *   carries URLs opens onto BoardUI `WebSearch`: the query and the URLs as a
 *   Sources row (hostname as the label, brand marks for the sites the design
 *   system draws).
 * - Everything else opens onto the argument summary and a 200-character
 *   result preview on the agent log's guide. Consecutive tools are wrapped by
 *   `ToolCallGroup` (see `messages.tsx`) so a burst of the same call reads as
 *   one row instead of a stack of rows.
 *
 * Everything is driven from the real part status — nothing here runs on a
 * timer. A render error inside falls back to the runtime's `ToolFallback`.
 */
export const TimbalToolPart: ToolCallMessagePartComponent = (props) => (
  <ToolPartBoundary fallback={<ToolFallback {...props} />}>
    <TimbalToolPartImpl {...props} />
  </ToolPartBoundary>
);

/**
 * Consecutive `tool-call` parts become one group so a run of five "Knowledge
 * base query" rows collapses to a single dropdown. Text, images, a lone tool
 * and a tool that resolved to a Timbal artifact stay ungrouped (`groupKey`
 * undefined) so a chart or table is not buried inside the log.
 */
export function groupConsecutiveToolCalls(parts: readonly GroupablePart[]) {
  const groups: { groupKey: string | undefined; indices: number[] }[] = [];
  let tools: number[] = [];
  const flush = () => {
    if (tools.length === 0) return;
    groups.push({
      groupKey: tools.length > 1 ? "tools" : undefined,
      indices: tools,
    });
    tools = [];
  };
  parts.forEach((part, index) => {
    if (isGroupableToolCall(part)) {
      tools.push(index);
    } else {
      flush();
      groups.push({ groupKey: undefined, indices: [index] });
    }
  });
  flush();
  return groups;
}

type GroupablePart = { type?: string; result?: unknown };

function isGroupableToolCall(part: GroupablePart) {
  return part.type === "tool-call" && !parseArtifactFromToolResult(part.result);
}

/**
 * Wraps a run of tool parts in one collapsed `ToolDisclosure` row that
 * shimmers while any call is still running. A single tool (or text) is not
 * wrapped — `groupKey` is undefined then.
 */
export function ToolCallGroup({
  groupKey,
  indices,
  children,
}: {
  groupKey: string | undefined;
  indices: number[];
  children: ReactNode;
}) {
  if (groupKey !== "tools" || indices.length < 2) return children;
  return <CollapsedToolCalls indices={indices}>{children}</CollapsedToolCalls>;
}

function CollapsedToolCalls({ indices, children }: { indices: number[]; children: ReactNode }) {
  const parts = useAuiState((s) => s.message.parts);
  const running = indices.some((index) => isToolPartRunning(parts[index]));
  const names = [
    ...new Set(
      indices
        .map((index) => {
          const part = parts[index];
          return part && typeof part === "object" && "toolName" in part && typeof part.toolName === "string"
            ? humanizeToolName(part.toolName)
            : null;
        })
        .filter((name): name is string => Boolean(name)),
    ),
  ];
  const count = indices.length;
  const label =
    names.length === 1 ? `${names[0]} · ${count}` : `${count} tool calls`;

  return (
    <ToolDisclosure label={label} running={running} testId="tool-call-group">
      <div className="flex flex-col">{children}</div>
    </ToolDisclosure>
  );
}

/**
 * The one row every tool call renders as. Closed on mount and never opened
 * by the runtime — not while the call runs, not when it settles; only the
 * reader's click opens it. The body stays mounted so closing can animate.
 */
function ToolDisclosure({
  label,
  icon: Icon = RiToolsLine,
  running = false,
  testId,
  children,
}: {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  running?: boolean;
  testId?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-0.5" data-testid={testId}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={label}
        className="group flex w-full cursor-pointer items-center gap-2 rounded-md py-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <Icon className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-body-medium text-text-secondary">
          {running ? <ShimmerText>{label}</ShimmerText> : label}
        </span>
        <RiArrowDownSLine
          aria-hidden
          className={cx(
            "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-300 ease group-hover:text-foreground-icon-secondary",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
      {/* No `initial`: the body renders at its target (closed) on mount and
          only animates when the reader toggles it. */}
      <motion.div
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{
          height: { duration: 0.3, ease: SOFT_EASE },
          opacity: { duration: 0.22, ease: "easeOut" },
        }}
        className="overflow-hidden"
        aria-hidden={!open}
        inert={!open}
      >
        {children}
      </motion.div>
    </div>
  );
}

function isToolPartRunning(part: unknown) {
  if (!part || typeof part !== "object") return false;
  const record = part as { type?: string; status?: unknown; result?: unknown };
  if (record.type !== "tool-call") return false;
  const status = record.status;
  if (status === "running") return true;
  if (status && typeof status === "object" && "type" in status) {
    const type = (status as { type?: string }).type;
    if (type === "running") return true;
    if (type === "complete" || type === "incomplete") return false;
  }
  return record.result === undefined;
}

const SEARCH_TOOL = /search|browse|fetch|crawl|web/i;
const PREVIEW_CHARS = 200;
const ARGS_CHARS = 160;

function TimbalToolPartImpl(props: ToolCallMessagePartProps) {
  const { toolName, args, argsText, result, status, isError } = props;
  const running = useToolRunning({ status, result });
  const registry = useArtifactRegistry();

  if (!running) {
    const artifact = parseArtifactFromToolResult(result);
    if (artifact && registry[artifact.type]) return <ToolArtifactFallback {...props} />;
  }

  const failed =
    !running && (isError === true || (status?.type === "incomplete" && status.reason !== "cancelled"));
  const label = humanizeToolName(toolName);
  const argsSummary = summarizeArgs(args, argsText);

  const title = failed ? `${label} · failed` : label;

  if (SEARCH_TOOL.test(toolName) && !failed) {
    const sources = running ? [] : collectSources(result);
    if (running || sources.length > 0) {
      return (
        <ToolDisclosure label={title} icon={RiSearchLine} running={running}>
          <SearchToolLog query={queryOf(args)} sources={sources} running={running} />
        </ToolDisclosure>
      );
    }
  }

  const lines: string[] = [];
  if (argsSummary) lines.push(argsSummary);
  lines.push(running ? "Waiting for result" : (previewResult(result) ?? "No result"));

  return (
    <ToolDisclosure label={title} running={running}>
      <ToolLogLines lines={lines} />
    </ToolDisclosure>
  );
}

/* --------------------------------------------------------------- generic */

/** The argument summary and result preview on the agent log's guide. */
function ToolLogLines({ lines }: { lines: string[] }) {
  const reduce = useLogMotion();
  return (
    <ul className="mt-0.5 ml-2 flex flex-col">
      {lines.map((line, index) => (
        <LogRow key={`${index}-${line}`} first={index === 0} last={index === lines.length - 1} reduce={reduce}>
          <span className="block py-1 text-body-regular break-words text-text-secondary">{line}</span>
        </LogRow>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- search */

function SearchToolLog({
  query,
  sources,
  running,
}: {
  query?: string;
  sources: WebSearchSource[];
  running: boolean;
}) {
  const steps: WebSearchStep[] = [];
  if (query) steps.push({ label: "Query", query, icon: RiSearchLine });
  steps.push(
    running
      ? { label: "Searching", icon: RiGlobalLine }
      : {
          label: `Found ${sources.length} ${sources.length === 1 ? "source" : "sources"}`,
          icon: RiGlobalLine,
          sources,
        },
  );
  // One unit per step, plus the Sources row under the step that found them.
  const total = steps.length + (running ? 0 : 1);
  return (
    <div className="mt-0.5 ml-2">
      <WebSearch key={running ? "running" : "settled"} steps={steps} revealed={total} working={false} />
    </div>
  );
}

/* ------------------------------------------------------------- formatting */

/** `get_weather` → "Get weather", `fetchUserProfile` → "Fetch user profile". */
export function humanizeToolName(name: string) {
  const spaced = name
    .replace(/[_\-.]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!spaced) return "Tool";
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function compact(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === undefined) return "";
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function truncate(text: string, max: number) {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/** `city: Paris, units: metric` — the arguments in one line. */
export function summarizeArgs(args: unknown, argsText?: string): string | undefined {
  if (args && typeof args === "object" && !Array.isArray(args)) {
    const entries = Object.entries(args as Record<string, unknown>);
    if (entries.length === 0) return undefined;
    return truncate(entries.map(([key, value]) => `${key}: ${compact(value)}`).join(", "), ARGS_CHARS);
  }
  const raw = argsText?.trim();
  if (!raw || raw === "{}") return undefined;
  return truncate(raw, ARGS_CHARS);
}

/** First 200 characters of the stringified result. */
export function previewResult(result: unknown): string | undefined {
  const text = compact(result);
  if (!text) return undefined;
  return truncate(text, PREVIEW_CHARS);
}

const QUERY_KEYS = ["query", "q", "search", "term", "url", "prompt", "input"];

function queryOf(args: unknown): string | undefined {
  if (!args || typeof args !== "object") return undefined;
  const record = args as Record<string, unknown>;
  for (const key of QUERY_KEYS) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return truncate(value, 80);
  }
  return undefined;
}

/* --------------------------------------------------------------- sources */

const URL_PATTERN = /https?:\/\/[^\s"'<>)\]}]+/g;
const URL_KEYS = ["url", "link", "href", "source_url", "sourceUrl", "uri"];
const TITLE_KEYS = ["title", "name", "headline", "label"];
const MAX_SOURCES = 12;
const MAX_DEPTH = 6;

/** Sites the design system draws a mark for, keyed by their apex domain. */
const BRAND_HOSTS: Record<string, WebSearchBrand> = {
  "github.com": "github",
  "gitlab.com": "gitlab",
  "bitbucket.org": "bitbucket",
  "x.com": "x",
  "twitter.com": "x",
  "reddit.com": "reddit",
  "linkedin.com": "linkedin",
  "facebook.com": "facebook",
  "instagram.com": "instagram",
  "tiktok.com": "tiktok",
  "discord.com": "discord",
  "slack.com": "slack",
  "figma.com": "figma",
  "notion.so": "notion",
  "notion.com": "notion",
  "dropbox.com": "dropbox",
  "spotify.com": "spotify",
  "twitch.tv": "twitch",
  "telegram.org": "telegram",
  "t.me": "telegram",
  "whatsapp.com": "whatsapp",
  "amazon.com": "amazon",
  "apple.com": "apple",
  "google.com": "google",
  "microsoft.com": "microsoft",
};

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function brandOf(hostname: string): WebSearchBrand | undefined {
  const parts = hostname.split(".");
  for (let i = 0; i < parts.length - 1; i += 1) {
    const brand = BRAND_HOSTS[parts.slice(i).join(".")];
    if (brand) return brand;
  }
  return undefined;
}

/** Every URL in a tool result, with a title when the surrounding object has one. */
export function collectSources(result: unknown): WebSearchSource[] {
  const hits = new Map<string, WebSearchSource>();
  const add = (rawUrl: string, title?: string) => {
    const url = rawUrl.replace(/[.,;:!?]+$/, "");
    if (hits.size >= MAX_SOURCES || hits.has(url)) return;
    const domain = hostnameOf(url);
    hits.set(url, {
      title: title?.trim() || domain,
      domain,
      href: url,
      brand: brandOf(domain),
    });
  };

  const visit = (value: unknown, depth: number) => {
    if (value == null || depth > MAX_DEPTH || hits.size >= MAX_SOURCES) return;
    if (typeof value === "string") {
      if (depth === 0 && /^\s*[[{]/.test(value)) {
        try {
          visit(JSON.parse(value), depth + 1);
          return;
        } catch {
          /* plain text — fall through to the URL scan */
        }
      }
      for (const match of value.matchAll(URL_PATTERN)) add(match[0]);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof value === "object") {
      const record = value as Record<string, unknown>;
      const url = URL_KEYS.map((key) => record[key]).find(
        (candidate): candidate is string =>
          typeof candidate === "string" && /^https?:\/\//.test(candidate),
      );
      const title = TITLE_KEYS.map((key) => record[key]).find(
        (candidate): candidate is string => typeof candidate === "string",
      );
      if (url) add(url, title);
      for (const [key, nested] of Object.entries(record)) {
        if (URL_KEYS.includes(key) || TITLE_KEYS.includes(key)) continue;
        visit(nested, depth + 1);
      }
    }
  };

  visit(result, 0);
  return Array.from(hits.values());
}

/* ---------------------------------------------------------------- boundary */

class ToolPartBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[chat] tool part failed to render, using ToolFallback", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
