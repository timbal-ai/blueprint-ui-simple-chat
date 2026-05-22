import { Bot } from "lucide-react";
import type { WorkforceItem } from "@timbal-ai/timbal-sdk";

import { TimbalV2Button } from "@/components/studio/timbal-v2-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { studioPillSurfaceClass } from "@/lib/studio-chrome";

interface StudioSidebarProps {
  workforces: WorkforceItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

function workforceId(w: WorkforceItem) {
  return w.id ?? w.uid ?? w.name ?? "";
}

function workforceLabel(w: WorkforceItem) {
  return w.name ?? workforceId(w);
}

function workforceInitial(w: WorkforceItem) {
  const label = workforceLabel(w);
  return label.charAt(0).toUpperCase() || "?";
}

export function StudioSidebar({
  workforces,
  selectedId,
  onSelect,
}: StudioSidebarProps) {
  if (workforces.length === 0) return null;

  return (
    <aside className="absolute top-0 bottom-0 left-0 z-50 flex flex-col pl-[var(--studio-sidebar-gap)] pt-[var(--studio-topbar-gap)]">
      <div
        className={cn(
          "flex w-[var(--studio-chrome-pill-height)] flex-col items-center gap-2 rounded-full p-1",
          studioPillSurfaceClass,
        )}
      >
        {workforces.map((w) => {
          const id = workforceId(w);
          const isActive = id === selectedId;
          const label = workforceLabel(w);

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <TimbalV2Button
                  variant={isActive ? "primary" : "secondary"}
                  size="sm"
                  isIconOnly
                  className="!size-8 !min-h-8 !min-w-8"
                  onClick={() => onSelect(id)}
                  aria-label={label}
                  aria-pressed={isActive}
                >
                  {w.type === "agent" ? (
                    <Bot className="size-4" />
                  ) : (
                    <span className="text-xs font-semibold">
                      {workforceInitial(w)}
                    </span>
                  )}
                </TimbalV2Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </aside>
  );
}
