# Critique rubric — score a screenshot before calling it done

Score each dimension 1–5 at **1280 and 375 px, light and dark**. Anything ≤ 2 is a
finding: fix it and re-shoot (max 3 rounds). Write the final scores in the turn
summary when gaps remain.

| # | Dimension | 5 looks like | 1 looks like |
|---|---|---|---|
| 1 | **Direction fidelity** | The screen matches `DESIGN.md`: chosen shell, accent visibly applied, density as decided, tone in copy and spacing | Default sidebar + default blue + template unchanged while DESIGN.md says otherwise |
| 2 | **Distinctiveness** | You could not mistake this for the previous project; the template's demo copy/data is gone; the composition serves THIS brief | Same shell, same accent, same cards as last time with new labels; lorem/"Board team" left in |
| 3 | **Hierarchy** | One clear primary action per screen; the answer to "what needs me?" in 5 s; numbers link to detail | Everything the same weight; uniform card soup; primary action buried |
| 4 | **Token discipline** | Only semantic tokens and composite type; dark mode reads correctly with no invisible text or muddy surfaces | Raw colors, hand-stacked type, white-on-light in dark mode |
| 5 | **Layout integrity** | No overflow, no clipped controls, aligned gutters, sheets/modals full-width on mobile, tables scroll in place | Horizontal scrollbar on the page, stacked sticky bars, a composer pushed below the fold |
| 6 | **States** | Loading is a skeleton of what's coming; empty states have one CTA; errors are visible and specific | Spinner in a void, blank regions, swallowed fetch errors |
| 7 | **Responsiveness (375)** | Shell becomes a drawer, grids stack, actions collapse into a menu, nothing hidden that matters | Desktop layout squeezed, text truncated, unreachable controls |
| 8 | **Motion & interaction** | Hover/focus/pressed states present; entrances subtle per `registry/motion.md`; reduced-motion respected | Dead hovers, no focus ring, jumpy layout shifts |
| 9 | **Copy** | Sentence case, domain-specific labels, no placeholder text | UPPERCASE headings, "Operations", "Lorem ipsum", "Click here" |
| 10 | **Chat contract** (when present) | Composer pinned, message list is the only scroller, attachments and stop visible when relevant, BoardUI chrome not a hand-rolled bubble list | Composer scrolls away, chat framed as a widget with a title, second message list |

Named failures (any instance = fix before returning): the previous project's
screen with new labels · default blue with a non-blue brand in `DESIGN.md` · a
chart legend/axis wall that duplicates the tooltip · a hand-rolled table,
calendar, gauge, composer or auth form when the registry has one · `useState`
page switching · raw colors.
