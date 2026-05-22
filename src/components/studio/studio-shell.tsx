import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { useSession, useWorkforces } from "@timbal-ai/timbal-react";

import { ModeToggle } from "@/components/mode-toggle";
import { StudioAgentSelect } from "@/components/studio/studio-agent-select";
import { StudioChat } from "@/components/studio/studio-chat";
import { StudioSidebar } from "@/components/studio/studio-sidebar";
import { TimbalV2Button } from "@/components/studio/timbal-v2-button";
import { isAuthEnabled } from "@/config";
import { cn } from "@/lib/utils";
import {
  STUDIO_TOPBAR_BRAND_ANCHOR_ID,
  studioChromeShellStyle,
  studioPlaygroundGradientClass,
  studioTopbarIconPillClass,
} from "@/lib/studio-chrome";

interface StudioShellProps {
  headerStart?: ReactNode;
}

/**
 * Studio playground layout — `useWorkforces` agent list, sidebar picker, and
 * `TimbalChat` with attachments, artifacts, and custom slots.
 */
export function StudioShell({ headerStart }: StudioShellProps) {
  const { logout } = useSession();
  const { workforces, selectedId, setSelectedId } = useWorkforces();
  const showAgentPicker = workforces.length > 1;

  return (
    <div
      className="relative h-dvh overflow-hidden bg-background dark:bg-black"
      style={studioChromeShellStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-background dark:bg-black"
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          studioPlaygroundGradientClass,
        )}
        aria-hidden
      />

      {showAgentPicker && (
        <StudioSidebar
          workforces={workforces}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      )}

      <header
        className={cn(
          "absolute top-0 right-0 z-50 flex items-start justify-between px-4 pt-[var(--studio-topbar-gap)]",
          showAgentPicker ? "left-[var(--studio-inset-left)]" : "left-0",
        )}
      >
        <div
          className="flex min-w-0 items-center gap-2"
          style={{ minHeight: "var(--studio-chrome-pill-height)" }}
        >
          <div
            id={STUDIO_TOPBAR_BRAND_ANCHOR_ID}
            className="flex shrink-0 items-center"
          />
          {headerStart}
          {showAgentPicker && (
            <StudioAgentSelect
              workforces={workforces}
              value={selectedId}
              onValueChange={setSelectedId}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <ModeToggle />
          {isAuthEnabled && (
            <TimbalV2Button
              variant="secondary"
              size="sm"
              isIconOnly
              className={studioTopbarIconPillClass}
              onClick={logout}
              title="Logout"
            >
              <LogOut className="size-3.5" />
            </TimbalV2Button>
          )}
        </div>
      </header>

      <main
        className={cn(
          "relative z-10 flex h-full flex-col pt-[var(--studio-inset-top)]",
          showAgentPicker && "pl-[var(--studio-inset-left)]",
        )}
      >
        {selectedId ? <StudioChat workforceId={selectedId} /> : null}
      </main>
    </div>
  );
}
