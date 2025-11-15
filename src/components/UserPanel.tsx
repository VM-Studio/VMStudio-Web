"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserType = { id: number; email: string; firstName?: string; lastName?: string };
type NotificationType = { id: number; message: string; read: boolean; createdAt?: string };
type TaskType = { id: number; title: string; done: boolean };
type CommentType = { id: number; content: string; author?: UserType; createdAt?: string };
type ProjectType = { id: number; title?: string; tasks: TaskType[]; comments: CommentType[] };

type MeResponse = { ok: boolean; projects: ProjectType[]; notifications: NotificationType[] };

type InterestFormData = { business: string; industry: string; description: string; style: string; pages: string; budget: string; contact: string };

export default function UserPanel({ user }: { user: UserType }){
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Array<{id:number; title:string; description?:string; url?:string}>>([]);
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  useEffect(()=>{
    let mounted = true;
    fetch('/api/portfolio').then(r=>r.json()).then(j=>{ if (mounted && j?.ok) setPortfolio(j.projects || []); }).catch(()=>{});
    return ()=>{ mounted = false; };
  }, []);



// CommentForm moved to module scope to avoid hook-order lint rules.
  

  // Pricing definitions. Portfolio will be loaded from API below.

  const plans = [
    { id: 1, name: 'Básico', price: '199€', features: ['1 página', 'Diseño responsive', 'Formulario de contacto'] },
    { id: 2, name: 'Estándar', price: '499€', features: ['Hasta 5 páginas', 'SEO básico', 'Integración redes'] },
    { id: 3, name: 'Profesional', price: '999€', features: ['Hasta 10 páginas', 'E-commerce básico', 'Optimización'] },
    { id: 4, name: 'Avanzado', price: '1999€', features: ['Tienda completa', 'Integraciones avanzadas', 'Soporte prioritario'] },
  ];

  // logout is handled inline in the header to ensure redirect to /login

  async function submitInterest(form: InterestFormData){
    setSubmitting(true); setSubmitResult(null);
    try{
      const res = await fetch('/api/submit-lead', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = await res.json();
      if (j.ok) {
        setSubmitResult('Gracias — nos pondremos en contacto pronto.');
        setShowModal(false);
        setSubmitted(true);
      } else {
        setSubmitResult('Error al enviar. Intenta más tarde.');
      }
    }catch(e){ console.error(e); setSubmitResult('Error de conexión'); }
    setSubmitting(false);
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Client-only navbar (logo only, taller, profile link and logout as white text) */}
      {/* unified with hero: removed border-b */}
      <header className="flex items-center justify-between px-10 py-6 bg-white">
        <div className="flex items-center gap-3 ml-2">
          <Image src="/logoo.png" alt="logo" width={64} height={64} className="object-contain rounded" />
        </div>
        <div className="flex items-center gap-5 mr-2">
          <button onClick={async ()=>{ try{ await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); }catch(e){ console.error(e); } router.push('/login'); }} className="text-black text-sm">Cerrar sesión</button>
          <button aria-label="Perfil" onClick={()=>router.push('/profile')} className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
            {/* simple profile icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a8.25 8.25 0 0115 0" />
            </svg>
          </button>
        </div>
      </header>

      {/* submit result banner */}
      {submitResult && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-green-700/80 p-3 rounded flex items-center justify-between">
            <div>{submitResult}</div>
            <button onClick={()=>setSubmitResult(null)} className="px-2 py-1 bg-white/10 rounded">Cerrar</button>
          </div>
        </div>
      )}

  {/* Hero: centered image + title + CTA */}
  <section className="py-40 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
          {/* Image centered */}
          <Image src="/hero.png" alt="3d-computer" width={560} height={360} className="object-contain mx-auto" />
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">Tu web profesional en manos expertas</h1>
            <p className="mb-8 text-xl md:text-2xl text-black/80">Creamos sitios que venden, con diseño moderno y optimizados para conversión.</p>
            <div>
  <button
    onClick={() => setShowModal(true)}
    className="
      group 
      relative 
      mx-auto 
      w-full sm:w-auto
      px-12 py-5
      text-xl font-semibold 
      text-white 
      rounded-2xl
      bg-gradient-to-r from-blue-600 to-blue-700 
      shadow-[0_8px_25px_rgba(37,99,235,0.35)]
      hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)]
      hover:scale-[1.04] 
      active:scale-[0.98]
      transition-all duration-200
    "
  >
    <span className="relative z-10">Quiero mi propia web</span>

    <div
      className="
        absolute inset-0 
        rounded-2xl 
        bg-gradient-to-r from-blue-500/30 to-blue-700/40 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 blur-sm
      "
    />
  </button>
