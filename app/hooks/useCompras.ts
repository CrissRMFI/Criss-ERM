import { useState, useEffect, useCallback } from "react";
import { comprasService } from "../services/compras.service";

export interface CompraLinea {
  id: string;
  productoId: string;
  producto: { id: string; nombre: string; precio: number };
  cantidadTotal: number;
  cantidadRetirada: number;
  precioCosto: number;
}

export interface PagoCompra {
  id: string;
  monto: number;
  fecha: string;
  tipo: string;
  notas: string;
}

export interface Compra {
  id: string;
  fecha: string;
  proveedor?: { id: string; nombre: string } | null;
  observaciones: string;
  estado: "PENDIENTE" | "COMPLETADA" | "CANCELADA";
  canceladaAt?: string | null;
  lineas: CompraLinea[];
  pagos: PagoCompra[];
  createdAt: string;
}

export function useCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCompras(await comprasService.getAll());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  const crear = async (data: {
    fecha: string;
    proveedorId?: string;
    observaciones: string;
    lineas: {
      productoId: string;
      cantidadTotal: number;
      precioCosto: number;
    }[];
  }) => {
    await comprasService.create(data);
    await fetchCompras();
  };

  const retirar = async (
    compraLineaId: string,
    cantidad: number,
    almacenDestinoId: string,
  ) => {
    await comprasService.retirar(compraLineaId, { cantidad, almacenDestinoId });
    await fetchCompras();
  };

  const pagar = async (
    compraId: string,
    data: { monto: number; fecha: string; tipo: string; notas?: string },
  ) => {
    await comprasService.pagarCompra(compraId, data);
    await fetchCompras();
  };

  const cancelar = async (compraId: string) => {
    const result = await comprasService.cancelar(compraId);
    await fetchCompras();
    return result;
  };

  return {
    compras,
    loading,
    error,
    crear,
    retirar,
    pagar,
    cancelar,
    refetch: fetchCompras,
  };
}
