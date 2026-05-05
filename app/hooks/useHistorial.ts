import { useState, useEffect } from "react";
import { facturasService } from "../services/facturas.service";

export function useHistorial(clienteId?: string, verAnuladas = false) {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      setFacturas(await facturasService.getAll(clienteId, verAnuladas));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [clienteId, verAnuladas]);

  const anular = async (id: string) => {
    await facturasService.anular(id);
    await fetch();
  };

  return { facturas, loading, error, anular, refetch: fetch };
}