</div>

          </div>
        </div>
  </section>

  {/* subtle divider between sections */}
  <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-slate-100 my-8" /></div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white/5 rounded-lg max-w-2xl w-full p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Cuéntanos sobre tu negocio</h3>
              <button onClick={()=>setShowModal(false)} className="text-white/70">Cerrar</button>
            </div>
            <InterestForm submitting={submitting} onSubmit={submitInterest} initialEmail={user.email} />
          </div>
        </div>
      )}

      {/* Confirmation after submitting interest */}
      {submitted && (
        <section className="py-6 px-4 max-w-3xl mx-auto text-center">
          <div className="bg-green-900/60 p-6 rounded">
            <h3 className="text-xl font-semibold">Muchas gracias por contactarnos</h3>
            <p className="text-sm text-white/80 mt-2">En menos de 24 horas estaremos en contacto</p>
          </div>
        </section>
      )}

  {/* NUESTROS SERVICIOS (adapted, enlarged) */}
  <section className="w-full bg-slate-50 py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-28">
          <div className="text-center space-y-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-blue-500 uppercase">Servicios</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Nuestros servicios principales</h2>
            <p className="max-w-3xl mx-auto text-slate-500 text-base md:text-lg">Te acompañamos en todo el proceso: desde la idea inicial hasta el lanzamiento y la optimización continua de tu presencia digital.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="group flex flex-col h-full rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-lg font-bold">DW</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Diseño Web</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">Diseños modernos, responsivos y optimizados para que tu marca se vea impecable en todos los dispositivos.</p>
            </div>

            <div className="group flex flex-col h-full rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-lg font-bold">EC</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">E-commerce</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">Tiendas online listas para vender, con pasarela de pago, gestión de productos y panel simple para administrarlas.</p>
            </div>

            <div className="group flex flex-col h-full rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600 text-lg font-bold">SEO</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">SEO & Performance</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">Optimización técnica y de contenido para que tu web cargue rápido y se posicione mejor en buscadores.</p>
            </div>

            <div className="group flex flex-col h-full rounded-3xl border border-slate-200 bg-white/90 px-8 py-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 text-lg font-bold">MT</div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Mantenimiento</h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">Soporte, monitoreo y actualizaciones periódicas para que tu web esté siempre online y segura.</p>
            </div>
          </div>

          {/* PLANES (enlarged cards) */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <p className="text-sm font-semibold tracking-[0.2em] text-blue-500 uppercase">Planes</p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Planes para distintas webs</h2>
              <p className="max-w-3xl mx-auto text-slate-500 text-base md:text-lg">Todos los planes son de <span className="font-semibold text-slate-700">pago único</span>. Diseñamos, configuramos y dejamos tu web lista para vender y recibir consultas, sin cuotas mensuales de desarrollo.</p>
            </div>

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {/* Básico */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white px-8 pt-8 pb-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Básico</h3>
                <p className="mt-2 text-sm md:text-base text-slate-600">Para tener presencia profesional online.</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-extrabold text-slate-900">199€</span>
                  <span className="text-sm md:text-base font-medium text-slate-500">EUR</span>
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-emerald-600">Pago único</p>
                <ul className="mt-6 space-y-3 text-sm md:text-base text-slate-600">
                  <li>• 1 página tipo landing (scroll largo)</li>
                  <li>• Diseño responsive y optimizado</li>
                  <li>• Formulario de contacto (mail + WhatsApp)</li>
                </ul>

                <button
                  type="button"
                  onClick={()=> setOpenPlan(openPlan === 'basic' ? null : 'basic')}
                  className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm md:text-base font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
                >
                  {openPlan === 'basic' ? 'Ocultar detalles' : 'Ver todo lo que incluye'}
                </button>

                <ul id="plan-basic-details" className={`mt-4 space-y-2 text-sm md:text-sm text-slate-600 ${openPlan === 'basic' ? '' : 'hidden'}`}>
                  <li>• Configuración de dominio (dominio no incluido)</li>
                  <li>• Certificado SSL y sitio en HTTPS</li>
                  <li>• Integración con Google Analytics básico</li>
                  <li>• Botón flotante de WhatsApp</li>
                  <li>• Optimización básica de velocidad</li>
                  <li>• Textos base revisados y adaptados a tu marca</li>
                  <li>• Hasta 2 rondas de ajustes de diseño</li>
                </ul>

                <button className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-sm md:text-base font-semibold text-white shadow-md hover:bg-blue-700 transition">Seleccionar</button>
              </div>

              {/* Estándar */}
              <div className="flex flex-col rounded-3xl border-2 border-blue-500/60 bg-white px-8 pt-8 pb-8 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-1.5 transition-all duration-200">
                <div className="inline-flex items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Estándar</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs md:text-sm font-medium text-blue-600">Más elegido</span>
                </div>
                <p className="mt-2 text-sm md:text-base text-slate-600">Ideal para marcas y negocios en crecimiento.</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-extrabold text-slate-900">349€</span>
                  <span className="text-sm md:text-base font-medium text-slate-500">EUR</span>
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-emerald-600">Pago único</p>
                <ul className="mt-6 space-y-3 text-sm md:text-base text-slate-600">
                  <li>• Hasta 5 páginas (home, servicios, contacto, etc.)</li>
                  <li>• Diseño personalizado según tu marca</li>
                  <li>• SEO on-page básico en cada sección</li>
                </ul>

                <button
                  type="button"
                  onClick={()=> setOpenPlan(openPlan === 'standard' ? null : 'standard')}
                  className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm md:text-base font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
                >
                  {openPlan === 'standard' ? 'Ocultar detalles' : 'Ver todo lo que incluye'}
                </button>

                <ul id="plan-standard-details" className={`mt-4 space-y-2 text-sm md:text-sm text-slate-600 ${openPlan === 'standard' ? '' : 'hidden'}`}>
                  <li>• Todo lo del plan Básico</li>
                  <li>• Secciones separadas: Inicio, Sobre nosotros, Servicios, Contacto, etc.</li>
                  <li>• Integración con redes sociales y botones de compartir</li>
                  <li>• Configuración de Google Analytics 4</li>
                  <li>• Configuración de Google Search Console</li>
                  <li>• Meta tags para SEO (títulos, descripciones, OG tags)</li>
                  <li>• Hasta 5 formularios diferentes (contacto, presupuesto, etc.)</li>
                  <li>• Hasta 3 rondas de ajustes de diseño</li>
                </ul>

                <button className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-sm md:text-base font-semibold text-white shadow-md hover:bg-blue-700 transition">Seleccionar</button>
              </div>

              {/* Profesional */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white px-8 pt-8 pb-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Profesional</h3>
                <p className="mt-2 text-sm md:text-base text-slate-600">Pensado para negocios que necesitan escalar.</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-extrabold text-slate-900">499€</span>
                  <span className="text-sm md:text-base font-medium text-slate-500">EUR</span>
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-emerald-600">Pago único</p>
                <ul className="mt-6 space-y-3 text-sm md:text-base text-slate-600">
                  <li>• Hasta 10 páginas y secciones avanzadas</li>
                  <li>• Secciones para portfolio, proyectos o casos de éxito</li>
                  <li>• Preparada para campañas de anuncios (landing pages)</li>
                </ul>

                <button
                  type="button"
                  onClick={()=> setOpenPlan(openPlan === 'pro' ? null : 'pro')}
                  className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm md:text-base font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
                >
                  {openPlan === 'pro' ? 'Ocultar detalles' : 'Ver todo lo que incluye'}
                </button>

                <ul id="plan-pro-details" className={`mt-4 space-y-2 text-sm md:text-sm text-slate-600 ${openPlan === 'pro' ? '' : 'hidden'}`}>
                  <li>• Todo lo del plan Estándar</li>
                  <li>• Estructura pensada para performance y conversión</li>
                  <li>• Integración de catálogos o listados de servicios/productos</li>
                  <li>• Integración de píxeles de Meta / TikTok Ads / Google Ads</li>
                  <li>• Optimización de velocidad y buenas prácticas Core Web Vitals</li>
                  <li>• Configuración de blog o sección de noticias</li>
                  <li>• Automatización básica: formularios conectados a email marketing</li>
                  <li>• Hasta 4 rondas de ajustes de diseño y contenido</li>
                </ul>

                <button className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-sm md:text-base font-semibold text-white shadow-md hover:bg-blue-700 transition">Seleccionar</button>
              </div>

              {/* Avanzado */}
              <div className="flex flex-col rounded-3xl border border-slate-200 bg-white px-8 pt-8 pb-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">Avanzado</h3>
                <p className="mt-2 text-sm md:text-base text-slate-600">Para proyectos completos de e-commerce y marca.</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-extrabold text-slate-900">699€</span>
                  <span className="text-sm md:text-base font-medium text-slate-500">EUR</span>
                </div>
                <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wide text-emerald-600">Pago único</p>
                <ul className="mt-6 space-y-3 text-sm md:text-base text-slate-600">
                  <li>• Tienda online completa con carrito y checkout</li>
                  <li>• Gestión de productos, categorías y stock</li>
                  <li>• Pensado para marcas que quieren vender en serio</li>
                </ul>

                <button
                  type="button"
                  onClick={()=> setOpenPlan(openPlan === 'advanced' ? null : 'advanced')}
                  className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm md:text-base font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
                >
                  {openPlan === 'advanced' ? 'Ocultar detalles' : 'Ver todo lo que incluye'}
                </button>

                <ul id="plan-advanced-details" className={`mt-4 space-y-2 text-sm md:text-sm text-slate-600 ${openPlan === 'advanced' ? '' : 'hidden'}`}>
                  <li>• Todo lo del plan Profesional</li>
                  <li>• Integración con pasarelas de pago (Stripe, Mercado Pago, etc.)</li>
                  <li>• Configuración de correos automáticos (confirmación de pedido, etc.)</li>
                  <li>• Gestión de cupones, descuentos y métodos de envío</li>
                  <li>• Integración avanzada con redes y catálogos (Instagram Shopping, etc.)</li>
                  <li>• Estructura preparada para multi-idioma (opcional)</li>
                  <li>• Soporte prioritario por 60 días desde el lanzamiento</li>
                  <li>• Videollamada de handoff para enseñarte a administrar la tienda</li>
                </ul>

                <button className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-sm md:text-base font-semibold text-white shadow-md hover:bg-blue-700 transition">Seleccionar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* subtle divider between sections */}
      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-slate-100 my-8" /></div>

      {/* simple pricing removed - using the modern Plans section above */}

  {/* Portfolio showcase (each entry links to the real site) */}
  <section className="py-20 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">Nuestro portfolio</h2>
  <div className="max-w-7xl mx-auto space-y-10">
          {/* Showcase entries: left image, right text */}
          {[
            { id: 'e-ticketpro', title: 'E-ticketpro', category: 'Eventos & Entretenimiento', description: 'Plataforma para venta de entradas online y gestión de organizadores.', url: 'https://e-ticketpro.com/' },
            { id: 'organizacionajr', title: 'Organizacion AJR', category: 'Organización', description: 'Sitio institucional para organización AJR.', url: 'https://www.organizacionajr.com/' },
            { id: 'geneveobras', title: 'Geneve Obras', category: 'Construcción', description: 'Web para empresa constructora y obras.', url: 'https://www.geneveobras.com/' },
            { id: 'aspensound', title: 'The Aspen Sound', category: 'Eventos', description: 'Proyecto cultural / musical con venta de entradas y contenidos.', url: 'https://www.theaspensound.com/' },
            { id: 'allbrokers', title: 'All Brokers', category: 'Finanzas', description: 'Sitio para broker inmobiliario y servicios asociados.', url: 'https://www.allbrokersrl.com/' },
            { id: 'kuduobras', title: 'Kudu Obras', category: 'Construcción', description: 'Empresa de obras y reformas, catálogo de proyectos.', url: 'https://kuduobras.com/' },
            { id: 'yesicaoviedo', title: 'Yesica Oviedo', category: 'Real Estate', description: 'Desarrollo inmobiliario y sitio profesional', url: 'https://www.yesicaoviedo.com/' },
          ].map((site, idx) => (
            <a key={site.id} href={site.url} target="_blank" rel="noopener noreferrer" className="block border border-slate-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
              <div className={`flex flex-col md:flex-row items-stretch ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 w-full bg-slate-100 h-56 md:h-auto flex items-center justify-center">
                  {/* Try to load the site's homepage as preview image; if it fails, show a neutral placeholder */}
                  <img src={site.url} alt={`${site.title} preview`} className="w-full h-full object-cover" onError={(e)=>{ (e.target as HTMLImageElement).style.display='none'; }} />
                </div>
                <div className="md:w-1/2 w-full p-8 bg-white flex flex-col justify-center">
                  <div className="text-sm font-semibold tracking-widest text-blue-500 uppercase">{site.category}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3">{site.title}</h3>
                  <p className="mt-4 text-slate-600 text-base md:text-lg">{site.description}</p>
                  <div className="mt-6">
                    <span className="text-blue-600 font-medium">Ver página web</span>
                    <span className="ml-2 text-blue-600">→</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* profile moved to /profile — not shown here in client panel */}
    </div>
  );
}

function InterestForm({ submitting, onSubmit, initialEmail }: { submitting: boolean; onSubmit: (f: InterestFormData)=>void; initialEmail?: string }){
  const [business, setBusiness] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [pages, setPages] = useState('');
  const [budget, setBudget] = useState('');
  const [contact, setContact] = useState(initialEmail || '');

  async function submit(e?: React.FormEvent){
    e?.preventDefault();
    onSubmit({ business, industry, description, style, pages, budget, contact });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm">Nombre del negocio</label>
        <input value={business} onChange={(e)=>setBusiness(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div>
        <label className="block text-sm">Industria</label>
        <input value={industry} onChange={(e)=>setIndustry(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div>
        <label className="block text-sm">Qué necesita la web</label>
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-2 rounded bg-black/10" rows={3} />
      </div>
      <div>
        <label className="block text-sm">Estilo deseado</label>
        <input value={style} onChange={(e)=>setStyle(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div>
        <label className="block text-sm">Páginas necesarias</label>
        <input value={pages} onChange={(e)=>setPages(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div>
        <label className="block text-sm">Rango de presupuesto</label>
        <input value={budget} onChange={(e)=>setBudget(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div>
        <label className="block text-sm">Contacto (email o teléfono)</label>
        <input value={contact} onChange={(e)=>setContact(e.target.value)} className="w-full p-2 rounded bg-black/10" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="px-3 py-2 bg-blue-600 rounded">{submitting? 'Enviando...':'Enviar'} </button>
      </div>
    </form>
  );
}

function CommentForm({ projectId, onNewComment }: { projectId: number; onNewComment: (c: CommentType) => void }){
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    try{
      const res = await fetch(`/api/projects/${projectId}/comments`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: value }) });
      const j = await res.json();
      if (j.ok && j.comment) {
        onNewComment(j.comment as CommentType);
        setValue('');
      }
    }catch(e){ console.error(e); }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="mt-2">
      <textarea value={value} onChange={(e)=>setValue(e.target.value)} className="w-full p-2 rounded bg-black/5 text-white" rows={3} />
      <div className="mt-2">
        <button type="submit" disabled={loading} className="px-3 py-2 bg-blue-600 rounded">{loading? 'Enviando...' : 'Enviar comentario'}</button>
      </div>
    </form>
  );
}
