import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { clearSession, loadSession, saveSession } from "../session";
import type { AuthSession } from "../types";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  accessToken: string;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      accessToken: session?.accessToken ?? "",
      signIn(nextSession) {
        saveSession(nextSession);
        setSession(nextSession);
      },
      signOut() {
        clearSession();
        setSession(null);
      }
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function useAccessToken() {
  return useAuth().accessToken;
}
