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

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Base de Productos</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setModalOpen(true);
          }}
        >
          + Nuevo producto
        </button>
      </div>

      <div className="search-bar mb-4">
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

      <div className="card overflow-x-auto">
        <ProductosTable
          productos={productos}
          loading={loading}
          search={search}
          onEdit={(p) => {
            setEditando(p);
            setModalOpen(true);
          }}
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
