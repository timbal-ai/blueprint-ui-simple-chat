import { RiGlobalLine, RiSearchLine, RiToolsLine } from "@remixicon/react";
import type { ToolCallMessagePartComponent, ToolCallMessagePartProps } from "@assistant-ui/react";
import { Component, type ReactNode } from "react";
import {
  ToolArtifactFallback,
  ToolFallback,
  parseArtifactFromToolResult,
  useArtifactRegistry,
  useToolRunning,
} from "@timbal-ai/timbal-react";

import { TaskList, type TaskListStep, type TaskListTask } from "@/components/application/task-list/task-list";
import {
  WebSearch,
  type WebSearchBrand,
  type WebSearchSource,
  type WebSearchStep,
} from "@/components/application/web-search/web-search";

/**
 * `tools.Override` for the BoardUI assistant message: tool calls rendered with
 * BoardUI's agent log components on top of the Timbal runtime.
 *
 * - A result that parses as a registered Timbal artifact (chart, table, ui,
 *   html, json, question) is delegated to the runtime's `ToolArtifactFallback`,
 *   so artifacts render exactly as with the stock message.
 * - A search-shaped tool (`/search|browse|fetch|crawl|web/i`) whose result
 *   carries URLs renders as BoardUI `WebSearch`: the query as the heading and
 *   the URLs as a Sources row (hostname as the label, brand marks for the sites
 *   the design system draws).
 * - Everything else is one BoardUI `TaskList` task: the humanised tool name as
 *   the header (shimmering while it runs, with the log's working indicator),
 *   the argument summary and a 200-character result preview as its steps.
 *   Finished tasks collapse to their header, so a run of tool calls reads as a
 *   compact list of rows that expand on demand.
 *
 * Both logs are driven through their controlled `revealed` prop from the real
 * part status — nothing here runs on a timer. A render error inside falls back
 * to the runtime's `ToolFallback`.
 */
export const TimbalToolPart: ToolCallMessagePartComponent = (props) => (
  <ToolPartBoundary fallback={<ToolFallback {...props} />}>
    <TimbalToolPartImpl {...props} />
  </ToolPartBoundary>
);

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

  if (!running && !failed && SEARCH_TOOL.test(toolName)) {
    const sources = collectSources(result);
    if (sources.length > 0) {
      return (
        <div className="py-0.5">
          <SearchToolLog label={label} query={queryOf(args)} sources={sources} />
        </div>
      );
    }
  }
  if (running && SEARCH_TOOL.test(toolName)) {
    return (
      <div className="py-0.5">
        <SearchToolLog label={label} query={queryOf(args)} sources={[]} running />
      </div>
    );
  }

  return (
    <div className="py-0.5">
      <GenericToolLog
        label={label}
        argsSummary={argsSummary}
        preview={running ? undefined : previewResult(result)}
        running={running}
        failed={failed}
      />
    </div>
  );
}

/* --------------------------------------------------------------- generic */

function GenericToolLog({
  label,
  argsSummary,
  preview,
  running,
  failed,
}: {
  label: string;
  argsSummary?: string;
  preview?: string;
  running: boolean;
  failed: boolean;
}) {
  const steps: TaskListStep[] = [];
  if (argsSummary) steps.push({ label: argsSummary });
  // A pending result keeps the header shimmering and the working indicator at
  // the tail until the real one lands; the row itself stays unrevealed.
  steps.push({ label: running ? "Waiting for result" : (preview ?? "No result") });

  const task: TaskListTask = {
    title: failed ? `${label} · failed` : label,
    runningTitle: label,
    icon: RiToolsLine,
    steps,
  };
  const total = 1 + steps.length;
  const revealed = running ? total - 1 : total;

  return (
    <TaskList
      // Re-keyed on completion so the settled log mounts collapsed instead of
      // animating the running rows shut.
      key={running ? "running" : "settled"}
      tasks={[task]}
      revealed={revealed}
      collapseOnComplete
      working="Working"
    />
  );
}

/* ---------------------------------------------------------------- search */

function SearchToolLog({
  label,
  query,
  sources,
  running = false,
}: {
  label: string;
  query?: string;
  sources: WebSearchSource[];
  running?: boolean;
}) {
  const steps: WebSearchStep[] = [
    { heading: true, label, query, icon: RiSearchLine },
    running
      ? { label: "Searching", icon: RiGlobalLine }
      : {
          label: `Found ${sources.length} ${sources.length === 1 ? "source" : "sources"}`,
          icon: RiGlobalLine,
          sources,
        },
  ];
  // Units: heading, step, and the sources row once there are sources.
  const total = running ? 2 : 3;
  return (
    <WebSearch
      key={running ? "running" : "settled"}
      steps={steps}
      revealed={running ? 1 : total}
      working="Searching"
    />
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
