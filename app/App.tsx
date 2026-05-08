"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { authService } from "./services/auth.service";

const LINKS_ADMIN = [
  { href: "/factura", label: "Factura" },
  { href: "/clientes", label: "Clientes" },
  { href: "/compras", label: "Compras" },
  { href: "/traslados", label: "Traslados" },
  { href: "/almacenes", label: "Almacenes" },
  { href: "/productos", label: "Productos" },
  { href: "/historial", label: "Historial" },
  { href: "/proveedores", label: "Proveedores" },
];

const LINKS_OPERADOR = [
  { href: "/compras", label: "Compras" },
  { href: "/traslados", label: "Traslados" },
  { href: "/almacenes", label: "Almacenes" },
];

export default function Nav() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const rol = (session?.user as any)?.rol;
  const links = rol === "ADMIN" ? LINKS_ADMIN : LINKS_OPERADOR;

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-[#1a1209] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <span className="font-serif text-[#e8d5a3] text-lg whitespace-nowrap">
          Criss ERM
        </span>

        {/* Links desktop */}
        <div className="hidden md:flex items-center h-14">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`h-14 flex items-center px-4 text-sm font-medium border-b-2 transition-colors
                ${
                  path === l.href
                    ? "text-[#e8d5a3] border-[#c9a84c]"
                    : "text-[#9e8f75] border-transparent hover:text-[#e8d5a3]"
                }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Derecha: usuario + logout desktop */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-[#9e8f75]">{session?.user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-[#9e8f75] hover:text-[#e8d5a3] transition-colors"
          >
            Salir
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-[#9e8f75] hover:text-[#e8d5a3] p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Menu mobile desplegable */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2e2315]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-5 py-3 text-sm font-medium border-l-2 transition-colors
                ${
                  path === l.href
                    ? "text-[#e8d5a3] border-[#c9a84c] bg-[#2e2315]"
                    : "text-[#9e8f75] border-transparent hover:text-[#e8d5a3] hover:bg-[#2e2315]"
                }`}
            >
              {l.label}
            </Link>
          ))}
          {/* Logout mobile */}
          <div className="px-5 py-3 border-t border-[#2e2315] flex justify-between items-center">
            <span className="text-xs text-[#9e8f75]">
              {session?.user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-[#9e8f75] hover:text-[#e8d5a3] transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
