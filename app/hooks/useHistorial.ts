import { useState, useEffect } from "react";
import { facturasService } from "../services/facturas.service";

export function useHistorial() {
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    facturasService
      .getAll()
      .then(setFacturas)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { facturas, loading, error };
}
