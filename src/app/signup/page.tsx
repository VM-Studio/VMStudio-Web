"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, dni, phone, email, password }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("ok");
        router.push("/login");
      } else {
        setStatus(json.error || "error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="w-full max-w-lg p-8 bg-white/5 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="Nombre" required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
            <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Apellido" required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={dni} onChange={(e)=>setDni(e.target.value)} placeholder="DNI" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Teléfono" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
          </div>

          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Contraseña" type="password" required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />

          <div className="flex items-center gap-4">
            <button type="submit" className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 rounded-lg font-semibold">Crear cuenta</button>
            {status === 'loading' && <span className="text-white/60">Creando cuenta...</span>}
            {status === 'ok' && <span className="text-green-400">Cuenta creada. Ingresa para continuar.</span>}
            {status && status !== 'loading' && status !== 'ok' && <span className="text-red-400">{status}</span>}
          </div>
        </form>
        <p className="text-sm text-white/60 mt-4">Ya tenés cuenta? <a href="/login" className="text-blue-300">Entrar</a></p>
      </div>
    </main>
  );
}
