import { useSobre } from '../../hooks/useSobre';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import ContatoSection from '../../components/ContatoSection';
import LocalizacaoSection from '../../components/LocalizacaoSection';
import FormConsignado from './sections/consignado/FormConsignado';

export default function Consignado() {
  const { dados } = useSobre();

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full">
        <WhatsAppButton />
        <div className="max-w-[900px] mx-auto px-5 py-[30px] pb-[70px]">
          <FormConsignado whatsappLink={dados.whatsapp?.link} />
        </div>
        <LocalizacaoSection />
        <ContatoSection />
      </main>
      <Footer />
    </div>
  );
}
