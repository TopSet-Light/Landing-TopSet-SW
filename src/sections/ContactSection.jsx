import DepthButton from '../components/ui/DepthButton.jsx';
export default function ContactSection() {
  return (
    <section className="w-full bg-[#070707] py-20 px-margin-mobile lg:px-[8vw]" id="contacto">
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xl p-space-xl rounded-2xl bg-surface-container-low shadow-[0_0_50px_-10px_rgba(255,80,112,0.1)]">
        <div className="max-w-2xl">
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface uppercase leading-tight">
            ¿TIENES UNA IDEA O UN SISTEMA QUE ESCALAR?
          </h3>
          <p className="font-body-md text-body-md text-secondary mt-space-xs">
            Agendamos una sesión de diagnóstico técnico de 30 minutos sin costo para analizar tu
            arquitectura.
          </p>
        </div>
        <DepthButton className="" href="mailto:hola@topset.studio">
          <span>Agendar llamada</span>
          <span className="tracking-tighter transition-transform duration-200 group-hover:translate-x-1.5">
            {'>>>'}
          </span>
        </DepthButton>
      </div>
    </section>
  );
}
