import { useSobre } from '../../hooks/useSobre';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import InstagramPanel from '../../components/InstagramPanel';
import ContatoSection from '../../components/ContatoSection';
import LocalizacaoSection from '../../components/LocalizacaoSection';

export default function SobreLoja() {
  const { dados } = useSobre();
  const imagens = dados.imagens?.imagemDestaque ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSlider imagens={imagens} />

      <main className="flex flex-col items-center mt-[30px] flex-1">
        <WhatsAppButton />

        {/* Sobre empresa */}
        <div className="w-full max-w-[1200px] px-5 py-[30px]">
          {dados.empresa?.nomeEmpresa && (
            <div className="mb-6">
              <p className="text-[2rem] font-bold uppercase text-[#333] max-lg:text-[1.3rem]">{dados.empresa.nomeEmpresa}</p>
            </div>
          )}

          {(dados.sobre?.texto1 || dados.imagens?.imagemSobre1) && (
            <div className="flex gap-[40px] mb-[40px] items-center max-lg:flex-col">
              {dados.imagens?.imagemSobre1 && (
                <img
                  src={`/uploads/bannersAbout/${dados.imagens.imagemSobre1}`}
                  alt="Sobre a empresa"
                  className="max-w-[500px] w-full rounded-[10px] object-cover max-lg:max-w-full"
                />
              )}
              <div>
                <p className="text-base text-[#535353] leading-relaxed">{dados.sobre?.texto1}</p>
              </div>
            </div>
          )}

          {(dados.sobre?.texto2 || dados.imagens?.imagemSobre2) && (
            <div className="flex gap-[40px] mb-[40px] items-center flex-row-reverse max-lg:flex-col">
              {dados.imagens?.imagemSobre2 && (
                <img
                  src={`/uploads/bannersAbout/${dados.imagens.imagemSobre2}`}
                  alt="Sobre a empresa"
                  className="max-w-[500px] w-full rounded-[10px] object-cover max-lg:max-w-full"
                />
              )}
              <div>
                <p className="text-base text-[#535353] leading-relaxed">{dados.sobre?.texto2}</p>
              </div>
            </div>
          )}
        </div>

        <InstagramPanel />
        <div className="h-[60px]" />
        <LocalizacaoSection />
        <ContatoSection />
      </main>

      <Footer />
    </div>
  );
}
