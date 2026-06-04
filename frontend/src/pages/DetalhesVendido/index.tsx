import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import { formatarKm } from '../../lib/utils';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import iconCambio from '../../assets/icons/public/veiculos/catalogo/Cambio.png';
import iconKm from '../../assets/icons/public/veiculos/catalogo/Km.png';
import iconCombustivel from '../../assets/icons/public/veiculos/catalogo/Combustivel.png';

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
          <button onClick={() => navigate(-1)} className="mb-5 text-[#535353] hover:text-primaria font-bold cursor-pointer border-none bg-transparent text-base">
            ← Voltar
          </button>

          <div className="mb-4 bg-[#e8e8e8] inline-block px-4 py-2 rounded-[8px]">
            <span className="text-[#535353] font-bold uppercase text-sm">✓ VEÍCULO VENDIDO</span>
          </div>

          <div className="flex gap-[40px] max-lg:flex-col">
            <div className="flex-1">
              <div className="w-full h-[400px] overflow-hidden rounded-[10px] mb-[10px] max-lg:h-[250px] relative">
                <img
                  src={veiculo.Imagens[imgAtiva] ? `/uploads/vehiclesSold/${veiculo.Imagens[imgAtiva]}` : '/icons/veiculos/semimagem.png'}
                  alt={veiculo.Nome}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-2xl bg-black/50 px-6 py-3 rounded-[8px]">VENDIDO</span>
                </div>
              </div>
              <div className="flex gap-[8px] flex-wrap">
                {veiculo.Imagens.map((img, i) => (
                  <img
                    key={img}
                    src={`/uploads/vehiclesSold/${img}`}
                    alt={`Foto ${i + 1}`}
                    className={`w-[80px] h-[60px] object-cover rounded-[5px] cursor-pointer transition-all ${imgAtiva === i ? 'ring-2 ring-primaria' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setImgAtiva(i)}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[0.7rem] font-bold px-2 py-[2px] rounded-[5px] text-white" style={{ backgroundColor: 'var(--cor-primaria)' }}>
                  {veiculo.TipoVeiculo}
                </span>
                <span className="text-[0.8rem] text-[#6b6b6b]">Código: {veiculo.CodigoSequencial}</span>
              </div>

              <h1 className="text-[1.8rem] font-bold uppercase max-lg:text-[1.4rem]" style={{ color: 'var(--cor-primaria)' }}>
                {veiculo.Marca} {veiculo.Nome}
              </h1>
              <p className="text-[#6b6b6b] text-base uppercase mb-2">{veiculo.Modelo} — {veiculo.Ano}</p>
              <p className="text-[2rem] font-bold mb-4" style={{ color: 'var(--cor-primaria)' }}>R$ {veiculo.Valor}</p>

              <div className="flex gap-[10px] mb-5 flex-wrap">
                {[
                  { icon: iconCambio, label: veiculo.Cambio },
                  { icon: iconKm, label: `${formatarKm(veiculo.Km)} KM` },
                  { icon: iconCombustivel, label: veiculo.Combustivel },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1 bg-[#f4f4f4] rounded-[8px] px-4 py-2">
                    <img src={item.icon} className="w-5 h-5" alt="" />
                    <span className="text-[0.8rem] text-[#535353]">{item.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-[#888] text-sm">Este veículo já foi vendido. Confira nosso estoque para encontrar outros disponíveis.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
