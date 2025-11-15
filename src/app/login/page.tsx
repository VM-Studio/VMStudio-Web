"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | string>(null);
  const [asAdmin, setAsAdmin] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, asAdmin }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        // server sets httpOnly cookie; redirect to home
        router.push("/");
      } else {
        setStatus(json.error || "invalid_credentials");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-md rounded-2xl p-10">
        <h1 className="text-3xl font-bold mb-8">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email o teléfono"
            type="text"
            required
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            type="password"
            required
            className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10"
          />
          <div className="flex items-center gap-4">
            <button className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 rounded-xl font-semibold text-lg">Entrar</button>
            {status === 'loading' && <span className="text-white/60">Validando...</span>}
            {status && status !== 'loading' && status !== 'ok' && <span className="text-red-400">{status}</span>}
          </div>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <input id="asAdmin" type="checkbox" checked={asAdmin} onChange={(e)=>setAsAdmin(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="asAdmin">Ingresar como administrador</label>
          </div>
        </form>
        <p className="text-sm text-white/60 mt-6">¿No tenés cuenta? <a href="/signup" className="text-blue-300">Registrate</a></p>
      </div>
    </main>
  );
}
