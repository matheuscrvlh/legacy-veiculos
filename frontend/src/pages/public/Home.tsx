import { useSobre } from '../../hooks/useSobre';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import InstagramPanel from '../../components/InstagramPanel';
import ContatoSection from '../../components/ContatoSection';
import LocalizacaoSection from '../../components/LocalizacaoSection';
import DestaquesSection from './sections/home/DestaquesSection';
import EstoqueBannerSection from './sections/home/EstoqueBannerSection';

export default function Home() {
  const { dados } = useSobre();
  const imagens = dados.imagens?.imagemDestaque ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <HeroSlider imagens={imagens} />

      <main className="flex flex-col flex-1">
        <WhatsAppButton />
        <DestaquesSection />
        <EstoqueBannerSection />

        <div className="bg-[#f7f7f7] py-[60px] flex flex-col items-center">
          <InstagramPanel />
        </div>

        <LocalizacaoSection />

        <ContatoSection />
      </main>

      <Footer />
    </div>
  );
}
