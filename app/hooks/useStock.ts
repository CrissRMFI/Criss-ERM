import { useState, useEffect, useCallback } from "react";
import { almacenesService } from "../services/almacenes.service";

export interface StockProducto {
  productoId: string;
  nombre: string;
  precioVenta: number;
  cantidadTotal: number;
  lotes: {
    id: string;
    cantidad: number;
    precioCosto: number;
    createdAt: string;
  }[];
}

export function useStock(almacenId: string) {
  const [stock, setStock] = useState<StockProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStock(await almacenesService.getStock(almacenId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [almacenId]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return { stock, loading, error, refetch: fetchStock };
}
