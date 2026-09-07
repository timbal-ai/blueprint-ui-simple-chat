import { RiMailSendLine } from "@remixicon/react";
import { useEffect, useState, type FormEvent } from "react";
import {
  fetchProjectConfig,
  getAuthBaseUrl,
  TimbalMark,
  useOptionalSession,
  type AuthProvider,
} from "@timbal-ai/timbal-react";

import { Button } from "@/components/base/buttons/button";
import { Divider } from "@/components/base/divider/divider";
import { Input } from "@/components/base/input/input";
import { SocialButton } from "@/components/base/social-button/social-button";
import type { SocialProvider } from "@/components/base/social-button/social-providers";
import { cx } from "@/utils/cx";

/**
 * Login — BoardUI auth-card grammar (rounded-3xl card, title-2, stacked
 * social buttons under an "or continue with" divider) driven by the Timbal
 * session. Passwordless by design: Timbal signs users in with OAuth redirects
 * or an emailed magic link, so there is no password field.
 *
 * Mount as `AuthGuard`'s login UI:
 *
 * ```tsx
 * <AuthGuard requireAuth renderLogin={<Login />}>…</AuthGuard>
 * ```
 *
 * Wire contract (same as the runtime's `TimbalLoginScreen`):
 * - providers come from `GET {base}/config` through `SessionProvider`
 *   (`authProviders`) — only enabled methods render;
 * - OAuth buttons redirect to `{base}/auth/{provider}[?redirect_uri=…]`;
 * - the email form POSTs `{base}/auth/magic-link` with `{ email }`.
 */
const OAUTH: Record<Exclude<AuthProvider, "email">, SocialProvider> = {
  google: "google",
  microsoft: "microsoft",
  github: "github",
};

export interface LoginProps {
  /** Where to land after OAuth (`?redirect_uri=`). Defaults to the server default. */
  redirectUri?: string;
  title?: string;
  description?: string;
  /** Mark above the title. Defaults to the Timbal mark — swap for the product logo. */
  logo?: React.ReactNode;
  className?: string;
}

export function Login({
  redirectUri,
  title = "Welcome back",
  description,
  logo = <TimbalMark size={28} />,
  className,
}: LoginProps) {
  const session = useOptionalSession();
  const base = getAuthBaseUrl();
  // Without a live session config (SessionProvider absent or disabled — e.g. the
  // standalone /login preview) read the providers straight from GET {base}/config
  // so the screen still reflects the project's real sign-in methods.
  const sessionHasConfig = session?.configStatus === "ok";
  const [fallbackProviders, setFallbackProviders] = useState<AuthProvider[]>([]);
  useEffect(() => {
    if (sessionHasConfig) return;
    const ctrl = new AbortController();
    fetchProjectConfig({ baseUrl: base, retries: 0, signal: ctrl.signal })
      .then((r) => {
        if (r.status === "ok") setFallbackProviders(r.config.auth.providers);
      })
      .catch((err) => {
        if (!ctrl.signal.aborted) console.warn("[login] config unavailable", err);
      });
    return () => ctrl.abort();
  }, [sessionHasConfig, base]);
  const methods = sessionHasConfig ? session.authProviders : fallbackProviders;
  const oauth = methods.filter((p): p is Exclude<AuthProvider, "email"> => p !== "email");
  const hasEmail = methods.includes("email");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentTo, setSentTo] = useState("");

  const onProvider = (provider: SocialProvider) => {
    const url = `${base}/auth/${provider}`;
    window.location.assign(
      redirectUri ? `${url}?redirect_uri=${encodeURIComponent(redirectUri)}` : url,
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch(`${base}/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`magic-link ${res.status}`);
      setSentTo(email);
      setStatus("sent");
    } catch (err) {
      console.error("[login] magic link failed", err);
      setStatus("error");
    }
  };

  const card =
    "flex w-full max-w-[400px] flex-col rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8 dark:bg-background-secondary-default";

  return (
    <div
      className={cx(
        "flex min-h-dvh items-center justify-center bg-background-full p-4 sm:p-6",
        className,
      )}
    >
      {status === "sent" ? (
        <div className={cx(card, "items-center text-center")}>
          <RiMailSendLine className="mb-4 size-8 text-foreground-icon-secondary" aria-hidden />
          <h1 className="text-title-2-medium text-text-primary">Check your inbox</h1>
          <p className="mt-2 text-body-regular text-text-secondary">
            We sent a sign-in link to <span className="text-text-primary">{sentTo}</span>.
          </p>
        </div>
      ) : (
        <div className={card}>
          {logo ? <div className="mb-6 flex">{logo}</div> : null}
          <h1 className="text-title-2-medium text-text-primary">{title}</h1>
          <p className="mt-1 text-body-regular text-text-secondary">
            {description ??
              (status === "error"
                ? "We couldn't send the link. Check the address and try again."
                : hasEmail
                  ? "Enter your email and we'll send you a sign-in link."
                  : oauth.length
                    ? "Choose how you'd like to continue."
                    : "No sign-in methods are available for this project.")}
          </p>

          {hasEmail ? (
            <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@company.com"
                autoComplete="email"
                isRequired
              />
              <Button type="submit" className="w-full" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send sign-in link"}
              </Button>
            </form>
          ) : null}

          {oauth.length ? (
            <>
              {hasEmail ? (
                <div className="my-5">
                  <Divider>or continue with</Divider>
                </div>
              ) : (
                <div className="mt-6" />
              )}
              <div className="flex flex-col gap-2.5">
                {oauth.map((p) => (
                  <SocialButton
                    key={p}
                    brand={OAUTH[p]}
                    appearance="white"
                    fullWidth
                    onClick={() => onProvider(OAUTH[p])}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
