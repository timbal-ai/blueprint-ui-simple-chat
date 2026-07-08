import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared page scaffold for gallery routes — title header + stacked sections. */
function GalleryPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 animate-in fade-in-0 slide-in-from-bottom-1 flex-col gap-6 overflow-auto px-6 py-6 duration-300 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** Titled demo tile — one component/state per card. */
function DemoCard({
  title,
  children,
  className,
  contentClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <h2 className="text-[13px] font-medium text-muted-foreground">{title}</h2>
      <div className={cn("flex min-w-0 flex-1 flex-wrap items-center gap-3", contentClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Responsive grid of DemoCards. */
function DemoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
}

export { DemoCard, DemoGrid, GalleryPage };
