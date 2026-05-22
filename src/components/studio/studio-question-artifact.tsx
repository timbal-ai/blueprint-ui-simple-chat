import { CheckIcon } from "lucide-react";
import { useCallback, useState } from "react";
import {
  useThreadRuntime,
  type ArtifactRenderer,
  type QuestionArtifact,
} from "@timbal-ai/timbal-react";

import { TimbalV2Button } from "@/components/studio/timbal-v2-button";
import {
  studioArtifactShellClass,
  studioQuestionOptionClass,
  studioQuestionOptionSelectedClass,
} from "@/lib/studio-chrome";
import { cn } from "@/lib/utils";

/** Stable per-row key — agents sometimes omit or duplicate `id`. */
function optionKey(
  option: QuestionArtifact["options"][number],
  index: number,
): string {
  const id = option.id?.trim();
  return id ? id : `__option-${index}`;
}

function OptionRadio({ selected }: { selected: boolean }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-neutral-300 bg-background dark:border-white/20",
      )}
      aria-hidden
    >
      {selected ? <CheckIcon className="size-2.5 stroke-[3]" /> : null}
    </span>
  );
}

/**
 * In-thread `question` artifact — studio integration card + flat option rows.
 * Replaces timbal-react `QuestionArtifactView` when registered in `TimbalChat`.
 */
export const StudioQuestionArtifact: ArtifactRenderer<QuestionArtifact> = ({
  artifact,
}) => {
  const runtime = useThreadRuntime();
  const [selected, setSelected] = useState<string[]>([]);
  const [submittedIds, setSubmittedIds] = useState<string[] | null>(null);

  const isMulti = artifact.multi === true;
  const isDisabled = submittedIds !== null;

  const send = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      const labels = artifact.options
        .map((o, index) => ({ option: o, key: optionKey(o, index) }))
        .filter(({ key }) => keys.includes(key))
        .map(({ option }) => option.label);
      setSubmittedIds(keys);
      runtime.append({
        role: "user",
        content: [{ type: "text", text: labels.join(", ") }],
      });
    },
    [artifact.options, runtime],
  );

  const onPick = useCallback(
    (key: string) => {
      if (isDisabled) return;
      if (!isMulti) {
        send([key]);
        return;
      }
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
      );
    },
    [isDisabled, isMulti, send],
  );

  const onConfirm = useCallback(() => {
    send(selected);
  }, [selected, send]);

  return (
    <div className={studioArtifactShellClass} data-artifact-kind="question">
      <div className="px-2.5 py-2">
        {artifact.prompt ? (
          <p className="mb-2 text-sm font-normal leading-snug text-foreground">
            {artifact.prompt}
          </p>
        ) : null}

        <div className="flex flex-col gap-0.5" role="list">
          {artifact.options.map((option, index) => {
            const key = optionKey(option, index);
            const isSelected = submittedIds
              ? submittedIds.includes(key)
              : isMulti && selected.includes(key);
            return (
              <button
                key={key}
                type="button"
                role="listitem"
                disabled={isDisabled}
                onClick={() => onPick(key)}
                className={cn(
                  isSelected
                    ? studioQuestionOptionSelectedClass
                    : studioQuestionOptionClass,
                  isDisabled &&
                    (isSelected
                      ? "cursor-default"
                      : "cursor-not-allowed opacity-50"),
                )}
              >
                <OptionRadio selected={isSelected} />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-normal text-foreground">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {isMulti && !submittedIds ? (
          <div className="mt-2 flex justify-end">
            <TimbalV2Button
              type="button"
              variant="primary"
              size="sm"
              disabled={selected.length === 0}
              onClick={onConfirm}
            >
              Confirm
            </TimbalV2Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
