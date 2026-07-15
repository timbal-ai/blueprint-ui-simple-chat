"use client";

import { Children, useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiCheckLine,
  RiCodeSLine,
  RiEyeLine,
  RiFileCodeLine,
  RiFileCopyLine,
  RiListUnordered,
  RiTerminalBoxLine,
  RiVipCrownLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import { Highlight } from "prism-react-renderer";
import type { PrismTheme } from "prism-react-renderer";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { Logo } from "@/components/foundations/brand/logo";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → component detail (node 3795:2990).
 *
 * The documentation template for a single design-system component: breadcrumb →
 * title + description → Preview/Code surface with a Copy action → an Installation
 * section with numbered, connector-linked steps (dependency command + source
 * file). Package-manager tabs and copy buttons are interactive.
 */

/* ----------------------------------------------------------- syntax highlight */

/**
 * Headless Prism (prism-react-renderer) with a BoardUI theme, so highlighting
 * uses a real TSX tokenizer while keeping our palette. Colours are wired to
 * theme CSS variables where possible; token accents mirror the brand code look.
 */
const CODE_THEME: PrismTheme = {
  plain: { color: "var(--color-text-secondary)" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--color-neutral-500)" } },
    { types: ["punctuation"], style: { color: "var(--color-text-tertiary)" } },
    {
      types: ["keyword", "boolean", "operator", "module", "control-flow", "important"],
      style: { color: "#7ccf00" },
    },
    {
      types: ["string", "char", "attr-value", "template-string", "regex", "url"],
      style: { color: "var(--color-neutral-500)" },
    },
    {
      types: ["class-name", "maybe-class-name", "builtin", "tag"],
      style: { color: "#00bc7d" },
    },
    { types: ["constant", "number", "symbol"], style: { color: "#2b7fff" } },
    { types: ["attr-name", "property", "parameter"], style: { color: "var(--color-text-secondary)" } },
    { types: ["function"], style: { color: "var(--color-text-secondary)" } },
  ],
};

// Quick, smooth line-by-line reveal (used when the Code tab is opened).
const CODE_CONTAINER_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018 } },
};
const CODE_LINE_VARIANTS = {
  hidden: { opacity: 0, y: 2, filter: "blur(2px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.18, ease: "easeOut" as const },
  },
};

function CodeContent({
  code,
  language = "tsx",
  animate = false,
}: {
  code: string;
  language?: string;
  animate?: boolean;
}) {
  return (
    <Highlight code={code.replace(/\n$/, "")} language={language} theme={CODE_THEME}>
      {({ tokens, getLineProps, getTokenProps }) => {
        const lines = tokens.map((line, i) => {
          const tokenNodes = line.map((token, key) => <span key={key} {...getTokenProps({ token })} />);
          if (!animate) {
            return (
              <span key={i} {...getLineProps({ line, className: "block min-h-5" })}>
                {tokenNodes}
              </span>
            );
          }
          return (
            <motion.span
              key={i}
              variants={CODE_LINE_VARIANTS}
              {...getLineProps({ line, className: "block min-h-5" })}
            >
              {tokenNodes}
            </motion.span>
          );
        });

        if (!animate) {
          return (
            <code className="block font-mono text-[14px] leading-5 whitespace-pre">{lines}</code>
          );
        }
        return (
          <motion.code
            className="block font-mono text-[14px] leading-5 whitespace-pre"
            variants={CODE_CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {lines}
          </motion.code>
        );
      }}
    </Highlight>
  );
}

/* ----------------------------------------------------------------- copy button */

function useCopy(value: string) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return { copied, copy };
}

/** Copy → check crossfade: each glyph blurs + scales + fades as state flips. */
function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
      <RiFileCopyLine
        aria-hidden
        className={cx(
          "absolute size-5 text-foreground-icon-secondary transition-all duration-200 ease-out",
          copied ? "scale-75 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
        )}
      />
      <RiCheckLine
        aria-hidden
        className={cx(
          "absolute size-5 text-foreground-icon-secondary transition-all duration-200 ease-out",
          copied ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[2px]",
        )}
      />
    </span>
  );
}

