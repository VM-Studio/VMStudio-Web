"use client";
import React, { useEffect, useState } from "react";
import UserPanel from "@/components/UserPanel";
import AdminDashboard from "@/components/AdminDashboard";

type MeUser = { id: number; email: string; firstName?: string; role?: string };

export default function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((j) => {
        if (mounted && j.ok) setUser(j.user);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  async function doLogin(values: { identifier: string; password: string }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const j = await res.json();
      if (!j.ok) {
        setError(j.error || "Error");
      } else {
        const r2 = await fetch("/api/auth/me");
        const j2 = await r2.json();
        if (j2.ok) setUser(j2.user);
      }
    } catch (e) {
      console.error(e);
      setError("Error de conexión");
    }
    setLoading(false);
  }

  async function doSignup(values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dni?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const j = await res.json();
      if (!j.ok) {
        setError(j.error || "Error");
      } else {
        await doLogin({ identifier: values.email, password: values.password });
      }
    } catch (e) {
      console.error(e);
      setError("Error de conexión");
    }
    setLoading(false);
  }

  if (user) {
    if (user.role === "ADMIN") return <AdminDashboard />;
    return <UserPanel user={user} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      {/* 👇 FORMULARIO MÁS ANCHO */}
      <div className="relative w-full max-w-lg">
        {/* Glow suave detrás */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/15 via-sky-400/8 to-indigo-500/15 blur-3xl" />

        {/* Card más grande */}
        <div className="relative rounded-3xl px-10 py-16 sm:px-12 sm:py-18">
          {/* Header con logo + texto (logo al lado de “Acceso”) */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logoo.png"
                alt="VM Studio"
                className="h-16 w-auto object-contain"
              />
              
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Inicia sesión para entrar a tu panel.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-10">
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium">
              <button
                onClick={() => setMode("login")}
                className={`px-5 py-2 rounded-full ${
                  mode === "login"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-900 transition"
                }`}
              >
                Ingresar
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`px-5 py-2 rounded-full ${
                  mode === "signup"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500 hover:text-slate-900 transition"
                }`}
              >
                Crear cuenta
              </button>
            </div>
          </div>

          {/* Formulario */}
          {mode === "login" ? (
            <LoginForm onSubmit={doLogin} loading={loading} error={error} />
          ) : (
            <SignupForm onSubmit={doSignup} loading={loading} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}

function LoginForm({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (v: { identifier: string; password: string }) => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <form
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({ identifier, password });
      }}
      /* 👇 MÁS ESPACIO ENTRE BLOQUES DEL FORM */
      className="space-y-12"
    >
      {/* Campo Email / Teléfono */}
      <div className="space-y-5">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="login-identifier"
        >
          Email o teléfono
        </label>
        <input
          id="login-identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="tu-correo@ejemplo.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {/* Campo Contraseña BIEN SEPARADO DEL ANTERIOR */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="login-password"
          >
            Contraseña
          </label>
          <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <input
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="flex items-center justify-between pt-3 text-sm">
        <label className="inline-flex items-center gap-3 text-slate-500">
          <input
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Recordarme en este dispositivo</span>
        </label>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

function SignupForm({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (v: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dni?: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!firstName || !lastName || !email || !password)
      return setLocalError("Completa los campos requeridos");
    if (password !== confirm)
      return setLocalError("Las contraseñas no coinciden");
    await onSubmit({ firstName, lastName, email, password, phone, dni });
  }

  return (
    <form onSubmit={submit} className="space-y-12">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="signup-first"
          >
            Nombre
          </label>
          <input
            id="signup-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        <div className="space-y-4">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="signup-last"
          >
            Apellido
          </label>
          <input
            id="signup-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Apellido"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="signup-email"
        >
          Email
        </label>
        <input
          id="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu-correo@ejemplo.com"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="signup-dni"
          >
            DNI / ID
          </label>
          <input
            id="signup-dni"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="DNI (opcional)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
        <div className="space-y-4">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="signup-phone"
          >
            Teléfono
          </label>
          <input
            id="signup-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(011) 15-1234-5678"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="signup-password"
        >
          Contraseña
        </label>
        <input
          id="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      <div className="space-y-4">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="signup-confirm"
        >
          Confirmar contraseña
        </label>
        <input
          id="signup-confirm"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
          type="password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 shadow-xs outline-none ring-0 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {(localError || error) && (
        <div className="text-sm text-red-500">{localError || error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
