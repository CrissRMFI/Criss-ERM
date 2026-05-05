"use client";

import { useState } from "react";
import { useClientes, ClienteConDeuda } from "../../hooks/useClientes";
import { useToast } from "../../hooks/useToast";
import ClienteModal from "./ClienteModal";
import ClienteRow from "./ClienteRow";
import HistorialCliente from "./HistorialCliente";
import Toast from "../../ui/Toast";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<ClienteConDeuda | null>(null);
  const [historialCliente, setHistorialCliente] =
    useState<ClienteConDeuda | null>(null);
  const { clientes, loading, crear, actualizar, toggleActivo } = useClientes(
    search,
    !mostrarInactivos,
  );
  const { toast, showToast } = useToast();

  const handleSave = async (data: any) => {
    if (editando) {
      await actualizar(editando.id, data);
      showToast("Cliente actualizado");
    } else {
      await crear(data);
      showToast("Cliente agregado");
    }
  };

  const handleToggle = async (c: ClienteConDeuda) => {
    await toggleActivo(c.id, !c.activo);
    showToast(c.activo ? "Cliente desactivado" : "Cliente activado");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Clientes</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setModalOpen(true);
          }}
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="search-bar flex-1 min-w-[200px] mb-0">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={(e) => setMostrarInactivos(e.target.checked)}
          />
          Mostrar inactivos
        </label>
      </div>

      <div className="prod-count">
        {loading
          ? ""
          : `${clientes.length} cliente${clientes.length !== 1 ? "s" : ""}`}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            {search
              ? `Sin resultados para "${search}"`
              : "No hay clientes aún."}
          </div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th className="hidden md:table-cell">Dirección</th>
                <th className="r">Deuda actual</th>
                <th className="hidden sm:table-cell">Estado</th>
                <th className="r">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <ClienteRow
                  key={c.id}
                  cliente={c}
                  onHistorial={(c) => router.push(`/clientes/${c.id}`)}
                  onEditar={(c) => {
                    setEditando(c);
                    setModalOpen(true);
                  }}
                  onToggle={handleToggle}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ClienteModal
        open={modalOpen}
        cliente={editando}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      {historialCliente && (
        <HistorialCliente
          clienteId={historialCliente.id}
          clienteNombre={historialCliente.nombre}
          onClose={() => setHistorialCliente(null)}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
