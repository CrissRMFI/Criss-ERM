"use client";

import { useState, useEffect } from "react";
import { Proveedor } from "../../hooks/useProveedores";

interface Props {
  open: boolean;
  proveedor: Proveedor | null;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    telefono?: string;
    notas?: string;
  }) => Promise<void>;
}

export default function ProveedorModal({
  open,
  proveedor,
  onClose,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(proveedor?.nombre ?? "");
      setTelefono(proveedor?.telefono ?? "");
      setNotas(proveedor?.notas ?? "");
      setError("");
    }
  }, [open, proveedor]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        nombre: nombre.trim(),
        telefono: telefono.trim() || undefined,
        notas: notas.trim() || undefined,
      });
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
      <div className="modal w-[90%] max-w-md">
        <h3 className="mb-4">
          {proveedor ? "Editar proveedor" : "Nuevo proveedor"}
        </h3>

        <div className="modal-field">
          <label>Nombre *</label>
          <input
            type="text"
            placeholder="Nombre del proveedor…"
            value={nombre}
            autoFocus
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
        </div>
        <div className="modal-field">
          <label>Teléfono</label>
          <input
            type="text"
            placeholder="Ej: 11 1234-5678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Notas</label>
          <textarea
            className="field-input"
            placeholder="Notas internas…"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-[var(--rust)] mt-1">{error}</p>}

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
