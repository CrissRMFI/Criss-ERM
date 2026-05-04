"use client";

import { useState, useEffect } from "react";
import { Producto } from "../../types";

interface Props {
  open: boolean;
  producto: Producto | null; // null = nuevo, objeto = editar
  onClose: () => void;
  onSave: (data: { nombre: string; precio: number }) => Promise<void>;
}

export default function ProductoModal({
  open,
  producto,
  onClose,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(producto?.nombre ?? "");
      setPrecio(producto?.precio?.toString() ?? "");
      setError("");
    }
  }, [open, producto]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      setError("Ingresá el nombre");
      return;
    }
    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum < 0) {
      setError("Ingresá un precio válido");
      return;
    }

    setSaving(true);
    try {
      await onSave({ nombre: nombre.trim(), precio: precioNum });
      onClose();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="modal-bg open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>{producto ? "Editar producto" : "Nuevo producto"}</h3>

        <div className="modal-field">
          <label>Nombre del producto</label>
          <input
            type="text"
            placeholder="Ej: Leche entera 1L"
            value={nombre}
            autoFocus
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        <div className="modal-field">
          <label>Precio de venta</label>
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>

        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

        <div className="modal-btns">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
