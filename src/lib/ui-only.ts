import type { WorkforceItem } from "@timbal-ai/timbal-sdk";
import type { ThreadSuggestion } from "@timbal-ai/timbal-react";

/**
 * Local preview mode helpers — used when `VITE_STUDIO_UI_ONLY=true` or the
 * Vite dev server is running without `VITE_TIMBAL_PROJECT_ID`. Provides an
 * in-memory `fetch` so the chat UI renders without hitting `/api`.
 */

export const STUDIO_UI_PREVIEW_WORKFORCE_ID = "blueprint-preview";

export const studioUiPreviewWorkforces: WorkforceItem[] = [
  {
    type: "agent",
    id: STUDIO_UI_PREVIEW_WORKFORCE_ID,
    name: "Blueprint preview",
  },
  {
    type: "agent",
    id: "blueprint-preview-2",
    name: "Second agent",
  },
];

export const studioUiPreviewSuggestions: ThreadSuggestion[] = [
  { title: "Summarize this week" },
  { title: "What can you help with?" },
  { title: "Draft a status update" },
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function previewStreamResponse(): Response {
  const lines = [
    `data: ${JSON.stringify({
      type: "START",
      run_id: "ui-preview-run",
      path: "agent",
    })}`,
    `data: ${JSON.stringify({
      type: "DELTA",
      item: {
        type: "text_delta",
        text_delta:
          "Blueprint UI preview — messages stay local. Run `timbal start` and set `VITE_STUDIO_UI_ONLY=false` to connect a real agent.",
      },
    })}`,
  ];
  const body = `${lines.join("\n\n")}\n\n`;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(body));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

/** In-memory fetch — never hits the Vite `/api` proxy. */
export async function studioUiOnlyFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const method = (options?.method ?? "GET").toUpperCase();

  if (method === "GET" && url.includes("/workforce") && !url.includes("/stream")) {
    return jsonResponse(studioUiPreviewWorkforces);
  }

  if (method === "POST" && url.includes("/stream")) {
    return previewStreamResponse();
  }

  if (method === "POST" && url.includes("/files/upload")) {
    return jsonResponse({ url: "https://example.com/ui-preview-file" });
  }

  return jsonResponse({ ok: true });
}
