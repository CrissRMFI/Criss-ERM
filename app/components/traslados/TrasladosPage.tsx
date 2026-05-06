"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../hooks/useToast";
import { trasladosService } from "../../services/traslados.service";
import NuevoTrasladoModal from "./NuevoTrasladoModal";
import Toast from "../../ui/Toast";

export default function TrasladosPage() {
  const [traslados, setTraslados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast, showToast } = useToast();

  const fetchTraslados = useCallback(async () => {
    setLoading(true);
    try {
      setTraslados(await trasladosService.getAll());
    } catch {
      showToast("Error al cargar traslados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTraslados();
  }, [fetchTraslados]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Traslados</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Nuevo traslado
        </button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : traslados.length === 0 ? (
          <div className="empty-state">No hay traslados registrados.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {traslados.map((t) => (
                <tr key={t.id}>
                  <td>{t.fecha}</td>
                  <td className="font-medium">{t.origen.nombre}</td>
                  <td className="font-medium">{t.destino.nombre}</td>
                  <td>
                    <div className="flex flex-col gap-0.5">
                      {t.lineas.map((l: any) => (
                        <span key={l.id} className="text-sm">
                          {l.producto.nombre} —{" "}
                          <span className="text-[var(--muted)]">
                            {l.cantidad} u.
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <NuevoTrasladoModal
          onClose={() => setModalOpen(false)}
          onGuardado={fetchTraslados}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
