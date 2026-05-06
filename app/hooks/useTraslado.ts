import { useState, useEffect } from "react";
import { Traslado } from "./useTraslados";
import { trasladosService } from "../services/traslados.service";

export function useTraslado(id: string) {
  const [traslado, setTraslado] = useState<Traslado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trasladosService
      .getById(id)
      .then(setTraslado)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { traslado, loading, error };
}
