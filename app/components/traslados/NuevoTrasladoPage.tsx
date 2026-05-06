"use client";

import { useEffect, useState } from "react";
import { useAlmacenes } from "../../hooks/useAlmacenes";
import { useStock } from "../../hooks/useStock";
import { useNuevoTraslado } from "../../hooks/useNuevoTraslado";
import { useToast } from "../../hooks/useToast";
import { trasladosService } from "../../services/traslados.service";
import { useRouter } from "next/navigation";
import Toast from "../../ui/Toast";
import Link from "next/link";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function NuevoTrasladoPage() {
  const router = useRouter();
  const { almacenes } = useAlmacenes();
  const { toast, showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const t = useNuevoTraslado(almacenes);
  const { stock, loading: loadingStock } = useStock(t.origenId);

  useEffect(() => {
    if (!loadingStock && t.origenId) {
      t.cargarStock(stock);
    }
  }, [stock, loadingStock, t.origenId]);

  const handleGuardar = async () => {
    if (!t.validar()) {
      if (!t.origenId || !t.destinoId) {
        showToast("Seleccioná origen y destino");
        return;
      }
      if (t.origenId === t.destinoId) {
        showToast("El origen y destino no pueden ser iguales");
        return;
      }
      showToast("Ingresá al menos una cantidad a trasladar");
      return;
    }
    setSaving(true);
    try {
      await trasladosService.create(t.buildData());
      showToast("Traslado registrado");
      setTimeout(() => router.push("/traslados"), 1200);
    } catch (e: any) {
      showToast(e.message ?? "Error al registrar traslado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <Link
            href="/traslados"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-1 block"
          >
            ← Traslados
          </Link>
          <h1 className="page-title">Nuevo traslado</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleGuardar}
          disabled={saving}
        >
          {saving ? "Registrando…" : "Confirmar traslado"}
        </button>
      </div>

      <div className="card p-6 flex flex-col gap-6">
        {/* ORIGEN / DESTINO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Origen</label>
            <select
              className="field-input"
              value={t.origenId}
              onChange={(e) => {
                t.setOrigenId(e.target.value);
                t.setDestinoId("");
              }}
            >
              <option value="">Seleccioná un almacén…</option>
              {almacenes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Destino</label>
            <select
              className="field-input"
              value={t.destinoId}
              onChange={(e) => t.setDestinoId(e.target.value)}
              disabled={!t.origenId}
            >
              <option value="">Seleccioná un almacén…</option>
              {almacenes
                .filter((a) => a.id !== t.origenId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* FECHA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Fecha</label>
            <input
              type="date"
              className="field-input"
              value={t.fecha}
              onChange={(e) => t.setFecha(e.target.value)}
            />
          </div>
        </div>

        {/* STOCK */}
        {t.origenId && (
          <div>
            <div className="sec-title">
              Stock en {t.origen?.nombre} — ingresá la cantidad a trasladar
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
                    className={`flex flex-wrap items-center gap-3 p-3 border rounded-lg transition-colors
                      ${l.cantidad > 0 ? "border-[var(--gold)] bg-[var(--cream)]" : "border-[var(--border)] bg-[var(--paper)]"}
                      ${l.esNegativo ? "border-[var(--rust)]" : ""}
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{l.nombre}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        Disponible: {l.cantidadDisponible} u.
                        {l.esNegativo && (
                          <span className="text-[var(--rust)] ml-2 font-semibold">
                            ⚠ Quedarás debiendo{" "}
                            {l.cantidad - l.cantidadDisponible} u.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Costo editable */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[var(--muted)]">
                        Costo:
                      </span>
                      <input
                        type="number"
                        step="1"
                        value={l.precioCosto || ""}
                        onChange={(e) =>
                          t.actualizarCosto(
                            l.loteId,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-24 text-right border border-[var(--border)] rounded-lg px-2 py-1 text-xs outline-none focus:border-[var(--gold)]"
                      />
                    </div>

                    {/* Cantidad */}
                    <input
                      type="number"
                      min={0}
                      value={l.cantidad || ""}
                      placeholder="0"
                      onChange={(e) =>
                        t.actualizarCantidad(
                          l.loteId,
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className={`w-20 text-right border rounded-lg px-2 py-1 text-sm font-bold outline-none
                        ${
                          l.esNegativo
                            ? "border-[var(--rust)] focus:border-[var(--rust)]"
                            : "border-[var(--border)] focus:border-[var(--gold)]"
                        }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESUMEN */}
        {t.lineasActivas.length > 0 && (
          <div>
            <div className="sec-title">Resumen del traslado</div>
            <div className="totals-box">
              {t.lineasActivas.map((l) => (
                <div key={l.loteId} className="t-row">
                  <span className="t-lbl">{l.nombre}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--muted)]">
                      {fmt(l.precioCosto)} c/u
                    </span>
                    <span className="t-val">{l.cantidad} u.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OBSERVACIONES */}
        <div>
          <label className="field-label">Observaciones</label>
          <textarea
            className="field-input"
            placeholder="Notas…"
            value={t.observaciones}
            onChange={(e) => t.setObservaciones(e.target.value)}
          />
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
