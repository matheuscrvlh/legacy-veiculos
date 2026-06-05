import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { veiculosApi } from '../../api/veiculos';
import { Veiculo } from '../../types';
import { useSobre } from '../../hooks/useSobre';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import GaleriaVeiculo from './sections/detalhes/GaleriaVeiculo';
import InfoVeiculo from './sections/detalhes/InfoVeiculo';

export default function DetalhesVeiculo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dados } = useSobre();
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [imgAtiva, setImgAtiva] = useState(0);

  useEffect(() => {
    if (!id) return;
    veiculosApi.buscarPorId(id).then(setVeiculo).catch(() => navigate('/estoque'));
  }, [id]);

  if (!veiculo) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  const msgWpp = `Olá! Tenho interesse no veículo: ${veiculo.Nome} (Código: ${veiculo.CodigoSequencial})`;
  const wppLink = dados.whatsapp?.link ? `${dados.whatsapp.link}&text=${encodeURIComponent(msgWpp)}` : '#';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WhatsAppButton />
        <div className="max-w-[1200px] mx-auto px-5 py-[30px]">
          <button onClick={() => navigate(-1)} className="mb-5 text-[#535353] hover:text-primaria font-bold cursor-pointer border-none bg-transparent text-base">← Voltar</button>
          <div className="flex gap-[40px] max-lg:flex-col">
            <GaleriaVeiculo imagens={veiculo.Imagens} nome={veiculo.Nome} folder="vehicles" imgAtiva={imgAtiva} onSelect={setImgAtiva} />
            <InfoVeiculo veiculo={veiculo} wppLink={wppLink} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
