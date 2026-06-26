import { FaInstagram } from 'react-icons/fa';
import { useSobre } from '../../hooks/useSobre';
import iconStorys from '../../assets/icons/public/all/storysinstagram.png';

export default function InstagramPanel() {
  const { dados } = useSobre();
  const ig = dados.instagramLoja;

  if (!ig) return null;

  const feedKeys = ['imagem1', 'imagem2', 'imagem3', 'imagem4', 'imagem5', 'imagem6'] as const;
  const feedImagens = feedKeys.map((k) => ig.feed[k]).filter(Boolean);

  return (
    <section className="w-full max-w-[680px] mx-auto max-lg:w-[90vw]">
      {/* Cabeçalho da section */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-[5px] mb-3" style={{ color: 'var(--cor-primaria)' }}>
          REDES SOCIAIS
        </p>
        <h2 className="text-[1.8rem] font-black uppercase text-[#232323] max-lg:text-[1.4rem]">
          SIGA-NOS NO INSTAGRAM
        </h2>
        <div className="w-[48px] h-[3px] mx-auto mt-3" style={{ backgroundColor: 'var(--cor-primaria)' }} />
      </div>

      {/* Card Instagram */}
      <a href={dados.instagram?.link || '#'} target="_blank" rel="noopener noreferrer" className="no-underline block rounded-2xl overflow-hidden">
        <div className="bg-[#181818]" style={{ transform: 'translateZ(0)' }}>

          {/* Perfil */}
          <div className="flex items-center gap-4 px-5 py-5 border-b border-white/10">
            <div className="relative flex-shrink-0">
              <img src={iconStorys} className="absolute inset-0 w-[68px] h-[68px] z-[2]" alt="" />
              {ig.icone && (
                <img src={`/uploads/bannersInstagram/${ig.icone}`} className="w-[68px] h-[68px] rounded-full object-cover p-[5px]" alt="Perfil" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{ig.id}</p>
              <p className="text-white/60 text-sm truncate">{ig.nome}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-white/80 text-xs"><strong className="text-white">{ig.publicacoes}</strong> publicações</span>
                <span className="text-white/80 text-xs"><strong className="text-white">{ig.seguidores}</strong> seguidores</span>
              </div>
            </div>
            <FaInstagram size={24} color="white" className="flex-shrink-0 opacity-80" />
          </div>

          {/* Feed */}
          {feedImagens.length > 0 && (
            <div className="grid grid-cols-3">
              {feedImagens.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden">
                  <img
                    src={`/uploads/bannersInstagram/${img}`}
                    alt={`Post ${i + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-200 hover:opacity-70"
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div
            className="text-center text-white font-bold text-xs uppercase tracking-[3px] py-4 transition-opacity hover:opacity-90 rounded-b-2xl"
            style={{ backgroundColor: 'var(--cor-primaria)' }}
          >
            Ver perfil no Instagram
          </div>
        </div>
      </a>
    </section>
  );
}
