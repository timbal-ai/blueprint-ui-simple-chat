import { type ReactNode, useCallback, useRef, useState } from "react";
import {
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
  AssistantRuntimeProvider,
} from "@assistant-ui/react";
import { authFetch } from "@/auth/tokens";

const USE_FAKE_LONG_STREAM = import.meta.env.VITE_FAKE_LONG_STREAM === "true";
const FAKE_STREAM_DELAY_MS = Number(import.meta.env.VITE_FAKE_STREAM_DELAY_MS ?? 75);

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function parseLine(line: string): Record<string, unknown> | null {
  let jsonStr = line.trim();
  if (!jsonStr) return null;
  if (jsonStr.startsWith("data: ")) jsonStr = jsonStr.substring(6);
  if (jsonStr === "[DONE]") return null;
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

const convertMessage = (message: ChatMessage): ThreadMessageLike => ({
  role: message.role,
  content: [{ type: "text", text: message.content }],
  id: message.id,
});

function buildFakeLongResponse(input: string): string {
  const safeInput = input.trim() || "your request";
  const base = [
    `Fake streaming fallback enabled. You asked: "${safeInput}".`,
    "",
    "This is a deliberately long response used to test rendering, scrolling, cancellation, and streaming UX behavior.",
    "",
    "What this stream is exercising:",
    "- Frequent tiny token updates",
    "- Long markdown paragraphs",
    "- Bullet list rendering",
    "- UI action bar behavior while running",
    "- Stop button and abort flow",
    "",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae mi at augue pulvinar porta. Praesent ullamcorper felis at nibh tincidunt, id sagittis mauris interdum. Integer nec semper dui. Curabitur sed fermentum libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "",
    "Aliquam luctus purus non bibendum faucibus. Donec at elit eget massa feugiat ultricies. Quisque condimentum, libero in egestas varius, purus justo aliquam sem, vitae feugiat nunc lorem a justo. Sed non tempor est. In hac habitasse platea dictumst.",
    "",
    "If you can read this arriving progressively, the fallback is working as intended.",
  ].join("\n");

  // Repeat once to make the thread roughly 2x longer.
  return `${base}\n\n---\n\n${base}`;
}

function waitWithAbort(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    throw new DOMException("The operation was aborted.", "AbortError");
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(timeoutId);
      reject(new DOMException("The operation was aborted.", "AbortError"));
    };

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

async function streamFakeLongResponse(
  input: string,
  signal: AbortSignal,
  onDelta: (delta: string) => void,
): Promise<void> {
  const fullResponse = buildFakeLongResponse(input);
  let cursor = 0;

  while (cursor < fullResponse.length) {
    if (signal.aborted) {
      throw new DOMException("The operation was aborted.", "AbortError");
    }

    const chunkSize = Math.min(
      fullResponse.length - cursor,
      Math.floor(Math.random() * 12) + 2,
    );
    const delta = fullResponse.slice(cursor, cursor + chunkSize);
    cursor += chunkSize;
    onDelta(delta);

    await waitWithAbort(FAKE_STREAM_DELAY_MS, signal);
  }
}

interface TimbalRuntimeProviderProps {
  workforceId: string;
  children: ReactNode;
}

export function TimbalRuntimeProvider({
  workforceId,
  children,
}: TimbalRuntimeProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const streamAssistantResponse = useCallback(
    async (input: string, assistantId: string, signal: AbortSignal) => {
      let assistantContent = "";
      const updateAssistantMessage = (nextContent: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: nextContent } : m,
          ),
        );
      };

      try {
        if (USE_FAKE_LONG_STREAM) {
          await streamFakeLongResponse(input, signal, (delta) => {
            assistantContent += delta;
            updateAssistantMessage(assistantContent);
          });
          return;
        }

        const res = await authFetch(
          `/api/workforce/${workforceId}/stream`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
            signal,
          },
        );

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const event = parseLine(line);
            if (!event) continue;
            const eventType = event.type as string | undefined;

            if (eventType === "DELTA") {
              const item = event.item as Record<string, unknown> | undefined;
              if (
                item?.type === "text_delta" &&
                typeof item.text_delta === "string"
              ) {
                assistantContent += item.text_delta;
                updateAssistantMessage(assistantContent);
              }
            } else if (eventType === "CHUNK") {
              assistantContent += String(event.chunk);
              updateAssistantMessage(assistantContent);
            } else if (eventType === "OUTPUT") {
              if (!assistantContent && event.output) {
                const outputText =
                  typeof event.output === "string"
                    ? event.output
                    : JSON.stringify(event.output);
                assistantContent = outputText;
                updateAssistantMessage(outputText);
              }
            }
          }
        }

        if (buffer.trim()) {
          const event = parseLine(buffer);
          if (
            event?.type === "OUTPUT" &&
            !assistantContent &&
            event.output
          ) {
            const outputText =
              typeof event.output === "string"
                ? event.output
                : JSON.stringify(event.output);
            updateAssistantMessage(outputText);
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const errorMsg = assistantContent || "Something went wrong.";
          updateAssistantMessage(errorMsg);
        }
      } finally {
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [workforceId],
  );

  const onNew = useCallback(
    async (message: AppendMessage) => {
      const textPart = message.content.find((c) => c.type === "text");
      if (!textPart || textPart.type !== "text") return;

      const input = textPart.text;
      const userId = crypto.randomUUID();
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: input },
      ]);

      setIsRunning(true);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      await streamAssistantResponse(input, assistantId, controller.signal);
    },
    [streamAssistantResponse],
  );

  const onReload = useCallback(
    async (parentId: string | null) => {
      const parentIdx = parentId
        ? messages.findIndex((m) => m.id === parentId)
        : messages.length - 2;

      const userMessage = parentIdx >= 0 ? messages[parentIdx] : null;
      if (!userMessage || userMessage.role !== "user") return;

      const input = userMessage.content;
      const assistantId = crypto.randomUUID();

      setMessages((prev) => {
        const trimmed = prev.slice(0, parentIdx + 1);
        return [...trimmed, { id: assistantId, role: "assistant" as const, content: "" }];
      });

      setIsRunning(true);

      const controller = new AbortController();
      abortRef.current = controller;

      await streamAssistantResponse(input, assistantId, controller.signal);
    },
    [messages, streamAssistantResponse],
  );

  const onCancel = useCallback(async () => {
    abortRef.current?.abort();
  }, []);

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage,
    onNew,
    onReload,
    onCancel,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
