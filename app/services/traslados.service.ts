const BASE = "/api/traslados";

export const trasladosService = {
  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar traslados");
    return res.json();
  },

  create: async (data: {
    origenId: string;
    destinoId: string;
    fecha: string;
    observaciones: string;
    lineas: {
      loteId: string;
      productoId: string;
      cantidad: number;
      precioCosto: number;
    }[];
  }) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Error al registrar traslado");
    }
    return res.json();
  },
};
