export default function CTA() {
  return (
    <section className="relative w-full py-32 px-6 sm:px-8 lg:px-12 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-blue-700/20 blur-3xl rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-12 sm:p-16 text-center space-y-8">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            ¿Listo para <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-500">transformar</span> tu visión?
          </h2>

          {/* Description */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Cuéntanos tu idea y descubre cómo podemos llevarla al siguiente nivel. 
            Consultorías gratis, sin compromiso.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="group relative px-10 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-105">
              <span className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Agendar Consultoría
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button className="px-10 py-4 bg-white/10 text-white font-bold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              Enviar Brief
            </button>
          </div>

          {/* Social proof */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/60 mb-4">Empresas que confían en nosotros</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {["Empresa", "Studio", "Digital", "Tech", "Cloud"].map((company, idx) => (
                <div key={idx} className="text-white/40 font-semibold text-sm">
                  {company} ✦
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