function CopyLabeled({ value }: { value: string }) {
  const { copied, copy } = useCopy(value);
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex cursor-pointer items-center justify-center gap-0.5 rounded-2lg border border-border-button-default bg-background-primary-default p-2 shadow-xs transition-colors hover:bg-background-primary-hover"
    >
      <CopyGlyph copied={copied} />
      <span className="px-1 text-body-medium text-text-primary">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function CopyIcon({ value }: { value: string }) {
  const { copied, copy } = useCopy(value);
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy"
      className="flex size-7 cursor-pointer items-center justify-center rounded-2lg transition-colors hover:bg-background-primary-hover"
    >
      <CopyGlyph copied={copied} />
    </button>
  );
}

/* --------------------------------------------------------------------- pill tab */

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

/**
 * Thin wrapper over the base SegmentedControl so the docs tabs (Preview/Code,
 * package managers, size variants) share the sliding-thumb animation.
 */
function PillTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; icon?: IconComponent }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <SegmentedControl
      selectedKeys={new Set([value])}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (next != null) onChange(next as T);
      }}
    >
      {options.map(({ value: option, icon: Icon }) => (
        <SegmentedControlItem key={option} id={option} className="gap-1.5">
          {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
          {option}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}

/* ------------------------------------------------------------------ code shells */

const CODE_SURFACE_SHADOW =
  "shadow-[0px_2px_0px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.05),0px_6px_10px_0px_rgba(0,0,0,0.02)]";

const PACKAGE_MANAGERS = ["npm", "pnpm", "yarn"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];
const PM_OPTIONS = PACKAGE_MANAGERS.map((value) => ({ value }));

function commandFor(pm: PackageManager, dependency: string) {
  const verb = pm === "npm" ? "install" : "add";
  return { head: pm, tail: `${verb} ${dependency}` };
}

export function CommandBlock({ dependency }: { dependency: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const { head, tail } = commandFor(pm, dependency);
  const full = `${head} ${tail}`;

  return (
    <div className="flex w-full flex-col gap-0.5 rounded-3xl bg-background-secondary-default p-2">
      <div className="flex items-center justify-between">
        <PillTabs<PackageManager> options={PM_OPTIONS} value={pm} onChange={setPm} />
        <div className="pr-1">
          <CopyIcon value={full} />
        </div>
      </div>
      <div className="p-1">
        <div
          className={cx(
            "flex h-14 items-center overflow-x-auto rounded-xl bg-background-primary-default px-5 py-3",
            CODE_SURFACE_SHADOW,
          )}
        >
          <code className="font-mono text-[14px] leading-5 whitespace-nowrap">
            <span className="text-[#fb64b6]">{head}</span>
            <span className="text-text-secondary"> </span>
            <span className="text-[#ad46ff]">{tail}</span>
          </code>
        </div>
      </div>
    </div>
  );
}

const CLI_RUNNERS: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

/**
 * One-liner `npx boardui@latest …` block with package-runner tabs. Pass a
 * component `name` for `add <name>`, or a full `command` (e.g. "init").
 */
export function CliCommandBlock({ name, command }: { name?: string; command?: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const head = CLI_RUNNERS[pm];
  const tail = `boardui@latest ${command ?? `add ${name}`}`;
  const full = `${head} ${tail}`;

  return (
    <div className="flex w-full flex-col gap-0.5 rounded-3xl bg-background-secondary-default p-2">
      <div className="flex items-center justify-between">
        <PillTabs<PackageManager> options={PM_OPTIONS} value={pm} onChange={setPm} />
        <div className="pr-1">
          <CopyIcon value={full} />
        </div>
      </div>
      <div className="p-1">
        <div
          className={cx(
            "flex h-14 items-center overflow-x-auto rounded-xl bg-background-primary-default px-5 py-3",
            CODE_SURFACE_SHADOW,
          )}
        >
          <code className="font-mono text-[14px] leading-5 whitespace-nowrap">
            <span className="text-[#fb64b6]">{head}</span>
            <span className="text-text-secondary"> </span>
            <span className="text-[#ad46ff]">{tail}</span>
          </code>
        </div>
      </div>
    </div>
  );
}

/**
 * Tabbed code block — same shell as CommandBlock (grey surface, pill tabs,
 * copy icon), but each tab swaps a full code snippet. Used for e.g. size
 * variants where the docs want to show `md` vs `sm` usage.
 */
export function TabbedCodeBlock<T extends string>({ tabs }: { tabs: { value: T; code: string }[] }) {
  const [active, setActive] = useState<T>(tabs[0].value);
  const current = tabs.find((t) => t.value === active) ?? tabs[0];

  return (
    <div className="flex w-full flex-col gap-0.5 rounded-3xl bg-background-secondary-default p-2">
      <div className="flex items-center justify-between">
        <PillTabs<T> options={tabs.map((t) => ({ value: t.value }))} value={active} onChange={setActive} />
        <div className="pr-1">
          <CopyIcon value={current.code} />
        </div>
      </div>
      <div className="p-1">
        <div
          className={cx(
            "overflow-auto rounded-xl bg-background-primary-default px-5 py-3",
            CODE_SURFACE_SHADOW,
          )}
        >
          <CodeContent code={current.code} />
        </div>
      </div>
    </div>
  );
}

export function CodeFileBlock({ name, code }: { name: string; code: string }) {
  return (
    <div className="flex w-full flex-col gap-0.5 rounded-3xl bg-background-secondary-default p-2">
      <div className="flex items-center justify-between pl-2">
        <p className="font-mono text-[14px] leading-5 text-text-secondary">{name}</p>
        <div className="pr-1">
          <CopyIcon value={code} />
        </div>
      </div>
      <div className="p-1">
        <div
          className={cx(
            "max-h-[360px] overflow-auto rounded-xl bg-background-primary-default px-5 py-3",
            CODE_SURFACE_SHADOW,
          )}
        >
          <CodeContent code={code} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- preview area */

export function PreviewPanel({
  preview,
  code,
  previewClassName,
}: {
  preview: ReactNode;
  code: string;
  previewClassName?: string;
}) {
  const [tab, setTab] = useState<"Preview" | "Code">("Preview");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <PillTabs<"Preview" | "Code">
          options={[
            { value: "Preview", icon: RiEyeLine },
            { value: "Code", icon: RiCodeSLine },
          ]}
          value={tab}
          onChange={setTab}
        />
        <CopyLabeled value={code} />
      </div>
      {tab === "Preview" ? (
        <motion.div
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cx(
            "flex min-h-[327px] items-center justify-center rounded-3xl border border-border-button-default p-8",
            previewClassName,
          )}
        >
          {preview}
        </motion.div>
      ) : (
        <div className="min-h-[327px] overflow-auto rounded-3xl border border-border-button-default p-6">
          <CodeContent code={code} animate />
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- install step */

export function InstallStep({
  n,
  label,
  children,
  last = false,
}: {
  n: number;
  label: ReactNode;
  children?: ReactNode;
  last?: boolean;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-2lg border border-border-button-default bg-background-primary-default text-body-medium text-text-primary shadow-xs">
          {n}
        </div>
        {!last && <div className="w-px flex-1 bg-border-button-default" />}
      </div>
      <div className={cx("flex min-w-0 flex-1 flex-col gap-3", last ? "pb-0" : "pb-8")}>
        <div className="flex min-h-8 flex-wrap items-center gap-1.5 pt-1 text-headline-medium text-text-primary">
          {label}
        </div>
        {children}
      </div>
    </li>
  );
}

/** Inline monospace chip for prop/value names inside doc prose. */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-background-secondary-default px-1.5 py-0.5 font-mono text-[13px] text-text-primary">
      {children}
    </code>
  );
}

/** Inline monospace file-name chip used inside step labels. */
export function FileChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-purple-100 bg-purple-50 p-[5px] font-mono text-[14px] leading-5 text-purple-500">
      {children}
    </span>
  );
}

/** The numbered manual copy-paste flow: deps command → source file → aliases. */
function ManualInstallSteps({
  dependency,
  file,
}: {
  dependency: string;
  file: { name: string; code: string };
}) {
  return (
    <ol className="flex flex-col">
      <InstallStep n={1} label="Install the following dependencies">
        <CommandBlock dependency={dependency} />
      </InstallStep>
      <InstallStep
        n={2}
        label={
          <>
            <span>Create a</span>
            <FileChip>{file.name}</FileChip>
            <span>file and paste the following into it.</span>
          </>
        }
      >
        <CodeFileBlock name={file.name} code={file.code} />
      </InstallStep>
      <InstallStep n={3} label="Update the import paths to match your project setup." last />
    </ol>
  );
}

/** Small "PRO" pill used next to pro component names in nav and headers. */
export function ProBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-sm bg-background-tertiary-default px-1 py-px transition-colors duration-150 ease",
        "text-[10px] leading-4 font-semibold tracking-wide text-text-secondary uppercase",
        className,
      )}
    >
      Pro
    </span>
  );
}

/** Installation replacement for pro components — no CLI command or source. */
function ProCallout({ title, kind = "component" }: { title: string; kind?: "component" | "template" }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border-button-default bg-background-secondary-default p-6">
      <span className="flex size-9 items-center justify-center rounded-2lg bg-linear-to-b from-blue-500 to-blue-600 shadow-nav-selected">
        <RiVipCrownLine className="size-5 text-white" aria-hidden />
      </span>
      <p className="text-body-medium text-text-primary">
        {title} is a Pro {kind}.
      </p>
      <p className="text-headline-medium text-text-secondary">
        {kind === "template"
          ? "Templates ship as a complete source package — every screen, component, and data file — sold separately with a BoardUI license — coming soon. Until then, you can explore the full live preview above."
          : "Pro components aren't available through the CLI or as copy-paste source. They ship as a source download with a BoardUI Pro license — coming soon. Until then, you can explore the full live preview above."}
      </p>
    </div>
  );
}

