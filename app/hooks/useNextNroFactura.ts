import { useState, useEffect } from "react";
import { facturasService } from "../services/facturas.service";

export function useNextNroFactura() {
  const [nro, setNro] = useState<number | null>(null);

  useEffect(() => {
    facturasService
      .getNextNumero()
      .then(setNro)
      .catch(() => setNro(null));
  }, []);

  return nro;
}
