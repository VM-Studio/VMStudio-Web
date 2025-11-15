/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";

type Project = any;

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    const json = await res.json();
    if (json.ok) setProjects(json.projects || []);
    // load leads/solicitudes
    try{
      const r2 = await fetch('/api/admin/leads');
      const j2 = await r2.json();
      if (j2.ok) setLeads(j2.leads || []);
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  useEffect(() => { const t = setTimeout(()=>{ load(); }, 0); return ()=>clearTimeout(t); }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) });
    const json = await res.json();
    if (json.ok) {
      setShowModal(false);
      setTitle(''); setDescription('');
      load();
    }
  }

  async function openProject(id: number) {
    const res = await fetch(`/api/admin/projects/${id}`);
    const json = await res.json();
    if (json.ok) setSelected(json.project);
  }

  async function toggleTask(pid: number, taskId: number) {
    const res = await fetch(`/api/admin/projects/${pid}/tasks/${taskId}`, { method: 'PATCH' });
    const json = await res.json();
    if (json.ok) {
      // refresh selected project
      if (selected && selected.id === pid) openProject(pid);
      load();
    }
  }

  async function postComment(pid: number, content: string) {
    const res = await fetch(`/api/admin/projects/${pid}/comments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ authorId: 1, content }) });
    const json = await res.json();
    if (json.ok) openProject(pid);
  }

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Panel de Administrador</h1>
        <div>
          <button onClick={()=>setShowModal(true)} className="px-4 py-2 bg-blue-600 rounded">Añadir un proyecto</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="font-semibold mb-2">Solicitudes</h2>
          <div className="bg-white/5 p-4 rounded max-h-[30vh] overflow-auto mb-4">
            {loading && <div>Cargando...</div>}
            {!loading && leads.length === 0 && <div className="text-sm text-white/60">No hay solicitudes</div>}
            {!loading && leads.map(l => (
              <div key={l.id} className="p-3 border-b border-white/5">
                <div className="font-semibold">{l.business || l.name || l.email}</div>
                <div className="text-sm text-white/60">{l.details || ''}</div>
                <div className="mt-2 text-sm bg-black/10 p-2 rounded">
                  <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(l.raw || l, null, 2)}</pre>
                </div>
                <div className="mt-2 flex gap-2">
                  <button onClick={async ()=>{ const r = await fetch(`/api/admin/leads/${l.id}/accept`, { method: 'POST' }); const j = await r.json(); if (j.ok) load(); }} className="px-2 py-1 bg-green-600 rounded">Aceptar</button>
                  <button onClick={async ()=>{ const r = await fetch(`/api/admin/leads/${l.id}/deny`, { method: 'POST' }); const j = await r.json(); if (j.ok) load(); }} className="px-2 py-1 bg-red-600 rounded">Denegar</button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="font-semibold mb-2">Lista de proyectos</h2>
          <div className="bg-white/5 p-4 rounded max-h-[30vh] overflow-auto">
            {loading && <div>Cargando...</div>}
            {!loading && projects.map(p => (
              <div key={p.id} className="p-3 border-b border-white/5 cursor-pointer" onClick={()=>openProject(p.id)}>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-white/60">{p.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {selected ? (
            <div className="bg-white/5 p-6 rounded">
              <h3 className="text-xl font-semibold mb-2">{selected.title}</h3>
              <div className="mb-4">{selected.description}</div>
              <section className="mb-4">
                <h4 className="font-semibold">Información del cliente / Lead</h4>
                <pre className="text-sm text-white/70 bg-black/10 p-2 rounded">{JSON.stringify(selected.lead, null, 2)}</pre>
              </section>

              <section className="mb-4">
                <h4 className="font-semibold">Checklist</h4>
                <ul>
                  {selected.tasks.map((t: any) => (
                    <li key={t.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={t.done} onChange={()=>toggleTask(selected.id, t.id)} />
                      <span className={t.done? 'line-through text-white/60':''}>{t.title}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="font-semibold mb-2">Comentarios</h4>
                <div className="space-y-2 mb-2">
                  {selected.comments.map((c: any)=> (
                    <div key={c.id} className="p-2 bg-black/10 rounded">
                      <div className="text-sm font-semibold">{c.author?.firstName || c.author?.email}</div>
                      <div className="text-sm">{c.content}</div>
                    </div>
                  ))}
                </div>
                <CommentForm projectId={selected.id} onPosted={(content)=>postComment(selected.id, content)} />
              </section>
            </div>
          ) : (
            <div className="p-6 bg-white/5 rounded">Seleccioná un proyecto para ver detalles</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <form onSubmit={createProject} className="bg-slate-800 p-6 rounded w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Nuevo proyecto</h3>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="w-full p-2 mb-2 rounded bg-white/5" />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" className="w-full p-2 mb-2 rounded bg-white/5" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={()=>setShowModal(false)} className="px-3 py-2">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 rounded">Crear</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CommentForm({ projectId, onPosted }: { projectId: number; onPosted: (content: string)=>void }){
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onPosted(text); setText(''); }} className="flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escribir comentario..." className="flex-1 p-2 rounded bg-white/5" />
      <button type="submit" className="px-3 py-2 bg-blue-600 rounded">Enviar</button>
    </form>
  );
}
