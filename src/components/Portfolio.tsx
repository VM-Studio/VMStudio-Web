export default function Portfolio() {
  const projects = [
    {
      title: "E-commerce Moderno",
      category: "Web Development",
      description: "Plataforma de venta online con 50K+ usuarios mensuales",
      tags: ["Next.js", "Stripe", "Analytics"],
      image: "bg-linear-to-br from-purple-600 to-blue-600",
    },
    {
      title: "App de Productividad",
      category: "Mobile App",
      description: "Gestor de tareas con sincronización en tiempo real",
      tags: ["React Native", "Firebase", "Cloud"],
      image: "bg-linear-to-br from-pink-600 to-purple-600",
    },
    {
      title: "Dashboard Empresarial",
      category: "Web Application",
      description: "Sistema de análisis y reporte para Fortune 500",
      tags: ["React", "D3.js", "GraphQL"],
      image: "bg-linear-to-br from-blue-600 to-cyan-600",
    },
    {
      title: "Identidad Visual",
      category: "Branding",
      description: "Rebranding completo para startup tech de alto impacto",
      tags: ["Design System", "Brand Guidelines"],
      image: "bg-linear-to-br from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="relative w-full py-32 px-6 sm:px-8 lg:px-12 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-300 text-sm font-medium">
            🎯 Casos de Éxito
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Proyectos que Transforman
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Historias reales de empresas que crecieron con nuestro aporte estratégico.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Card Background */}
              <div
                className={`absolute inset-0 ${project.image} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative h-80 p-8 flex flex-col justify-between">
                {/* Top section */}
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-lg">{project.description}</p>
                </div>

                {/* Bottom section with tags and arrow */}
                <div className="flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80 border border-white/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <svg
                    className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300"
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-20">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105">
            Ver Todos los Proyectos
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
