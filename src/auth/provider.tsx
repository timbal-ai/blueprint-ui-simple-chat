/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session } from "@timbal-ai/timbal-sdk";
import { isAuthEnabled } from "@/auth/config";
import {
  getRefreshToken,
  clearTokens,
  fetchCurrentUser,
  refreshAccessToken,
} from "@/auth/tokens";

export { isAuthEnabled };

// ============================================
// Session Context
// ============================================

interface SessionContextType {
  user: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// ============================================
// Session Provider
// ============================================

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthEnabled) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const restoreSession = async () => {
      try {
        // Try fetching current user — the API checks the httpOnly cookie
        const u = await fetchCurrentUser();
        if (ignore) return;
        if (u) {
          setUser(u);
          setLoading(false);
          return;
        }

        // Cookie may have expired — try refreshing from stored refresh token
        if (getRefreshToken()) {
          const ok = await refreshAccessToken();
          if (ignore) return;
          if (ok) {
            const refreshedUser = await fetchCurrentUser();
            if (ignore) return;
            if (refreshedUser) {
              setUser(refreshedUser);
              setLoading(false);
              return;
            }
          }
        }
      } catch {
        if (ignore) return;
        clearTokens();
      }

      setLoading(false);
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    fetch("/api/auth/logout", { method: "POST" })
      .finally(() => (window.location.href = `/api/auth/login?return_to=${returnTo}`));
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
