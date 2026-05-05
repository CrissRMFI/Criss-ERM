import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center flex flex-col items-center gap-8">
        {/* Logo */}
        <div>
          <h1 className="font-serif text-5xl text-[var(--ink)] tracking-tight">
            <span className="text-[var(--gold)]">.</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-2 tracking-widest uppercase">
            Sistema de gestión
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-[var(--gold)]" />

        {/* Acceso */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/factura"
            className="btn btn-primary w-full justify-center py-3 text-sm"
          >
            Ingresar
          </Link>
        </div>

        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Criss ERM
        </p>
      </div>
    </div>
  );
}
