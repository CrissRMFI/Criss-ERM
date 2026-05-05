import { useState, useEffect } from "react";
import { almacenesService } from "../services/almacenes.service";

export interface Almacen {
  id: string;
  nombre: string;
  tipo: "CENTRAL" | "MOVIL";
}

export function useAlmacenes() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    almacenesService
      .getAll()
      .then(setAlmacenes)
      .catch(() => setAlmacenes([]))
      .finally(() => setLoading(false));
  }, []);

  return { almacenes, loading };
}
