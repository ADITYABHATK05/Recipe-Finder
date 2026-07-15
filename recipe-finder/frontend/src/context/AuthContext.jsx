import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

const TOKEN_KEY = "recipe-finder-token";
const USER_KEY = "recipe-finder-user";

const readStoredAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY) || "";
  const storedUser = localStorage.getItem(USER_KEY);

  return {
    token,
    user: storedUser ? JSON.parse(storedUser) : null,
  };
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const persistAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setAuth(data);
  };

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuth({ token: "", user: null });
  };

  const loginWithEmail = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    persistAuth(response.data);
    return response.data.user;
  };

  const loginWithGoogle = async (credential) => {
    const response = await api.post("/auth/google", { credential });
    persistAuth(response.data);
    return response.data.user;
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setAuth((prev) => ({ ...prev, user: updatedUser }));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      loginWithEmail,
      loginWithGoogle,
      logout: clearAuth,
      updateUser,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};