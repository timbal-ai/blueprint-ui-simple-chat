import type { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { useAuiState } from "@assistant-ui/react";
import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";

import {
  StudioToolBodyPresence,
  StudioToolMotion,
  StudioToolPresence,
} from "@/components/studio/studio-tool-motion";
import {
  parseArtifactFromToolResult,
  useArtifactRegistry,
  useTimbalRuntime,
} from "@timbal-ai/timbal-react";

import {
  studioComposerIoWellClass,
  studioTimelineActionClass,
  studioTimelineBodyPadClass,
  studioTimelineChevronClass,
  studioTimelineDetailClass,
  studioTimelineRowButtonClass,
  studioTimelineShimmerActionClass,
  studioTimelineTextClass,
} from "@/lib/studio-chrome";
import { cn } from "@/lib/utils";

function isStudioToolRunning({
  status,
  result,
  streamRunning,
}: {
  status?: { type: string; reason?: string };
  result?: unknown;
  streamRunning: boolean;
}) {
  const isError =
    status?.type === "incomplete" && status.reason !== "cancelled";
  if (isError) return false;
  if (status?.type === "running") return true;
  if (status?.type === "complete") return false;
  // Fallback when status is missing — timbal convertMessage omits tool status
  return streamRunning && result === undefined;
}

function useStudioToolRunning(props: {
  status?: { type: string; reason?: string };
  result?: unknown;
}) {
  const { isRunning: streamRunning } = useTimbalRuntime();
  const partStatus = useAuiState((s) => s.part.status);
  return isStudioToolRunning({
    status: partStatus ?? props.status,
    result: props.result,
    streamRunning,
  });
}

function formatToolLabel(toolName: string) {
  return toolName
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
}

function formatToolResult(result: unknown): string {
  if (typeof result === "string") return result;
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}

function TimelineActionLabel({
  action,
  detail,
  shimmer = false,
}: {
  action: string;
  detail?: string;
  shimmer?: boolean;
}) {
  return (
    <span className="inline-flex min-w-0 max-w-full items-baseline gap-1">
      {action ? (
        shimmer ? (
          <span
            className={cn(
              studioTimelineShimmerActionClass,
              "aui-studio-tool-shimmer",
            )}
          >
            {action}
          </span>
        ) : (
          <span className={studioTimelineActionClass}>{action}</span>
        )
      ) : null}
      {detail ? (
        <span className={studioTimelineDetailClass}>{detail}</span>
      ) : null}
    </span>
  );
}

function TimelineHoverChevron({ expanded }: { expanded: boolean }) {
  return (
    <ChevronRightIcon
      className={studioTimelineChevronClass(expanded)}
      aria-hidden
    />
  );
}

function StudioToolPanel({
  toolName,
  argsText,
  result,
  isError,
}: {
  toolName: string;
  argsText?: string;
  result?: unknown;
  isError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const detail = formatToolLabel(toolName);

  const formattedArgs = useMemo(() => {
    if (!argsText || argsText === "{}") return null;
    try {
      return JSON.stringify(JSON.parse(argsText), null, 2);
    } catch {
      return argsText;
    }
  }, [argsText]);

  const formattedResult = useMemo(() => {
    if (result === undefined || result === null) return null;
    return formatToolResult(result);
  }, [result]);

  const hasBody = Boolean(formattedArgs || formattedResult);
  const action = isError ? "Failed" : "Used";

  if (!hasBody) {
    return (
      <div className="aui-studio-tool-row w-full min-w-0">
        <TimelineActionLabel action={action} detail={detail} />
      </div>
    );
  }

  return (
    <div className="aui-studio-tool-row w-full min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${action} ${detail}`}
        className={studioTimelineRowButtonClass}
      >
        <span
          className={cn(
            "inline-flex min-w-0 max-w-full items-center gap-0.5",
            studioTimelineTextClass,
            "text-foreground",
          )}
        >
          <TimelineActionLabel action={action} detail={detail} />
          <TimelineHoverChevron expanded={open} />
        </span>
      </button>

      <StudioToolBodyPresence
        open={open}
        className={cn(studioTimelineBodyPadClass, "gap-2")}
      >
        {formattedArgs ? (
          <div
            className={cn(
              studioComposerIoWellClass,
              "max-h-48 overflow-auto px-2.5 py-2",
            )}
          >
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] font-normal leading-relaxed text-foreground">
              {formattedArgs}
            </pre>
          </div>
        ) : null}
        {formattedResult ? (
          <div
            className={cn(
              studioComposerIoWellClass,
              "max-h-48 overflow-auto px-2.5 py-2",
            )}
          >
            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] font-normal leading-relaxed text-foreground">
              {formattedResult}
            </pre>
          </div>
        ) : null}
      </StudioToolBodyPresence>
    </div>
  );
}

/** Compose timeline tool row — flat “Used render chart” toggle like “Thought 512 ms”. */
export const StudioToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const isRunning = useStudioToolRunning({ status, result });
  const isError =
    status?.type === "incomplete" && status.reason !== "cancelled";

  const presenceKey = isRunning ? "running" : isError ? "error" : "complete";

  return (
    <StudioToolPresence
      presenceKey={presenceKey}
      variant={isRunning ? "executing" : "settled"}
      className="py-0.5"
    >
      {isRunning ? (
        <div className="aui-studio-tool-running">
          <TimelineActionLabel
            action="Using"
            detail={formatToolLabel(toolName)}
            shimmer
          />
        </div>
      ) : (
        <StudioToolPanel
          toolName={toolName}
          argsText={argsText}
          result={result}
          isError={isError}
        />
      )}
    </StudioToolPresence>
  );
};

/** Artifact-aware wrapper — same behavior as timbal-react `ToolArtifactFallback`. */
export const StudioToolArtifactFallback: ToolCallMessagePartComponent = (
  props,
) => {
  const registry = useArtifactRegistry();
  const isRunning = useStudioToolRunning({
    status: props.status,
    result: props.result,
  });

  if (!isRunning) {
    const artifact = parseArtifactFromToolResult(props.result);
    if (artifact) {
      const Renderer = registry[artifact.type];
      if (Renderer) {
        return (
          <StudioToolMotion
            motionKey={`artifact-${artifact.type}`}
            className="aui-studio-tool-artifact"
          >
            <Renderer artifact={artifact} />
          </StudioToolMotion>
        );
      }
    }
  }

  return <StudioToolFallback {...props} />;
};
