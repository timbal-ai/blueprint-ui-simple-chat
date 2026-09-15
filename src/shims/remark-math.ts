/**
 * `remark-math` with single-dollar inline math turned off.
 *
 * The Timbal runtime's `MarkdownText` wires `remarkMath` with its defaults, and
 * the default treats `$…$` as inline TeX. Product copy is full of currency —
 * "Priced at **$26,450** (… **$399/mo**)" — so everything between two prices
 * rendered as a KaTeX formula. Vite aliases `remark-math` to this file (see
 * vite.config.ts) so the runtime's own import picks it up without forking its
 * markdown component. `$$…$$` blocks and `\(…\)` / `\[…\]` still work.
 */
import remarkMath from "../../node_modules/remark-math/index.js";

type RemarkMathOptions = NonNullable<Parameters<typeof remarkMath>[0]>;

export default function remarkMathCurrencySafe(this: unknown, options?: RemarkMathOptions) {
  // remark plugins run with the processor as `this`; keep it.
  return (remarkMath as (this: unknown, options?: RemarkMathOptions) => unknown).call(this, {
    singleDollarTextMath: false,
    ...options,
  });
}
