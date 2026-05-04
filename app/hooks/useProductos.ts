import { useState, useEffect, useCallback } from "react";
import { Producto } from "../types";
import { productosService } from "../services/productos.service";

export function useProductos(search = "") {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProductos(await productosService.getAll(search));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetch, 300);
    return () => clearTimeout(t);
  }, [fetch]);

  const crear = async (data: { nombre: string; precio: number }) => {
    await productosService.create(data);
    await fetch();
  };

  const actualizar = async (
    id: string,
    data: { nombre: string; precio: number },
  ) => {
    await productosService.update(id, data);
    await fetch();
  };

  const eliminar = async (id: string) => {
    await productosService.delete(id);
    await fetch();
  };

  return {
    productos,
    loading,
    error,
    crear,
    actualizar,
    eliminar,
    refetch: fetch,
  };
}
