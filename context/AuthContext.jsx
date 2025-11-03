"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createMockJWT, parseMockJWT, validateMockCredentials } from "@/lib/auth";

export const AuthContext = createContext({
  user: null,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Hydrate user from cookie on mount
    const token = getCookie("authTokens");
    if (token) {
      const payload = parseMockJWT(token);
      if (payload?.email && payload?.role) {
        setUser({ email: payload.email, role: payload.role });
      }
    }
  }, []);

  const login = async (email, password, role) => {
    const ok = validateMockCredentials(email, password, role);
    if (!ok) return false;
    const token = createMockJWT({ email, role });
    setCookie("authTokens", token, 24 * 60 * 60);
    setUser({ email, role });
    return true;
  };

  const logout = async () => {
    deleteCookie("authTokens");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

// Cookie helpers (client-side)
function setCookie(name, value, maxAgeSeconds) {
  const expires = maxAgeSeconds ? `; max-age=${maxAgeSeconds}` : "";
  document.cookie = `${name}=${value}; path=/; SameSite=Lax${expires}`;
}
function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}
