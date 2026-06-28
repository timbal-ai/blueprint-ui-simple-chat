import { TimbalMark } from "@timbal-ai/timbal-react";

/**
 * Default scaffold placeholder shown on a fresh build.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPOSER: This is a stand-in, NOT the real app. When you build the UI you MUST
 * remove this placeholder and render the actual surface instead. In `App.tsx`,
 * the index route renders `<Placeholder />` — swap it for your real page (e.g.
 * `<Home />` for the chat shell, or whatever app you are building) and delete
 * this file once it is no longer referenced. Do not ship the placeholder.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const Placeholder = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <TimbalMark size={72} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your app will live here
        </h1>
        <p className="text-base text-muted-foreground">
          Ask Timbal to build it.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
