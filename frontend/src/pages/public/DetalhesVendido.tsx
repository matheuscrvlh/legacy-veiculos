import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import GaleriaVeiculo from './sections/detalhes/GaleriaVeiculo';
import InfoVendido from './sections/detalhes/InfoVendido';

export default function DetalhesVendido() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [imgAtiva, setImgAtiva] = useState(0);

  useEffect(() => {
    if (!id) return;
    vendidosApi.buscarPorId(id).then(setVeiculo).catch(() => navigate('/estoque'));
  }, [id]);

  if (!veiculo) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WhatsAppButton />
        <div className="max-w-[1200px] mx-auto px-5 py-[30px]">
          <button onClick={() => navigate(-1)} className="mb-5 text-[#535353] hover:text-primaria font-bold cursor-pointer border-none bg-transparent text-base">← Voltar</button>
          <div className="mb-4 bg-[#e8e8e8] inline-block px-4 py-2 rounded-[8px]">
            <span className="text-[#535353] font-bold uppercase text-sm">✓ VEÍCULO VENDIDO</span>
          </div>
          <div className="flex gap-[40px] max-lg:flex-col">
            <GaleriaVeiculo imagens={veiculo.Imagens} nome={veiculo.Nome} folder="vehiclesSold" imgAtiva={imgAtiva} onSelect={setImgAtiva} soldOverlay />
            <InfoVendido veiculo={veiculo} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
