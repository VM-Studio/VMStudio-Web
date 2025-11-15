"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    Producto: ["Servicios", "Portafolio", "Pricing", "Enterprise"],
    Empresa: ["Sobre Nosotros", "Blog", "Carreras", "Contacto"],
    Legal: ["Privacidad", "Términos", "Cookies", "GDPR"],
  };

  return (
    <footer className="relative w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-500">
                  VM Studio
                </div>
                <p className="text-white/60 text-sm">
                  Transformamos ideas en productos digitales de clase mundial.
                </p>
                {/* Social icons */}
                <div className="flex gap-4 pt-4">
                  {[
                    { icon: "f", label: "Facebook" },
                    { icon: "𝕏", label: "Twitter" },
                    { icon: "◉", label: "LinkedIn" },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600/30 border border-white/20 hover:border-blue-600/50 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                      title={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation links */}
            {Object.entries(navigation).slice(0, 3).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-white font-semibold">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact info */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Contacto</h3>
              <div className="space-y-3 text-sm">
                <a href="mailto:hola@vmstudio.com" className="text-white/60 hover:text-white transition-colors">
                  hola@vmstudio.com
                </a>
                <p className="text-white/60">
                  Buenos Aires, Argentina
                </p>
                <a href="tel:+541234567890" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                  +54 (123) 456-7890
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 py-8">
            {/* Bottom content */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                © {currentYear} VM Studio. Todos los derechos reservados.
              </p>
              <div className="flex gap-6 text-sm">
                {navigation.Legal.map((item, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to top button area */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-8">
          <div className="flex justify-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-3 rounded-full bg-white/10 hover:bg-blue-600/30 border border-white/20 hover:border-blue-600/50 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
