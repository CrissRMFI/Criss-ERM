"use client";

import { useRouter } from "next/navigation";

interface ProductoFaltante {
  nombre: string;
  disponible: number;
  solicitado: number;
}

interface Props {
  errores: ProductoFaltante[];
  onClose: () => void;
}

export default function StockInsuficienteModal({ errores, onClose }: Props) {
  const router = useRouter();

  const handleTraslado = () => {
    onClose();
    router.push("/traslados/nuevo?desde=almacen-central");
  };

  return (
    <div className="modal-bg open">
      <div className="modal w-[90%] max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-[var(--rust)] text-sm font-bold">!</span>
          </div>
          <h3 className="text-[var(--rust)]">Stock insuficiente</h3>
        </div>

        <p className="text-sm text-[var(--muted)] mb-4">
          No hay suficiente stock en el Depósito Móvil para los siguientes
          productos:
        </p>

        <div className="flex flex-col gap-2 mb-5">
          {errores.map((e) => (
            <div
              key={e.nombre}
              className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
            >
              <span className="font-medium text-sm">{e.nombre}</span>
              <div className="text-right">
                <div className="text-xs text-[var(--muted)]">
                  Disponible:{" "}
                  <span className="font-bold text-[var(--rust)]">
                    {e.disponible}
                  </span>
                </div>
                <div className="text-xs text-[var(--muted)]">
                  Solicitado: <span className="font-bold">{e.solicitado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleTraslado}>
            Ir a Traslados
          </button>
        </div>
      </div>
    </div>
  );
}
