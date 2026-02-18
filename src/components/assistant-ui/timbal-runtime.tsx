import { type ReactNode, useCallback, useRef, useState } from "react";
import {
  useExternalStoreRuntime,
  type ThreadMessageLike,
  type AppendMessage,
  AssistantRuntimeProvider,
} from "@assistant-ui/react";
import { authFetch } from "@/auth/tokens";

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

      let assistantContent = "";

      try {
        const res = await authFetch(
          `/api/workforce/${workforceId}/stream`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
            signal: controller.signal,
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
                const snapshot = assistantContent;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: snapshot } : m,
                  ),
                );
              }
            } else if (eventType === "CHUNK") {
              assistantContent += String(event.chunk);
              const snapshot = assistantContent;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: snapshot } : m,
                ),
              );
            } else if (eventType === "OUTPUT") {
              if (!assistantContent && event.output) {
                const outputText =
                  typeof event.output === "string"
                    ? event.output
                    : JSON.stringify(event.output);
                assistantContent = outputText;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: outputText }
                      : m,
                  ),
                );
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
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: outputText }
                  : m,
              ),
            );
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const errorMsg = assistantContent || "Something went wrong.";
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: errorMsg } : m,
            ),
          );
        }
      } finally {
        setIsRunning(false);
        abortRef.current = null;
      }
    },
    [workforceId],
  );

  const onCancel = useCallback(async () => {
    abortRef.current?.abort();
  }, []);

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    convertMessage,
    onNew,
    onCancel,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
