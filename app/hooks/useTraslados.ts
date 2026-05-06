import { useState, useEffect, useCallback } from "react";
import { trasladosService } from "../services/traslados.service";

export interface TrasladoLinea {
  id: string;
  productoId: string;
  producto: { nombre: string };
  cantidad: number;
  precioCosto: number;
}

export interface Traslado {
  id: string;
  numeroMovimiento: number;
  fecha: string;
  observaciones: string;
  origenId: string;
  destinoId: string;
  origen: { id: string; nombre: string; tipo: string };
  destino: { id: string; nombre: string; tipo: string };
  lineas: TrasladoLinea[];
  createdAt: string;
}

export function useTraslados(almacenId?: string) {
  const [traslados, setTraslados] = useState<Traslado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraslados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTraslados(await trasladosService.getAll(almacenId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [almacenId]);

  useEffect(() => {
    fetchTraslados();
  }, [fetchTraslados]);

  return { traslados, loading, error, refetch: fetchTraslados };
}
