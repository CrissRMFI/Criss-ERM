const BASE = "/api/compras";

export const comprasService = {
  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar compras");
    return res.json();
  },

  create: async (data: {
    fecha: string;
    proveedor: string;
    observaciones: string;
    lineas: {
      productoId: string;
      cantidadTotal: number;
      precioCosto: number;
    }[];
  }) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al registrar compra");
    return res.json();
  },

  getPendientes: async () => {
    const res = await fetch(`${BASE}/pendientes`);
    if (!res.ok) throw new Error("Error al cargar pendientes");
    return res.json();
  },

  retirar: async (
    compraLineaId: string,
    data: {
      cantidad: number;
      almacenDestinoId: string;
    },
  ) => {
    const res = await fetch(`${BASE}/lineas/${compraLineaId}/retirar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al registrar retiro");
    return res.json();
  },
};
