"use client";

import { useState, useEffect } from "react";
import { Cliente } from "../../types";

interface Props {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onSave: (data: {
    nombre: string;
    telefono?: string;
    direccion?: string;
    notas?: string;
  }) => Promise<void>;
}

export default function ClienteModal({
  open,
  cliente,
  onClose,
  onSave,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setNombre(cliente?.nombre ?? "");
      setTelefono(cliente?.telefono ?? "");
      setDireccion(cliente?.direccion ?? "");
      setNotas(cliente?.notas ?? "");
      setError("");
    }
  }, [open, cliente]);

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
        direccion: direccion.trim() || undefined,
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
        <h3 className="mb-4">{cliente ? "Editar cliente" : "Nuevo cliente"}</h3>

        <div className="modal-field">
          <label>Nombre *</label>
          <input
            type="text"
            placeholder="Nombre completo…"
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
          <label>Dirección</label>
          <input
            type="text"
            placeholder="Ej: Av. Corrientes 1234"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Notas internas</label>
          <textarea
            className="field-input"
            placeholder="Ej: paga los viernes, no fiar más de $50.000…"
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
