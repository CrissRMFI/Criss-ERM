import { useState, useEffect, useCallback } from "react";
import { notificacionesService } from "../services/notificaciones.service";
import { useRouter } from "next/navigation";

export interface Notificacion {
  id: string;
  tipo: string;
  mensaje: string;
  leida: boolean;
  url: string;
  createdAt: string;
}

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const router = useRouter();

  const fetchNotificaciones = useCallback(async () => {
    try {
      setNotificaciones(await notificacionesService.getAll());
    } catch {
      setNotificaciones([]);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
    // Polling cada 30 segundos
    const interval = setInterval(fetchNotificaciones, 30000);
    return () => clearInterval(interval);
  }, [fetchNotificaciones]);

  const marcarLeida = async (notif: Notificacion) => {
    await notificacionesService.marcarLeida(notif.id);
    setNotificaciones((prev) => prev.filter((n) => n.id !== notif.id));
    router.push(notif.url);
  };

  return {
    notificaciones,
    cantidad: notificaciones.length,
    marcarLeida,
    refetch: fetchNotificaciones,
  };
}
