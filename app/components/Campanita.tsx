"use client";

import { useState } from "react";
import { useNotificaciones } from "../hooks/useNotificaciones";

export default function Campanita() {
  const { notificaciones, cantidad, marcarLeida } = useNotificaciones();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-[#9e8f75] hover:text-[#e8d5a3] transition-colors p-1"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {cantidad > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--rust)] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {cantidad > 9 ? "9+" : cantidad}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Overlay para cerrar */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-8 w-80 bg-white rounded-xl shadow-xl border border-[var(--border)] z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--cream)]">
              <span className="text-sm font-bold text-[var(--ink)]">
                Notificaciones
              </span>
            </div>

            {notificaciones.length === 0 ? (
              <div className="px-4 py-6 text-sm text-[var(--muted)] text-center">
                Sin notificaciones pendientes
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notificaciones.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      marcarLeida(n);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--cream)] cursor-pointer border-b border-[var(--cream)] last:border-0"
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[var(--rust)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--ink)] leading-snug">
                        {n.mensaje}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {new Date(n.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
