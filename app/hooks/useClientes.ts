import { useState, useEffect, useCallback } from "react";
import { Cliente } from "../types";
import { clientesService } from "../services/clientes.service";

export function useClientes(search = "", soloActivos = true) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setClientes(await clientesService.getAll(search, soloActivos));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [search, soloActivos]);

  useEffect(() => {
    const t = setTimeout(fetchClientes, 300);
    return () => clearTimeout(t);
  }, [fetchClientes]);

  const crear = async (data: {
    nombre: string;
    telefono?: string;
    direccion?: string;
    notas?: string;
  }) => {
    await clientesService.create(data);
    await fetchClientes();
  };

  const actualizar = async (
    id: string,
    data: {
      nombre: string;
      telefono?: string;
      direccion?: string;
      notas?: string;
    },
  ) => {
    await clientesService.update(id, data);
    await fetchClientes();
  };

  const toggleActivo = async (id: string, activo: boolean) => {
    await clientesService.toggleActivo(id, activo);
    await fetchClientes();
  };

  return {
    clientes,
    loading,
    error,
    crear,
    actualizar,
    toggleActivo,
    refetch: fetchClientes,
  };
}
