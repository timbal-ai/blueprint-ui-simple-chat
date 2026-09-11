# BoardUI theming reference

How BoardUI's tokens work, what the semantic families are, and how to rebrand. Everything here lives in the project after `npx boardui@latest init`: tokens in `styles/theme.css`, the type scale in `styles/typography.css`, the Tailwind entry in `styles/globals.css`.

## Architecture

BoardUI is Tailwind CSS v4, CSS-first: there is no `tailwind.config.js`. Tokens are CSS custom properties declared inside `@theme` blocks in `styles/theme.css`, which makes each one a Tailwind utility automatically (`--color-text-primary` becomes `text-text-primary`, `bg-text-primary`, and so on).

Two layers:

1. **Primitives**: raw color ramps (`--color-neutral-50` through `--color-neutral-950`, `--color-blue-*`, `--color-red-*`, ...). Components never reference these directly.
2. **Semantic tokens**: role-named tokens that map onto primitives (`--color-text-primary: var(--color-neutral-950)`). Components use only these. Dark mode re-binds the semantic layer under `.dark { ... }`, so every component flips automatically with zero `dark:` prefixes.

The composite type styles work the same way: each `--text-<style>` in `styles/typography.css` carries size, line-height, letter-spacing, and font-weight together, surfacing as one utility (`text-body-medium`).

## Semantic color families

Use these utilities and nothing else. Never raw palette classes, hex, or oklch literals in component code.

| Family | Utilities | Use for |
| --- | --- | --- |
| Text | `text-text-primary`, `-secondary`, `-tertiary`, `-placeholder`, `-disabled`, `text-text-error-primary`, `text-text-white` | All copy. Primary for headings/labels, secondary for supporting copy, tertiary for hints. |
| Surfaces | `bg-background-full` (page ground), `bg-background-primary-default` / `-hover` / `-active`, `bg-background-secondary-default` / `-hover`, `bg-background-tertiary-default` / `-hover`, `bg-background-quaternary-default` | Page, cards, wells, hover states. Secondary is the subtle gray tray; tertiary/quaternary step darker. |
| Borders | `border-border-button-default` / `-hover` / `-active`, `border-separator-border` (hairlines), `border-border-table`, `border-border-checkbox-*`, `border-border-error-default`, `ring-border-focus-ring` | Card and control outlines, dividers, focus rings. |
| Icons | `text-foreground-icon-primary` through `-quaternary`, `text-foreground-icon-error`, `-disabled` | Icon color steps, strongest to faintest. |
| Charts | `chart-1` through `chart-5` (each with a `-active` variant), `chart-track`, `chart-cursor`, `chart-neutral` | Series colors in chart cards. Recolor a chart by re-mapping these tokens, not by editing chart code. |
| Accent | `accent-50` through `accent-950` | CTAs, selection states, links, focus. The brand ramp. |

## Type scale

Composite utilities, one per style-weight pair. Weights: `-regular`, `-medium`, `-semibold`, `-bold`.

Sizes below are this blueprint's (set in `styles/brand.css`; BoardUI's own ramp is
one step larger — 14px body, 24px title-1). Same style names, so nothing in a
component changes when the ramp does.

| Style | Size | Role |
| --- | --- | --- |
| `text-display-1` ... `text-display-4` | 44px down to 26px | Marketing hero type |
| `text-large-title-*` | 56px | Oversized landing headers |
| `text-title-1-*` | 22px | Page titles |
| `text-title-2-*` | 18px | Section headings |
| `text-title-3-*` | 16px | Card titles |
| `text-headline-*` | 15px | Emphasized body, lead paragraphs |
| `text-body-*` | 13px | Default UI text, buttons, inputs |
| `text-body-2-*` | 12px | Dense UI text |
| `text-caption-1-*` | 11px | Labels, meta text |
| `text-caption-2-*` | 10px | Smallest annotations |

Numerals are tabular everywhere (`body { font-variant-numeric: tabular-nums }`), so
KPI values, tables and timestamps align without a monospace face.

Typical pairings: `text-title-2-medium text-text-primary` for a section heading, `text-body-regular text-text-secondary` for supporting copy, `text-caption-1-semibold` for small labels. If a style seems missing, check `styles/typography.css` before stacking `text-sm font-medium` by hand: that combination is never correct in a BoardUI project.

## Dark mode

Light is `:root`; dark activates when `.dark` is on `<html>` (declared via `@custom-variant dark` in `styles/globals.css`). Because components only use semantic tokens, they need no `dark:` styling. Rule of thumb: if you are typing `dark:` followed by a color, stop and pick a better token.

**Dark is the default in this blueprint.** `index.html` puts `class="dark"` on `<html>` and, before first paint, reads the `boardui:theme` preference — writing `"dark"` when nothing is stored so the vendored `ThemeToggle` (which treats a missing key as light) agrees. Light stays a first-class mode: the toggle persists the choice and every token has both bindings. To ship light-first for a product, change the default string in that one script.

