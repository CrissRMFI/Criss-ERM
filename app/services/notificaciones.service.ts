const BASE = "/api/notificaciones";

export const notificacionesService = {
  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar notificaciones");
    return res.json();
  },

  marcarLeida: async (id: string) => {
    const res = await fetch(`${BASE}/${id}/leer`, { method: "PATCH" });
    if (!res.ok) throw new Error("Error al marcar notificación");
    return res.json();
  },
};
