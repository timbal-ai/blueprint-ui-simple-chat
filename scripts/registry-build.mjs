#!/usr/bin/env node
/**
 * registry-build — generate the agent-facing component registry from source.
 *
 *   bun run registry:build            # writes registry/registry.json, registry/props.md, registry/templates.md
 *   bun run registry:build -- --check # CI drift check: exit 1 if the generated files differ from disk
 *
 * What it reads: every exported symbol under src/components/{base,application,foundations,timbal}/**
 * and src/pages/templates/*.tsx. Syntax-level only — one ts.createSourceFile per file, no
 * type-checker — so it finishes in well under a second and never touches node_modules types.
 *
 * What it writes:
 *   registry/registry.json  one item per export: kind, import path, summary, props (type text,
 *                           default, doc), tags, template membership; plus a `templates` block
 *   registry/props.md       the same, grouped layer → file, as tight markdown tables
 *   registry/templates.md   per template route: shell, component subtree, data files, how to adapt
 *
 * Known limits (by design, see the report in props.md's header):
 *  - Props typed via an IMPORTED type are recorded by their destructured names + defaults, with
 *    `propsType` / `propsFrom` pointing at the external type (members are not expanded).
 *  - `extends` clauses on external interfaces (e.g. ButtonHTMLAttributes) are kept as text.
 *  - `export *` re-exports are ignored; `export { a as b }` lists are resolved to the local
 *    declaration or recorded as a re-export (`reexportOf`).
 */
import ts from "typescript";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const REGISTRY_DIR = join(ROOT, "registry");
const CHECK = process.argv.includes("--check");

/** Layer → source root. Layer order below is the order used for output. */
const LAYERS = {
  base: "src/components/base",
  application: "src/components/application",
  foundations: "src/components/foundations",
  timbal: "src/components/timbal",
};
const TEMPLATES_DIR = "src/pages/templates";
const LAYER_ORDER = ["base", "application", "timbal", "foundations", "pages"];

const SUBTREE_DEPTH = 3;
const TYPE_TEXT_MAX = 160;
const SUMMARY_MAX = 200;
const SHAPE_MAX = 240;
const MD_DOC_MAX = 280;
const SKIP_FILE = /\.(d|test|spec|stories)\.tsx?$/;

/* ------------------------------------------------------------------ utils */

