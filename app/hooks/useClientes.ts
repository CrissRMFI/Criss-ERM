import { useState, useEffect, useCallback } from "react";
import { Cliente } from "../types";
import { clientesService } from "../services/clientes.service";

export interface ClienteConDeuda extends Cliente {
  deudaMonetaria: number;
  deudaCajas: number;
}

export function useClientes(search = "", soloActivos = true) {
  const [clientes, setClientes] = useState<ClienteConDeuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: Cliente[] = await clientesService.getAll(search, soloActivos);

      // Cargar deuda de cada cliente en paralelo
      const conDeuda = await Promise.all(
        data.map(async (c) => {
          try {
            const deuda = await clientesService.getDeuda(c.id);
            return {
              ...c,
              deudaMonetaria: deuda.deudaMonetaria,
              deudaCajas: deuda.deudaCajas,
            };
          } catch {
            return { ...c, deudaMonetaria: 0, deudaCajas: 0 };
          }
        }),
      );

      setClientes(conDeuda);
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
