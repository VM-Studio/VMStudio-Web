import Image from "next/image";

export default function Hero() {
  const features = [
    { icon: "⚡", label: "Rápido", desc: "Rendimiento optimizado" },
    { icon: "🎨", label: "Diseño", desc: "Interfaces modernas" },
    { icon: "🚀", label: "Escalable", desc: "Crece con tu negocio" },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fondo gradiente */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Orbes grandes de glow */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-32 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Contenedor contenido */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Columna izquierda */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm w-fit mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
              </span>
              <span className="text-sm text-white/80 font-medium">
                Bienvenido a VM Studio
              </span>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-blue-200 to-blue-300">
                Crea tu Realidad
              </span>
              <br />
              <span className="text-white">Digital</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Soluciones innovadoras de software y diseño para transformar tu
              visión en realidad. Especialistas en web, mobile y experiencias
              digitales inmersivas.
            </p>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <a href="/order/new" className="group relative inline-flex items-center justify-center px-8 py-3 sm:px-10 sm:py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105">
                <span className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Me interesa tener mi propia web
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </a>

              <a href="#services" className="group relative px-8 py-3 sm:px-10 sm:py-4 bg-white/10 border-2 border-white/30 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:shadow-white/10">
                <span className="flex items-center gap-2">
                  Saber Más
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Columna derecha: card de preview */}
          <div className="flex-1 relative w-full h-96 lg:h-full min-h-96">
            <div className="absolute inset-0 rounded-2xl border border-white/20 overflow-hidden bg-white/5 backdrop-blur-xl group">
              {/* Imagen de fondo (public/vmbackground.png) */}
              <div className="absolute inset-0">
                <Image
                  src="/vmbackground.png"
                  alt="VM background"
                  fill
                  className="object-cover object-center transform scale-95"
                  priority
                />
                {/* Very subtle overlay to preserve contrast but keep original transparent background visible */}
                <div className="absolute inset-0 bg-black/5" />
              </div>

              {/* Contenido encima de la imagen (ej: mockup / badges) */}
              <div className="relative z-10 flex items-center justify-center h-full p-6">
                <div className="w-full max-w-xs text-center space-y-4">
                  {/* decorative element removed to show the image clearly */}
                  <div className="h-3 bg-white/20 rounded-full w-32 mx-auto" />
                  <div className="h-2 bg-white/10 rounded-full w-24 mx-auto" />
                </div>
              </div>

              {/* Glow al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-blue-600/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Fila de features con los 3 blobs adentro */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mt-24 pt-12 border-t border-white/10">
          {features.map((feature, idx) => (
            <div
              key={feature.label}
              className="relative group p-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Blob decorativo dentro de la tarjeta */}
              <div
                className={`pointer-events-none floating-blob ${
                  idx === 0 ? "blob-1" : idx === 1 ? "blob-2" : "blob-3"
                } opacity-60 blur-3xl -top-10 -right-10`}
              />

              <div className="relative">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-1">
                  {feature.label}
                </h3>
                <p className="text-white/60 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
