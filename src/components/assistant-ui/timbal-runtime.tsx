import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
  AssistantRuntimeProvider,
} from "@assistant-ui/react";
import { authFetch } from "@/auth/tokens";

const USE_FAKE_LONG_STREAM = import.meta.env.VITE_FAKE_LONG_STREAM === "true";
const FAKE_STREAM_DELAY_MS = Number(import.meta.env.VITE_FAKE_STREAM_DELAY_MS ?? 75);

type TextContentPart = {
  type: "text";
  text: string;
};

type ToolCallContentPart = {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  argsText: string;
  result?: unknown;
};

type ContentPart = TextContentPart | ToolCallContentPart;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: ContentPart[];
  runId?: string;
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
  content: message.content,
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
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const streamAssistantResponse = useCallback(
    async (
      input: string,
      userId: string,
      assistantId: string,
      parentId: string | null,
      signal: AbortSignal,
    ) => {
      const contentParts: ContentPart[] = [];
      const toolCallMap = new Map<string, number>();

      const getOrCreateTextPart = (): TextContentPart => {
        const lastPart = contentParts[contentParts.length - 1];
        if (lastPart && lastPart.type === "text") {
          return lastPart;
        }
        const newTextPart: TextContentPart = { type: "text", text: "" };
        contentParts.push(newTextPart);
        return newTextPart;
      };

      const updateAssistantMessage = (runId?: string) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === assistantId) {
              return { ...m, content: [...contentParts], ...(runId && { runId }) };
            }
            return m;
          }),
        );
      };

      const stampRunId = (runId: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userId || m.id === assistantId ? { ...m, runId } : m,
          ),
        );
      };

      try {
        if (USE_FAKE_LONG_STREAM) {
          const fakeToolCallId = `call_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;

          contentParts.push({
            type: "tool-call",
            toolCallId: fakeToolCallId,
            toolName: "get_datetime",
            argsText: "{}",
          });
          toolCallMap.set(fakeToolCallId, contentParts.length - 1);
          updateAssistantMessage();

          await waitWithAbort(2000, signal);

          const toolPart = contentParts[toolCallMap.get(fakeToolCallId)!] as ToolCallContentPart;
          toolPart.result = `Current datetime (from tool): ${new Date().toISOString()}`;
          updateAssistantMessage();

          await waitWithAbort(300, signal);

          await streamFakeLongResponse(input, signal, (delta) => {
            const textPart = getOrCreateTextPart();
            textPart.text += delta;
            updateAssistantMessage();
          });
          return;
        }

        const res = await authFetch(
          `/api/workforce/${workforceId}/stream`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: input,
              ...(parentId && { parent_id: parentId }),
            }),
            signal,
          },
        );

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let capturedRunId: string | null = null;

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

            if (
              !capturedRunId &&
              eventType === "START" &&
              typeof event.run_id === "string" &&
              typeof event.path === "string" &&
              !event.path.includes(".")
            ) {
              capturedRunId = event.run_id;
              stampRunId(capturedRunId);
            }

            if (eventType === "DELTA") {
              const item = event.item as Record<string, unknown> | undefined;
              if (!item) continue;

              const itemType = item.type as string | undefined;

              if (itemType === "text_delta" && typeof item.text_delta === "string") {
                const textPart = getOrCreateTextPart();
                textPart.text += item.text_delta;
                updateAssistantMessage();
              } else if (itemType === "tool_use") {
                const toolCallId = (item.id as string) || `tool-${crypto.randomUUID()}`;
                const toolName = (item.name as string) || "unknown";
                const inputStr = typeof item.input === "string" ? item.input : JSON.stringify(item.input ?? {});
                
                const toolCallPart: ToolCallContentPart = {
                  type: "tool-call",
                  toolCallId,
                  toolName,
                  argsText: inputStr,
                };
                const idx = contentParts.length;
                contentParts.push(toolCallPart);
                toolCallMap.set(toolCallId, idx);
                updateAssistantMessage();
              } else if (itemType === "tool_use_delta") {
                const toolCallId = item.id as string;
                const inputDelta = item.input_delta as string | undefined;
                if (toolCallId && inputDelta) {
                  const idx = toolCallMap.get(toolCallId);
                  if (idx !== undefined) {
                    const part = contentParts[idx] as ToolCallContentPart;
                    part.argsText += inputDelta;
                    updateAssistantMessage();
                  }
                }
              }
            } else if (eventType === "CHUNK") {
              const textPart = getOrCreateTextPart();
              textPart.text += String(event.chunk);
              updateAssistantMessage();
            } else if (eventType === "OUTPUT") {
              const output = event.output as Record<string, unknown> | string | undefined;
              if (output) {
                if (typeof output === "object" && output.content) {
                  const outputContent = output.content as Array<Record<string, unknown>>;
                  for (const part of outputContent) {
                    if (part.type === "tool_use") {
                      const toolCallId = (part.id as string) || `tool-${crypto.randomUUID()}`;
                      const existingIdx = toolCallMap.get(toolCallId);
                      if (existingIdx !== undefined) {
                        const existingPart = contentParts[existingIdx] as ToolCallContentPart;
                        existingPart.result = "Tool executed";
                      } else {
                        const toolName = (part.name as string) || "unknown";
                        const inputData = part.input;
                        const inputStr = typeof inputData === "string" ? inputData : JSON.stringify(inputData ?? {});
                        const toolCallPart: ToolCallContentPart = {
                          type: "tool-call",
                          toolCallId,
                          toolName,
                          argsText: inputStr,
                          result: "Tool executed",
                        };
                        contentParts.push(toolCallPart);
                        toolCallMap.set(toolCallId, contentParts.length - 1);
                      }
                    } else if (part.type === "text" && typeof part.text === "string") {
                      const textPart = getOrCreateTextPart();
                      if (!textPart.text) {
                        textPart.text = part.text;
                      }
                    }
                  }
                  updateAssistantMessage();
                } else if (contentParts.length === 0) {
                  const outputText = typeof output === "string" ? output : JSON.stringify(output);
                  contentParts.push({ type: "text", text: outputText });
                  updateAssistantMessage();
                }
              }
            }
          }
        }

        if (buffer.trim()) {
          const event = parseLine(buffer);
          if (event?.type === "OUTPUT" && contentParts.length === 0 && event.output) {
            const outputText =
              typeof event.output === "string"
                ? event.output
                : JSON.stringify(event.output);
            contentParts.push({ type: "text", text: outputText });
            updateAssistantMessage();
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          if (contentParts.length === 0) {
            contentParts.push({ type: "text", text: "Something went wrong." });
          }
          updateAssistantMessage();
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

      const assistantMessages = messagesRef.current.filter(
        (msg) => msg.role === "assistant",
      );
      const parentId = assistantMessages[assistantMessages.length - 1]?.runId ?? null;

      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: [{ type: "text", text: input }] },
      ]);

      setIsRunning(true);
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: [] },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      await streamAssistantResponse(input, userId, assistantId, parentId, controller.signal);
    },
    [streamAssistantResponse],
  );

  const onReload = useCallback(
    async (messageId: string | null) => {
      const currentMessages = messagesRef.current;
      const messageIdx = messageId
        ? currentMessages.findIndex((m) => m.id === messageId)
        : currentMessages.length - 2;

      const userMessage = messageIdx >= 0 ? currentMessages[messageIdx] : null;
      if (!userMessage || userMessage.role !== "user") return;

      const textPart = userMessage.content.find((c) => c.type === "text");
      if (!textPart || textPart.type !== "text") return;

      const input = textPart.text;
      const assistantId = crypto.randomUUID();

      const assistantMessages = currentMessages
        .slice(0, messageIdx)
        .filter((msg) => msg.role === "assistant");
      const parentId = assistantMessages[assistantMessages.length - 1]?.runId ?? null;

      setMessages((prev) => {
        const trimmed = prev.slice(0, messageIdx + 1);
        return [...trimmed, { id: assistantId, role: "assistant" as const, content: [] }];
      });

      setIsRunning(true);

      const controller = new AbortController();
      abortRef.current = controller;

      await streamAssistantResponse(input, userMessage.id, assistantId, parentId, controller.signal);
    },
    [streamAssistantResponse],
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