/* --------------------------------------------------------- table of contents */

export type TocItem = { id: string; label: string };

/**
 * Sticky "On this page" rail. Smooth-scrolls to a section on click and
 * highlights the section currently in view (scrollspy) with a left accent bar,
 * matching the docs-sidebar's neutral active treatment.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -66% 0px", threshold: [0, 1] },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  const handleClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-body-medium text-text-primary">
        <RiListUnordered className="size-4 text-text-secondary" aria-hidden />
        On this page
      </p>
      <ul className="flex flex-col border-l border-border-button-default">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="flex">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={active ? "location" : undefined}
                className={cx(
                  "-ml-px border-l-2 py-1.5 pl-4 text-body-medium transition-colors duration-150 ease",
                  active
                    ? "border-text-primary text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** One anchored content section. Extracted so the mapped output is a single
 *  keyed component and the heading/body aren't a bare keyless child array.
 *  `Children.toArray` normalizes/auto-keys whatever the caller's `body` JSX
 *  resolves to, since it's opaque content authored by each doc page.
 *
 *  Spacing: gap-3 between the heading and the body; the arbitrary variant
 *  adds 4px below the body's leading description paragraph so it breathes
 *  a bit more before the preview panel, without editing every doc page. */
function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-14 flex-col gap-3 pt-10 [&>div>p:first-child]:mb-1">
      <h2 className="text-title-2-medium text-text-primary">{title}</h2>
      {Children.toArray(children)}
    </section>
  );
}

