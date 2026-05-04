import { RefObject } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function useExport(cardRef: RefObject<HTMLDivElement>) {
  const capture = async () => {
    return html2canvas(cardRef.current!, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  };

  const exportPDF = async (nro: string, cliente: string, fecha: string) => {
    const canvas = await capture();
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const ih = (canvas.height * pw) / canvas.width;

    if (ih <= ph) {
      pdf.addImage(img, "PNG", 0, 0, pw, ih);
    } else {
      let y = 0,
        rem = ih,
        pg = 0;
      while (rem > 0) {
        if (pg > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, -y, pw, ih);
        y += ph;
        rem -= ph;
        pg++;
      }
    }

    pdf.save(
      `factura_${nro}_${cliente.replace(/\s+/g, "_") || "cliente"}_${fecha}.pdf`,
    );
  };

  const exportWA = async (nro: string, cliente: string) => {
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

  return { exportPDF, exportWA };
}
