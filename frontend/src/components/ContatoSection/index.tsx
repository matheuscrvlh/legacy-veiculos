import { useSobre } from '../../hooks/useSobre';
import iconWhatsapp from '../../assets/icons/public/all/whatsappicon.png';
import iconInstagram from '../../assets/icons/public/all/instagramicon.png';
import iconFacebook from '../../assets/icons/public/all/facebookicon.png';

export default function ContatoSection() {
  const { dados } = useSobre();

  return (
    <div className="flex justify-center gap-5 flex-wrap text-center max-w-[1200px] mx-auto my-[30px] max-lg:my-[70px] max-lg:flex-col max-lg:items-center max-lg:gap-[50px]">
      <h1 className="text-[2rem] font-bold uppercase text-[#333] w-full mb-[5px] max-lg:text-[1.6rem] max-lg:mb-[-25px]">
        ENTRE EM CONTATO CONOSCO!
      </h1>

      {/* WhatsApp */}
      {dados.whatsapp?.link && (
        <div className="relative flex flex-col items-center bg-white px-[60px] py-[60px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-[350px] cursor-pointer transition-all duration-300 hover:-translate-y-[30px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] group max-lg:w-[80vw] max-lg:max-w-[420px]">
          <a href={dados.whatsapp.link} target="_blank" rel="noreferrer" className="block no-underline text-inherit">
            <div className="mb-[15px]">
              <img src={iconWhatsapp} className="w-[60px] h-[60px] object-contain" alt="WhatsApp" />
            </div>
            <div className="text-[1.2rem] text-[#333] font-bold mb-[10px]">{dados.whatsapp.numero}</div>
          </a>
          <div className="text-[0.9rem] text-white absolute left-0 right-0 w-full opacity-0 invisible bottom-[-50px] transition-all duration-300 py-[10px] group-hover:opacity-100 group-hover:visible group-hover:bottom-[-30px] bg-[#25D366]">
            ENTRE EM CONTATO!
          </div>
        </div>
      )}

      {/* Instagram */}
      {dados.instagram?.link && (
        <div className="relative flex flex-col items-center bg-white px-[60px] py-[60px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-[350px] cursor-pointer transition-all duration-300 hover:-translate-y-[30px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] group max-lg:w-[80vw] max-lg:max-w-[420px]">
          <a href={dados.instagram.link} target="_blank" rel="noreferrer" className="block no-underline text-inherit">
            <div className="mb-[15px]">
              <img src={iconInstagram} className="w-[60px] h-[60px] object-contain" alt="Instagram" />
            </div>
            <div className="text-[1.2rem] text-[#333] font-bold mb-[10px]">{dados.instagram.nome}</div>
          </a>
          <div className="text-[0.9rem] text-white absolute left-0 right-0 w-full opacity-0 invisible bottom-[-50px] transition-all duration-300 py-[10px] group-hover:opacity-100 group-hover:visible group-hover:bottom-[-30px] bg-[#E4405F]">
            ENTRE EM CONTATO!
          </div>
        </div>
      )}

      {/* Facebook */}
      {dados.facebook?.link && (
        <div className="relative flex flex-col items-center bg-white px-[60px] py-[60px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] w-[350px] cursor-pointer transition-all duration-300 hover:-translate-y-[30px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] group max-lg:w-[80vw] max-lg:max-w-[420px]">
          <a href={dados.facebook.link} target="_blank" rel="noreferrer" className="block no-underline text-inherit">
            <div className="mb-[15px]">
              <img src={iconFacebook} className="w-[60px] h-[60px] object-contain" alt="Facebook" />
            </div>
            <div className="text-[1.2rem] text-[#333] font-bold mb-[10px]">{dados.facebook.nome}</div>
          </a>
          <div className="text-[0.9rem] text-white absolute left-0 right-0 w-full opacity-0 invisible bottom-[-50px] transition-all duration-300 py-[10px] group-hover:opacity-100 group-hover:visible group-hover:bottom-[-30px] bg-[#1877F2]">
            ENTRE EM CONTATO!
          </div>
        </div>
      )}
    </div>
  );
}
