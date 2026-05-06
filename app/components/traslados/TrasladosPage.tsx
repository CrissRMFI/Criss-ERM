"use client";

import Link from "next/link";
import { useTraslados } from "../../hooks/useTraslados";
import { useRouter } from "next/navigation";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function TrasladosPage() {
  const { traslados, loading, error } = useTraslados();
  const router = useRouter();

  if (error)
    return <div className="empty-state">Error al cargar traslados.</div>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Traslados</h1>
        <Link href="/traslados/nuevo" className="btn btn-primary">
          + Nuevo traslado
        </Link>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : traslados.length === 0 ? (
          <div className="empty-state">No hay traslados registrados.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>MOV</th>
                <th className="hidden sm:table-cell">Fecha</th>
                <th>Origen</th>
                <th>Destino</th>
                <th className="hidden md:table-cell">Productos</th>
              </tr>
            </thead>
            <tbody>
              {traslados.map((t) => (
                <tr
                  key={t.id}
                  className="cursor-pointer hover:bg-[var(--paper)]"
                  onClick={() => router.push(`/traslados/${t.id}`)}
                >
                  <td className="font-bold text-[var(--gold)]">
                    MOV-{String(t.numeroMovimiento).padStart(3, "0")}
                  </td>
                  <td className="hidden sm:table-cell text-sm">{t.fecha}</td>
                  <td className="font-medium">{t.origen.nombre}</td>
                  <td className="font-medium">{t.destino.nombre}</td>
                  <td className="hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      {t.lineas.map((l) => (
                        <span key={l.id} className="text-sm">
                          {l.producto.nombre} —{" "}
                          <span className="text-[var(--muted)]">
                            {l.cantidad} u.
                          </span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
