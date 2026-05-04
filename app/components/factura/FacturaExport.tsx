import { FilaProducto, Pago } from "../../types";

interface Props {
  nro: number | null;
  fecha: string;
  cliente: string;
  filas: FilaProducto[];
  subtotal: number;
  saldoAnt: number | "";
  totalGeneral: number;
  pagos: Pago[];
  totalPagado: number;
  saldoPendiente: number;
  cajaDatos: { deuda: string; dejo: string; retiro: string };
  cajaNuevoSaldo: number;
  obs: string;
  fechaDisplay: string;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function FacturaExport(props: Props) {
  const {
    nro,
    fecha,
    cliente,
    filas,
    subtotal,
    saldoAnt,
    totalGeneral,
    pagos,
    totalPagado,
    saldoPendiente,
    cajaDatos,
    cajaNuevoSaldo,
    obs,
    fechaDisplay,
  } = props;

  const row = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
  } as React.CSSProperties;
  const muted = { color: "#7a6c55" } as React.CSSProperties;
  const box = {
    background: "#f0ebe0",
    borderRadius: 10,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  };
  const secTitle = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#c9a84c",
    textTransform: "uppercase" as const,
    borderBottom: "1px solid #f0ebe0",
    paddingBottom: 6,
    marginBottom: 10,
  };

  return (
    // Fondo crema exterior con padding — esto es lo que captura html2canvas
    <div
      style={{
        backgroundColor: "#f0ebe0",
        padding: 32,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Tarjeta blanca */}
      <div
        style={{
          width: 600,
          backgroundColor: "#ffffff",
          fontFamily: "'DM Sans', Arial, sans-serif",
          fontSize: 14,
          color: "#1a1209",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(26,18,9,0.12)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            borderBottom: "3px solid #c9a84c",
            padding: "28px 40px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              Factura
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#7a6c55",
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              Comprobante de Venta
            </div>
            <div
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                background: "#c9a84c",
                padding: "3px 12px",
                borderRadius: 20,
                marginTop: 8,
                textTransform: "uppercase",
              }}
            >
              Original
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#7a6c55",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              N° Factura
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#c9a84c" }}>
              {nro ?? "—"}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#7a6c55",
                textTransform: "uppercase",
                marginBottom: 4,
                marginTop: 10,
              }}
            >
              Fecha
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{fecha}</div>
          </div>
        </div>

        {/* BODY */}
        <div
          style={{
            padding: "24px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          {/* CLIENTE */}
          <div>
            <div style={secTitle}>Datos del cliente</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1,
                color: "#7a6c55",
                textTransform: "uppercase",
                marginBottom: 5,
              }}
            >
              Nombre
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                borderBottom: "1px solid #d4c9b0",
                paddingBottom: 6,
              }}
            >
              {cliente || "—"}
            </div>
          </div>

          {/* PRODUCTOS */}
          <div>
            <div style={secTitle}>Productos / Servicios</div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#f0ebe0" }}>
                  {["Producto", "Cant.", "P. Unit.", "Subtotal"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 10px",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.3,
                        color: "#7a6c55",
                        textTransform: "uppercase",
                        textAlign:
                          i === 0 ? "left" : i === 1 ? "center" : "right",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas
                  .filter((f) => f.nombre)
                  .map((f, i) => (
                    <tr
                      key={f.id}
                      style={{
                        borderBottom: "1px solid #f0ebe0",
                        background: i % 2 === 0 ? "#fff" : "#fdfaf5",
                      }}
                    >
                      <td style={{ padding: "8px 10px" }}>{f.nombre}</td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        {f.qty}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>
                        {fmt(f.precio)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {fmt(f.qty * f.precio)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* TOTALES */}
          <div style={box}>
            <div style={row}>
              <span style={muted}>Subtotal productos</span>
              <span style={{ fontWeight: 600 }}>{fmt(subtotal)}</span>
            </div>
            {saldoAnt !== "" && saldoAnt > 0 && (
              <div style={row}>
                <span style={muted}>Saldo Anterior</span>
                <span style={{ fontWeight: 600 }}>{fmt(saldoAnt)}</span>
              </div>
            )}
            <div
              style={{
                ...row,
                borderTop: "1px solid #d4c9b0",
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Total General
              </span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#b85c38" }}>
                {fmt(totalGeneral)}
              </span>
            </div>
          </div>

          {/* PAGOS */}
          {pagos.length > 0 && (
            <div>
              <div style={secTitle}>Pagos recibidos</div>
              {pagos.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...row,
                    padding: "6px 0",
                    borderBottom: "1px solid #f0ebe0",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{p.tipo}</span>
                  {p.detalle && (
                    <span style={{ ...muted, flex: 1, marginLeft: 12 }}>
                      {p.detalle}
                    </span>
                  )}
                  <span style={{ fontWeight: 700 }}>{fmt(p.monto)}</span>
                </div>
              ))}
              <div style={{ ...box, marginTop: 10 }}>
                <div style={row}>
                  <span style={{ color: "#5a6e52" }}>Total Pagado</span>
                  <span style={{ fontWeight: 600, color: "#5a6e52" }}>
                    {fmt(totalPagado)}
                  </span>
                </div>
                <div
                  style={{
                    ...row,
                    borderTop: "1px solid #d4c9b0",
                    paddingTop: 8,
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Saldo Pendiente
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: saldoPendiente > 0.005 ? "#b85c38" : "#5a6e52",
                    }}
                  >
                    {fmt(saldoPendiente)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* CAJAS */}
          {
            <div>
              <div style={secTitle}>Movimiento de cajas</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                {[
                  { label: "Deuda", value: cajaDatos.deuda },
                  { label: "Dejo", value: cajaDatos.dejo },
                  { label: "Retiro", value: cajaDatos.retiro },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      border: "1.5px solid #d4c9b0",
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: "#7a6c55",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {value || "—"}
                    </div>
                  </div>
                ))}
              </div>
              <div style={box}>
                <div style={row}>
                  <span
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Nuevo saldo en cajas
                  </span>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: cajaNuevoSaldo > 0 ? "#b85c38" : "#5a6e52",
                    }}
                  >
                    {cajaNuevoSaldo} cajas
                  </span>
                </div>
              </div>
            </div>
          }

          {/* OBSERVACIONES */}
          {
            <div>
              <div style={secTitle}>Observaciones</div>
              <div style={{ fontSize: 13, color: "#4a3f30", lineHeight: 1.6 }}>
                {obs}
              </div>
            </div>
          }
        </div>

        {/* FOOTER */}
        <div
          style={{
            background: "#f0ebe0",
            padding: "12px 40px",
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d4c9b0",
            fontSize: 11,
            color: "#7a6c55",
          }}
        >
          <span>Generado el {fechaDisplay}</span>
          <span>Documento no fiscal · Solo para control interno</span>
        </div>
      </div>
    </div>
  );
}
