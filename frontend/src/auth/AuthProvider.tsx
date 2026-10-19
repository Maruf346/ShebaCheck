import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearTokens,
  getAccessToken,
  getCurrentUser,
  loginAccount,
  registerAccount,
  saveTokens,
  updateCurrentUser,
  type ApiUser,
} from "../api/client";

interface RegisterPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "customer" | "provider";
}

interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  updateProfile: (payload: Partial<Pick<ApiUser, "first_name" | "last_name" | "phone">>) => Promise<ApiUser>;
  logout: () => void;
  reloadUser: () => Promise<ApiUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getAccessToken()));

  const reloadUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      setIsLoading(false);
      return null;
    }
    setIsLoading(true);
    try {
      const current = await getCurrentUser();
      setUser(current);
      return current;
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (getAccessToken()) void reloadUser().catch(() => undefined);
    else setIsLoading(false);
  }, [reloadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginAccount(email.trim().toLowerCase(), password);
    saveTokens(tokens);
    const current = await getCurrentUser();
    setUser(current);
    return current;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    await registerAccount(payload);
    return login(payload.email, payload.password);
  }, [login]);

  const updateProfile = useCallback(async (payload: Partial<Pick<ApiUser, "first_name" | "last_name" | "phone">>) => {
    const updated = await updateCurrentUser(payload);
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    updateProfile,
    logout,
    reloadUser,
  }), [user, isLoading, login, register, updateProfile, logout, reloadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
