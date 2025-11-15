/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';

type Props = { params: { projectId: string } };

export default function PreviewPage({ params }: Props) {
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    let mounted = true;
    fetch(`/api/admin/projects/${params.projectId}`).then(r=>r.json()).then(j=>{
      if(!mounted) return;
      if(!j.ok) return setError('No autorizado o proyecto no encontrado');
      setProject(j.project);
    }).catch(e=>{ console.error(e); if(mounted) setError('Error al cargar'); });
    return ()=>{ mounted=false };
  }, [params.projectId]);

  if (error) return <div style={{ padding: 24 }}>{error}</div>;
  if (!project) return <div style={{ padding: 24 }}>Cargando previsualización...</div>;

  const lead = project.lead;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>{project.title || `Proyecto #${project.id}`}</h1>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18 }}>Datos del lead</h2>
        {lead ? (
          <div>
            <div><strong>Nombre:</strong> {lead.name}</div>
            <div><strong>Email:</strong> {lead.email}</div>
            <div><strong>Teléfono:</strong> {lead.phone}</div>
            <div><strong>Empresa:</strong> {lead.business}</div>
            <div style={{ marginTop: 8 }}><strong>Detalles:</strong><pre style={{ whiteSpace: 'pre-wrap' }}>{lead.details}</pre></div>
          </div>
        ) : (
          <div>No hay datos del lead.</div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 18 }}>Previsualización básica</h2>
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0 }}>{project.title || 'Mi sitio'}</h3>
          <p>{project.description || 'Una previsualización del sitio creado para este cliente.'}</p>
          <hr />
          <p>Contenido de ejemplo basado en el lead y la configuración del proyecto.</p>
        </div>
      </section>
    </main>
  );
}
