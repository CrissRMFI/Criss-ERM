"use client";

import { useNuevaCompra } from "../../hooks/useNuevaCompra";
import { useToast } from "../../hooks/useToast";
import { useCompras } from "../../hooks/useCompras";
import LineaCompraRow from "./LineaCompraRow";
import Toast from "../../ui/Toast";

interface Props {
  onClose: () => void;
  onGuardado: () => void;
}

export default function NuevaCompraModal({ onClose, onGuardado }: Props) {
  const form = useNuevaCompra();
  const { crear } = useCompras();
  const { toast, showToast } = useToast();

  const handleGuardar = async () => {
    if (!form.validar()) {
      showToast("Agregá al menos un producto con cantidad y precio");
      return;
    }
    try {
      await crear(form.buildData());
      showToast("Compra registrada");
      form.reset();
      setTimeout(() => {
        onGuardado();
        onClose();
      }, 1200);
    } catch {
      showToast("Error al registrar compra");
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3>Nueva compra</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* DATOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="modal-field">
                <label>Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => form.setFecha(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Proveedor</label>
                <input
                  type="text"
                  placeholder="Nombre del proveedor…"
                  value={form.proveedor}
                  onChange={(e) => form.setProveedor(e.target.value)}
                />
              </div>
            </div>

            {/* PRODUCTOS */}
            <div>
              <div className="sec-title">Productos</div>
              <div className="overflow-x-auto">
                <table className="ptable">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="c">Cant.</th>
                      <th className="r pw">P. Costo</th>
                      <th className="r ps">Total</th>
                      <th className="dx"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.lineas.map((l) => (
                      <LineaCompraRow
                        key={l.id}
                        linea={l}
                        query={form.lineasSearch[l.id]?.query ?? l.nombre}
                        results={form.lineasSearch[l.id]?.results ?? []}
                        onQueryChange={form.buscarProducto}
                        onSelect={form.seleccionarProducto}
                        onChange={form.actualizarLinea}
                        onDelete={() => form.eliminarLinea(l.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="add-row-btn mt-2" onClick={form.agregarLinea}>
                + Agregar producto
              </button>
            </div>

            {/* OBSERVACIONES */}
            <div className="modal-field">
              <label>Observaciones</label>
              <textarea
                className="field-input"
                placeholder="Notas…"
                value={form.observaciones}
                onChange={(e) => form.setObservaciones(e.target.value)}
              />
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleGuardar}>
                Registrar compra
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
