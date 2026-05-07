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
  const [totalValor, setTotalValor] = useState(0);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const productos = await almacenesService.getStock(almacenId);
      setStock(productos);
      const total = productos.reduce(
        (acc: number, p: StockProducto) =>
          acc + p.lotes.reduce((a, l) => a + l.cantidad * l.precioCosto, 0),
        0,
      );

      setTotalValor(total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [almacenId]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return { stock, totalValor, loading, error, refetch: fetchStock };
}
