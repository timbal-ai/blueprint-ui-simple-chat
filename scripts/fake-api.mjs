#!/usr/bin/env node
/**
 * fake-api — a stand-in for the Timbal API so the UI can be exercised end to
 * end without a backend.
 *
 *   bun run dev:fake        # starts this on :5301 and vite with /api proxied to it
 *   node scripts/fake-api.mjs   # standalone; then VITE_API_PROXY_TARGET=http://localhost:5301 bun run dev
 *
 * Endpoints:
 *   GET  /api/config                    → open project (auth.required=false) with email+google+github providers
 *   GET  /api/workforce                 → three workforces
 *   POST /api/files/upload              → { url } (images come back as data URLs so tiles render)
 *   POST /api/workforce/:id/stream      → SSE run: generic tool → web search → chart artifact → markdown
 *                                          prompt containing "fail" → HTTP 500; "slow" → 6 s first tool
 *   POST /api/auth/magic-link           → 200 (email in body) so the Login "check your inbox" state shows
 */
import { createServer } from "node:http";

const PORT = Number(process.env.FAKE_API_PORT ?? 5301);

// 1×1 transparent PNG — enough for an <img> tile.
const PNG_1PX =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

const WORKFORCES = [
  { id: "support", name: "Support agent", type: "agent", description: "Answers customer questions" },
  { id: "research", name: "Research agent", type: "agent", description: "Digs through the web" },
  { id: "nightly", name: "Nightly digest", type: "workflow" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sse = (res, event) => res.write(`data: ${JSON.stringify(event)}\n\n`);
const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

async function stream(res, prompt) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  sse(res, { type: "START", run_id: `run-${Date.now()}`, path: "agent" });
  await sleep(200);

  // 1. generic tool — held so the running state is visible
  sse(res, {
    type: "DELTA",
    path: "agent.llm",
    item: { type: "tool_use", id: "t1", name: "get_weather", input: { city: "Paris", units: "metric" } },
  });
  await sleep(/slow/i.test(prompt) ? 6000 : 2200);
  sse(res, {
    type: "OUTPUT",
    path: "agent.llm",
    output: {
      content: [
        {
          type: "tool_result",
          tool_use_id: "t1",
          content: JSON.stringify({ temp: 18, condition: "Cloudy", humidity: 72, wind_kph: 14 }),
        },
      ],
    },
  });
  await sleep(300);

  // 2. search-shaped tool with URL results
  sse(res, {
    type: "DELTA",
    path: "agent.llm",
    item: { type: "tool_use", id: "t2", name: "web_search", input: { query: "Paris weather trends 2026" } },
  });
  await sleep(900);
  sse(res, {
    type: "OUTPUT",
    path: "agent.llm",
    output: {
      content: [
        {
          type: "tool_result",
          tool_use_id: "t2",
          content: JSON.stringify({
            results: [
              { title: "Climate of Paris — Wikipedia", url: "https://en.wikipedia.org/wiki/Climate_of_Paris" },
              { title: "r/paris: what's the weather like this week?", url: "https://www.reddit.com/r/paris/comments/abc123" },
              { title: "Prévisions Paris — Météo-France", url: "https://meteofrance.com/previsions-meteo-france/paris/75000" },
              { title: "open-meteo/open-meteo", url: "https://github.com/open-meteo/open-meteo" },
            ],
          }),
        },
      ],
    },
  });
  await sleep(300);

  // 3. artifact-returning tool (chart)
  sse(res, {
    type: "DELTA",
    path: "agent.llm",
    item: { type: "tool_use", id: "t3", name: "make_chart", input: { metric: "temperature" } },
  });
  await sleep(600);
  sse(res, {
    type: "OUTPUT",
    path: "agent.llm",
    output: {
      content: [
        {
          type: "tool_result",
          tool_use_id: "t3",
          content: JSON.stringify({
            type: "chart",
            chartType: "bar",
            title: "Temperature this week",
            description: "Daily highs, °C",
            data: [
              { day: "Mon", temp: 18 },
              { day: "Tue", temp: 20 },
              { day: "Wed", temp: 17 },
              { day: "Thu", temp: 22 },
              { day: "Fri", temp: 24 },
            ],
            xKey: "day",
            dataKey: "temp",
          }),
        },
      ],
    },
  });
  await sleep(300);

  // 4. streamed markdown answer
  const text =
    "Paris is **18 °C and cloudy** right now with 72 % humidity.\n\n" +
    "- Highs climb to **24 °C by Friday**\n" +
    "- Wind stays light (14 km/h)\n\n" +
    "Sources agree the week trends warmer; see the chart above for the daily highs.";
  for (const chunk of text.match(/.{1,24}/gs) ?? []) {
    sse(res, { type: "DELTA", path: "agent.llm", item: { type: "text_delta", text_delta: chunk } });
    await sleep(40);
  }
  sse(res, { type: "OUTPUT", path: "agent", output: { content: [{ type: "text", text }] }, status: { code: "success" } });
  res.end();
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let body = "";
  for await (const chunk of req) body += chunk;
  const path = url.pathname.replace(/^\/api/, "");

  if (req.method === "GET" && path === "/config") {
    return json(res, 200, {
      project: { id: "fake", name: "Fake project" },
      auth: { required: false, providers: ["email", "google", "github"] },
    });
  }
  if (req.method === "GET" && path === "/workforce") return json(res, 200, WORKFORCES);
  if (req.method === "POST" && path === "/auth/magic-link") return json(res, 200, { ok: true });
  if (req.method === "POST" && path === "/files/upload") {
    const name = /filename="([^"]+)"/.exec(body)?.[1] ?? "file";
    return json(res, 200, {
      url: /\.(png|jpe?g|gif|webp)$/i.test(name)
        ? `data:image/png;base64,${PNG_1PX}`
        : `https://files.example.com/uploads/${encodeURIComponent(name)}`,
    });
  }
  if (req.method === "POST" && /^\/workforce\/[^/]+\/stream$/.test(path)) {
    let prompt = "";
    try {
      const parsed = JSON.parse(body);
      prompt = typeof parsed.prompt === "string" ? parsed.prompt : JSON.stringify(parsed.prompt ?? "");
    } catch {
      /* ignore */
    }
    if (/fail/i.test(prompt)) return json(res, 500, { error: "simulated failure" });
    return stream(res, prompt);
  }
  res.writeHead(404);
  res.end();
}).listen(PORT, () => console.log(`fake timbal api on http://localhost:${PORT}  (prompts: normal · "slow" · "fail")`));
