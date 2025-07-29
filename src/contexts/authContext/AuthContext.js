import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    if (userData.stsTokenManager && userData.stsTokenManager.accessToken) {
      localStorage.setItem('token', userData.stsTokenManager.accessToken);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.removeItem('token');
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
