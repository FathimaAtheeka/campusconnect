import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getStoredUser, getToken, setStoredUser, setToken } from "./api";

export type Role = "student" | "admin";
export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  modules?: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser<AuthUser>());
  const [loading, setLoading] = useState<boolean>(!!getToken() && !getStoredUser());

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const res = await api<{ user: AuthUser }>("/api/auth/me");
      setUser(res.user);
      setStoredUser(res.user);
    } catch {
      setToken(null);
      setStoredUser(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (getToken() && !user) {
      setLoading(true);
      refresh().finally(() => setLoading(false));
    }
  }, [refresh, user]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api<{ token: string; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      refresh,
    }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
