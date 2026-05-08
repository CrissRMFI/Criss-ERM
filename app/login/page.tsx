"use client";

import { useLogin } from "../hooks/useLogin";

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
        <div className="text-center">
          <h1 className="font-serif text-5xl text-[var(--ink)] tracking-tight">
            Criss<span className="text-[var(--gold)]">.</span>
          </h1>
          <p className="text-sm text-[var(--muted)] mt-2 tracking-widest uppercase">
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
