import { FilaProducto, Pago } from "../types";

const BASE = "/api/facturas";

export const facturasService = {
  getAll: async (clienteId?: string, verAnuladas = false) => {
    const params = new URLSearchParams();
    if (clienteId) params.set("clienteId", clienteId);
    if (verAnuladas) params.set("anuladas", "true");
    const res = await fetch(`${BASE}?${params}`);
    if (!res.ok) throw new Error("Error al cargar facturas");
    return res.json();
  },

  anular: async (id: string) => {
    const res = await fetch(`${BASE}/${id}/anular`, { method: "PATCH" });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Error al anular");
    }
    return res.json();
  },

  create: async (data: any) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 422) {
      const { errores } = await res.json();
      throw { tipo: "STOCK_INSUFICIENTE", errores };
    }

    if (!res.ok) throw new Error("Error al guardar factura");
    return res.json();
  },

  getNextNumero: async (): Promise<number> => {
    const res = await fetch("/api/facturas/next-numero");
    if (!res.ok) throw new Error("Error al obtener número");
    const data = await res.json();
    return data.numero;
  },
};
