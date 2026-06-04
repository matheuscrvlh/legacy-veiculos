import { useSobre } from '../../hooks/useSobre';
import iconWhatsappFixo from '../../assets/icons/public/all/whatsappiconfixo.png';

export default function WhatsAppButton() {
  const { dados } = useSobre();

  if (!dados.whatsapp?.link) return null;

  return (
    <div className="fixed z-[1000] bottom-[50px] right-[50px] max-lg:bottom-[30px] max-lg:right-[30px]">
      <a href={dados.whatsapp.link} target="_blank" rel="noreferrer">
        <img
          src={iconWhatsappFixo}
          alt="WhatsApp"
          className="w-[80px] h-[80px] max-lg:w-[70px] max-lg:h-[70px] transition-transform duration-200 hover:scale-110 cursor-pointer"
        />
      </a>
    </div>
  );
}
