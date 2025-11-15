export default function Services() {
  const services = [
    {
      icon: "🎨",
      title: "Diseño UI/UX",
      description: "Interfaces intuitivas y experiencias visuales cautivadoras que transforman ideas en productos digitales memorables.",
      features: ["Investigación de usuarios", "Prototipado", "Design Systems"],
    },
    {
      icon: "💻",
      title: "Desarrollo Web",
      description: "Aplicaciones web modernas, rápidas y escalables con las últimas tecnologías y mejores prácticas.",
      features: ["Next.js", "React", "Full Stack"],
    },
    {
      icon: "📱",
      title: "Desarrollo Mobile",
      description: "Aplicaciones nativas y cross-platform que conectan con tus usuarios en cualquier dispositivo.",
      features: ["iOS", "Android", "React Native"],
    },
    {
      icon: "🚀",
      title: "Estrategia Digital",
      description: "Planificación integral de tu presencia digital para maximizar impacto y conversiones.",
      features: ["Consultoría", "Growth", "Analytics"],
    },
  ];

  return (
    <section className="relative w-full py-32 px-6 sm:px-8 lg:px-12 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-40 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 text-blue-300 text-sm font-medium">
            ✨ Nuestros Servicios
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Soluciones Digitales Completas
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            De la idea al producto. Te acompañamos en cada etapa de tu transformación digital.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-blue-600/50 hover:bg-slate-900 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl transition-opacity duration-300" />

              <div className="relative z-20 space-y-4">
                {/* Icon */}
                <div className="text-5xl">{service.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">{service.title}</h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {service.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/30"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow icon */}
                <div className="pt-4">
                  <svg
                    className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2"
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
      </div>
    </section>
  );
}
