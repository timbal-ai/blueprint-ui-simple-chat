import React from "react";
import { isAuthEnabled } from "./config";
import { useSession } from "./provider";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
}) => {
  const { isAuthenticated, loading } = useSession();

  if (!isAuthEnabled) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to the API's login page, preserving the current path
    const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/api/auth/login?return_to=${returnTo}`;
    return null;
  }

  return children;
};
