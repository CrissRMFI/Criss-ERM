"use client";

import { useState } from "react";
import { Cliente } from "../../types";
import { useClientes } from "../../hooks/useClientes";
import { useToast } from "../../hooks/useToast";
import { useHistorial } from "../../hooks/useHistorial";
import ClienteModal from "./ClienteModal";
import Toast from "../../ui/Toast";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

function HistorialCliente({
  clienteId,
  onClose,
}: {
  clienteId: string;
  onClose: () => void;
}) {
  const { facturas, loading } = useHistorial(clienteId);

  return (
    <div
      className="modal-bg open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal"
        style={{
          width: "90%",
          maxWidth: 620,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3>Historial de facturas</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : facturas.length === 0 ? (
          <div className="empty-state">Sin facturas aún.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th className="r">Total</th>
                <th className="r">Pagado</th>
                <th className="r">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((f: any) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 700, color: "var(--gold)" }}>
                    #{f.numero}
                  </td>
                  <td>{f.fecha}</td>
                  <td className="r" style={{ fontWeight: 600 }}>
                    {fmt(f.totalGeneral)}
                  </td>
                  <td className="r" style={{ color: "var(--sage)" }}>
                    {fmt(f.totalPagado)}
                  </td>
                  <td
                    className="r"
                    style={{
                      fontWeight: 700,
                      color:
                        f.saldoPendiente > 0 ? "var(--rust)" : "var(--sage)",
                    }}
                  >
                    {fmt(f.saldoPendiente)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [historialId, setHistorialId] = useState<string | null>(null);
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

  const handleToggle = async (c: Cliente) => {
    await toggleActivo(c.id, !c.activo);
    showToast(c.activo ? "Cliente desactivado" : "Cliente activado");
  };

  return (
    <>
      <div className="page-header">
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

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "0.83rem",
            color: "var(--muted)",
            cursor: "pointer",
          }}
        >
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

      <div className="card" style={{ overflowX: "auto" }}>
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
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th className="r">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id} style={{ opacity: c.activo ? 1 : 0.5 }}>
                  <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                  <td style={{ color: "var(--muted)" }}>{c.telefono || "—"}</td>
                  <td style={{ color: "var(--muted)" }}>
                    {c.direccion || "—"}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: c.activo ? "#e8f5e9" : "#f5f5f5",
                        color: c.activo ? "var(--sage)" : "var(--muted)",
                      }}
                    >
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="r">
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setHistorialId(c.id)}
                      >
                        Historial
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditando(c);
                          setModalOpen(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={`btn btn-sm ${c.activo ? "btn-danger" : "btn-ghost"}`}
                        onClick={() => handleToggle(c)}
                      >
                        {c.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
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

      {historialId && (
        <HistorialCliente
          clienteId={historialId}
          onClose={() => setHistorialId(null)}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