## House style — the "console" baseline

The product should read like an operations console (Palantir Foundry, Linear, the Timbal platform), not a marketing site. Everything below is a token override in `styles/brand.css`; nothing in `components/` was touched, so it survives `boardui:sync` and applies to vendored and project code alike.

| Axis | What `brand.css` sets | Why |
| --- | --- | --- |
| Surfaces (dark) | page `neutral-950`, cards `neutral-900`, wells `neutral-800`; borders `neutral-800`, hover `600` | Near-black ground with hairline separation; hierarchy by one shade, not by shadow |
| Surfaces (light) | page `neutral-50`, cards white | A grey ground makes white cards read as panels |
| Density | `--spacing: 0.21875rem` (3.5px, vs Tailwind's 4px) | Every padding, gap and control height shrinks 12.5% at once — 36px buttons become 31.5px — with all proportions kept |
| Radius | `xs 2 · sm 3 · md 4 · lg 6 · 2lg 6 · xl 8 · 2xl 12 · 3xl 16 · 4xl 20` (px) | A concentric ladder: each step down ≈ the padding between the two shapes at 3.5px/unit, so a `3xl` card with `p-2` wraps `xl` tiles, a `2xl` tile wraps `lg` controls, a `2lg` button wraps `md` chips. `rounded-full` stays for avatars and dots |
| Type | Ramp one step down (13px body), tabular numerals | See Type scale |
| Buttons | BoardUI's elevated two-stop gradients + `shadow-xs`, unchanged — except the primary, which is monochrome: charcoal in light (`neutral-700→800`, hover `600→700`, active `800→900`), white in dark (`white→neutral-200`, hover `white→100`, active `200→300`) with `neutral-900` ink. The Timbal runtime's `--primary` / `--primary-fill-*` follow the same stops through `styles/timbal-bridge.css` | The blue slab was the loudest thing on screen; a monochrome primary keeps hierarchy and leaves blue for selection, links and focus. Danger stays red |
| Colour | BoardUI's own: accent ramp, status chips (`lime` / `rose` / `yellow` / `cyan` / `purple`), chart palette, notification and calendar tints | The palette is the design system's signature; seriousness comes from surfaces, density, type and radius, not from desaturating it |
| Icons | Remix Icon (`@remixicon/react`), `Line` variants | BoardUI's set; `Fill` only where BoardUI uses it (stop control, alert glyphs) |

## Icons

Icons come from **`@remixicon/react`** (BoardUI's set). Use the outline `…Line` variant for chrome and rows; `…Fill` only where BoardUI itself does (`RiStopFill` on the composer's stop control, `RiAlertFill` in toasts, `RiAddFill` on primary buttons). Size through `className` (`size-4` in rows and buttons, `size-5` in nav rows and the composer). Never mix in a second icon family.

## Rebranding

- **Accent color**: the `--color-accent-*` ramp in `styles/theme.css` aliases a primitive ramp (blue by default). Point the eleven accent steps at another ramp, or paste literal values, and every CTA, link, focus ring, and selection state follows.
- **Runtime theme switching gotcha**: if you generate accent ramps at runtime (user-picked brand colors), write literal `oklch(...)` values into the CSS custom properties. Do not point them at `var()` references of other tokens; Tailwind's build only preserves what it can see statically.
- **Neutrals and semantics**: adjust the semantic layer, not component code. Example: to soften every card border, change `--color-border-button-default`, and both modes stay consistent if you update the `.dark` binding too.
- **Charts**: re-map `--color-chart-1` through `--color-chart-5` (and `-active`) to restyle every chart card at once.
- **Radius and density**: override `--radius-*` and `--spacing` in `styles/brand.css` `@theme` (values in House style above). Loosening for a consumer product means raising those two together (keep the ladder concentric), not adding `p-6`/`rounded-2xl` per component. Leave `rounded-full` for avatars and dots.
- **Dark muted text**: BoardUI leaves `--color-text-secondary` at 500 and sets tertiary to 600, which disappears on 800/900 surfaces. `brand.css` remaps secondary→400, tertiary/placeholder→500 and icon secondary/tertiary→400/500, and solidifies `--color-composer-panel-tab-background`.
- **Primary button colour**: `--gradient-button-primary-{default,hover,active}` in `:root` (light) and `.dark`, plus the scoped ink rule at the end of `brand.css` (`.dark .bg-button-primary … { color }` — the surface is white in dark, and `text-text-white` is shared with the red danger button, so the token cannot flip). To go back to BoardUI's blue-everywhere, set both gradients to the accent ramp, delete the ink rule, and point `--primary` in `timbal-bridge.css` at `--color-accent-600` again.

For the full current token values, read `styles/theme.css` in the project, or ask the BoardUI MCP server's `get_theme` tool for the live stylesheet contents.
