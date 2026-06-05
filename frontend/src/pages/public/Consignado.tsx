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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WhatsAppButton />
        <div className="max-w-[900px] mx-auto px-5 py-[30px]">
          <FormConsignado whatsappLink={dados.whatsapp?.link} />
        </div>
        <ContatoSection />
        <LocalizacaoSection />
      </main>
      <Footer />
    </div>
  );
}
