"use client";

import { useState } from "react";
import { useStock } from "../../hooks/useStock";
import StockTable from "./StockTable";

interface Props {
  almacenId: string;
  titulo: string;
}

export default function AlmacenPage({ almacenId, titulo }: Props) {
  const [search, setSearch] = useState("");
  const { stock, loading, error } = useStock(almacenId);

  const filtrado = stock.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  if (error)
    return <div className="empty-state">Error al cargar el stock.</div>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">{titulo}</h1>
        <div className="text-sm text-[var(--muted)]">
          {loading
            ? ""
            : `${stock.length} producto${stock.length !== 1 ? "s" : ""}`}
        </div>
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
