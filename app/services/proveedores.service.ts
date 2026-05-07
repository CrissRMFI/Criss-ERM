const BASE = "/api/proveedores";

export const proveedoresService = {
  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar proveedores");
    return res.json();
  },

  create: async (data: {
    nombre: string;
    telefono?: string;
    notas?: string;
  }) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear proveedor");
    return res.json();
  },

  update: async (
    id: string,
    data: { nombre: string; telefono?: string; notas?: string },
  ) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar proveedor");
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
};
