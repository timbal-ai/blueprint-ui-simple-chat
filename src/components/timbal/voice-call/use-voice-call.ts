"use client";

import {
  LiveKitVoiceSession,
  type LiveKitVoiceStatus,
  type VoiceEvent,
  type VoiceSessionConnection,
} from "@timbal-ai/timbal-sdk/voice/livekit";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useVoiceCall — one browser voice call with a Timbal agent, over the SDK's
 * LiveKit session. It owns the parts that are easy to get wrong: one attempt
 * at a time, cancelling while the call starts, "ready" only once `start()`
 * has resolved, captions that follow re-heard and interrupted turns, mute,
 * blocked autoplay, and microphone errors the user can act on.
 *
 * ```tsx
 * const call = useVoiceCall({
 *   // Your API's authenticated session route (wf.voice.createSession() or a
 *   // proxy over wf.voice.rtc); the browser never holds a Timbal key.
 *   connect: (signal) => fetch(`/api/workforce/${agentId}/voice/session`, { method: "POST", signal }),
 *   messages: { failed: "No s'ha pogut iniciar la trucada." },
 * });
 * <VoiceCall call={call} label="Parla amb suport" />
 * ```
 *
 * Draw your own controls from what it returns when `VoiceCall` does not fit.
 */

export type VoiceCallPhase = "idle" | "connecting" | "ready" | "reconnecting" | "error";
export type VoiceCallMode = "listening" | "thinking" | "speaking";

/** The latest exchange: what the user said and the agent's reply to it. */
export interface VoiceCaptions {
  user: string;
  /** `false` while the user is still speaking. */
  userFinal: boolean;
  agent: string;
  /** The reply's text is complete (its audio may still be playing). */
  agentDone: boolean;
}

/** What the user reads when a call fails, in the app's language. */
export interface VoiceCallMessages {
  microphoneBlocked: string;
  noMicrophone: string;
  failed: string;
  muteFailed: string;
}

export const VOICE_CALL_MESSAGES: VoiceCallMessages = {
  microphoneBlocked: "Microphone access is blocked. Allow it in your browser settings and try again.",
  noMicrophone: "No microphone found. Connect one and try again.",
  failed: "Couldn't start the call. Try again.",
  muteFailed: "Couldn't change the microphone. Try again.",
};

export interface UseVoiceCallOptions {
  /** Ask your API for the call's connection: return its `Response` or the parsed connection. */
  connect: (signal: AbortSignal) => Promise<Response | VoiceSessionConnection>;
  messages?: Partial<VoiceCallMessages>;
  /** Startup budget: microphone, your route, the room and the agent. Default 120 000 ms. */
  startupTimeoutMs?: number;
  /** Every raw session event (metrics, usage, approvals), for what the hook does not surface. */
  onEvent?: (event: VoiceEvent) => void;
}

export interface VoiceCallState {
  phase: VoiceCallPhase;
  mode: VoiceCallMode;
  muted: boolean;
  audioBlocked: boolean;
  /** A message from `messages`, never the SDK's raw text. */
  error: string | null;
  captions: VoiceCaptions;
  /** Microphone level 0–1 while the call is live; zero when muted. */
  level: number;
  sessionId: string | null;
  /** Start a call; ignored while one is starting or live. */
  start: () => void;
  /** End the call, or cancel it while it starts. */
  end: () => void;
  toggleMute: () => void;
  /** Call from a tap when `audioBlocked`. */
  resumeAudio: () => void;
}

export const EMPTY_CAPTIONS: VoiceCaptions = { user: "", userFinal: false, agent: "", agentDone: false };

export type CaptionEvent =
  | { type: "user"; text: string; final: boolean; replace?: boolean }
  | { type: "agent"; text?: string; delta?: string; done?: boolean }
  | { type: "interrupted"; heardText: string | null };

export function reduceCaptions(state: VoiceCaptions, event: CaptionEvent): VoiceCaptions {
  switch (event.type) {
    case "user": {
      // A new turn (not the server re-hearing the last one) starts a fresh exchange.
      const newTurn = state.userFinal && !event.replace;
      return {
        user: event.text,
        userFinal: event.final,
        agent: newTurn ? "" : state.agent,
        agentDone: newTurn ? false : state.agentDone,
      };
    }
    case "agent": {
      let { agent, agentDone } = state;
      if (typeof event.text === "string") {
        agent = event.text;
        agentDone = false;
      } else if (event.delta) {
        agent = (agentDone ? "" : agent) + event.delta;
        agentDone = false;
      }
      if (event.done) agentDone = true;
      return { ...state, agent, agentDone };
    }
    case "interrupted":
      // The reply was cut off: show what was actually spoken.
      return { ...state, agent: event.heardText ?? state.agent, agentDone: true };
  }
}

export function phaseFromStatus(status: LiveKitVoiceStatus): VoiceCallPhase {
  switch (status) {
    case "connecting":
    case "initializing":
      return "connecting";
    case "ready":
      return "ready";
    case "reconnecting":
      return "reconnecting";
    case "error":
      return "error";
    case "ended":
      return "idle";
  }
}

