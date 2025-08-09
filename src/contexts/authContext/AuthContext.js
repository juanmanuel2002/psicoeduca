import React, { createContext, useState, useEffect } from "react";
import { refreshToken } from  '../../services/authService'

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

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

    // Detectar actividad del usuario
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  useEffect(() => {
    const checkToken = async() => {
      const token = localStorage.getItem('token');
      const expiration = user?.stsTokenManager?.expirationTime;
      const refreshTokenData = user?.stsTokenManager?.refreshToken;
      const now = Date.now();
      
      if (token && expiration) {
        if (now > expiration) {
          logout();
        } else {
          const timeLeft = expiration - now;
          // Si faltan menos de 2 minutos, refresca el token
          if (timeLeft < 2 * 60 * 1000 && now - lastActivity < 2 * 60 * 1000) {
            const refreshed = await refreshToken({refreshTokenData});
            if (refreshed?.accessToken) {
              localStorage.setItem('token', refreshed.accessToken);
              setUser({
                ...user,
                stsTokenManager: {
                  ...user.stsTokenManager,
                  accessToken: refreshed.accessToken,
                  expirationTime: refreshed.expirationTime,
                },
              });
            }else {
              logout();
            }
             
          }
        }
      }
    };

    // Verifica cada minuto
    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, lastActivity]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
