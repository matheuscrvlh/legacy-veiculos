import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useSobre } from '../../hooks/useSobre';

export default function ContatoSection() {
  const { dados } = useSobre();
  const wpp = dados.whatsapp;
  const ig = dados.instagram;
  const fb = dados.facebook;

  const secundarios = [
    ig?.link && { href: ig.link, Icon: FaInstagram, label: ig.nome || 'Instagram', cor: '#E4405F' },
    fb?.link && { href: fb.link, Icon: FaFacebook, label: fb.nome || 'Facebook', cor: '#1877F2' },
  ].filter(Boolean) as { href: string; Icon: React.ElementType; label: string; cor: string }[];

  return (
    <section className="w-full bg-white py-20 px-6">
      <div data-aos="fade-up" className="max-w-[800px] mx-auto flex flex-col items-center text-center">

        <p className="text-xs font-bold uppercase tracking-[6px] mb-5" style={{ color: 'var(--cor-primaria)' }}>
          FALE CONOSCO
        </p>

        <h2 className="text-[3rem] font-black uppercase text-[#181818] leading-tight mb-4 max-lg:text-[2.1rem]">
          SEU PRÓXIMO CARRO<br />
          <span style={{ color: 'var(--cor-primaria)' }}>ESTÁ AQUI.</span>
        </h2>

        <p className="text-[#888] text-base max-w-[480px] leading-relaxed mb-12 max-lg:text-sm">
          Tire suas dúvidas, agende uma visita ou negocie agora mesmo. Nossa equipe responde rápido.
        </p>

        {/* CTA WhatsApp */}
        {wpp?.link && (
          <a href={wpp.link} target="_blank" rel="noreferrer" className="no-underline mb-10 w-full max-w-[400px]">
            <div className="bg-[#25D366] flex items-center justify-center gap-4 py-5 px-8 transition-all duration-300 hover:brightness-105 hover:scale-[1.02] cursor-pointer shadow-[0_8px_30px_rgba(37,211,102,0.25)]">
              <FaWhatsapp size={28} color="white" />
              <div className="text-left">
                <p className="text-white font-black uppercase tracking-[2px] text-[0.95rem] leading-none">Falar no WhatsApp</p>
                {wpp.numero && <p className="text-white/80 text-sm mt-[4px]">{wpp.numero}</p>}
              </div>
            </div>
          </a>
        )}

        {/* Divisor */}
        {secundarios.length > 0 && (
          <div className="flex items-center gap-4 w-full max-w-[400px] mb-8">
            <div className="flex-1 h-px bg-[#e8e8e8]" />
            <span className="text-[#bbb] text-xs uppercase tracking-[3px]">ou siga a gente</span>
            <div className="flex-1 h-px bg-[#e8e8e8]" />
          </div>
        )}

        {/* Redes secundárias */}
        {secundarios.length > 0 && (
          <div className="flex gap-3 flex-wrap justify-center">
            {secundarios.map(({ href, Icon, label, cor }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="no-underline group">
                <div
                  className="flex items-center gap-3 px-7 py-4 transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.03]"
                  style={{ backgroundColor: cor }}
                >
                  <Icon size={20} color="white" />
                  <span className="text-white font-bold text-sm uppercase tracking-[1px]">{label}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
