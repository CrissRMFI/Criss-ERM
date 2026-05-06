"use client";

import { useEffect } from "react";
import { useNuevoTraslado } from "../../hooks/useNuevoTraslado";
import { useStock } from "../../hooks/useStock";
import { useToast } from "../../hooks/useToast";
import { trasladosService } from "../../services/traslados.service";
import Toast from "../../ui/Toast";

interface Props {
  onClose: () => void;
  onGuardado: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function NuevoTrasladoModal({ onClose, onGuardado }: Props) {
  const t = useNuevoTraslado();
  const { stock, loading: loadingStock } = useStock(t.origenId);
  const { toast, showToast } = useToast();

  // Cargar stock cuando cambia el origen
  useEffect(() => {
    if (!loadingStock) t.cargarStock(stock);
  }, [stock, loadingStock]);

  const handleGuardar = async () => {
    if (!t.validar()) {
      showToast("Ingresá al menos una cantidad a trasladar");
      return;
    }
    try {
      await trasladosService.create(t.buildData());
      showToast("Traslado registrado");
      t.reset();
      setTimeout(() => {
        onGuardado();
        onClose();
      }, 1200);
    } catch (e: any) {
      showToast(e.message ?? "Error al registrar traslado");
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3>Nuevo traslado</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* ORIGEN / DESTINO */}
            <div>
              <div className="sec-title">Origen</div>
              <div className="flex gap-3">
                {(["CENTRAL", "MOVIL"] as const).map((tipo) => (
                  <button
                    key={tipo}
                    className={`btn btn-sm ${t.origenTipo === tipo ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => t.setOrigenTipo(tipo)}
                  >
                    {tipo === "CENTRAL" ? "Casa Central" : "Depósito Móvil"}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                → Destino: <strong>{t.destinoNombre}</strong>
              </p>
            </div>

            {/* FECHA */}
            <div className="modal-field">
              <label>Fecha</label>
              <input
                type="date"
                value={t.fecha}
                onChange={(e) => t.setFecha(e.target.value)}
              />
            </div>

            {/* STOCK DISPONIBLE */}
            <div>
              <div className="sec-title">
                Stock disponible — ingresá la cantidad a trasladar
              </div>

              {loadingStock ? (
                <div className="empty-state">Cargando stock…</div>
              ) : t.lineas.length === 0 ? (
                <div className="empty-state">Sin stock en este almacén.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {t.lineas.map((l) => (
                    <div
                      key={l.loteId}
                      className="flex items-center gap-3 p-3 bg-[var(--paper)] border border-[var(--border)] rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {l.nombre}
                        </div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">
                          Disponible: {l.cantidadDisponible} u. — Costo:{" "}
                          {fmt(l.precioCosto)}
                        </div>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={l.cantidadDisponible}
                        value={l.cantidad || ""}
                        placeholder="0"
                        onChange={(e) =>
                          t.actualizarCantidad(
                            l.loteId,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-20 text-right border border-[var(--border)] rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-[var(--gold)]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RESUMEN */}
            {t.lineasActivas.length > 0 && (
              <div className="totals-box">
                <div className="sec-title">Resumen</div>
                {t.lineasActivas.map((l) => (
                  <div key={l.loteId} className="t-row">
                    <span className="t-lbl">{l.nombre}</span>
                    <span className="t-val">{l.cantidad} u.</span>
                  </div>
                ))}
              </div>
            )}

            {/* OBSERVACIONES */}
            <div className="modal-field">
              <label>Observaciones</label>
              <textarea
                className="field-input"
                placeholder="Notas…"
                value={t.observaciones}
                onChange={(e) => t.setObservaciones(e.target.value)}
              />
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleGuardar}>
                Confirmar traslado
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