const posix = (p) => p.split("\\").join("/");
const stemOf = (p) => basename(p).replace(/\.[^.]+$/, "");
const pascal = (s) =>
  s
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
const isPascal = (n) => /^[A-Z][A-Za-z0-9]*$/.test(n) && /[a-z]/.test(n);
const isHookName = (n) => /^use[A-Z0-9]/.test(n);
const isUpperSnake = (n) => /^[A-Z][A-Z0-9_]*$/.test(n) && n.length > 1;
const collapse = (s) => s.replace(/\s+/g, " ").trim();
const cap = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const importFromOf = (rel) => "@/" + rel.replace(/^src\//, "").replace(/\.[^.]+$/, "");
const uniq = (arr) => [...new Set(arr)];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Resolve an import specifier to a repo-relative file path (only `@/` and relative specifiers). */
function resolveModule(spec, fromRel) {
  let base;
  if (spec.startsWith("@/")) base = join(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(ROOT, dirname(fromRel), spec);
  else return null;
  for (const cand of [base, `${base}.tsx`, `${base}.ts`, join(base, "index.tsx"), join(base, "index.ts")]) {
    if (existsSync(cand) && statSync(cand).isFile()) return posix(relative(ROOT, cand));
  }
  return null;
}

/* --------------------------------------------------------------- comments */

const IGNORED_COMMENT = /^(\/\*+|\/\/)\s*(eslint|@ts-|prettier|biome|oxlint|c8 |istanbul|v8 |#region|#endregion)/i;
const JSDOC_TAG_LINE =
  /^[ \t]*@(param|returns?|example|see|deprecated|default(Value)?|remarks|internal|public|private|typeParam|template|throws|since|todo|type|link|module|packageDocumentation)\b/m;

const rawComment = (sf, r) => sf.text.slice(r.pos, r.end);
/** Single-line `/* ------ section ------ *\/` dividers carry no documentation. */
const isDivider = (raw) => !raw.includes("\n") && /[-=─]{4,}/.test(raw);

function commentBody(raw) {
  if (raw.startsWith("/*")) {
    return raw
      .replace(/^\/\*+/, "")
      .replace(/\*+\/$/, "")
      .split("\n")
      .map((l) => l.replace(/^[ \t]*\*[ \t]?/, ""))
      .join("\n")
      .trim();
  }
  return raw.replace(/^\/\/[ \t]?/, "").trim();
}

/**
 * Leading comments of `node`, split into the group that touches it (no blank line in between —
 * that is the node's own doc) and the detached ones before it (file-level prose).
 */
function splitLeadingComments(sf, node) {
  const ranges = (ts.getLeadingCommentRanges(sf.text, node.getFullStart()) ?? []).filter((r) => {
    const raw = rawComment(sf, r);
    return !IGNORED_COMMENT.test(raw) && !isDivider(raw);
  });
  const attached = [];
  let boundary = node.getStart(sf);
  let i = ranges.length - 1;
  for (; i >= 0; i--) {
    const r = ranges[i];
    if (/\n[ \t]*\n/.test(sf.text.slice(r.end, boundary))) break;
    attached.unshift(r);
    boundary = r.pos;
    if (r.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      i--;
      break;
    }
  }
  return { attached, detached: ranges.slice(0, i + 1) };
}

function cleanDoc(s) {
  s = s.replace(/\r/g, "");
  const tag = s.search(JSDOC_TAG_LINE);
  if (tag >= 0) s = s.slice(0, tag);
  s = s.replace(/\{@link\s+([^}|\s]+)[^}]*\}/g, "$1");
  return s.trim();
}

/** The doc comment attached to `node` (JSDoc or `//` run), or a same-line trailing comment. */
function docOf(sf, node) {
  const { attached } = splitLeadingComments(sf, node);
  if (attached.length) return cleanDoc(attached.map((r) => commentBody(rawComment(sf, r))).join("\n"));
  const trailing = (ts.getTrailingCommentRanges(sf.text, node.end) ?? []).filter(
    (r) => !IGNORED_COMMENT.test(rawComment(sf, r)),
  );
  if (trailing.length) return cleanDoc(trailing.map((r) => commentBody(rawComment(sf, r))).join(" "));
  return "";
}

const ABBREVIATIONS = /^(e\.g|i\.e|vs|etc|cf|approx|no|fig|ca|resp|incl|min|max|px)\.$/i;

function splitSentences(s) {
  const out = [];
  let start = 0;
  const re = /[.!?](?=\s+[A-Z0-9"'`([*_])/g;
  let m;
  while ((m = re.exec(s))) {
    const before = s.slice(start, m.index + 1);
    const lastWord = before.match(/(\S+)$/)?.[1] ?? "";
    if (ABBREVIATIONS.test(lastWord) || /^\(?[A-Za-z]\.$/.test(lastWord)) continue;
    out.push(before.trim());
    start = m.index + 1;
  }
  const rest = s.slice(start).trim();
  if (rest) out.push(rest);
  return out;
}

/** First sentence of a doc, skipping Figma provenance lines, ≤ SUMMARY_MAX chars. */
function firstSentence(doc) {
  if (!doc) return "";
  const flat = collapse(doc.replace(/```[\s\S]*?```/g, " "));
  const sentences = splitSentences(flat);
  let i = 0;
  while (i < sentences.length && /^figma sources?\b/i.test(sentences[i])) i++;
  return cap(sentences[i] ?? sentences[0] ?? "", SUMMARY_MAX);
}

/* ------------------------------------------------------------ type text */

/** Source text of a type node: whitespace collapsed, bracket padding and a leading `|` removed, capped. */
const tidyType = (s) =>
  collapse(s)
    .replace(/([<([])\s+/g, "$1")
    .replace(/\s+([>)\],;])/g, "$1")
    .replace(/;\s*}/g, " }")
    .replace(/^\|\s*/, "");
const typeText = (node, sf) => cap(tidyType(node.getText(sf)), TYPE_TEXT_MAX);
const nameText = (name, sf) =>
  ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) || ts.isPrivateIdentifier(name) ? name.text : collapse(name.getText(sf));
/** Prop → its type node, kept out of the serialized item. */
const NODE_OF = new WeakMap();
const isBareRef = (node) => !!node && ts.isTypeReferenceNode(node) && !node.typeArguments && ts.isIdentifier(node.typeName);

/** Same-file type names referenced anywhere inside a type node. */
function typeRefsIn(node, ctx) {
  const out = [];
  if (!node) return out;
  const visit = (n) => {
    if (ts.isTypeReferenceNode(n) && ts.isIdentifier(n.typeName) && ctx.types.has(n.typeName.text)) out.push(n.typeName.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return uniq(out);
}

const COMPONENT_TYPE_NAMES = new Set([
  "FC",
  "VFC",
  "FunctionComponent",
  "VoidFunctionComponent",
  "ComponentType",
  "ComponentClass",
  "ForwardRefExoticComponent",
  "MemoExoticComponent",
  "NamedExoticComponent",
  "ForwardRefRenderFunction",
]);

function typeRefName(node) {
  if (!node || !ts.isTypeReferenceNode(node)) return null;
  const n = node.typeName;
  return ts.isIdentifier(n) ? n.text : ts.isQualifiedName(n) ? n.right.text : null;
}
const isComponentTypeRef = (node) => COMPONENT_TYPE_NAMES.has(typeRefName(node) ?? "");

function containsJsx(node) {
  let found = false;
  const visit = (n) => {
    if (found) return;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) {
      found = true;
      return;
    }
    if (ts.isCallExpression(n)) {
      const c = n.expression;
      const callee = ts.isIdentifier(c) ? c.text : ts.isPropertyAccessExpression(c) ? c.name.text : "";
      if (callee === "createElement" || callee === "jsx" || callee === "jsxs") {
        found = true;
        return;
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return found;
}

/* ---------------------------------------------------------- props model */

/** Add one interface/type-literal member to `acc` (first occurrence wins). */
function addMember(m, ctx, acc, from) {
  const { sf } = ctx;
  let name;
  let type;
  if (ts.isPropertySignature(m)) {
    name = nameText(m.name, sf);
    type = m.type ? typeText(m.type, sf) : "unknown";
  } else if (ts.isMethodSignature(m)) {
    name = nameText(m.name, sf);
    const params = m.parameters.map((p) => collapse(p.getText(sf))).join(", ");
    type = cap(`(${params}) => ${m.type ? collapse(m.type.getText(sf)) : "void"}`, TYPE_TEXT_MAX);
  } else if (ts.isIndexSignatureDeclaration(m)) {
    name = `[${m.parameters.map((p) => collapse(p.getText(sf))).join(", ")}]`;
    type = m.type ? typeText(m.type, sf) : "unknown";
  } else {
    return; // call / construct signatures
  }
  if (acc.props.some((p) => p.name === name)) return;
  const prop = { name, type, optional: !!m.questionToken };
  const doc = collapse(docOf(sf, m));
  if (doc) prop.doc = doc;
  if (from) prop.from = from;
  if (m.type) NODE_OF.set(prop, m.type);
  acc.props.push(prop);
}

/**
 * Same-file types a component's props point at: bare references to non-object aliases
 * (`variant?: ButtonVariant`) get their union inlined as `typeExpanded`; every referenced
 * type that is NOT exported is returned so the file can list it (the agent cannot import it).
 */
function annotateLocalTypes(props, ctx) {
  const candidates = new Map(); // name → { objectLike, nested }
  for (const p of props) {
    const node = NODE_OF.get(p);
    if (!node) continue;
    let inlined = null;
    if (isBareRef(node)) {
      const decl = ctx.types.get(node.typeName.text);
      if (decl && ts.isTypeAliasDeclaration(decl) && !isObjectLike(decl, ctx)) {
        p.typeExpanded = typeText(decl.type, ctx.sf);
        inlined = node.typeName.text;
      }
    }
    for (const name of typeRefsIn(node, ctx)) {
      if (ctx.exportedTypes.has(name)) continue;
      const c = candidates.get(name) ?? { objectLike: isObjectLike(ctx.types.get(name), ctx), nested: false };
      if (name !== inlined) c.nested = true;
      candidates.set(name, c);
    }
  }
  // Aliases that were inlined in every cell need no separate line; object shapes and nested refs do.
  return [...candidates.entries()].filter(([, c]) => c.objectLike || c.nested).map(([name]) => ({ name, type: localTypeShape(ctx.types.get(name), ctx) }));
}

function localTypeShape(decl, ctx) {
  if (ts.isTypeAliasDeclaration(decl) && !isObjectLike(decl, ctx)) return typeText(decl.type, ctx.sf);
  const acc = { props: [], extends: [] };
  collectFromDecl(decl, ctx, acc, new Set([decl.name.text]), null);
  return shapeOf({ props: acc.props, extends: acc.extends, type: ts.isTypeAliasDeclaration(decl) ? typeText(decl.type, ctx.sf) : undefined });
}

const LITERAL_KEYS = (node) => {
  const lits = [];
  const visit = (n) => {
    if (ts.isLiteralTypeNode(n) && ts.isStringLiteral(n.literal)) lits.push(n.literal.text);
    else if (ts.isUnionTypeNode(n)) n.types.forEach(visit);
    else if (ts.isParenthesizedTypeNode(n)) visit(n.type);
    else lits.push(null);
  };
  visit(node);
  return lits.includes(null) ? null : lits;
};

/** Flatten a type node into `acc.props` (same-file declarations) and `acc.extends` (external text). */
function collectFromTypeNode(node, ctx, acc, seen, from) {
  if (!node) return;
  const { sf } = ctx;
  if (ts.isParenthesizedTypeNode(node)) return collectFromTypeNode(node.type, ctx, acc, seen, from);
  if (ts.isTypeLiteralNode(node)) {
    for (const m of node.members) addMember(m, ctx, acc, from);
    return;
  }
  if (ts.isIntersectionTypeNode(node)) {
    for (const t of node.types) collectFromTypeNode(t, ctx, acc, seen, from);
    return;
  }
  if (ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName)) {
    const name = node.typeName.text;
    const args = node.typeArguments ?? [];
    const local = ctx.types.get(name);
    if (local) {
      if (!seen.has(name)) {
        seen.add(name);
        collectFromDecl(local, ctx, acc, seen, from ?? name);
      }
      return;
    }
    // Structural helpers over a same-file type can still be flattened syntactically.
    if ((name === "Omit" || name === "Pick") && args.length === 2 && typeRefName(args[0]) && ctx.types.has(typeRefName(args[0]))) {
      const keys = LITERAL_KEYS(args[1]);
      if (keys) {
        const inner = { props: [], extends: [] };
        collectFromTypeNode(args[0], ctx, inner, seen, from ?? typeRefName(args[0]));
        for (const p of inner.props) {
          const keep = name === "Omit" ? !keys.includes(p.name) : keys.includes(p.name);
          if (keep && !acc.props.some((q) => q.name === p.name)) acc.props.push(p);
        }
        acc.extends.push(...inner.extends.map((e) => `${name}<${e}, …>`));
        return;
      }
    }
    if ((name === "Partial" || name === "Required" || name === "Readonly" || name === "PropsWithChildren") && args.length === 1) {
      const inner = { props: [], extends: [] };
      collectFromTypeNode(args[0], ctx, inner, seen, from);
      for (const p of inner.props) {
        if (name === "Partial") p.optional = true;
        if (name === "Required") p.optional = false;
        if (!acc.props.some((q) => q.name === p.name)) acc.props.push(p);
      }
      if (name === "PropsWithChildren" && !acc.props.some((q) => q.name === "children")) {
        acc.props.push({ name: "children", type: "ReactNode", optional: true });
      }
      // Whatever could not be opened stays wrapped, e.g. `Partial<T>` for a type parameter.
      acc.extends.push(...inner.extends.map((e) => (name === "PropsWithChildren" ? e : `${name}<${e}>`)));
      return;
    }
  }
  acc.extends.push(typeText(node, sf));
}

function collectFromDecl(decl, ctx, acc, seen, from) {
  if (ts.isInterfaceDeclaration(decl)) {
    for (const m of decl.members) addMember(m, ctx, acc, from);
    for (const hc of decl.heritageClauses ?? []) {
      for (const t of hc.types) {
        const n = ts.isIdentifier(t.expression) ? t.expression.text : null;
        if (n && ctx.types.has(n)) {
          if (!seen.has(n)) {
            seen.add(n);
            collectFromDecl(ctx.types.get(n), ctx, acc, seen, n);
          }
        } else {
          acc.extends.push(typeText(t, ctx.sf));
        }
      }
    }
  } else if (ts.isTypeAliasDeclaration(decl)) {
    collectFromTypeNode(decl.type, ctx, acc, seen, from);
  }
}

/** Is this alias/interface something we can list members for (object-like)? */
function isObjectLike(node, ctx) {
  if (ts.isInterfaceDeclaration(node)) return true;
  const t = ts.isTypeAliasDeclaration(node) ? node.type : node;
  if (ts.isTypeLiteralNode(t) || ts.isIntersectionTypeNode(t)) return true;
  if (ts.isParenthesizedTypeNode(t)) return isObjectLike(t.type, ctx);
  if (ts.isTypeReferenceNode(t)) {
    const n = typeRefName(t);
    return ctx.types.has(n) || ["Omit", "Pick", "Partial", "Required", "Readonly", "PropsWithChildren"].includes(n);
  }
  return false;
}

/**
 * Resolve the props of a component/hook from its annotated type node (or a same-file declaration).
 * Returns { props, extends, propsType, propsFrom, external }.
 */
function resolveProps(typeNodeOrDecl, ctx) {
  const out = { props: [], extends: [], propsType: null, propsFrom: null, external: false };
  if (!typeNodeOrDecl) return out;
  const seen = new Set();
  if (ts.isInterfaceDeclaration(typeNodeOrDecl) || ts.isTypeAliasDeclaration(typeNodeOrDecl)) {
    out.propsType = typeNodeOrDecl.name.text;
    seen.add(out.propsType);
    collectFromDecl(typeNodeOrDecl, ctx, out, seen, null);
    return out;
  }
  const node = typeNodeOrDecl;
  const refName = typeRefName(node);
  if (refName && ctx.types.has(refName)) {
    out.propsType = refName;
    seen.add(refName);
    collectFromDecl(ctx.types.get(refName), ctx, out, seen, null);
    return out;
  }
  if (refName && ctx.imports.has(refName) && !["Omit", "Pick", "Partial", "Required", "Readonly", "PropsWithChildren"].includes(refName)) {
    const imp = ctx.imports.get(refName);
    out.propsType = typeText(node, ctx.sf);
    out.propsFrom = imp.module;
    out.external = true;
    return out;
  }
  collectFromTypeNode(node, ctx, out, seen, null);
  if (!out.props.length && out.extends.length === 1 && !ts.isTypeLiteralNode(node) && !ts.isIntersectionTypeNode(node)) {
    // A bare reference we could not open (global/ambient type): keep it as the props type name.
    out.propsType = out.extends[0];
    out.extends = [];
    out.external = true;
  }
  return out;
}

/** Fold destructured defaults (and names the type did not cover) into resolved props. */
function applyDestructuring(resolved, pattern, sf) {
  if (!pattern || !ts.isObjectBindingPattern(pattern)) return;
  for (const el of pattern.elements) {
    if (el.dotDotDotToken) continue;
    const key = el.propertyName ? nameText(el.propertyName, sf) : ts.isIdentifier(el.name) ? el.name.text : null;
    if (!key) continue;
    const def = el.initializer ? cap(collapse(el.initializer.getText(sf)), 80) : undefined;
    const existing = resolved.props.find((p) => p.name === key);
    if (existing) {
      if (def !== undefined) existing.default = def;
    } else {
      const prop = { name: key };
      if (def !== undefined) {
        prop.default = def;
        prop.optional = true;
      }
      prop.from = resolved.external ? resolved.propsType ?? "external" : resolved.extends[0] ?? "external";
      resolved.props.push(prop);
    }
  }
}

/* ------------------------------------------------------- value analysis */

const WRAPPERS = new Set(["memo", "forwardRef", "observer", "lazy"]);

/** Peel memo()/forwardRef()/parens/casts off an initializer to reach the function node. */
function unwrapFn(expr, ctx, depth = 0) {
  if (!expr || depth > 6) return { fn: null, wrapper: null };
  if (
    ts.isParenthesizedExpression(expr) ||
    ts.isAsExpression(expr) ||
    ts.isSatisfiesExpression(expr) ||
    ts.isTypeAssertionExpression(expr) ||
    ts.isNonNullExpression(expr)
  ) {
    return unwrapFn(expr.expression, ctx, depth + 1);
  }
  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) return { fn: expr, wrapper: null };
  if (ts.isCallExpression(expr)) {
    const c = expr.expression;
    const callee = ts.isIdentifier(c) ? c.text : ts.isPropertyAccessExpression(c) ? c.name.text : null;
    if (callee && WRAPPERS.has(callee)) {
      const inner = unwrapFn(expr.arguments[0], ctx, depth + 1);
      const wrapper = { name: callee, typeArgs: [...(expr.typeArguments ?? [])], inner: inner.wrapper };
      return { fn: inner.fn, wrapper };
    }
    return { fn: null, wrapper: null };
  }
  if (ts.isIdentifier(expr)) {
    const v = ctx.values.get(expr.text);
    if (v) {
      if (ts.isFunctionDeclaration(v.node)) return { fn: v.node, wrapper: null };
      if (ts.isVariableDeclaration(v.node)) return unwrapFn(v.node.initializer, ctx, depth + 1);
    }
  }
  return { fn: null, wrapper: null };
}

function firstParamIsProps(fn, sf) {
  const p = fn?.parameters[0];
  if (!p) return false;
  if (ts.isObjectBindingPattern(p.name)) return true;
  if (p.type && ts.isTypeLiteralNode(p.type)) return true;
  if (p.type && ts.isTypeReferenceNode(p.type) && /Props\b/.test(p.type.getText(sf))) return true;
  return false;
}

const returnsElement = (fn, sf) => !!fn?.type && /\b(ReactNode|ReactElement|JSX\.Element|Element)\b/.test(fn.type.getText(sf));

function signatureOf(fn, sf) {
  const params = fn.parameters.map((p) => collapse(p.getText(sf))).join(", ");
  const tp = fn.typeParameters?.length ? `<${fn.typeParameters.map((t) => collapse(t.getText(sf))).join(", ")}>` : "";
  return cap(`${tp}(${params})${fn.type ? ` => ${collapse(fn.type.getText(sf))}` : ""}`, TYPE_TEXT_MAX);
}

function unwrapExpr(e) {
  while (
    e &&
    (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isTypeAssertionExpression(e) || ts.isNonNullExpression(e))
  ) {
    e = e.expression;
  }
  return e;
}

/** Coarse type text for a non-function const without an annotation. */
function describeInitializer(init, sf) {
  const e = unwrapExpr(init);
  if (!e) return undefined;
  if (ts.isArrayLiteralExpression(e)) return `array(${e.elements.length})`;
  if (ts.isObjectLiteralExpression(e)) return "object";
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e) || ts.isTemplateExpression(e)) return "string";
  if (ts.isNumericLiteral(e)) return "number";
  if (e.kind === ts.SyntaxKind.TrueKeyword || e.kind === ts.SyntaxKind.FalseKeyword) return "boolean";
  if (ts.isNewExpression(e)) return cap(collapse(e.expression.getText(sf)), 60);
  if (ts.isCallExpression(e)) {
    const c = e.expression;
    const ta = e.typeArguments?.length ? `<${e.typeArguments.map((t) => collapse(t.getText(sf))).join(", ")}>` : "";
    return cap(`${collapse(c.getText(sf))}${ta}(…)`, 80);
  }
  if (ts.isIdentifier(e)) return `typeof ${e.text}`;
  return undefined;
}

/**
 * Demo/config datasets: anything in a `*-data.ts(x)` file, UPPER_SNAKE constants holding an
 * array/object literal (or a declared collection type), and `*Data`/`DEMO_*`-style literals.
 */
function isDataConst(name, init, typeAnn, rel, sf) {
  if (/-data\.tsx?$/.test(rel)) return true;
  const e = unwrapExpr(init);
  const literal = !!e && (ts.isArrayLiteralExpression(e) || ts.isObjectLiteralExpression(e));
  if (isUpperSnake(name)) {
    if (literal) return true;
    if (typeAnn && /(\[\]|^Array<|^Record<|^Readonly(Array|Map|Set)<|^Map<|^Set<)/.test(collapse(typeAnn.getText(sf)))) return true;
    return false;
  }
  return literal && /data|demo|mock|sample|fixture/i.test(name);
}

/* ------------------------------------------------------------ catalog */

/** BoardUI's vendored catalog: module → { title, description, install, primary export }. */
function parseCatalog(md) {
  const byModule = new Map();
  if (!md) return byModule;
  for (const sec of md.split(/^### /m).slice(1)) {
    const nl = sec.indexOf("\n");
    const title = sec.slice(0, nl).trim();
    const body = sec.slice(nl + 1);
    const description =
      body
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .find((p) => p && !p.startsWith("-") && !p.startsWith("```") && !/^Usage:/.test(p)) ?? "";
    const install = body.match(/npx boardui@latest add ([a-z0-9-]+)/)?.[1] ?? kebab(title);
    const mods = [];
    for (const m of body.matchAll(/import\s+(?:type\s+)?(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s+from\s+"(@\/components\/[^"]+)"/g)) {
      const names = [];
      if (m[1]) names.push(m[1]);
      if (m[2]) {
        for (const part of m[2].split(",")) {
          const n = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0];
          if (n) names.push(n);
        }
      }
      mods.push({ module: m[3], names });
    }
    const target =
      mods.find((m) => stemOf(m.module) === install) ??
      (mods.length === 1 ? mods[0] : mods.find((m) => stemOf(m.module).endsWith(install) || install.endsWith(stemOf(m.module))));
    if (!target) continue;
    const primary = target.names.find((n) => n === pascal(stemOf(target.module))) ?? target.names[0];
    if (!byModule.has(target.module)) byModule.set(target.module, { title, description, install, primary });
  }
  return byModule;
}

/* ------------------------------------------------------- file analysis */

function analyzeFile(rel, layer) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  const sf = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, rel.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const stem = stemOf(rel);
  const layerRoot = layer === "pages" ? TEMPLATES_DIR : LAYERS[layer];
  const segs = rel.slice(layerRoot.length + 1).split("/");
  const group = layer === "pages" ? "templates" : segs.length > 1 ? segs[0] : stem;

  const imports = new Map(); // local → { module, imported, isType, resolved }
  const importEdges = []; // { module, resolved, names, isType }
  const values = new Map(); // name → { node, statement }
  const types = new Map(); // name → declaration

  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) {
      const module = st.moduleSpecifier.text;
      const resolved = resolveModule(module, rel);
      const clause = st.importClause;
      const names = [];
      if (clause) {
        if (clause.name) {
          imports.set(clause.name.text, { module, imported: "default", isType: !!clause.isTypeOnly, resolved });
          names.push(clause.name.text);
        }
        const nb = clause.namedBindings;
        if (nb && ts.isNamespaceImport(nb)) {
          imports.set(nb.name.text, { module, imported: "*", isType: !!clause.isTypeOnly, resolved });
          names.push(`* as ${nb.name.text}`);
        } else if (nb) {
          for (const el of nb.elements) {
            const imported = (el.propertyName ?? el.name).text;
            imports.set(el.name.text, { module, imported, isType: !!clause.isTypeOnly || !!el.isTypeOnly, resolved });
            names.push(imported);
          }
        }
      }
      importEdges.push({ module, resolved, names, isType: !!clause?.isTypeOnly });
    } else if (ts.isFunctionDeclaration(st) && st.name) {
      values.set(st.name.text, { node: st, statement: st });
    } else if (ts.isVariableStatement(st)) {
      for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) values.set(d.name.text, { node: d, statement: st });
    } else if ((ts.isClassDeclaration(st) || ts.isEnumDeclaration(st)) && st.name) {
      values.set(st.name.text, { node: st, statement: st });
    } else if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) {
      types.set(st.name.text, st);
    }
  }

  const exportedTypes = new Set();
  for (const st of sf.statements) {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) ?? [] : [];
    if ((ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) && mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) exportedTypes.add(st.name.text);
    if (ts.isExportDeclaration(st) && !st.moduleSpecifier && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) if (types.has((el.propertyName ?? el.name).text)) exportedTypes.add((el.propertyName ?? el.name).text);
    }
  }
  const ctx = { sf, rel, imports, values, types, exportedTypes };

  // File-level prose: the first substantial block comment that is not the doc of an exported declaration.
  let fileDoc = "";
  for (const st of sf.statements) {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) ?? [] : [];
    const exported = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) || ts.isExportAssignment(st) || ts.isExportDeclaration(st);
    const { attached, detached } = splitLeadingComments(sf, st);
    const candidates = exported ? detached : [...detached, ...attached];
    for (const r of candidates) {
      if (r.kind !== ts.SyntaxKind.MultiLineCommentTrivia) continue;
      const body = cleanDoc(commentBody(rawComment(sf, r)));
      if (body.length < 40) continue;
      fileDoc = body;
      break;
    }
    if (fileDoc) break;
  }

  // Exports, in declaration order.
  const entries = [];
  let starReexports = 0;
  const push = (e) => entries.push(e);
  for (const st of sf.statements) {
    const mods = ts.canHaveModifiers(st) ? ts.getModifiers(st) ?? [] : [];
    const isExport = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = mods.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (ts.isFunctionDeclaration(st)) {
      if (isExport) push({ name: st.name?.text ?? pascal(stem), node: st, statement: st, isDefault });
    } else if (ts.isVariableStatement(st)) {
      if (!isExport) continue;
      for (const d of st.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) push({ name: d.name.text, node: d, statement: st });
        else {
          const visit = (n) => {
            if (ts.isIdentifier(n)) push({ name: n.text, node: d, statement: st, pattern: true });
            else if (ts.isBindingElement(n)) visit(n.name);
            else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) n.elements.forEach((el) => !ts.isOmittedExpression(el) && visit(el));
          };
          visit(d.name);
        }
      }
    } else if (ts.isClassDeclaration(st) || ts.isEnumDeclaration(st)) {
      if (isExport) push({ name: st.name?.text ?? pascal(stem), node: st, statement: st, isDefault });
    } else if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) {
      if (isExport) push({ name: st.name.text, node: st, statement: st, isTypeOnly: true });
    } else if (ts.isExportAssignment(st)) {
      if (st.isExportEquals) continue;
      const expr = unwrapExpr(st.expression);
      if (ts.isIdentifier(expr)) {
        const v = values.get(expr.text);
        const t = types.get(expr.text);
        if (v) push({ name: expr.text, node: v.node, statement: v.statement, isDefault: true, docNode: st });
        else if (t) push({ name: expr.text, node: t, statement: t, isTypeOnly: true, isDefault: true });
        else if (imports.has(expr.text)) {
          const imp = imports.get(expr.text);
          push({ name: expr.text, reexport: { name: imp.imported, from: imp.module, resolved: imp.resolved }, statement: st, isDefault: true });
        }
      } else {
        push({ name: pascal(stem), node: st.expression, statement: st, isDefault: true, isExpr: true });
      }
    } else if (ts.isExportDeclaration(st)) {
      if (!st.exportClause || ts.isNamespaceExport(st.exportClause)) {
        starReexports++;
        continue;
      }
      for (const el of st.exportClause.elements) {
        const exported = el.name.text;
        const local = (el.propertyName ?? el.name).text;
        const isTypeOnly = !!st.isTypeOnly || !!el.isTypeOnly;
        if (st.moduleSpecifier) {
          const module = st.moduleSpecifier.text;
          push({ name: exported, reexport: { name: local, from: module, resolved: resolveModule(module, rel) }, isTypeOnly, statement: st });
          continue;
        }
        const v = values.get(local);
        const t = types.get(local);
        if (isTypeOnly && t) push({ name: exported, node: t, statement: t, isTypeOnly: true, alias: local !== exported ? local : undefined });
        else if (v) push({ name: exported, node: v.node, statement: v.statement, alias: local !== exported ? local : undefined });
        else if (t) push({ name: exported, node: t, statement: t, isTypeOnly: true, alias: local !== exported ? local : undefined });
        else if (imports.has(local)) {
          const imp = imports.get(local);
          push({
            name: exported,
            reexport: { name: imp.imported, from: imp.module, resolved: imp.resolved },
            isTypeOnly: isTypeOnly || imp.isType,
            statement: st,
          });
        } else push({ name: exported, unresolved: true, statement: st });
      }
    }
  }

  const importFrom = importFromOf(rel);
  const items = entries.map((e) => buildItem(e, ctx, { rel, layer, group, importFrom, stem }));

  // Props types → mark them as "props of X" and avoid duplicating their members.
  for (const it of items) {
    if ((it.kind !== "component" && it.kind !== "hook") || !it.propsTypeLocal) continue;
    const t = items.find((x) => x.kind === "type" && x.name === it.propsTypeLocal);
    if (t) {
      t.propsOf = [...(t.propsOf ?? []), it.name];
      t.props = [];
    }
  }
  for (const it of items) {
    if (it.propsOf && !it.summary) it.summary = `Props of ${it.propsOf.map((n) => `\`${n}\``).join(", ")}.`;
    delete it.propsTypeLocal;
  }

  return {
    rel,
    layer,
    group,
    stem,
    importFrom,
    sf,
    ctx,
    fileDoc,
    importEdges,
    items,
    starReexports,
    parseErrors: sf.parseDiagnostics?.length ?? 0,
  };
}

/* -------------------------------------------------------- item builder */

function buildItem(entry, ctx, file) {
  const { sf } = ctx;
  const item = {
    name: entry.name,
    kind: "util",
    path: file.rel,
    importFrom: file.importFrom,
    layer: file.layer,
    group: file.group,
    summary: "",
    props: [],
    tags: uniq([file.layer, file.group, file.stem, kebab(entry.name)]),
  };
  if (entry.isDefault) item.isDefault = true;
  if (entry.alias) item.localName = entry.alias;

  if (entry.reexport) {
    const { name, from, resolved } = entry.reexport;
    const fromDisplay = resolved ? importFromOf(resolved) : from;
    item.kind = entry.isTypeOnly ? "type" : isHookName(entry.name) ? "hook" : isPascal(entry.name) ? "component" : isUpperSnake(entry.name) ? "data" : "util";
    item.summary = `Re-export of \`${name}\` from \`${fromDisplay}\`.`;
    item.reexportOf = { name, from: fromDisplay };
    return item;
  }
  if (entry.unresolved) {
    item.summary = "(export target not found in file)";
    return item;
  }

  const node = entry.node;
  const docSource = entry.docNode ?? entry.statement ?? node;
  const doc = docOf(sf, docSource) || (entry.docNode ? docOf(sf, entry.statement) : "");
  item.summary = firstSentence(doc);

  // ---- types
  if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    item.kind = "type";
    if (node.typeParameters?.length) item.typeParams = node.typeParameters.map((t) => collapse(t.getText(sf)));
    if (isObjectLike(node, ctx)) {
      const acc = { props: [], extends: [] };
      collectFromDecl(node, ctx, acc, new Set([node.name.text]), null);
      item.props = acc.props;
      if (acc.extends.length) item.extends = acc.extends;
    }
    if (ts.isTypeAliasDeclaration(node)) item.type = typeText(node.type, sf);
    return item;
  }

  // ---- enums / classes
  if (ts.isEnumDeclaration(node)) {
    item.type = `enum { ${node.members.map((m) => nameText(m.name, sf)).join(", ")} }`;
    return item;
  }
  if (ts.isClassDeclaration(node)) {
    const heritage = node.heritageClauses?.flatMap((h) => h.types) ?? [];
    const base = heritage[0];
    if (base && /Component$/.test(collapse(base.expression.getText(sf))) && isPascal(entry.name)) {
      item.kind = "component";
      const r = resolveProps(base.typeArguments?.[0], ctx);
      Object.assign(item, propsFields(r));
    } else {
      item.type = `class${base ? ` extends ${typeText(base, sf)}` : ""}`;
    }
    return item;
  }

  // ---- values
  let fn = null;
  let wrapper = null;
  let typeAnn = null;
  let init = null;
  if (ts.isFunctionDeclaration(node)) fn = node;
  else if (ts.isVariableDeclaration(node)) {
    typeAnn = node.type ?? null;
    init = node.initializer ?? null;
    if (!entry.pattern) ({ fn, wrapper } = unwrapFn(init, ctx));
  } else if (entry.isExpr) ({ fn, wrapper } = unwrapFn(node, ctx));

  const name = entry.alias ?? entry.name;

  if (fn && isHookName(name)) {
    item.kind = "hook";
    const props = [];
    const ext = [];
    for (const p of fn.parameters) {
      if (ts.isObjectBindingPattern(p.name)) {
        const r = p.type ? resolveProps(p.type, ctx) : { props: [], extends: [], propsType: null, propsFrom: null, external: true };
        applyDestructuring(r, p.name, sf);
        props.push(...r.props);
        ext.push(...r.extends);
        if (r.propsType && !r.external && !item.propsTypeLocal) item.propsTypeLocal = r.propsType;
        if (r.external) {
          item.propsType = r.propsType;
          if (r.propsFrom) item.propsFrom = r.propsFrom;
        }
      } else {
        const prop = { name: nameText(p.name, sf) };
        if (p.type) {
          prop.type = typeText(p.type, sf);
          NODE_OF.set(prop, p.type);
        }
        prop.optional = !!p.questionToken || !!p.initializer;
        if (p.initializer) prop.default = cap(collapse(p.initializer.getText(sf)), 80);
        const pd = collapse(docOf(sf, p));
        if (pd) prop.doc = pd;
        props.push(prop);
      }
    }
    item.props = props;
    if (ext.length) item.extends = uniq(ext);
    if (fn.typeParameters?.length) item.typeParams = fn.typeParameters.map((t) => collapse(t.getText(sf)));
    if (fn.type) item.returns = typeText(fn.type, sf);
    const local = annotateLocalTypes(item.props, ctx);
    if (local.length) item.localTypes = local;
    return item;
  }

  // `export const ModalTrigger = AriaDialogTrigger;` — an alias of an imported symbol.
  if (!fn && init && ts.isIdentifier(unwrapExpr(init)) && ctx.imports.has(unwrapExpr(init).text) && !ctx.values.has(unwrapExpr(init).text)) {
    const imp = ctx.imports.get(unwrapExpr(init).text);
    const fromDisplay = imp.resolved ? importFromOf(imp.resolved) : imp.module;
    item.kind = isHookName(name) ? "hook" : isPascal(name) ? "component" : isUpperSnake(name) ? "data" : "util";
    if (!item.summary) item.summary = `Alias of \`${imp.imported}\` from \`${fromDisplay}\`.`;
    item.reexportOf = { name: imp.imported, from: fromDisplay };
    if (typeAnn) item.type = typeText(typeAnn, sf);
    return item;
  }

  const componentTyped = !!typeAnn && isComponentTypeRef(typeAnn);
  const looksComponent =
    isPascal(name) &&
    ((fn && (containsJsx(fn.body ?? fn) || firstParamIsProps(fn, sf) || returnsElement(fn, sf))) || componentTyped || (!!wrapper && (fn || wrapper.name === "lazy")));

  if (looksComponent) {
    item.kind = "component";
    let typeNode = null;
    for (let w = wrapper; w && !typeNode; w = w.inner) {
      if (w.name === "forwardRef" && w.typeArgs[1]) typeNode = w.typeArgs[1];
      if (w.name === "memo" && w.typeArgs[0]) typeNode = w.typeArgs[0];
    }
    if (!typeNode && componentTyped && typeAnn.typeArguments?.[0]) typeNode = typeAnn.typeArguments[0];
    const param = fn?.parameters[0];
    if (!typeNode && param?.type) typeNode = param.type;
    if (!typeNode && ctx.types.has(`${name}Props`)) typeNode = ctx.types.get(`${name}Props`);
    const r = resolveProps(typeNode, ctx);
    if (param) applyDestructuring(r, param.name, sf);
    if (!typeNode && param && ts.isObjectBindingPattern(param.name)) r.external = true;
    Object.assign(item, propsFields(r));
    if (wrapper) item.wrapper = wrapperChain(wrapper);
    if (fn?.typeParameters?.length) item.typeParams = fn.typeParameters.map((t) => collapse(t.getText(sf)));
    const local = annotateLocalTypes(item.props, ctx);
    if (local.length) item.localTypes = local;
    return item;
  }

  if (fn) {
    item.kind = "util";
    item.type = signatureOf(fn, sf);
    return item;
  }

  // Non-function const.
  if (typeAnn) item.type = typeText(typeAnn, sf);
  else {
    const d = describeInitializer(init, sf);
    if (d) item.type = d;
  }
  item.kind = isDataConst(name, init, typeAnn, file.rel, sf) ? "data" : "util";
  return item;
}

