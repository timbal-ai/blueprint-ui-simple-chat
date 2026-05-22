import type { WorkforceItem } from "@timbal-ai/timbal-sdk";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  studioSecondaryChromeClass,
  studioTopbarPillHeightClass,
} from "@/lib/studio-chrome";

interface StudioAgentSelectProps {
  workforces: WorkforceItem[];
  value: string;
  onValueChange: (id: string) => void;
}

function workforceId(w: WorkforceItem) {
  return w.id ?? w.uid ?? w.name ?? "";
}

const triggerClass = cn(
  studioTopbarPillHeightClass,
  studioSecondaryChromeClass,
  "w-auto min-w-[9rem] max-w-[14rem] gap-2 rounded-full border-0 px-3.5 text-sm font-medium text-foreground shadow-none",
  "focus-visible:ring-2 focus-visible:ring-foreground/15 focus-visible:ring-offset-0",
  "data-[state=open]:from-neutral-50/60 data-[state=open]:to-neutral-100/70",
  "dark:data-[state=open]:from-white/[0.08] dark:data-[state=open]:to-white/[0.05]",
  "[&_[data-slot=select-value]]:truncate",
  "[&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground [&_svg]:opacity-60",
  "data-[state=open]:[&_svg]:rotate-180 [&_svg]:transition-transform [&_svg]:duration-200",
);

const contentClass = cn(
  "min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl",
  "border border-neutral-200/80 bg-background p-1",
  "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
  "dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
);

const itemClass = cn(
  "min-h-8 rounded-md py-1.5 pl-2.5 pr-7 text-sm text-foreground",
  "focus:bg-neutral-100 focus:text-foreground",
  "data-[highlighted]:bg-neutral-100 data-[highlighted]:text-foreground",
  "dark:focus:bg-white/[0.06] dark:data-[highlighted]:bg-white/[0.06]",
  "data-[state=checked]:font-medium",
  "[&_[data-slot=select-item-indicator]]:text-muted-foreground/70 [&_[data-slot=select-item-indicator]_svg]:size-3",
);

export function StudioAgentSelect({
  workforces,
  value,
  onValueChange,
}: StudioAgentSelectProps) {
  const selected = workforces.find((w) => workforceId(w) === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={triggerClass}>
        <SelectValue placeholder="Select agent">
          {selected?.name ?? "Select agent"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        sideOffset={6}
        className={contentClass}
        viewportClassName="p-0"
      >
        {workforces.map((w) => {
          const id = workforceId(w);
          return (
            <SelectItem key={id} value={id} className={itemClass}>
              {w.name ?? id}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
