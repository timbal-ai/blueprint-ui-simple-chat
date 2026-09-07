import { RiMailSendLine } from "@remixicon/react";
import { useState } from "react";
import {
  getAuthBaseUrl,
  TimbalMark,
  useOptionalSession,
  type AuthProvider,
} from "@timbal-ai/timbal-react";

import { AuthCard } from "@/components/application/auth/auth-card";
import type { SocialProvider } from "@/components/base/social-button/social-providers";

/**
 * BoardUI `AuthCard` driven by the Timbal session — the login screen for
 * `AuthGuard`'s `renderLogin` prop:
 *
 * ```tsx
 * <AuthGuard requireAuth renderLogin={<BoardLogin />}>…</AuthGuard>
 * ```
 *
 * Same wire contract as the runtime's `TimbalLoginScreen`, different chrome:
 * - providers come from `GET /api/config` via `SessionProvider`
 *   (`authProviders`), so only enabled methods render;
 * - OAuth buttons redirect to `{base}/auth/{provider}[?redirect_uri=…]`;
 * - the email form POSTs `{base}/auth/magic-link` `{ email }` (passwordless).
 */
const OAUTH: Record<Exclude<AuthProvider, "email">, SocialProvider> = {
  google: "google",
  microsoft: "microsoft",
  github: "github",
};

export function BoardLogin({ redirectUri }: { redirectUri?: string }) {
  const session = useOptionalSession();
  const base = getAuthBaseUrl();
  const providers = (session?.authProviders ?? []).filter(
    (p): p is Exclude<AuthProvider, "email"> => p !== "email",
  );
  const hasEmail = (session?.authProviders ?? []).includes("email");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [sentTo, setSentTo] = useState("");

  const onProvider = (provider: SocialProvider) => {
    const url = `${base}/auth/${provider}`;
    window.location.assign(
      redirectUri ? `${url}?redirect_uri=${encodeURIComponent(redirectUri)}` : url,
    );
  };

  const onSubmit = async (data: FormData) => {
    const email = String(data.get("email") ?? "").trim();
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
      console.error("[board-login] magic link failed", err);
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background-secondary-default p-4 sm:p-6">
      {status === "sent" ? (
        <div className="w-full max-w-[420px] rounded-3xl border border-border-button-default bg-background-primary-default p-8 text-center shadow-card">
          <RiMailSendLine
            className="mx-auto mb-4 size-8 text-foreground-icon-secondary"
            aria-hidden
          />
          <h1 className="text-title-2-medium text-text-primary">Check your inbox</h1>
          <p className="mt-2 text-body-regular text-text-secondary">
            We sent a sign-in link to <span className="text-text-primary">{sentTo}</span>.
          </p>
        </div>
      ) : (
        <AuthCard
          logo={<TimbalMark size={28} />}
          title="Welcome back"
          description={
            status === "error"
              ? "We couldn't send the link. Check the address and try again."
              : hasEmail
                ? "Enter your email and we'll send you a sign-in link."
                : "Choose how you'd like to continue."
          }
          passwordless
          cta={status === "sending" ? "Sending…" : "Send sign-in link"}
          providers={providers.map((p) => OAUTH[p])}
          onProvider={onProvider}
          onSubmit={onSubmit}
          className="w-full max-w-[420px]"
        />
      )}
    </div>
  );
}
