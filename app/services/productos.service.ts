import { Producto } from "../types";

const BASE = "/api/productos";

export const productosService = {
  getAll: async (q?: string): Promise<Producto[]> => {
    const url = q?.trim() ? `${BASE}?q=${encodeURIComponent(q)}` : BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al cargar productos");
    return res.json();
  },

  create: async (data: {
    nombre: string;
    precio: number;
  }): Promise<Producto> => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear producto");
    return res.json();
  },

  update: async (
    id: string,
    data: { nombre: string; precio: number },
  ): Promise<Producto> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar producto");
  },
};
