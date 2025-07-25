const API_URL = process.env.REACT_APP_API_URL || "";

export async function getCursos() {
  try {
    const res = await fetch(`${API_URL}/cursos`);
    if (!res.ok) throw new Error("Error al obtener cursos");
    return await res.json();
  } catch (err) {
    console.error("Error en getCursos:", err);
    return [];
  }
}
