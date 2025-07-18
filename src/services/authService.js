const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const loginWithGoogle = async (token) => {
    const res = await fetch(`${API_URL}/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const getLoginWithGoogle = async () => {
  try {
    const res = await fetch(`${API_URL}/login/google`);
    if (!res.ok) throw new Error("No se pudo obtener Google Client ID");
    const data = await res.json();
    return atob(data.clientId);
  } catch (err) {
    console.error("Error al obtener Google Client ID:", err);
    throw new Error("No se pudo obtener Google Client ID");
  }
};

export const resetPassword = async (email) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
