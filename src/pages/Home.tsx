import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Loader2, LogOut, Send, Square } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isAuthEnabled, useSession } from "@/auth/provider";
import { authFetch } from "@/auth/tokens";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Workforce {
  id: string;
  name: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Stream parser
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Home = () => {
  const { theme, systemTheme } = useTheme();
  const { logout } = useSession();
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Core state
  const [workforces, setWorkforces] = useState<Workforce[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, statusText, scrollToBottom]);

  // Auto-resize textarea
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, []);

  useEffect(resizeTextarea, [input, resizeTextarea]);

  // Fetch workforces on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch("/api/workforce");
        if (!res.ok) return;
        const data: Workforce[] = await res.json();
        setWorkforces(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch {
        // silently fail — user can retry
      }
    };
    load();
  }, []);

  // -----------------------------------------------------------------------
  // Send message & stream response
  // -----------------------------------------------------------------------

  const sendMessage = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || !selectedId || isStreaming) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" },
    ]);
    setIsStreaming(true);
    setStatusText("Thinking...");

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantContent = "";

    try {
      const res = await authFetch(`/api/workforce/${selectedId}/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

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

          if (eventType === "START") {
            const st = event.status_text as string | undefined;
            if (st) setStatusText(st);
          } else if (eventType === "DELTA") {
            const item = event.item as Record<string, unknown> | undefined;
            if (item?.type === "text_delta" && typeof item.text_delta === "string") {
              assistantContent += item.text_delta;
              const snapshot = assistantContent;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: snapshot };
                return next;
              });
              setStatusText(null);
            }
          } else if (eventType === "CHUNK") {
            const chunk = event.chunk;
            assistantContent += String(chunk);
            const snapshot = assistantContent;
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: snapshot };
              return next;
            });
            setStatusText(null);
          } else if (eventType === "OUTPUT") {
            if (!assistantContent && event.output) {
              const outputText =
                typeof event.output === "string"
                  ? event.output
                  : JSON.stringify(event.output);
              assistantContent = outputText;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: outputText };
                return next;
              });
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim()) {
        const event = parseLine(buffer);
        if (event && event.type === "OUTPUT" && !assistantContent && event.output) {
          const outputText =
            typeof event.output === "string"
              ? event.output
              : JSON.stringify(event.output);
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", content: outputText };
            return next;
          });
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const errorMsg = assistantContent || "Something went wrong.";
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: errorMsg };
          return next;
        });
      }
    } finally {
      setIsStreaming(false);
      setStatusText(null);
      abortRef.current = null;
    }
  }, [input, selectedId, isStreaming]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between w-full py-3 px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <img
            src={currentTheme === "dark" ? "/timbal_w.svg" : "/timbal_b.svg"}
            alt="Timbal"
            className="h-5 w-auto"
          />
          {workforces.length > 0 && (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {workforces.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isAuthEnabled && (
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm pt-32">
              <p>Send a message to get started.</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const isEmpty = !msg.content;
            const isLastAssistant =
              msg.role === "assistant" && i === messages.length - 1;

            return (
              <div
                key={i}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {isEmpty && isLastAssistant && isStreaming ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" />
                      {statusText || "Thinking..."}
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
          />
          {isStreaming ? (
            <Button
              size="icon"
              variant="destructive"
              onClick={stopStreaming}
              className="shrink-0 rounded-xl"
            >
              <Square className="size-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || !selectedId}
              className="shrink-0 rounded-xl"
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
