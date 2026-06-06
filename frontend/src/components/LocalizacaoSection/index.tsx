import { useSobre } from '../../hooks/useSobre';

export default function LocalizacaoSection() {
  const { dados } = useSobre();
  const loc = dados.localizacao;

  if (!loc) return null;

  return (
    <section className="w-full bg-[#181818] flex flex-col lg:flex-row min-h-[480px]">
      {/* Info */}
      <div data-aos="fade-right" className="lg:w-[40%] flex flex-col justify-center px-[8vw] py-16 max-lg:px-6 max-lg:py-10">
        <p className="text-xs font-bold uppercase tracking-[5px] mb-4" style={{ color: 'var(--cor-primaria)' }}>
          ONDE ESTAMOS
        </p>
        <h2 className="text-[2.8rem] font-black uppercase text-white leading-tight mb-8 max-lg:text-[1.5rem]">
          NOSSA<br />
          <span style={{ color: 'var(--cor-primaria)' }}>LOCALIZAÇÃO</span>
        </h2>

        <div className="flex flex-col gap-5">
          {loc.endereco && (
            <div className="flex gap-4 items-start">
              <div className="w-[3px] self-stretch flex-shrink-0" style={{ backgroundColor: 'var(--cor-primaria)' }} />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[2px] mb-1">Endereço</p>
                <p className="text-white text-[0.95rem] leading-relaxed">{loc.endereco}</p>
              </div>
            </div>
          )}
          {loc.horario && (
            <div className="flex gap-4 items-start">
              <div className="w-[3px] self-stretch flex-shrink-0" style={{ backgroundColor: 'var(--cor-primaria)' }} />
              <div>
                <p className="text-white/40 text-xs uppercase tracking-[2px] mb-1">Horário de Atendimento</p>
                <p className="text-white text-[0.95rem] leading-relaxed">{loc.horario}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mapa */}
      {loc.mapa && (
        <div data-aos="fade-left" className="lg:w-[60%] min-h-[320px] lg:min-h-0">
          <iframe
            src={loc.mapa}
            className="w-full h-full min-h-[320px] border-none grayscale opacity-90"
            allowFullScreen
            title="Localização"
          />
        </div>
      )}
    </section>
  );
}
