import { TimbalMark } from "@timbal-ai/timbal-react";

/**
 * Default scaffold placeholder shown on a fresh build.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT: This is a stand-in, NOT the real app. When you build the UI you MUST
 * replace it: in `App.tsx` the index route renders `<Placeholder />` — swap it
 * for the real surface (`<Home />` for a chat-first product, a template shell
 * from `registry/templates.md`, or your own page) and delete this file once
 * nothing references it. Never ship the placeholder.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function Placeholder() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-6 bg-background-full px-6 text-center">
      <TimbalMark size={72} />
      <div className="flex flex-col gap-2">
        <h1 className="text-title-2-medium text-text-primary">Your app will live here</h1>
        <p className="text-body-regular text-text-secondary">Ask Timbal to build it.</p>
      </div>
    </div>
  );
}
