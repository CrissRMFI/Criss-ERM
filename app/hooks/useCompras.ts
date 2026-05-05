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

export interface Compra {
  id: string;
  fecha: string;
  proveedor: string;
  observaciones: string;
  lineas: CompraLinea[];
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
    proveedor: string;
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

  return { compras, loading, error, crear, retirar, refetch: fetchCompras };
}
