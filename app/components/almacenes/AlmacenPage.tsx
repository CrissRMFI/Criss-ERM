"use client";

import { useState } from "react";
import { useStock } from "../../hooks/useStock";
import { useAlmacenes } from "../../hooks/useAlmacenes";
import StockTable from "./StockTable";
import Link from "next/link";

interface Props {
  almacenId: string;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function AlmacenPage({ almacenId }: Props) {
  const [search, setSearch] = useState("");
  const { stock, totalValor, loading, error } = useStock(almacenId);
  const { almacenes } = useAlmacenes();
  const almacen = almacenes.find((a) => a.id === almacenId);

  const filtrado = stock.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  if (error)
    return <div className="empty-state">Error al cargar el stock.</div>;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <Link
            href="/almacenes"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-1 block"
          >
            ← Almacenes
          </Link>
          <h1 className="page-title">{almacen?.nombre ?? "Almacén"}</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-sm text-[var(--muted)]">
            <span>
              {loading
                ? ""
                : `${stock.length} producto${stock.length !== 1 ? "s" : ""}`}
            </span>
            {!loading && totalValor >= 0 && (
              <span className="font-bold text-[var(--ink)]">
                Total: {fmt(totalValor)}
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/traslados/nuevo?desde=${almacenId}`}
          className="btn btn-primary"
        >
          + Trasladar desde aquí
        </Link>
      </div>
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Buscar producto…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-x-auto">
        <StockTable stock={filtrado} loading={loading} search={search} />
      </div>
    </>
  );
}
