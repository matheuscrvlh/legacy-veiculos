import { useState, useEffect } from 'react';
import { useSobre } from '../../hooks/useSobre';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import VehicleCard from '../../components/VehicleCard';
import LocalizacaoSection from '../../components/LocalizacaoSection';

export default function Vendidos() {
  const { dados } = useSobre();
  const [vendidos, setVendidos] = useState<Veiculo[]>([]);
  const imagens = dados.imagens?.imagemDestaque ?? [];

  useEffect(() => {
    vendidosApi.listar().then(setVendidos);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSlider imagens={imagens} />
      <main className="flex flex-col items-center mt-[30px] flex-1">
        <WhatsAppButton />
        <div className="text-center mb-8">
          <p className="text-[1.8rem] font-bold text-[#535353] uppercase">VEÍCULOS VENDIDOS</p>
          <p className="text-base text-[#535353]">Confira os veículos que já foram vendidos</p>
        </div>
        {vendidos.length > 0 ? (
          <div className="grid justify-center items-center gap-[15px] p-[30px] max-w-[1600px] w-[90vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, auto))' }}>
            {vendidos.map((v) => <VehicleCard key={v.ID} veiculo={v} isVendido />)}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center my-[50px] gap-[10px] text-center max-w-[1300px] w-[70vw] py-[30px] rounded-[10px] bg-[#f4f4f4]">
            <p>Nenhum veículo vendido encontrado.</p>
          </div>
        )}
        <LocalizacaoSection />
      </main>
      <Footer />
    </div>
  );
}
