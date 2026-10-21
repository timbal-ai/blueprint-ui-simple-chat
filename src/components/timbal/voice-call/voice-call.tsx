"use client";

import {
  RiClosedCaptioningFill,
  RiClosedCaptioningLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiMicFill,
  RiMicLine,
  RiMicOffFill,
  RiPhoneFill,
  RiVolumeUpLine,
} from "@remixicon/react";
import { useState } from "react";
import { useKit } from "@/components/timbal/i18n";
import { en } from "@/components/timbal/i18n/en";
import { cx } from "@/utils/cx";
import type { VoiceCallState } from "./use-voice-call";

/**
 * VoiceCall — the controls of a browser voice call driven by `useVoiceCall`:
 * a start button, then status, microphone level, captions, mute, end (cancel
 * while starting), "enable audio" when the browser blocks playback, and the
 * call's error. Pass every visible text in the app's language.
 *
 * ```tsx
 * const call = useVoiceCall({ connect: (signal) => api.voiceSession(agentId, signal) });
 * <VoiceCall call={call} label="Talk to support" labels={{ agent: "Support" }} />
 * ```
 */

export interface VoiceCallLabels {
  /** The section's accessible name. */
  call: string;
  connecting: string;
  reconnecting: string;
  /** Live, before anyone has spoken. */
  ready: string;
  listening: string;
  thinking: string;
  speaking: string;
  muted: string;
  mute: string;
  unmute: string;
  end: string;
  cancel: string;
  enableAudio: string;
  showCaptions: string;
  hideCaptions: string;
  /** Caption prefixes. */
  you: string;
  agent: string;
}

/** English; the component follows the kit's language (`KitLocale`). */
export const VOICE_CALL_LABELS: VoiceCallLabels = en.voiceCall;

export interface VoiceCallProps {
  call: VoiceCallState;
  /** The start button's text, e.g. "Talk to support". */
  label: string;
  labels?: Partial<VoiceCallLabels>;
  /** Show captions when the call starts (the user can toggle them). Default true. */
  captions?: boolean;
  className?: string;
}

const ICON_BUTTON =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border-button-default bg-background-primary-default text-text-primary transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2";

export function VoiceCall({ call, label, labels, captions: captionsInitially = true, className }: VoiceCallProps) {
  const kit = useKit();
  const text = { ...kit.t.voiceCall, ...labels };
  const [captionsOn, setCaptionsOn] = useState(captionsInitially);
  const { phase, captions } = call;

  if (phase === "idle" || phase === "error") {
    return (
      <div className={cx("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
        <button
          type="button"
          onClick={call.start}
          data-testid="voice-start"
          className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-border-button-default bg-background-primary-default px-4 text-body-medium text-text-primary shadow-xs transition-opacity outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
        >
          <RiMicLine className="size-5" aria-hidden />
          {label}
        </button>
        {call.error ? (
          <p role="alert" data-testid="voice-error" className="flex items-start gap-1.5 text-body-regular text-text-error-primary">
            <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{call.error}</span>
          </p>
        ) : null}
      </div>
    );
  }

  const connecting = phase === "connecting";
  const spoken = captions.user !== "" || captions.agent !== "";
  const status = connecting
    ? text.connecting
    : phase === "reconnecting"
      ? text.reconnecting
      : call.mode === "thinking"
        ? text.thinking
        : call.mode === "speaking"
          ? text.speaking
          : call.muted
            ? text.muted
            : spoken
              ? text.listening
              : text.ready;

  return (
    <section
      aria-label={text.call}
      data-testid="voice-panel"
      className={cx("flex flex-col gap-3 rounded-2xl bg-background-secondary-default p-3", className)}
    >
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <p role="status" data-testid="voice-status" className="flex items-center gap-2 truncate text-body-medium text-text-primary">
            {connecting || phase === "reconnecting" ? (
              <RiLoader4Line className="size-4 shrink-0 animate-spin" aria-hidden />
            ) : (
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-state-success-text" />
            )}
            <span className="truncate">{status}</span>
          </p>
          <div aria-hidden className="h-1 w-full max-w-40 overflow-hidden rounded-full bg-background-primary-default">
            <div
              className="h-full rounded-full bg-button-primary transition-[width] duration-100"
              style={{ width: `${Math.round(call.level * 100)}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCaptionsOn((on) => !on)}
          aria-pressed={captionsOn}
          aria-label={captionsOn ? text.hideCaptions : text.showCaptions}
          title={captionsOn ? text.hideCaptions : text.showCaptions}
          data-testid="voice-captions-toggle"
          className={ICON_BUTTON}
        >
          {captionsOn ? <RiClosedCaptioningFill className="size-5" aria-hidden /> : <RiClosedCaptioningLine className="size-5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={call.toggleMute}
          disabled={connecting}
          aria-pressed={call.muted}
          aria-label={call.muted ? text.unmute : text.mute}
          title={call.muted ? text.unmute : text.mute}
          data-testid="voice-mute"
          className={cx(ICON_BUTTON, "disabled:cursor-not-allowed disabled:opacity-40")}
        >
          {call.muted ? <RiMicOffFill className="size-5" aria-hidden /> : <RiMicFill className="size-5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={call.end}
          aria-label={connecting ? text.cancel : text.end}
          title={connecting ? text.cancel : text.end}
          data-testid="voice-end"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-text-error-primary text-text-white transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
        >
          <RiPhoneFill className="size-5 rotate-135" aria-hidden />
        </button>
      </div>

      {call.audioBlocked ? (
        <button
          type="button"
          onClick={call.resumeAudio}
          data-testid="voice-enable-audio"
          className="flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-lg border border-border-button-default bg-background-primary-default px-3 text-body-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2"
        >
          <RiVolumeUpLine className="size-4" aria-hidden />
          {text.enableAudio}
        </button>
      ) : null}

      {call.error ? (
        <p role="alert" data-testid="voice-error" className="flex items-start gap-1.5 text-body-regular text-text-error-primary">
          <RiErrorWarningLine className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{call.error}</span>
        </p>
      ) : null}

      {captionsOn && spoken ? (
        <div
          role="log"
          aria-live="polite"
          aria-label={text.call}
          data-testid="voice-captions"
          className="flex max-h-32 flex-col gap-1.5 overflow-y-auto text-body-regular break-words"
        >
          {captions.user ? (
            <p data-testid="voice-caption-user" className={cx("text-text-secondary", captions.userFinal ? "" : "italic")}>
              <span className="text-body-medium text-text-primary">{text.you}: </span>
              {captions.user}
            </p>
          ) : null}
          {captions.agent ? (
            <p data-testid="voice-caption-agent" className="text-text-primary">
              <span className="text-body-medium">{text.agent}: </span>
              {captions.agent}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
