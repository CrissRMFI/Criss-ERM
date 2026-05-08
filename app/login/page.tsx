"use client";

import { useLogin } from "../hooks/useLogin";
import Image from "next/image";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-center flex flex-col items-center gap-3">
          <Image
            src="https://res.cloudinary.com/developmentcrissroldan/image/upload/v1720758262/maresa-web-provisoria/LogoMaresaBlack_mqbglc.svg"
            alt="Logo"
            width={120}
            height={60}
            className="object-contain"
          />
          <p className="text-sm text-[var(--muted)] tracking-widest uppercase">
            Sistema de gestión
          </p>
        </div>

        <div className="w-12 h-px bg-[var(--gold)]" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="modal-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              autoFocus
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--rust)] text-center">{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full justify-center py-3"
            disabled={loading}
          >
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Criss ERM
        </p>
      </div>
    </div>
  );
}
