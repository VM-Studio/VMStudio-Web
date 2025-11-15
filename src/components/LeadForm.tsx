"use client";
import { useState } from "react";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  websiteType: string;
  complexity: string;
  colors: string;
  deadline: string;
  notes: string;
};

export default function LeadForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    websiteType: "Tienda / E-commerce",
    complexity: "Baja",
    colors: "",
    deadline: "",
    notes: "",
  });

  const [status, setStatus] = useState<string | null>(null);

  function update(field: keyof FormState, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required value={form.name} onChange={(e)=>update('name', e.target.value)} placeholder="Nombre" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
        <input value={form.company} onChange={(e)=>update('company', e.target.value)} placeholder="Empresa" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required value={form.email} onChange={(e)=>update('email', e.target.value)} placeholder="Email" type="email" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
        <input value={form.phone} onChange={(e)=>update('phone', e.target.value)} placeholder="Teléfono" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={form.websiteType} onChange={(e)=>update('websiteType', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10">
          <option>Tienda / E-commerce</option>
          <option>Landing / Portfolio</option>
          <option>Web Corporativa</option>
          <option>Otro</option>
        </select>
        <select value={form.complexity} onChange={(e)=>update('complexity', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10">
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>
      </div>

      <input value={form.colors} onChange={(e)=>update('colors', e.target.value)} placeholder="Colores / Estilo" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={form.deadline} onChange={(e)=>update('deadline', e.target.value)} placeholder="Fecha deseada / plazo" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
        <input value={form.notes} onChange={(e)=>update('notes', e.target.value)} placeholder="Notas adicionales" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10" />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 rounded-lg font-semibold">Enviar</button>
        {status === 'sending' && <span className="text-white/60">Enviando...</span>}
        {status === 'ok' && <span className="text-green-400">Enviado. ¡Gracias!</span>}
        {status === 'error' && <span className="text-red-400">Error al enviar</span>}
      </div>
    </form>
  );
}
