const BASE = "/api/compras";

export const comprasService = {
  getAll: async () => {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error("Error al cargar compras");
    return res.json();
  },

  create: async (data: {
    fecha: string;
    proveedorId?: string;
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

  pagarCompra: async (
    compraId: string,
    data: {
      monto: number;
      fecha: string;
      tipo: string;
      notas?: string;
    },
  ) => {
    const res = await fetch(`${BASE}/${compraId}/pagos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Error al registrar pago");
    }
    return res.json();
  },

  cancelar: async (compraId: string) => {
    const res = await fetch(`${BASE}/${compraId}/cancelar`, {
      method: "PATCH",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Error al cancelar");
    }
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error("Compra no encontrada");
    return res.json();
  },
};
