"use client";

import Link from "next/link";
import { useAlmacenes } from "../../hooks/useAlmacenes";

const TIPO_LABEL: Record<string, string> = {
  CENTRAL: "Casa Central",
  MOVIL: "Depósito Móvil",
  EXTERNO: "Externo",
};

const TIPO_COLOR: Record<string, string> = {
  CENTRAL: "bg-blue-100 text-blue-700",
  MOVIL: "bg-green-100 text-[var(--sage)]",
  EXTERNO: "bg-yellow-100 text-yellow-700",
};

export default function AlmacenesListPage() {
  const { almacenes, loading } = useAlmacenes();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Almacenes</h1>
      </div>

      {loading ? (
        <div className="empty-state">Cargando…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {almacenes.map((a) => (
            <Link
              key={a.id}
              href={`/almacenes/${a.id}`}
              className="card p-5 hover:shadow-lg transition-shadow cursor-pointer block"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-serif text-xl text-[var(--ink)]">
                    {a.nombre}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-2 inline-block ${TIPO_COLOR[a.tipo]}`}
                  >
                    {TIPO_LABEL[a.tipo]}
                  </span>
                </div>
                <span className="text-[var(--muted)] text-lg">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
