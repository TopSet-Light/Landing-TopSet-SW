export default function AboutSection() {
  return (
    <section
      className="w-full bg-[#ece9df] text-[#0a0a0a] py-[120px] px-margin-mobile lg:px-[8vw]"
      id="sobre-nosotros"
    >
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 flex flex-col">
          <h2 className="font-headline-lg text-headline-lg font-black text-[#0a0a0a] uppercase leading-[0.95] tracking-tight">
            Nuestro equipo & visión
          </h2>
          <p className="font-body-lg text-body-lg text-[#333333] leading-relaxed mt-space-lg mb-space-xl max-w-xl">
            Somos un equipo de ingenieros y diseñadores de software apasionados por transformar
            ideas complejas en sistemas y experiencias digitales que realmente ayuden a las empresas
            a escalar.
          </p>
          <div className="flex items-center gap-space-sm mb-space-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-[#0a0a0a] font-bold">
              NUESTROS PILARES & REDES
            </span>
            <span className="flex-1 h-px bg-black/10" />
          </div>
          <div className="flex flex-col gap-3">
            <a
              className="group bg-white rounded-xl p-4.5 px-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between transition-all"
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">terminal</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#484946] uppercase tracking-wider">
                    Open Source & Code Quality
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-[#0a0a0a]">
                    Arquitectura Limpia
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f3f3f1] group-hover:bg-[#0a0a0a] group-hover:text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-base">north_east</span>
              </div>
            </a>
            <a
              className="group bg-white rounded-xl p-4.5 px-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between transition-all"
              href="https://linkedin.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 font-bold font-headline-sm text-lg">
                  in
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#484946] uppercase tracking-wider">
                    Talento & Cultura
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-[#0a0a0a]">
                    Equipo Senior Multidisciplinario
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f3f3f1] group-hover:bg-[#0a0a0a] group-hover:text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-base">north_east</span>
              </div>
            </a>
            <div className="group bg-white rounded-xl p-4.5 px-6 shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between transition-all cursor-default">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">rocket_launch</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#484946] uppercase tracking-wider">
                    Metodología Rápida
                  </span>
                  <span className="font-headline-sm text-headline-sm font-bold text-[#0a0a0a]">
                    Sprints Quincenales & Entregas Continuas
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f3f3f1] flex items-center justify-center">
                <span className="material-symbols-outlined text-base text-[#0a0a0a]">done_all</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 relative">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black">
            <img
              loading="lazy"
              decoding="async"
              alt="Equipo de ingeniería Topset Studio trabajando en software"
              className="w-full h-[500px] object-cover grayscale contrast-125 hover:scale-102 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB63h_P0zrwCaEz8BUsq60tGU-gw78ZrvcnwNsme08haSGJsUNRCQxlh7WdAjo7RCg7Y5U-h5CXNBsm5qM97dkVQUiNqHX3MLnmn2XMhmBvCc5g8MdSDYGQyZzbAUDQf_53VLrjj8gMGtLcriXBGGFEHrqJhE_L6exRTTacD3QD6SbI_jTY0djp4FLQFDlwSms2MU4IrnGewiSiQ-HCFEtjGGSM5qZxFKGR3Pae8Ni9"
            />
            <a
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white text-[#0a0a0a] shadow-lg flex items-center justify-center font-headline-sm text-xl font-bold hover:bg-[#0a0a0a] hover:text-white transition-all transform hover:scale-110"
              href="https://linkedin.com"
              rel="noopener noreferrer"
              target="_blank"
              title="Ver en LinkedIn"
            >
              in
            </a>
            <div className="absolute bottom-5 left-5 bg-[#0a0a0a]/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-white/90">
                TOPSET HQ · MADRID / REMOTO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
