import React, { useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext.1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // naive: store role in token? For simplicity decode payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.sub, role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload["role"], email: payload.unique_name || payload.name });
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    const payload = JSON.parse(atob(res.data.token.split('.')[1]));
    setUser({ id: payload.sub, role: payload.role || payload["role"], email: payload.unique_name || payload.name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (email, password, role) => {
    await api.post("/auth/register", { email, password, role });
  };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
}
