import { RefObject } from "react";
import html2canvas from "html2canvas";

export function useExport(exportRef: RefObject<HTMLDivElement>) {
  const capture = async () => {
    return html2canvas(exportRef.current!, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 800,
    });
  };

  const exportWA = async (nro: number | null, cliente: string) => {
    const canvas = await capture();
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png"),
    );
    const file = new File([blob], `factura_${nro}.png`, { type: "image/png" });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: `Factura ${nro}` });
    } else {
      const link = document.createElement("a");
      link.download = `factura_${nro}_${cliente.replace(/\s+/g, "_") || "cliente"}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => window.open("https://web.whatsapp.com", "_blank"), 900);
    }
  };

  return { exportWA };
}
