import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useProfile } from "./useProfile";

type AuthContextValue = {
  session: AuthSession | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useProfile();

  const value = useMemo<AuthContextValue>(
    () => ({
      session: data,
      isLoading: isPending,
      isAuthenticated: Boolean(data),
    }),
    [data, isPending],
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
