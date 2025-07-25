// src/services/recursosService.js

const API_URL = process.env.REACT_APP_API_URL || "";

export async function getRecursos() {
  try {
    const res = await fetch(`${API_URL}/recursos`);
    if (!res.ok) throw new Error("Error al obtener recursos");
    return await res.json();
  } catch (err) {
    console.error("Error en getRecursos:", err);
    return [];
  }
}
