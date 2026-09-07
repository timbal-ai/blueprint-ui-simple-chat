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
 *   GET  /api/runs?roots=true&workforce_id=…  → past conversations (thread roots) for the history rail
 *   GET  /api/runs?group_id=…           → every turn of one conversation
 *   GET  /api/runs/:id                  → one turn with its trace (runtime rebuilds the messages from it)
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

/* Past conversations. Each root run is a conversation; follow-up turns point
 * at it through parent_id/group_id. Traces use the shape runTraceToMessages
 * reads: an `agent` root span and an `agent.llm` step whose input carries the
 * user message and whose output carries the assistant blocks. */
const HOURS = 3_600_000;
const now = Date.now();
const turn = ({ id, parent, group, ago, workforce, user, assistant }) => {
  const t0 = now - ago;
  return {
    id,
    group_id: group ?? id,
    parent_id: parent ?? null,
    created_at: new Date(t0).toISOString(),
    status: "success",
    duration_ms: 3200,
    workforce: { id: workforce, name: WORKFORCES.find((w) => w.id === workforce)?.name ?? workforce },
    input: { prompt: user },
    trace: [
      { call_id: `${id}-root`, parent_call_id: null, path: "agent", start_time: t0, input: { prompt: user } },
      {
        call_id: `${id}-llm`,
        parent_call_id: `${id}-root`,
        path: "agent.llm",
        start_time: t0 + 50,
        metadata: { type: "llm" },
        input: { messages: [{ role: "user", content: user }] },
        output: { content: [{ type: "text", text: assistant }] },
      },
    ],
  };
};
const RUNS = [
  turn({
    id: "c-101", ago: 2 * HOURS, workforce: "support",
    user: "Summarize this week's tickets",
    assistant: "**42 tickets** this week, 9 still open.\n\n- Login issues: 14\n- Billing: 11\n- Feature requests: 17\n\nMedian first response was 38 minutes.",
  }),
  turn({
    id: "c-102", parent: "c-101", group: "c-101", ago: 2 * HOURS - 5 * 60_000, workforce: "support",
    user: "Which of the open ones are oldest?",
    assistant: "Three tickets are older than five days: #4812 (SSO redirect loop), #4790 (invoice PDF blank) and #4771 (export timeout).",
  }),
  turn({
    id: "c-201", ago: 26 * HOURS, workforce: "support",
    user: "Draft a reply for the refund request from Acme",
    assistant: "Hi Dana,\n\nThanks for reaching out — I've processed the refund for the March invoice; it lands in 3–5 business days.\n\nBest,\nSupport",
  }),
  turn({
    id: "c-301", ago: 3 * 24 * HOURS, workforce: "support",
    user: "Explain what you can do",
    assistant: "I answer customer questions, draft replies, summarise ticket queues and look up account details.",
  }),
  turn({
    id: "c-401", ago: 5 * HOURS, workforce: "research",
    user: "Compare the three open-source vector databases",
    assistant: "Qdrant, Weaviate and Milvus differ mainly in deployment footprint and filtering…",
  }),
];
const listRuns = (params) => {
  let rows = RUNS;
  if (params.get("group_id")) rows = rows.filter((r) => String(r.group_id) === params.get("group_id"));
  if (params.get("roots") === "true") rows = rows.filter((r) => r.parent_id == null);
  if (params.get("workforce_id")) rows = rows.filter((r) => r.workforce.id === params.get("workforce_id"));
  const desc = (params.get("sort_order") ?? "desc") === "desc";
  rows = [...rows].sort((a, b) => (desc ? 1 : -1) * (Date.parse(b.created_at) - Date.parse(a.created_at)));
  // Previews omit the trace, like the platform's list endpoint.
  return { runs: rows.map(({ trace: _trace, ...preview }) => preview), next_page_token: null };
};

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
  if (req.method === "GET" && path === "/runs") return json(res, 200, listRuns(url.searchParams));
  if (req.method === "GET" && /^\/runs\/[^/]+$/.test(path)) {
    const run = RUNS.find((r) => r.id === decodeURIComponent(path.slice("/runs/".length)));
    return run ? json(res, 200, run) : json(res, 404, { error: "run not found" });
  }
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
