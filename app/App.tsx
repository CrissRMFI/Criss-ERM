"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const path = usePathname();

  return (
    <nav className="nav">
      <span className="nav-logo">Criss ERM</span>
      <Link
        href="/factura"
        className={`nav-tab ${path === "/factura" ? "active" : ""}`}
      >
        Factura
      </Link>
      <Link
        href="/productos"
        className={`nav-tab ${path === "/productos" ? "active" : ""}`}
      >
        Productos
      </Link>
    </nav>
  );
}