function wrapperChain(w) {
  const parts = [];
  for (let x = w; x; x = x.inner) parts.push(x.name);
  return parts.join("(") + ")".repeat(Math.max(0, parts.length - 1));
}

function propsFields(r) {
  const out = { props: r.props };
  if (r.extends.length) out.extends = uniq(r.extends);
  if (r.propsType && !r.external) out.propsTypeLocal = r.propsType;
  if (r.external) {
    out.propsType = r.propsType ?? undefined;
    if (r.propsFrom) out.propsFrom = r.propsFrom;
    out.propsExternal = true;
  }
  return out;
}

/* -------------------------------------------------------- templates */

function jsxTagName(tag) {
  return ts.isIdentifier(tag) ? tag.text : ts.isPropertyAccessExpression(tag) ? collapse(tag.getText()) : null;
}

/** All JSX elements in a source file: { name, node (opening/self-closing), attrs: [{name, value}] }. */
function jsxElementsOf(sf) {
  const out = [];
  const visit = (n) => {
    if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
      const name = jsxTagName(n.tagName);
      if (name) {
        const attrs = [];
        for (const a of n.attributes.properties) {
          if (!ts.isJsxAttribute(a)) continue;
          const an = ts.isIdentifier(a.name) ? a.name.text : collapse(a.name.getText(sf));
          let value = null;
          if (!a.initializer) value = "true";
          else if (ts.isStringLiteral(a.initializer)) value = JSON.stringify(a.initializer.text);
          else if (ts.isJsxExpression(a.initializer) && a.initializer.expression) value = `{${cap(collapse(a.initializer.expression.getText(sf)), 40)}}`;
          attrs.push({ name: an, value });
        }
        out.push({ name, node: n, attrs });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

function analyzeTemplates(files, byRel) {
  const pages = files.filter((f) => f.layer === "pages").sort((a, b) => a.rel.localeCompare(b.rel));
  const templates = [];
  for (const page of pages) {
    const slug = page.stem;
    const pageItem = page.items.find((i) => i.isDefault) ?? page.items.find((i) => i.kind === "component");
    const elements = jsxElementsOf(page.sf);
    let shellEl = null;
    let shellImp = null;
    for (const el of elements) {
      const imp = page.ctx.imports.get(el.name);
      if (imp?.resolved?.startsWith("src/components/application/")) {
        shellEl = el;
        shellImp = imp;
        break;
      }
    }
    if (!shellEl) {
      for (const el of elements) {
        const imp = page.ctx.imports.get(el.name);
        if (imp?.resolved?.startsWith("src/components/")) {
          shellEl = el;
          shellImp = imp;
          break;
        }
      }
    }
    const shellFile = shellImp ? byRel.get(shellImp.resolved) : null;
    const shellItem = shellFile?.items.find((i) => i.name === shellImp.imported) ?? shellFile?.items.find((i) => i.kind === "component");
    const mountedAs = shellEl ? `<${shellEl.name}${shellEl.attrs.map((a) => ` ${a.name}${a.value === "true" ? "" : `=${a.value}`}`).join("")} />` : null;
    const domain = shellFile && shellFile.layer === "application" ? shellFile.group : null;

    // Walk the import graph from the shell (files under src/components only).
    const modules = new Map(); // rel → { rel, depth, names:Set }
    if (shellFile) {
      const queue = [{ rel: shellFile.rel, depth: 0 }];
      modules.set(shellFile.rel, { rel: shellFile.rel, depth: 0, names: new Set([shellItem?.name ?? shellImp.imported]) });
      while (queue.length) {
        const cur = queue.shift();
        const f = byRel.get(cur.rel);
        if (!f) continue;
        for (const edge of f.importEdges) {
          if (!edge.resolved || !edge.resolved.startsWith("src/components/")) continue;
          let m = modules.get(edge.resolved);
          if (!m) {
            m = { rel: edge.resolved, depth: cur.depth + 1, names: new Set() };
            modules.set(edge.resolved, m);
            queue.push({ rel: edge.resolved, depth: cur.depth + 1 });
          }
          edge.names.forEach((n) => m.names.add(n));
        }
      }
    }
    const moduleList = [...modules.values()]
      .filter((m) => m.rel !== shellFile?.rel)
      .sort((a, b) => a.rel.localeCompare(b.rel))
      .map((m) => {
        const f = byRel.get(m.rel);
        return {
          importFrom: importFromOf(m.rel),
          path: m.rel,
          layer: f?.layer ?? "other",
          group: f?.group ?? "",
          depth: m.depth,
          names: [...m.names].sort(),
        };
      });

    // Data files in the shell's domain.
    const dataFiles = domain
      ? files
          .filter((f) => f.layer === "application" && f.group === domain && /-data\.tsx?$/.test(f.rel))
          .map((f) => describeDataFile(f))
      : [];

    // Sidebar hints for "how to adapt".
    const sidebarModule = moduleList.find((m) => /-sidebar$/.test(stemOf(m.path)));
    const sidebarFile = sidebarModule ? byRel.get(sidebarModule.path) : null;
    const navItem = sidebarFile?.items.find((i) => i.kind === "data" && /nav/i.test(i.name));
    // The string attrs the shell passes to its sidebar (`selected="finance"`) — styling/a11y attrs excluded.
    const isStateAttr = (a) => a.value && a.value.startsWith('"') && !/^(className|class|id|key|role|style|aria-.*|data-.*)$/.test(a.name);
    const sidebarEl = shellFile ? jsxElementsOf(shellFile.sf).find((el) => /Sidebar$/.test(el.name) && el.attrs.some(isStateAttr)) : null;
    const sidebarAttrs = sidebarEl ? uniq(sidebarEl.attrs.filter(isStateAttr).map((a) => `${a.name}=${a.value}`)) : [];

    const cards = moduleList.filter((m) => /-cards?$/.test(stemOf(m.path)));
    templates.push({
      slug,
      route: `/templates/${slug}`,
      domain,
      summary: pageItem?.summary || shellItem?.summary || "",
      page: { path: page.rel, importFrom: page.importFrom, export: pageItem?.name ?? null, isDefault: !!pageItem?.isDefault },
      shell: shellFile
        ? {
            name: shellItem?.name ?? shellImp.imported,
            path: shellFile.rel,
            importFrom: shellFile.importFrom,
            mountedAs,
            summary: shellItem?.summary ?? "",
            props: shellItem?.props ?? [],
          }
        : null,
      modules: moduleList,
      cards: cards.map((c) => c.importFrom),
      dataFiles,
      sidebar: sidebarModule
        ? {
            importFrom: sidebarModule.importFrom,
            path: sidebarModule.path,
            navConst: navItem?.name ?? null,
            navType: navItem?.type ?? null,
            shellAttrs: sidebarAttrs,
          }
        : null,
    });
  }
  return templates;
}

/** Referenced type names in a type node, resolved to same-file exports or imports. */
function shapeRefs(typeNode, f) {
  const refs = [];
  if (!typeNode) return refs;
  const visit = (n) => {
    if (ts.isTypeReferenceNode(n) && ts.isIdentifier(n.typeName)) {
      const name = n.typeName.text;
      if (f.ctx.types.has(name)) refs.push({ name, from: f.importFrom, local: true });
      else if (f.ctx.imports.has(name)) refs.push({ name, from: f.ctx.imports.get(name).module });
    }
    ts.forEachChild(n, visit);
  };
  visit(typeNode);
  return refs;
}

function describeDataFile(f) {
  const shapes = [];
  const data = [];
  const helpers = [];
  const types = [];
  for (const it of f.items) {
    if (it.kind === "data") {
      data.push({ name: it.name, type: it.type ?? null });
      const decl = f.ctx.values.get(it.localName ?? it.name);
      if (decl && ts.isVariableDeclaration(decl.node) && decl.node.type) {
        for (const r of shapeRefs(decl.node.type, f)) {
          const from = r.from.startsWith(".") ? importFromOf(resolveModule(r.from, f.rel) ?? r.from) : r.from;
          if (!shapes.some((s) => s.name === r.name && s.from === from)) shapes.push({ name: r.name, from });
        }
      }
    } else if (it.kind === "type") types.push(it.name);
    else if (it.kind === "util" || it.kind === "hook") helpers.push({ name: it.name, type: it.type ?? null });
  }
  for (const t of types) if (!shapes.some((s) => s.name === t)) shapes.push({ name: t, from: f.importFrom });
  return { path: f.rel, importFrom: f.importFrom, summary: firstSentence(f.fileDoc), data, helpers, types, shapes };
}

/* ------------------------------------------------------------ render */

function code(s) {
  if (s === undefined || s === null || s === "") return "";
  const str = String(s);
  if (!str.includes("`")) return `\`${str}\``;
  return `\`\` ${str} \`\``;
}
/** Table cells: pipes must be escaped (GFM honours `\|` there, even inside code spans). */
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const codeCell = (s) => (s === undefined || s === null || s === "" ? "" : cell(code(s)));
/** Prose lines: no pipe escaping — outside tables a `\|` inside a code span renders literally. */
const inline = (s) => String(s ?? "").replace(/\n/g, " ");

function shapeOf(it) {
  if (it.props?.length) {
    const members = it.props.map((p) => `${p.name}${p.optional ? "?" : ""}: ${p.type ?? "unknown"}`).join("; ");
    const ext = it.extends?.length ? ` & ${it.extends.join(" & ")}` : "";
    return cap(`{ ${members} }${ext}`, SHAPE_MAX);
  }
  if (it.type) return cap(it.type, SHAPE_MAX);
  if (it.extends?.length) return cap(it.extends.join(" & "), SHAPE_MAX);
  return "";
}

function renderEntry(it, lines, exportedTypeNames) {
  const title = it.kind === "hook" ? `${it.name}()` : it.name;
  lines.push(`**${title}**${it.summary ? ` — ${inline(it.summary)}` : ""}`);
  const meta = [];
  if (it.isDefault) meta.push("default export");
  if (it.wrapper) meta.push(`wrapped in ${code(it.wrapper)}`);
  if (it.typeParams?.length) meta.push(`generic ${code(`<${it.typeParams.join(", ")}>`)}`);
  if (it.returns) meta.push(`returns ${code(it.returns)}`);
  if (meta.length) lines.push(meta.join(" · "));
  if (it.extends?.length) lines.push(`Extends: ${it.extends.map((e) => inline(code(e))).join(", ")}`);
  if (it.propsExternal) {
    const src = it.propsType ? `${code(it.propsType)}${it.propsFrom ? ` from ${code(it.propsFrom)}` : ""} (external — members not indexed)` : "untyped";
    const destructured = it.props.length
      ? `; destructured: ${it.props.map((p) => `${code(p.name)}${p.default !== undefined ? ` = ${code(p.default)}` : ""}`).join(", ")}`
      : "";
    lines.push(`Props: ${inline(src + destructured)}`);
    lines.push("");
    return;
  }
  if (!it.props.length) {
    lines.push(it.kind === "hook" ? "No parameters." : it.extends?.length ? "No own props — accepts everything in Extends." : "No props.");
    lines.push("");
    return;
  }
  lines.push(`| ${it.kind === "hook" ? "param" : "prop"} | type | default | doc |`);
  lines.push("|---|---|---|---|");
  for (const p of it.props) {
    const name = `${p.name}${p.optional ? "?" : ""}`;
    // Non-exported same-file aliases are inlined (the agent cannot import the name); exported ones
    // keep their name — their shape is on the file's `Types:` line.
    const shown = p.typeExpanded && !exportedTypeNames.has(p.type) ? p.typeExpanded : p.type;
    const type = shown ? codeCell(shown) : "—";
    const doc = p.doc ? cell(cap(p.doc, MD_DOC_MAX)) : !p.type && p.from ? "(inherited)" : "";
    lines.push(`| ${cell(name)} | ${type} | ${codeCell(p.default)} | ${doc} |`);
  }
  lines.push("");
}

function renderReexports(items) {
  const groups = new Map();
  for (const it of items) {
    const key = it.reexportOf.from;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(it);
  }
  return [...groups.entries()]
    .map(
      ([from, its]) =>
        `from ${code(from)}: ${its.map((i) => `${code(i.name)}${i.reexportOf.name !== i.name && i.reexportOf.name !== "default" ? ` (= ${code(i.reexportOf.name)})` : ""}`).join(", ")}`,
    )
    .join(" · ");
}

function renderPropsMd(files, meta) {
  const all = files.flatMap((f) => f.items);
  const nComponents = all.filter((i) => i.kind === "component").length;
  const nHooks = all.filter((i) => i.kind === "hook").length;
  const lines = [];
  lines.push("# Component props index (generated — do not edit; `bun run registry:build`)", "");
  lines.push(`BoardUI ${meta.boardui} · ${nComponents} components · ${nHooks} hooks · generated ${meta.date}`, "");
  lines.push(
    "How to read: import path, one-line summary, then props (name · type · default · doc). Props with `?` are optional. " +
      "Types are source text (≤ 160 chars, `…` = truncated); same-file union aliases are inlined. `Extends:` lists external " +
      "interfaces the props inherit from (not expanded — e.g. every `ButtonHTMLAttributes` prop is accepted); a `—` type with " +
      "`(inherited)` is a prop the component destructures from one of those. Components whose props type comes from another " +
      "package show `Props:` with the destructured names instead of a table. After the tables: `Local types` (same-file, not " +
      "exported), `Types:` (exported type shapes), `Data:` (demo datasets), `Other exports:` (helpers), `Re-exports:`. " +
      "Machine-readable twin: `registry.json` (same items, plus `templates`).",
    "",
  );
  for (const layer of LAYER_ORDER) {
    const layerFiles = files.filter((f) => f.layer === layer && f.items.length);
    if (!layerFiles.length) continue;
    lines.push(`## ${layer}`, "");
    for (const f of layerFiles) {
      lines.push(`### ${f.group} — ${code(f.importFrom)}`);
      if (f.template) lines.push(`Template: /templates/${f.template} (see templates.md)`);
      lines.push("");
      const reexports = f.items.filter((i) => i.reexportOf);
      const main = f.items.filter((i) => (i.kind === "component" || i.kind === "hook") && !i.reexportOf);
      const exportedTypeNames = new Set(f.items.filter((i) => i.kind === "type").map((i) => i.name));
      for (const it of main) renderEntry(it, lines, exportedTypeNames);
      const typeItems = f.items.filter((i) => i.kind === "type" && !i.propsOf && !i.reexportOf);
      const propsTypes = f.items.filter((i) => i.kind === "type" && i.propsOf);
      const dataItems = f.items.filter((i) => i.kind === "data" && !i.reexportOf);
      const others = f.items.filter(
        (i) => !main.includes(i) && !typeItems.includes(i) && !propsTypes.includes(i) && !dataItems.includes(i) && !reexports.includes(i),
      );
      const tail = [];
      const localTypes = [];
      for (const it of main) for (const l of it.localTypes ?? []) if (!localTypes.some((x) => x.name === l.name)) localTypes.push(l);
      if (localTypes.length) {
        tail.push(`Local types (not exported): ${localTypes.map((t) => `${code(t.name)} = ${inline(code(t.type))}`).join(" · ")}`);
      }
      if (typeItems.length) {
        tail.push(
          `Types: ${typeItems
            .map((t) => {
              const shape = shapeOf(t);
              return `${code(t.name)}${shape ? ` = ${inline(code(shape))}` : ""}`;
            })
            .join(" · ")}`,
        );
      }
      if (dataItems.length) {
        tail.push(`Data: ${dataItems.map((d) => `${code(d.name)}${d.type ? `: ${inline(code(d.type))}` : ""}`).join(" · ")}`);
      }
      const otherParts = [
        ...propsTypes.map((t) => `${code(t.name)} (props of ${t.propsOf.join(", ")})`),
        ...others.map((o) => {
          if (o.kind === "util" && o.type && /^(<|\()/.test(o.type)) return inline(code(`${o.name}${o.type}`));
          return `${code(o.name)}${o.type ? `: ${inline(code(o.type))}` : ""}`;
        }),
      ];
      if (otherParts.length) tail.push(`Other exports: ${otherParts.join(" · ")}`);
      if (reexports.length) tail.push(`Re-exports: ${renderReexports(reexports)}`);
      if (tail.length) lines.push(...tail, "");
    }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function renderTemplatesMd(templates, files) {
  const lines = [];
  lines.push("# Templates (generated — do not edit; `bun run registry:build`)", "");
  lines.push(
    "BoardUI Pro template routes mounted by `src/App.tsx` (dev / `VITE_TEMPLATES`). Each page under `src/pages/templates/` " +
      "renders exactly one shell from `src/components/application/<domain>/<domain>-shell.tsx`; the shell composes the cards, " +
      "tables and sidebar listed below and reads its demo data from the domain's `*-data.ts(x)` file. Fork the shell, don't rebuild it. " +
      "Props for every module are in `props.md`.",
    "",
  );
  lines.push(`| slug | route | domain | what's inside | modules (≤ depth ${SUBTREE_DEPTH} / all) | cards |`);
  lines.push("|---|---|---|---|---|---|");
  for (const t of templates) {
    const near = t.modules.filter((m) => m.depth <= SUBTREE_DEPTH).length;
    lines.push(`| ${t.slug} | ${code(t.route)} | ${t.domain ?? "—"} | ${cell(t.summary)} | ${near} / ${t.modules.length} | ${t.cards.length} |`);
  }
  lines.push("");
  for (const t of templates) {
    lines.push(`## ${t.slug} — ${code(t.route)}`, "");
    if (t.summary) lines.push(inline(t.summary), "");
    lines.push(`- Page: ${code(t.page.path)}${t.page.export ? ` (${t.page.isDefault ? "default export " : ""}${code(t.page.export)})` : ""}`);
    if (t.shell) {
      lines.push(`- Shell: ${code(t.shell.name)} from ${code(t.shell.importFrom)} — ${code(t.shell.path)}${t.shell.mountedAs ? `, mounted as ${code(t.shell.mountedAs)}` : ""}`);
      if (t.shell.summary) lines.push(`- Shell doc: ${inline(t.shell.summary)}`);
      if (t.shell.props.length) {
        lines.push(
          `- Shell props: ${t.shell.props
            .map((p) => `${code(`${p.name}${p.optional ? "?" : ""}${p.type ? `: ${p.type}` : ""}${p.default !== undefined ? ` = ${p.default}` : ""}`)}`)
            .join(", ")}`,
        );
      }
    } else {
      lines.push("- Shell: (no `@/components` shell found in the page)");
    }
    lines.push("");

    lines.push(`### Component subtree (imports walked to depth ${SUBTREE_DEPTH})`, "");
    const shown = t.modules.filter((m) => m.depth <= SUBTREE_DEPTH);
    const deeper = t.modules.length - shown.length;
    for (const layer of LAYER_ORDER) {
      const mods = shown.filter((m) => m.layer === layer);
      if (!mods.length) continue;
      lines.push(`**${layer}**`);
      for (const m of mods) {
        const f = files.find((x) => x.rel === m.path);
        const exportsHere = f ? f.items.filter((i) => m.names.includes(i.name)) : [];
        const names = m.names.length ? m.names.map((n) => code(n)).join(", ") : "(side-effect import)";
        const kinds = exportsHere.length ? ` — ${uniq(exportsHere.map((i) => i.kind)).join("/")}` : "";
        lines.push(`- ${code(m.importFrom)} → ${names}${kinds}${m.depth > 1 ? ` (depth ${m.depth})` : ""}`);
      }
      lines.push("");
    }
    if (deeper > 0) lines.push(`_${deeper} more module(s) below depth ${SUBTREE_DEPTH} — see \`registry.json\` → templates[].modules._`, "");
    if (!shown.length) lines.push("_(no `@/components` imports)_", "");

    lines.push("### Data", "");
    if (t.dataFiles.length) {
      for (const d of t.dataFiles) {
        lines.push(`- ${code(d.path)}${d.summary ? ` — ${inline(d.summary)}` : ""}`);
        if (d.data.length) lines.push(`  - data: ${d.data.map((x) => inline(code(`${x.name}${x.type ? `: ${x.type}` : ""}`))).join(", ")}`);
        if (d.helpers.length) lines.push(`  - helpers: ${d.helpers.map((x) => inline(code(`${x.name}${x.type && x.type.startsWith("(") ? x.type : ""}`))).join(", ")}`);
        if (d.types.length) lines.push(`  - exported types: ${d.types.map((x) => code(x)).join(", ")}`);
        if (d.shapes.length) lines.push(`  - shapes to keep: ${d.shapes.map((s) => `${code(s.name)} (${code(s.from)})`).join(", ")}`);
      }
    } else {
      const domainMods = t.modules.filter((m) => m.group === t.domain && m.layer === "application");
      const domainTypes = uniq(
        domainMods.flatMap((m) => (files.find((x) => x.rel === m.path)?.items ?? []).filter((i) => i.kind === "type" && !i.propsOf).map((i) => `${code(i.name)} (${code(m.importFrom)})`)),
      );
      lines.push(
        `- No \`*-data\` file: the demo rows live inside the domain modules (${domainMods.map((m) => code(m.importFrom)).join(", ") || "—"}).` +
          (domainTypes.length ? ` Their exported types: ${domainTypes.join(", ")}.` : ""),
      );
    }
    lines.push("");

    lines.push("### How to adapt", "");
    const shellPath = t.shell?.path ?? "the shell";
    const shellName = t.shell?.name ?? "the shell";
    lines.push(`1. Copy ${code(shellPath)} into ${code("src/pages/<yours>.tsx")} (rename ${code(shellName)}), register a ${code("<Route>")} for it in ${code("src/App.tsx")}.`);
    if (t.dataFiles.length) {
      const shapes = uniq(t.dataFiles.flatMap((d) => d.shapes.map((s) => code(s.name))));
      lines.push(
        `2. Replace the exports of ${t.dataFiles.map((d) => code(d.path)).join(", ")} with real data (fetch or props) — keep the shapes${shapes.length ? `: ${shapes.join(", ")}` : ""}.`,
      );
    } else {
      lines.push("2. Replace the demo constants inside the domain modules above with real data — keep the exported types listed under Data.");
    }
    if (t.sidebar) {
      const nav = t.sidebar.navConst ? `${code(t.sidebar.navConst)}${t.sidebar.navType ? ` (${code(t.sidebar.navType)})` : ""} in ${code(t.sidebar.path)}` : code(t.sidebar.path);
      const attrs = t.sidebar.shellAttrs.length ? `; the shell marks the active entry with ${t.sidebar.shellAttrs.map((a) => code(a)).join(" ")}` : "";
      lines.push(`3. Swap the nav items in the sidebar: ${nav}${attrs}.`);
    } else {
      lines.push("3. Swap the nav items in the sidebar (this shell has no sidebar module — skip).");
    }
    lines.push(`4. Delete the template routes you don't use: their entries in the ${code("templates")} map of ${code("src/App.tsx")} and the matching ${code("src/pages/templates/*.tsx")}.`);
    lines.push("");
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

/* ------------------------------------------------------------- main */

function main() {
  const t0 = performance.now();
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const boardui = pkg.timbal?.boardui ?? "unknown";
  const catalog = parseCatalog(existsSync(join(REGISTRY_DIR, "components.md")) ? readFileSync(join(REGISTRY_DIR, "components.md"), "utf8") : "");

  // 1. collect files
  const fileList = [];
  for (const [layer, dir] of Object.entries(LAYERS)) {
    for (const abs of walk(join(ROOT, dir))) {
      const rel = posix(relative(ROOT, abs));
      if (!/\.tsx?$/.test(rel) || SKIP_FILE.test(rel)) continue;
      fileList.push({ rel, layer });
    }
  }
  const tplDir = join(ROOT, TEMPLATES_DIR);
  if (existsSync(tplDir)) {
    for (const name of readdirSync(tplDir).sort()) {
      const rel = posix(join(TEMPLATES_DIR, name));
      if (!/\.tsx$/.test(name) || SKIP_FILE.test(name) || statSync(join(ROOT, rel)).isDirectory()) continue;
      fileList.push({ rel, layer: "pages" });
    }
  }
  fileList.sort((a, b) => LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer) || (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));

  // 2. analyze
  const files = fileList.map((f) => analyzeFile(f.rel, f.layer));
  const byRel = new Map(files.map((f) => [f.rel, f]));
  const skipped = [];
  for (const f of files) {
    if (!f.items.length) skipped.push(`${f.rel} (no exports)`);
    if (f.parseErrors) skipped.push(`${f.rel} (${f.parseErrors} syntax diagnostics — extracted anyway)`);
  }

  // 3. summary fallbacks: BoardUI catalog description, then the file-level prose for the primary export
  for (const f of files) {
    const cat = catalog.get(f.importFrom);
    for (const it of f.items) {
      if (!cat) break;
      it.catalog = cat.install;
      if (!it.summary && it.name === cat.primary) it.summary = cap(cat.description, SUMMARY_MAX);
    }
    if (f.fileDoc) {
      const comps = f.items.filter((i) => (i.kind === "component" || i.kind === "hook") && !i.reexportOf);
      const primary =
        comps.find((i) => i.name === pascal(f.stem)) ??
        comps.find((i) => i.name.startsWith(pascal(f.stem))) ??
        comps.find((i) => i.isDefault) ??
        (comps.length === 1 ? comps[0] : null);
      if (primary && !primary.summary) primary.summary = firstSentence(f.fileDoc);
    }
  }

  // 4. templates + membership
  const templates = analyzeTemplates(files, byRel);
  const ownerByDomain = new Map(); // domain → slug (slug === domain wins, else alphabetical)
  for (const t of templates) {
    if (!t.domain) continue;
    const cur = ownerByDomain.get(t.domain);
    if (!cur || t.slug === t.domain || (cur !== t.domain && t.slug < cur)) ownerByDomain.set(t.domain, t.slug);
  }
  const reach = new Map(); // rel → Set(slug)
  for (const t of templates) {
    if (t.shell) (reach.get(t.shell.path) ?? reach.set(t.shell.path, new Set()).get(t.shell.path)).add(t.slug);
    for (const m of t.modules) (reach.get(m.path) ?? reach.set(m.path, new Set()).get(m.path)).add(t.slug);
  }
  for (const f of files) {
    const slugs = [...(reach.get(f.rel) ?? [])].sort();
    if (f.layer === "application") {
      const owner = ownerByDomain.get(f.group);
      if (owner && slugs.includes(owner)) f.template = owner;
    } else if (f.layer === "pages") {
      f.template = f.stem;
    }
    for (const it of f.items) {
      if (f.template) it.template = f.template;
      if (slugs.length) it.templates = slugs;
    }
  }

  // 5. render
  const items = files.flatMap((f) => f.items).map(orderItemKeys);
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const registry = {
    version: 1,
    boardui,
    generatedAt: now.toISOString(),
    items,
    templates: templates.map((t) => ({
      slug: t.slug,
      route: t.route,
      domain: t.domain,
      summary: t.summary,
      page: t.page,
      shell: t.shell,
      modules: t.modules,
      cards: t.cards,
      dataFiles: t.dataFiles,
      sidebar: t.sidebar,
    })),
  };
  const outputs = {
    "registry.json": JSON.stringify(registry, null, 2) + "\n",
    "props.md": renderPropsMd(files, { boardui, date }),
    "templates.md": renderTemplatesMd(templates, files),
  };

  // 6. write or check
  const drift = [];
  if (CHECK) {
    for (const [name, next] of Object.entries(outputs)) {
      const p = join(REGISTRY_DIR, name);
      if (!existsSync(p)) {
        drift.push(`registry/${name} is missing`);
        continue;
      }
      const prev = readFileSync(p, "utf8");
      const [a, b] = name.endsWith(".json") ? [normalizeJson(prev), normalizeJson(next)] : [normalizeMd(prev), normalizeMd(next)];
      if (a !== b) {
        const al = a.split("\n");
        const bl = b.split("\n");
        let i = 0;
        while (i < al.length && i < bl.length && al[i] === bl[i]) i++;
        drift.push(
          `registry/${name} is out of date (first difference at line ${i + 1}; disk ${al.length} lines, regenerated ${bl.length} lines)\n` +
            `    disk: ${cap(al[i] ?? "<eof>", 160)}\n    new:  ${cap(bl[i] ?? "<eof>", 160)}`,
        );
      }
    }
  } else {
    mkdirSync(REGISTRY_DIR, { recursive: true });
    for (const [name, content] of Object.entries(outputs)) writeFileSync(join(REGISTRY_DIR, name), content);
  }

  // 7. summary
  const perLayer = LAYER_ORDER.map((l) => `${l} ${items.filter((i) => i.layer === l).length}`).join(", ");
  const nComponents = items.filter((i) => i.kind === "component").length;
  const nHooks = items.filter((i) => i.kind === "hook").length;
  const nProps = items.filter((i) => i.kind === "component" || i.kind === "hook").reduce((s, i) => s + i.props.length, 0);
  const nStar = files.reduce((s, f) => s + f.starReexports, 0);
  const ms = Math.round(performance.now() - t0);
  console.log(
    `registry-build${CHECK ? " --check" : ""}: ${files.length} files → ${items.length} items (${perLayer}) · ${nComponents} components · ${nHooks} hooks · ${nProps} props · ${templates.length} templates · ${ms} ms`,
  );
  console.log(
    `  skipped: ${skipped.length ? skipped.join("; ") : "none"}${nStar ? `; ${nStar} \`export *\` re-export(s) ignored` : ""}`,
  );
  if (CHECK) {
    if (drift.length) {
      for (const d of drift) console.error(`  drift: ${d}`);
      console.error(`registry-build --check: ${drift.length} file(s) drifted — run \`bun run registry:build\` and commit the result.`);
      process.exit(1);
    }
    console.log("  check: registry/ is up to date");
  } else {
    console.log(`  wrote: ${Object.keys(outputs).map((n) => `registry/${n}`).join(", ")}`);
  }
}

const ITEM_KEY_ORDER = [
  "name",
  "kind",
  "path",
  "importFrom",
  "layer",
  "group",
  "summary",
  "props",
  "tags",
  "template",
  "templates",
  "catalog",
  "isDefault",
  "localName",
  "wrapper",
  "typeParams",
  "type",
  "extends",
  "returns",
  "propsType",
  "propsFrom",
  "propsExternal",
  "propsOf",
  "localTypes",
  "reexportOf",
];
function orderItemKeys(it) {
  const out = {};
  for (const k of ITEM_KEY_ORDER) if (it[k] !== undefined) out[k] = it[k];
  for (const k of Object.keys(it)) if (!(k in out) && it[k] !== undefined) out[k] = it[k];
  return out;
}

function normalizeJson(s) {
  try {
    const o = JSON.parse(s);
    delete o.generatedAt;
    return JSON.stringify(o, null, 2);
  } catch {
    return s;
  }
}
const normalizeMd = (s) => s.replace(/generated \d{4}-\d{2}-\d{2}/, "generated <date>");

main();
