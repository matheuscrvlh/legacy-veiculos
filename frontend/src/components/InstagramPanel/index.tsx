import { useSobre } from '../../hooks/useSobre';
import iconStorys from '../../assets/icons/public/all/storysinstagram.png';
import iconInstagram from '../../assets/icons/public/all/instagramicon.png';

export default function InstagramPanel() {
  const { dados } = useSobre();
  const ig = dados.instagramLoja;

  if (!ig) return null;

  const feedKeys = ['imagem1', 'imagem2', 'imagem3', 'imagem4', 'imagem5', 'imagem6'] as const;

  return (
    <div className="mt-[30px] min-w-[60vw] max-lg:mt-[110px] max-lg:w-[90vw] max-[700px]:mt-[100px] max-[500px]:mt-[70px]">
      <p className="text-[1.8rem] font-bold text-[#333333] max-lg:text-[1.3rem]">Siga-nos no Instagram</p>
      <a
        href={dados.instagram?.link || '#'}
        id="linkPainelInstagram"
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
      >
        <div className="border border-[#53535333] rounded-[8px] bg-[#232323]">
          {/* Head */}
          <div className="relative z-0 flex items-center gap-[10px] ml-[30px] h-[150px] max-lg:ml-[20px]">
            <div className="relative">
              <img src={iconStorys} className="absolute z-[4] w-[110px] h-[110px] max-lg:w-[80px] max-lg:h-[80px]" alt="" />
              {ig.icone && (
                <img
                  src={`/uploads/bannersInstagram/${ig.icone}`}
                  className="p-[7px] w-[110px] h-[110px] max-lg:w-[80px] max-lg:h-[80px]"
                  alt="Ícone"
                />
              )}
            </div>
            <div>
              <p className="text-[0.9rem] font-bold text-white max-lg:text-[0.8rem]">{ig.id}</p>
              <p className="text-[1.2rem] font-thin text-white max-lg:text-base">{ig.nome}</p>
              <p className="text-[#bbbbbb] max-lg:text-[0.9rem]">{ig.seguidores} seguidores</p>
              <p className="text-[#bbbbbb] max-lg:text-[0.9rem]">{ig.publicacoes} publicações</p>
            </div>
            <img src={iconInstagram} className="absolute z-[4] top-[1px] right-[1px] m-[5px] w-[30px] h-[30px]" alt="" />
          </div>

          {/* Feed */}
          <div className="grid grid-cols-3 gap-[2px] max-w-full pb-[20px]">
            {feedKeys.map((key) =>
              ig.feed[key] ? (
                <img
                  key={key}
                  src={`/uploads/bannersInstagram/${ig.feed[key]}`}
                  alt="Feed Instagram"
                  className="w-full h-auto object-cover hover:opacity-50"
                />
              ) : null
            )}
          </div>

          <button
            className="text-center text-black font-semibold rounded-[5px] ml-[2.5%] w-[95%] py-[5px] mb-[10px] border-none cursor-pointer"
            style={{ backgroundColor: 'var(--cor-primaria)' }}
          >
            Ver perfil completo no Instagram
          </button>
        </div>
      </a>
    </div>
  );
}
