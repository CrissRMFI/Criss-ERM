"use client";

import { useRef, useState } from "react";
import { useFactura } from "../../hooks/useFactura";
import { useExport } from "../../hooks/useExports";
import { useToast } from "../../hooks/useToast";
import { facturasService } from "../../services/facturas.service";
import FacturaHeader from "./FacturaHeader";
import FilaProductoRow from "./FilaProducto";
import FilaPago from "./FilaPago";
import TotalesBox from "./TotalesBox";
import CajasMovimiento from "./CajasMovimiento";
import FacturaExport from "./FacturaExport";
import SelectorCliente from "./SelectorCliente";
import Toast from "../../ui/Toast";

export default function FacturaPage() {
  const exportRef = useRef<HTMLDivElement>(null);
  const factura = useFactura();
  const { exportWA } = useExport(exportRef);
  const { toast, showToast } = useToast();
  const [waOpen, setWaOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const buildFacturaData = () => ({
    clienteId: factura.clienteSeleccionado?.id,
    clienteNombre: factura.clienteNombre,
    fecha: factura.fecha,
    subtotal: factura.subtotal,
    saldoAnterior: factura.saldoAnt === "" ? 0 : factura.saldoAnt,
    totalGeneral: factura.totalGeneral,
    totalPagado: factura.totalPagado,
    saldoPendiente: factura.saldoPendiente,
    cajaDeuda: factura.cajaDatos.deuda,
    cajaDejo: factura.cajaDatos.dejo,
    cajaRetiro: factura.cajaDatos.retiro,
    cajaNuevoSaldo: factura.cajaNuevoSaldo,
    observaciones: factura.obs,
    lineas: factura.filas.filter((f) => f.nombre),
    pagos: factura.pagos,
  });

  const handleGuardar = async () => {
    if (!factura.clienteNombre.trim()) {
      showToast("Seleccioná un cliente para continuar");
      return;
    }
    if (!factura.clienteSeleccionado) {
      showToast("El cliente debe seleccionarse de la lista");
      return;
    }
    setSaving(true);
    try {
      await facturasService.create(buildFacturaData());
      showToast("Factura guardada");
      setTimeout(() => factura.reset(), 1500);
    } catch {
      showToast("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleWA = async () => {
    setWaOpen(false);
    if (!factura.clienteNombre.trim() || !factura.clienteSeleccionado) {
      showToast("Seleccioná un cliente de la lista para continuar");
      return;
    }
    setSaving(true);
    try {
      await facturasService.create(buildFacturaData());
      await exportWA(factura.nro, factura.clienteNombre);
      setTimeout(() => factura.reset(), 1500);
    } catch {
      showToast("Error al procesar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Nueva Factura</h1>
        <div className="flex gap-2">
          <button className="btn btn-wa" onClick={() => setWaOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGuardar}
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>

      {/* INVOICE CARD */}
      <div className="card">
        <FacturaHeader
          nro={factura.nro?.toString() ?? "…"}
          fecha={factura.fecha}
          onNroChange={() => {}}
          onFechaChange={factura.setFecha}
        />

        <div className="inv-body">
          {/* CLIENTE */}
          <div>
            <div className="sec-title">Datos del cliente</div>
            <label className="field-label">Cliente</label>
            <SelectorCliente
              query={factura.clienteQuery}
              results={factura.clienteResults}
              onQueryChange={factura.setClienteQuery}
              onSelect={factura.seleccionarCliente}
              onFocus={() => factura.setClienteQuery("")}
            />
            {factura.clienteSeleccionado && (
              <div className="mt-2 px-3 py-2 bg-[var(--cream)] rounded-lg text-sm text-[var(--muted)] flex flex-wrap gap-4">
                {factura.clienteSeleccionado.telefono && (
                  <span>📞 {factura.clienteSeleccionado.telefono}</span>
                )}
                {factura.clienteSeleccionado.direccion && (
                  <span>📍 {factura.clienteSeleccionado.direccion}</span>
                )}
                {factura.clienteSeleccionado.notas && (
                  <span>📝 {factura.clienteSeleccionado.notas}</span>
                )}
              </div>
            )}
          </div>

          {/* PRODUCTOS */}
          <div>
            <div className="sec-title">Productos / Servicios</div>
            <div className="overflow-x-auto">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="c">Cant.</th>
                    <th className="pw r">P. Unit.</th>
                    <th className="ps r">Subtotal</th>
                    <th className="dx"></th>
                  </tr>
                </thead>
                <tbody>
                  {factura.filas.map((f) => (
                    <FilaProductoRow
                      key={f.id}
                      fila={f}
                      query={factura.filasSearch[f.id]?.query ?? f.nombre}
                      results={factura.filasSearch[f.id]?.results ?? []}
                      onQueryChange={factura.buscarProductoEnFila}
                      onSelect={factura.seleccionarProductoEnFila}
                      onChange={factura.actualizarFila}
                      onDelete={() => factura.eliminarFila(f.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <button className="add-row-btn" onClick={factura.agregarFila}>
              + Agregar producto
            </button>
          </div>

          {/* TOTALES */}
          <div>
            <div className="sec-title">Resumen de cuenta</div>
            <TotalesBox
              subtotal={factura.subtotal}
              saldoAnt={factura.saldoAnt}
              totalGeneral={factura.totalGeneral}
              totalPagado={factura.totalPagado}
              saldoPendiente={factura.saldoPendiente}
              onSaldoAntChange={factura.setSaldoAnt}
            />
          </div>

          {/* PAGOS */}
          <div>
            <div className="sec-title">Pagos recibidos</div>
            <div className="pay-list">
              {factura.pagos.map((p) => (
                <FilaPago
                  key={p.id}
                  pago={p}
                  tipos={factura.TIPOS_PAGO}
                  onChange={factura.actualizarPago}
                  onDelete={() => factura.eliminarPago(p.id)}
                />
              ))}
            </div>
            <button className="add-pay-btn" onClick={factura.agregarPago}>
              + Agregar pago
            </button>
          </div>

          {/* CAJAS */}
          <div>
            <div className="sec-title">Movimiento de cajas</div>
            <CajasMovimiento
              datos={factura.cajaDatos}
              nuevoSaldo={factura.cajaNuevoSaldo}
              onChange={factura.setCajaDatos}
            />
          </div>

          {/* OBSERVACIONES */}
          <div>
            <div className="sec-title">Observaciones</div>
            <textarea
              className="field-input"
              placeholder="Notas, aclaraciones…"
              value={factura.obs}
              onChange={(e) => factura.setObs(e.target.value)}
            />
          </div>
        </div>

        <div className="inv-footer">
          <span>Generado el {factura.fechaDisplay}</span>
          <span className="hidden sm:inline">
            Documento no fiscal · Solo para control interno
          </span>
        </div>
      </div>

      {/* Export invisible */}
      <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
        <div ref={exportRef}>
          <FacturaExport
            nro={factura.nro}
            fecha={factura.fecha}
            cliente={factura.clienteNombre}
            filas={factura.filas}
            subtotal={factura.subtotal}
            saldoAnt={factura.saldoAnt}
            totalGeneral={factura.totalGeneral}
            pagos={factura.pagos}
            totalPagado={factura.totalPagado}
            saldoPendiente={factura.saldoPendiente}
            cajaDatos={factura.cajaDatos}
            cajaNuevoSaldo={factura.cajaNuevoSaldo}
            obs={factura.obs}
            fechaDisplay={factura.fechaDisplay}
          />
        </div>
      </div>

      {/* Modal WhatsApp */}
      {waOpen && (
        <div
          className="modal-bg open"
          onClick={(e) => e.target === e.currentTarget && setWaOpen(false)}
        >
          <div className="modal wa-modal">
            <h3>Compartir por WhatsApp</h3>
            <p>
              En celular abre el selector nativo. En desktop descarga la imagen
              y abre WhatsApp Web.
            </p>
            <div className="modal-btns">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setWaOpen(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-wa btn-sm" onClick={handleWA}>
                Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
