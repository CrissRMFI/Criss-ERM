"use client";

import { useState } from "react";
import { Producto } from "../../types";
import { useProductos } from "../../hooks/useProductos";
import { useToast } from "../../hooks/useToast";
import ProductosTable from "./ProductosTable";
import ProductoModal from "./ProdcutoModal";
import Toast from "../../ui/Toast";

export default function ProductosPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const { productos, loading, crear, actualizar, eliminar } =
    useProductos(search);
  const { toast, showToast } = useToast();

  const handleSave = async (data: { nombre: string; precio: number }) => {
    if (editando) {
      await actualizar(editando.id, data);
      showToast("Producto actualizado");
    } else {
      await crear(data);
      showToast("Producto agregado");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await eliminar(id);
    showToast("Producto eliminado");
  };

  const abrirNuevo = () => {
    setEditando(null);
    setModalOpen(true);
  };
  const abrirEditar = (p: Producto) => {
    setEditando(p);
    setModalOpen(true);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Base de Productos</h1>
        <button className="btn btn-primary" onClick={abrirNuevo}>
          + Nuevo producto
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="prod-count">
        {loading
          ? ""
          : `${productos.length} producto${productos.length !== 1 ? "s" : ""}`}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <ProductosTable
          productos={productos}
          loading={loading}
          search={search}
          onEdit={abrirEditar}
          onDelete={handleDelete}
        />
      </div>

      <ProductoModal
        open={modalOpen}
        producto={editando}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
