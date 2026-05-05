"use client";

import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useCompras, Compra } from "../../hooks/useCompras";
import Toast from "../../ui/Toast";

interface Props {
  compra: Compra;
  onClose: () => void;
  onGuardado: () => void;
}

const ALMACEN_CENTRAL = "almacen-central";
const ALMACEN_MOVIL = "almacen-movil";

export default function RetirarModal({ compra, onClose, onGuardado }: Props) {
  const { retirar } = useCompras();
  const { toast, showToast } = useToast();

  const lineasPendientes = compra.lineas.filter(
    (l) => l.cantidadRetirada < l.cantidadTotal,
  );

  const [cantidades, setCantidades] = useState<Record<string, number>>(
    Object.fromEntries(
      lineasPendientes.map((l) => [l.id, l.cantidadTotal - l.cantidadRetirada]),
    ),
  );
  const [destino, setDestino] = useState<"CENTRAL" | "MOVIL">("CENTRAL");
  const [saving, setSaving] = useState(false);

  const handleRetirar = async () => {
    const lineasARetirar = lineasPendientes.filter(
      (l) => (cantidades[l.id] ?? 0) > 0,
    );
    if (!lineasARetirar.length) {
      showToast("Ingresá al menos una cantidad");
      return;
    }

    setSaving(true);
    try {
      const almacenId = destino === "CENTRAL" ? ALMACEN_CENTRAL : ALMACEN_MOVIL;
      await Promise.all(
        lineasARetirar.map((l) => retirar(l.id, cantidades[l.id], almacenId)),
      );
      showToast("Retiro registrado");
      onGuardado();
    } catch (e: any) {
      showToast(e.message ?? "Error al retirar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[90%] max-w-lg max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3>Retirar mercadería</h3>
              <p className="text-sm text-[var(--muted)] mt-0.5">
                {compra.proveedor || "Sin proveedor"} — {compra.fecha}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* DESTINO */}
            <div>
              <div className="sec-title">Destino</div>
              <div className="flex gap-3">
                {(["CENTRAL", "MOVIL"] as const).map((t) => (
                  <button
                    key={t}
                    className={`btn btn-sm ${destino === t ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setDestino(t)}
                  >
                    {t === "CENTRAL" ? "Casa Central" : "Depósito Móvil"}
                  </button>
                ))}
              </div>
            </div>

            {/* LINEAS */}
            <div>
              <div className="sec-title">Productos a retirar</div>
              <div className="flex flex-col gap-2">
                {lineasPendientes.map((l) => {
                  const pendiente = l.cantidadTotal - l.cantidadRetirada;
                  return (
                    <div
                      key={l.id}
                      className="flex items-center gap-3 p-3 bg-[var(--paper)] border border-[var(--border)] rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {l.producto.nombre}
                        </div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">
                          Pendiente: {pendiente} u. — Costo: ${" "}
                          {Math.round(l.precioCosto).toLocaleString("es-AR")}
                        </div>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={pendiente}
                        value={cantidades[l.id] ?? 0}
                        onChange={(e) => {
                          const val = Math.min(
                            pendiente,
                            Math.max(0, parseInt(e.target.value) || 0),
                          );
                          setCantidades((prev) => ({ ...prev, [l.id]: val }));
                        }}
                        className="w-20 text-right border border-[var(--border)] rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-[var(--gold)]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRetirar}
                disabled={saving}
              >
                {saving ? "Registrando…" : "Confirmar retiro"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