export function describeCallError(error: unknown, messages: VoiceCallMessages = VOICE_CALL_MESSAGES): string {
  const name = error instanceof Error ? error.name : "";
  const text = error instanceof Error ? error.message.toLowerCase() : "";
  if (name === "NotAllowedError" || name === "SecurityError" || text.includes("permission") || text.includes("denied")) {
    return messages.microphoneBlocked;
  }
  if (name === "NotFoundError" || name === "OverconstrainedError" || text.includes("no microphone") || text.includes("device not found")) {
    return messages.noMicrophone;
  }
  return messages.failed;
}

export function useVoiceCall(options: UseVoiceCallOptions): VoiceCallState {
  const [phase, setPhase] = useState<VoiceCallPhase>("idle");
  const [mode, setMode] = useState<VoiceCallMode>("listening");
  const [muted, setMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<VoiceCaptions>(EMPTY_CAPTIONS);
  const [level, setLevel] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });
  const sessionRef = useRef<LiveKitVoiceSession | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  // The current attempt. Callbacks and continuations of an older (cancelled
  // or replaced) attempt must never touch the current one.
  const attemptRef = useRef(0);

  const messages = useCallback(() => ({ ...VOICE_CALL_MESSAGES, ...optionsRef.current.messages }), []);

  const reset = useCallback(() => {
    setMode("listening");
    setMuted(false);
    setAudioBlocked(false);
    setCaptions(EMPTY_CAPTIONS);
    setLevel(0);
    setSessionId(null);
  }, []);

  const teardown = useCallback(() => {
    attemptRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    const session = sessionRef.current;
    sessionRef.current = null;
    session?.end();
  }, []);

  const start = useCallback(() => {
    if (controllerRef.current || sessionRef.current) return;
    const attempt = ++attemptRef.current;
    const current = () => attemptRef.current === attempt;
    const controller = new AbortController();
    controllerRef.current = controller;

    reset();
    setError(null);
    setPhase("connecting");

    const fail = (cause: unknown) => {
      if (!current()) return;
      teardown();
      reset();
      setError(describeCallError(cause, messages()));
      setPhase("error");
    };
    const caption = (event: CaptionEvent) => {
      if (current()) setCaptions((previous) => reduceCaptions(previous, event));
    };

    LiveKitVoiceSession.start({
      signal: controller.signal,
      connect: (signal) => optionsRef.current.connect(signal),
      startupTimeoutMs: optionsRef.current.startupTimeoutMs,
      onStatus: (status) => {
        if (!current()) return;
        if (status === "ended") {
          teardown();
          reset();
          setPhase("idle");
          return;
        }
        // start() resolving marks the call ready; status updates refine a live call only.
        if (status !== "error" && (status !== "ready" || sessionRef.current)) setPhase(phaseFromStatus(status));
      },
      onMode: (next) => {
        if (current()) setMode(next);
      },
      onUserTranscript: ({ text, final, replace }) => caption({ type: "user", text, final, replace }),
      onAgentText: ({ text, delta, done }) => caption({ type: "agent", text, delta, done }),
      onInterrupted: ({ heardText }) => caption({ type: "interrupted", heardText }),
      onAudioBlocked: () => {
        if (current()) setAudioBlocked(true);
      },
      onError: fail,
      onEvent: (event) => {
        if (current()) optionsRef.current.onEvent?.(event);
      },
    })
      .then((session) => {
        if (!current()) {
          session.end();
          return;
        }
        controllerRef.current = null;
        sessionRef.current = session;
        setSessionId(session.sessionId ?? null);
        setMuted(session.muted);
        setAudioBlocked(session.audioBlocked);
        setPhase("ready");
      })
      .catch((cause: unknown) => {
        if (current() && !controller.signal.aborted) fail(cause);
      });
  }, [messages, reset, teardown]);

  const end = useCallback(() => {
    teardown();
    reset();
    setError(null);
    setPhase("idle");
  }, [reset, teardown]);

  const toggleMute = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    session
      .setMuted(!session.muted)
      .then(() => {
        if (sessionRef.current === session) setMuted(session.muted);
      })
      .catch(() => {
        if (sessionRef.current === session) setError(messages().muteFailed);
      });
  }, [messages]);

  const resumeAudio = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    session
      .resumeAudio()
      .then(() => {
        if (sessionRef.current === session) setAudioBlocked(session.audioBlocked);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const id = window.setInterval(() => {
      const session = sessionRef.current;
      const next = session && !session.muted ? Math.min(1, session.inputVolume) : 0;
      setLevel((previous) => (Math.abs(previous - next) < 0.02 ? previous : next));
    }, 120);
    return () => window.clearInterval(id);
  }, [phase]);

  // Leaving the page ends the call, even while it is still starting.
  useEffect(() => teardown, [teardown]);

  return { phase, mode, muted, audioBlocked, error, captions, level, sessionId, start, end, toggleMute, resumeAudio };
}
