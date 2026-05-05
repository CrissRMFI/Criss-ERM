"use client";

import { useState } from "react";
import { useHistorial } from "../../hooks/useHistorial";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function HistorialPage() {
  const { facturas, loading, error } = useHistorial();
  const [search, setSearch] = useState("");
  const [detalle, setDetalle] = useState<any | null>(null);

  const filtradas = facturas.filter(
    (f) =>
      f.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      String(f.numero).includes(search),
  );

  if (error)
    return <div className="empty-state">Error al cargar el historial.</div>;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Historial</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por cliente o número…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="prod-count">
        {loading
          ? ""
          : `${filtradas.length} factura${filtradas.length !== 1 ? "s" : ""}`}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">No hay facturas aún.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th className="r">Total</th>
                <th className="r">Pagado</th>
                <th className="r">Pendiente</th>
                <th className="r"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 700, color: "var(--gold)" }}>
                    #{f.numero}
                  </td>
                  <td>{f.fecha}</td>
                  <td>{f.clienteNombre}</td>
                  <td className="r" style={{ fontWeight: 600 }}>
                    {fmt(f.totalGeneral)}
                  </td>
                  <td
                    className="r"
                    style={{ color: "var(--sage)", fontWeight: 600 }}
                  >
                    {fmt(f.totalPagado)}
                  </td>
                  <td
                    className="r"
                    style={{
                      color:
                        f.saldoPendiente > 0.005
                          ? "var(--rust)"
                          : "var(--sage)",
                      fontWeight: 700,
                    }}
                  >
                    {fmt(f.saldoPendiente)}
                  </td>
                  <td className="r">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setDetalle(f)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DETALLE */}
      {detalle && (
        <div
          className="modal-bg open"
          onClick={(e) => e.target === e.currentTarget && setDetalle(null)}
        >
          <div
            className="modal"
            style={{
              width: "90%",
              maxWidth: 560,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3>Factura #{detalle.numero}</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDetalle(null)}
              >
                Cerrar
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                fontSize: "0.88rem",
              }}
            >
              <div>
                <div className="sec-title">Cliente</div>
                <p style={{ fontWeight: 600, marginTop: 4 }}>
                  {detalle.cliente}
                </p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                  {detalle.fecha}
                </p>
              </div>

              <div>
                <div className="sec-title">Productos</div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.84rem",
                  }}
                >
                  <thead>
                    <tr style={{ background: "var(--cream)" }}>
                      <th
                        style={{
                          padding: "6px 10px",
                          textAlign: "left",
                          fontSize: "0.6rem",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Producto
                      </th>
                      <th
                        style={{
                          padding: "6px 10px",
                          textAlign: "center",
                          fontSize: "0.6rem",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Cant.
                      </th>
                      <th
                        style={{
                          padding: "6px 10px",
                          textAlign: "right",
                          fontSize: "0.6rem",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.lineas.map((l: any) => (
                      <tr
                        key={l.id}
                        style={{ borderBottom: "1px solid var(--cream)" }}
                      >
                        <td style={{ padding: "6px 10px" }}>{l.nombre}</td>
                        <td
                          style={{ padding: "6px 10px", textAlign: "center" }}
                        >
                          {l.qty}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            textAlign: "right",
                            fontWeight: 600,
                          }}
                        >
                          {fmt(l.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {detalle.pagos.length > 0 && (
                <div>
                  <div className="sec-title">Pagos</div>
                  {detalle.pagos.map((p: any) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "5px 0",
                        borderBottom: "1px solid var(--cream)",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{p.tipo}</span>
                      {p.detalle && (
                        <span
                          style={{
                            color: "var(--muted)",
                            flex: 1,
                            marginLeft: 10,
                          }}
                        >
                          {p.detalle}
                        </span>
                      )}
                      <span style={{ fontWeight: 700 }}>{fmt(p.monto)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="totals-box">
                <div className="t-row">
                  <span className="t-lbl">Total General</span>
                  <span className="t-val">{fmt(detalle.totalGeneral)}</span>
                </div>
                <div className="t-row">
                  <span className="t-lbl">Total Pagado</span>
                  <span className="t-val" style={{ color: "var(--sage)" }}>
                    {fmt(detalle.totalPagado)}
                  </span>
                </div>
                <div className="t-row grand">
                  <span className="t-lbl">Saldo Pendiente</span>
                  <span
                    className="t-val"
                    style={{
                      color:
                        detalle.saldoPendiente > 0.005
                          ? "var(--rust)"
                          : "var(--sage)",
                    }}
                  >
                    {fmt(detalle.saldoPendiente)}
                  </span>
                </div>
              </div>

              {
                <div>
                  <div className="sec-title">Movimiento de cajas</div>
                  <div className="cajas-grid" style={{ marginBottom: 10 }}>
                    {[
                      { label: "Deuda", value: detalle.cajaDeuda },
                      { label: "Dejo", value: detalle.cajaDejo },
                      { label: "Retiro", value: detalle.cajaRetiro },
                    ].map(({ label, value }) => (
                      <div className="caja" key={label}>
                        <label className="caja-lbl">{label}</label>
                        <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                          {value ?? 0}{" "}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="totals-box">
                    <div className="t-row grand">
                      <span className="t-lbl">Nuevo saldo en cajas</span>
                      <span
                        className="t-val"
                        style={{
                          color:
                            detalle.cajaNuevoSaldo > 0
                              ? "var(--rust)"
                              : "var(--sage)",
                        }}
                      >
                        {Math.round(detalle.cajaNuevoSaldo)} cajas
                      </span>
                    </div>
                  </div>
                </div>
              }

              {
                <div>
                  <div className="sec-title">Observaciones</div>
                  <div
                    style={{
                      background: "var(--cream)",
                      borderRadius: 8,
                      padding: "12px 14px",
                      fontSize: "0.84rem",
                      color: "var(--ink)",
                      lineHeight: 1.65,
                      borderLeft: "3px solid var(--gold)",
                    }}
                  >
                    {detalle.observaciones || "Sin observaciones."}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
