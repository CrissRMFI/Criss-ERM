const BASE = "/api/almacenes";

export const almacenesService = {
  getStock: async (almacenId: string) => {
    const res = await fetch(`${BASE}/${almacenId}/stock`);
    if (!res.ok) throw new Error("Error al cargar stock");
    return res.json();
  },

  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar almacenes");
    return res.json();
  },
};
