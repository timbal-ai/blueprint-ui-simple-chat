"use client";

import { type FC, useEffect, useState } from "react";
import type { SyntaxHighlighterProps } from "@assistant-ui/react-markdown";
import { type BundledLanguage, type BundledTheme, createHighlighter } from "shiki";

const SHIKI_THEME_DARK: BundledTheme = "vitesse-dark";
const SHIKI_THEME_LIGHT: BundledTheme = "vitesse-light";

const PRELOADED_LANGS: BundledLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "bash",
  "markdown",
  "jsx",
  "tsx",
  "sql",
  "yaml",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
];

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME_DARK, SHIKI_THEME_LIGHT],
      langs: PRELOADED_LANGS,
    });
  }
  return highlighterPromise;
}

getHighlighter();

const ShikiSyntaxHighlighter: FC<SyntaxHighlighterProps> = ({
  components: { Pre, Code },
  language,
  code,
}) => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const highlighter = await getHighlighter();
        const loadedLangs = highlighter.getLoadedLanguages();

        if (!loadedLangs.includes(language as BundledLanguage)) {
          try {
            await highlighter.loadLanguage(language as BundledLanguage);
          } catch {
            if (!cancelled) setHtml(null);
            return;
          }
        }

        const result = highlighter.codeToHtml(code, {
          lang: language,
          themes: {
            dark: SHIKI_THEME_DARK,
            light: SHIKI_THEME_LIGHT,
          },
        });

        if (!cancelled) setHtml(result);
      } catch {
        if (!cancelled) setHtml(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (html) {
    return (
      <div
        className="shiki-wrapper [&>pre]:!m-0 [&>pre]:!rounded-t-none [&>pre]:!rounded-b-lg [&>pre]:!border [&>pre]:!border-t-0 [&>pre]:!border-border/50 [&>pre]:!p-3 [&>pre]:!text-xs [&>pre]:!leading-relaxed [&>pre]:overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Pre>
      <Code>{code}</Code>
    </Pre>
  );
};

export default ShikiSyntaxHighlighter;
