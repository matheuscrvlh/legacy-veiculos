import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { veiculosApi } from '../../api/veiculos';
import { Veiculo } from '../../types';
import { useSobre } from '../../hooks/useSobre';
import { formatarKm } from '../../lib/utils';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import iconSeloOferta from '../../assets/icons/public/veiculos/oferta/selo-oferta-empresa.png';
import iconCambio from '../../assets/icons/public/veiculos/catalogo/Cambio.png';
import iconKm from '../../assets/icons/public/veiculos/catalogo/Km.png';
import iconCombustivel from '../../assets/icons/public/veiculos/catalogo/Combustivel.png';
import iconCor from '../../assets/icons/public/veiculos/detalhes/Cor.png';
import iconPortas from '../../assets/icons/public/veiculos/detalhes/Portas.png';
import iconCategoria from '../../assets/icons/public/veiculos/detalhes/Categoria.png';
import iconMarca from '../../assets/icons/public/veiculos/detalhes/Marca.png';
import iconAno from '../../assets/icons/public/veiculos/detalhes/Ano.png';

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
          <button onClick={() => navigate(-1)} className="mb-5 text-[#535353] hover:text-primaria font-bold cursor-pointer border-none bg-transparent text-base">
            ← Voltar
          </button>

          <div className="flex gap-[40px] max-lg:flex-col">
            {/* Images */}
            <div className="flex-1">
              <div className="w-full h-[400px] overflow-hidden rounded-[10px] mb-[10px] max-lg:h-[250px]">
                <img
                  src={veiculo.Imagens[imgAtiva] ? `/uploads/vehicles/${veiculo.Imagens[imgAtiva]}` : '/icons/veiculos/semimagem.png'}
                  alt={veiculo.Nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-[8px] flex-wrap">
                {veiculo.Imagens.map((img, i) => (
                  <img
                    key={img}
                    src={`/uploads/vehicles/${img}`}
                    alt={`Foto ${i + 1}`}
                    className={`w-[80px] h-[60px] object-cover rounded-[5px] cursor-pointer transition-all ${imgAtiva === i ? 'ring-2 ring-primaria' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setImgAtiva(i)}
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {veiculo.Oferta && (
                <img src={iconSeloOferta} alt="Oferta" className="w-[100px] mb-3" />
              )}
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

              <p className="text-[2rem] font-bold mb-4 max-lg:text-[1.5rem]" style={{ color: 'var(--cor-primaria)' }}>
                R$ {veiculo.Valor}
              </p>

              {/* Stats */}
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

              {/* Details table */}
              <div className="grid grid-cols-2 gap-2 mb-5 text-[0.9rem] max-lg:grid-cols-1">
                {[
                  { icon: iconMarca, label: 'Marca', value: veiculo.Marca },
                  { icon: iconAno, label: 'Ano', value: veiculo.Ano },
                  { icon: iconCor, label: 'Cor', value: veiculo.Cor },
                  { icon: iconPortas, label: 'Portas', value: veiculo.Portas },
                  { icon: iconCategoria, label: 'Categoria', value: veiculo.Categoria },
                ].filter((i) => i.value).map((item) => (
                  <div key={item.label} className="flex gap-2 items-center">
                    <img src={item.icon} className="w-4 h-4 opacity-60" alt="" />
                    <span className="font-bold text-[#333]">{item.label}:</span>
                    <span className="text-[#6b6b6b]">{item.value}</span>
                  </div>
                ))}
              </div>

              {veiculo.Sobre && (
                <div className="mb-5">
                  <h3 className="font-bold text-[#333] mb-1">Sobre o veículo:</h3>
                  <p className="text-[#6b6b6b] text-[0.9rem]">{veiculo.Sobre}</p>
                </div>
              )}

              {veiculo.Opcionais && (
                <div className="mb-5">
                  <h3 className="font-bold text-[#333] mb-1">Opcionais:</h3>
                  <p className="text-[#6b6b6b] text-[0.9rem]">{veiculo.Opcionais}</p>
                </div>
              )}

              <a href={wppLink} target="_blank" rel="noreferrer">
                <button className="w-full py-4 text-white font-bold uppercase text-base border-none cursor-pointer rounded-[5px] transition-all duration-300 hover:scale-105" style={{ backgroundColor: 'var(--cor-botao)' }}>
                  TENHO INTERESSE — FALAR NO WHATSAPP
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