/* ----------------------------------------------------------------- top-level */

export interface ComponentDetailProps {
  breadcrumb: { label: string; href?: string }[];
  title: string;
  description: string;
  preview: ReactNode;
  /** Extra classes for the preview surface (e.g. adjust padding for a given demo). */
  previewClassName?: string;
  /** Usage snippet shown under the Code tab and copied by the header Copy button. */
  previewCode: string;
  /** Optional anchored block rendered right after the main preview, before
   *  Installation — e.g. a larger composite demo that doesn't fit the
   *  Preview/Code toggle shape. Added to the "On this page" rail. */
  extraPreview?: { id: string; title: string; body: ReactNode };
  /** Optional content sections rendered between the preview and Installation.
   *  Each is anchored and added to the "On this page" rail. */
  sections?: { id: string; title: string; body: ReactNode }[];
  installIntro?: string;
  dependency?: string;
  file?: { name: string; code: string };
  /** Registry name for the BoardUI CLI. When set, the Installation section
   *  gains a CLI/Manual toggle with `npx boardui@latest add <cliName>`. */
  cliName?: string;
  /** Pro (paid) component: the Installation section is replaced by a Pro
   *  callout — no CLI command or source code is shown. */
  pro?: boolean;
  /** Adjusts the Pro callout copy — "template" for full-page templates sold
   *  separately (Home Dashboard, Medical Profile). */
  proKind?: "component" | "template";
  /** Widens the page (1560px shell / 1220px main) so full-page template
   *  previews fit without heavy downscaling. */
  wide?: boolean;
}

