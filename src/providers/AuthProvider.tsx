import { AuthContext } from "@/contexts/auth-context";
import { useProfile } from "@/hooks/useProfile";
import { useMemo, type ReactNode } from "react";


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