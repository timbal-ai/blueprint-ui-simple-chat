# Design record

> **Read this before any UI work. Update it after any design decision.**
> This file + `dna.json` are the durable design memory of this project —
> every future session reads them first so page 12 looks like page 1.

## Intent

_One or two sentences: what this product is, who uses it, and the feeling the
UI should carry. Rewrite when you author the real DNA._

Blueprint default: neutral, calm product surface that works for chat and
dashboards until the real domain is known.

## DNA summary

| Axis | Value | Why |
|---|---|---|
| Finish | `timbal` (canvas gradient, gradient + inset controls) | The house look — keep unless the user or a reference asks for flat |
| Surfaces | `panel` (gray canvas, elevated cards) | Safe SaaS default |
| Brand | `#18181b` (neutral zinc — zero chroma) | Placeholder; near-black/near-white primary until the real brand is known |
| Typography | `inter` pairing | Neutral default |
| Shape | radius 0.625rem, rounded controls | Middle of the road |
| Density | comfortable | Middle of the road |
| Motion | snappy (150ms base) | Product-feel default |

Change any of this in `dna.json`, then run `bun run dna:compile`.
**Never edit `tokens.css` by hand** — `dna:check` rejects drift.

## References

_Record every reference used and what was borrowed from it. This is how
consistency survives multi-session work._

| Source | Ref | Borrowed |
|---|---|---|
| — | — | — |

## Layout decisions

- Shell: _undecided — pick per domain (sidebar / topbar / minimal / split)._
- Page width: boxed.
- Nav model: _undecided._

## Component decisions

_Deviations from the stock components live here: "buttons are pill-shaped",
"tables are dense with zebra rows", "cards are flat with hairline borders"…
List the file you changed and the reason._

- None yet — stock blueprint components. Buttons, cards, dialogs, and the
  sidebar inset consume the DNA **finish tokens** (`--primary-fill-*`,
  `--elevated-*`, `--modal-*`, `--playground-*`, `shadow-control`), so
  `"finish": "timbal"` renders the signature Timbal chrome and
  `"finish": "flat"` renders plain flat surfaces from the same source.

## Open questions / known gaps

- None.