export function ComponentDetail({
  breadcrumb,
  title,
  description,
  preview,
  previewClassName,
  previewCode,
  extraPreview,
  sections = [],
  installIntro,
  dependency,
  file,
  cliName,
  pro = false,
  proKind = "component",
  wide = false,
}: ComponentDetailProps) {
  const toc: TocItem[] = [
    { id: "preview", label: "Preview" },
    ...(extraPreview ? [{ id: extraPreview.id, label: extraPreview.title }] : []),
    { id: "installation", label: "Installation" },
    ...sections.map((s) => ({ id: s.id, label: s.title })),
  ];

  return (
    <div
      className={cx(
        "mx-auto flex w-full justify-center gap-12 px-6 py-14 sm:px-10",
        wide ? "max-w-[1560px]" : "max-w-[1200px]",
      )}
    >
      <main className={cx("flex w-full min-w-0 flex-col gap-3", wide ? "max-w-[1220px]" : "max-w-[900px]")}>
        <Breadcrumb aria-label="Component">
          {breadcrumb.map((crumb, i) => (
            <BreadcrumbItem
              key={crumb.label}
              href={crumb.href}
              current={i === breadcrumb.length - 1}
            >
              {i === 0 && <Logo size={16} mono />}
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>

        <header className="flex flex-col gap-3 pt-2">
          <h1 className="text-title-1-medium text-text-primary">{title}</h1>
          <p className="text-headline-medium text-text-secondary">{description}</p>
        </header>

        <div id="preview" className="scroll-mt-14 pt-4">
          <PreviewPanel preview={preview} code={previewCode} previewClassName={previewClassName} />
        </div>

        {extraPreview && (
          <section id={extraPreview.id} className="flex scroll-mt-14 flex-col gap-3 pt-10 [&>div>p:first-child]:mb-1">
            <h2 className="text-title-2-medium text-text-primary">{extraPreview.title}</h2>
            {extraPreview.body}
          </section>
        )}

        <section id="installation" className="flex scroll-mt-14 flex-col gap-6 pt-10">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-title-2-medium text-text-primary">Installation</h2>
            {installIntro && (
              <p className="text-headline-medium text-text-secondary">{installIntro}</p>
            )}
          </div>

          {pro ? (
            <ProCallout title={title} kind={proKind} />
          ) : cliName ? (
            <Tabs>
              <TabList aria-label="Installation method">
                <Tab id="cli" icon={RiTerminalBoxLine}>
                  CLI
                </Tab>
                <Tab id="manual" icon={RiFileCodeLine}>
                  Manual
                </Tab>
              </TabList>
              <TabPanel id="cli" className="flex flex-col gap-4 pt-2">
                <p className="text-headline-medium text-text-secondary">
                  The CLI copies the component source (with its internal dependencies) into your
                  project and installs any required npm packages.
                </p>
                <CliCommandBlock name={cliName} />
              </TabPanel>
              <TabPanel id="manual">
                {dependency && file && <ManualInstallSteps dependency={dependency} file={file} />}
              </TabPanel>
            </Tabs>
          ) : (
            dependency && file && <ManualInstallSteps dependency={dependency} file={file} />
          )}
        </section>

        {sections.map((section) => (
          <DocSection key={section.id} id={section.id} title={section.title}>
            {section.body}
          </DocSection>
        ))}
      </main>

      <aside className="hidden w-[220px] shrink-0 xl:block">
        <div className="sticky top-14">
          <TableOfContents items={toc} />
        </div>
      </aside>
    </div>
  );
}
