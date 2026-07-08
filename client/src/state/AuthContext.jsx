import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("moviebox-user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("moviebox-token", data.token);
    localStorage.setItem("moviebox-user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("moviebox-token", data.token);
    localStorage.setItem("moviebox-user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function demoLogin(role = "admin") {
    const demoUser = {
      _id: role === "admin" ? "admin-demo" : "user-demo",
      name: role === "admin" ? "Admin User" : "Maya Chen",
      email: role === "admin" ? "admin@moviebox.test" : "maya@moviebox.test",
      role
    };
    localStorage.setItem("moviebox-user", JSON.stringify(demoUser));
    localStorage.setItem("moviebox-token", "demo-token");
    setUser(demoUser);
  }

  function logout() {
    localStorage.removeItem("moviebox-token");
    localStorage.removeItem("moviebox-user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, demoLogin, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
