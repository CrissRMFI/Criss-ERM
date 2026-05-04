"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";
import FacturaPage from "./components/FacturaPage";
import ProductosPage from "./components/ProductosPage";

type Tab = "factura" | "productos";

export default function App() {
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
