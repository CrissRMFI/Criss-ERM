import { useState, useEffect } from "react";
import { facturasService } from "../services/facturas.service";

export function useHistorial(clienteId?: string) {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = clienteId
      ? `/api/facturas?clienteId=${clienteId}`
      : "/api/facturas";

    fetch(url)
      .then((r) => r.json())
      .then(setFacturas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [clienteId]);

  return { facturas, loading, error };
}
