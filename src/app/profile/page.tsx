"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Project = {
  id: number;
  title?: string;
  tasks: { id: number; title: string; done: boolean }[];
  comments: { id: number; content: string; author?: { firstName?: string; email?: string } }[];
};

type ProfileResponse = {
  ok: boolean;
  projects: Project[];
  notifications: { id: number; message: string; read: boolean }[];
};

export default function ProfilePage(){
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    fetch('/api/projects/me', { credentials: 'same-origin' }).then(r=>r.json()).then(j=>{ if(mounted) setData(j); }).catch(()=>{}).finally(()=>{ if(mounted) setLoading(false); });
    return ()=>{ mounted=false };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
  if (!data || !data.ok) return <div className="min-h-screen flex items-center justify-center">No pudimos cargar tu perfil.</div>;

  const project = data.projects && data.projects[0];

  return (
  <main className="min-h-screen px-6 py-10 bg-black text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image src="/logoo.png" alt="logo" width={56} height={56} className="object-contain rounded" />
            <div>
              <h2 className="text-2xl font-semibold">Mi perfil</h2>
              <p className="text-sm text-white/70">Aquí verás tu proyecto en curso y notificaciones</p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Proyecto en curso</h3>
          {project ? (
            <div className="bg-white/5 p-4 rounded">
              <div className="mb-3 font-semibold">{project.title || 'Proyecto sin título'}</div>
              <div className="w-full bg-white/10 h-4 rounded mb-2">
                <div style={{ width: `${Math.round((project.tasks.filter((t)=>t.done).length/Math.max(1, project.tasks.length))*100)}%` }} className="bg-blue-500 h-4 rounded" />
              </div>
              <div className="text-sm mb-2">Progreso: {project.tasks ? Math.round((project.tasks.filter((t)=>t.done).length/Math.max(1, project.tasks.length))*100) : 0}%</div>
              <div className="mb-2">Tareas:</div>
              <ul className="list-disc ml-6 mb-4">
                {project.tasks && project.tasks.map((t)=> (<li key={t.id}>{t.title} {t.done? '(ok)':''}</li>))}
              </ul>
              <div className="mb-2">Comentarios:</div>
              <div className="space-y-2">
                {project.comments && project.comments.map((c)=>(
                  <div key={c.id} className="p-2 bg-black/10 rounded">
                    <div className="text-sm font-semibold">{c.author?.firstName || c.author?.email}</div>
                    <div className="text-sm">{c.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No hay proyectos aún.</div>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Notificaciones</h3>
          <div className="space-y-2">
            {data.notifications && data.notifications.length ? data.notifications.map((n)=> (
              <div key={n.id} className={`p-3 rounded ${n.read? 'bg-black/5':'bg-blue-900/30'}`}>
                {n.message}
              </div>
            )) : <div>No hay notificaciones.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
