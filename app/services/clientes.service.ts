const BASE = "/api/clientes";

export const clientesService = {
  getAll: async (q = "", soloActivos = true) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (!soloActivos) params.set("activos", "false");
    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error("Error al cargar clientes");
    return res.json();
  },

  create: async (data: {
    nombre: string;
    telefono?: string;
    direccion?: string;
    notas?: string;
  }) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear cliente");
    return res.json();
  },

  update: async (
    id: string,
    data: {
      nombre: string;
      telefono?: string;
      direccion?: string;
      notas?: string;
    },
  ) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar cliente");
    return res.json();
  },

  toggleActivo: async (id: string, activo: boolean) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo }),
    });
    if (!res.ok) throw new Error("Error al actualizar estado");
    return res.json();
  },

  getDeuda: async (
    id: string,
  ): Promise<{ deudaMonetaria: number; deudaCajas: number }> => {
    const res = await fetch(`${BASE}/${id}/deuda`);
    if (!res.ok) throw new Error("Error al obtener deuda");
    return res.json();
  },
};
