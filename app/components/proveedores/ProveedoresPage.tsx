"use client";

import { useState } from "react";
import { useProveedores, Proveedor } from "../../hooks/useProveedores";
import { useToast } from "../../hooks/useToast";
import ProveedorModal from "./ProveedorModal";
import Toast from "../../ui/Toast";

export default function ProveedoresPage() {
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const { proveedores, loading, crear, actualizar, toggleActivo } =
    useProveedores(!mostrarInactivos);
  const { toast, showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Proveedor | null>(null);

  const handleSave = async (data: any) => {
    if (editando) {
      await actualizar(editando.id, data);
      showToast("Proveedor actualizado");
    } else {
      await crear(data);
      showToast("Proveedor agregado");
    }
  };

  const handleToggle = async (p: Proveedor) => {
    await toggleActivo(p.id, !p.activo);
    showToast(p.activo ? "Proveedor desactivado" : "Proveedor activado");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Proveedores</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setModalOpen(true);
          }}
        >
          + Nuevo proveedor
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={(e) => setMostrarInactivos(e.target.checked)}
          />
          Mostrar inactivos
        </label>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : proveedores.length === 0 ? (
          <div className="empty-state">No hay proveedores aún.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="hidden sm:table-cell">Teléfono</th>
                <th className="hidden md:table-cell">Notas</th>
                <th>Estado</th>
                <th className="r">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.id} className={p.activo ? "" : "opacity-50"}>
                  <td className="font-semibold">{p.nombre}</td>
                  <td className="hidden sm:table-cell text-[var(--muted)]">
                    {p.telefono || "—"}
                  </td>
                  <td className="hidden md:table-cell text-[var(--muted)] text-sm">
                    {p.notas || "—"}
                  </td>
                  <td>
                    <span
                      className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
                      ${p.activo ? "bg-green-100 text-[var(--sage)]" : "bg-gray-100 text-[var(--muted)]"}`}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="r">
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditando(p);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={`btn btn-sm hidden sm:inline-flex ${p.activo ? "btn-danger" : "btn-ghost"}`}
                        onClick={() => handleToggle(p)}
                      >
                        {p.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProveedorModal
        open={modalOpen}
        proveedor={editando}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
