import { Traslado } from "../../hooks/useTraslados";

interface Props {
  traslado: Traslado;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function MovimientoExport({ traslado }: Props) {
  const nroMov = `MOV-${String(traslado.numeroMovimiento).padStart(3, "0")}`;

  const row = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
  } as React.CSSProperties;
  const muted = { color: "#7a6c55" } as React.CSSProperties;
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
    <div
      style={{
        backgroundColor: "#f0ebe0",
        padding: 32,
        display: "flex",
        justifyContent: "center",
      }}
    >
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
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              Movimiento
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
              Comprobante de traslado
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
              Interno
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
              N° Movimiento
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#c9a84c" }}>
              {nroMov}
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
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {traslado.fecha}
            </div>
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
          {/* ORIGEN / DESTINO */}
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                flex: 1,
                border: "1.5px solid #d4c9b0",
                borderRadius: 8,
                padding: 14,
              }}
            >
              <div
                style={{ ...secTitle, borderBottom: "none", marginBottom: 4 }}
              >
                Origen
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {traslado.origen.nombre}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#c9a84c",
                fontSize: 20,
              }}
            >
              →
            </div>
            <div
              style={{
                flex: 1,
                border: "1.5px solid #d4c9b0",
                borderRadius: 8,
                padding: 14,
              }}
            >
              <div
                style={{ ...secTitle, borderBottom: "none", marginBottom: 4 }}
              >
                Destino
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {traslado.destino.nombre}
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div>
            <div style={secTitle}>Productos trasladados</div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#f0ebe0" }}>
                  {["Producto", "Cant.", "P. Costo", "Total"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 10px",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.3,
                        color: "#7a6c55",
                        textTransform: "uppercase",
                        textAlign: i === 0 ? "left" : "right",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {traslado.lineas.map((l, i) => (
                  <tr
                    key={l.id}
                    style={{
                      borderBottom: "1px solid #f0ebe0",
                      background: i % 2 === 0 ? "#fff" : "#fdfaf5",
                    }}
                  >
                    <td style={{ padding: "8px 10px" }}>{l.producto.nombre}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>
                      {l.cantidad}
                    </td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>
                      {fmt(l.precioCosto)}
                    </td>
                    <td
                      style={{
                        padding: "8px 10px",
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      {fmt(l.cantidad * l.precioCosto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div
            style={{
              background: "#f0ebe0",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <div style={{ ...row, borderTop: "none" }}>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                Total en costo
              </span>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#b85c38" }}>
                {fmt(
                  traslado.lineas.reduce(
                    (acc, l) => acc + l.cantidad * l.precioCosto,
                    0,
                  ),
                )}
              </span>
            </div>
          </div>

          {/* OBSERVACIONES */}
          {traslado.observaciones?.trim() && (
            <div>
              <div style={secTitle}>Observaciones</div>
              <div style={{ fontSize: 13, color: "#4a3f30", lineHeight: 1.6 }}>
                {traslado.observaciones}
              </div>
            </div>
          )}
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
          <span>Generado el {traslado.fecha}</span>
          <span>Documento interno · Criss ERM</span>
        </div>
      </div>
    </div>
  );
}
