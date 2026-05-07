import { useState, useEffect, useCallback } from "react";
import { proveedoresService } from "../services/proveedores.service";

export interface Proveedor {
  id: string;
  nombre: string;
  telefono?: string | null;
  notas?: string | null;
  activo: boolean;
  createdAt: string;
}

export function useProveedores(soloActivos = true) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await proveedoresService.getAll();
      setProveedores(
        soloActivos ? data.filter((p: Proveedor) => p.activo) : data,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [soloActivos]);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const crear = async (data: {
    nombre: string;
    telefono?: string;
    notas?: string;
  }) => {
    await proveedoresService.create(data);
    await fetchProveedores();
  };

  const actualizar = async (
    id: string,
    data: { nombre: string; telefono?: string; notas?: string },
  ) => {
    await proveedoresService.update(id, data);
    await fetchProveedores();
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    await proveedoresService.toggleActivo(id, activo);
    await fetchProveedores();
  };

  return {
    proveedores,
    loading,
    error,
    crear,
    actualizar,
    toggleActivo,
    refetch: fetchProveedores,
  };
}
