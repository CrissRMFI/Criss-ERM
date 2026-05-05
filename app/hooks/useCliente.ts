import { useState, useEffect } from "react";
import { Cliente } from "../types";
import { clientesService } from "../services/clientes.service";

export function useCliente(id: string) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientesService
      .getById(id)
      .then(setCliente)
      .catch(() => setCliente(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { cliente, loading };
}
