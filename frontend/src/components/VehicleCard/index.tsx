import { useNavigate } from 'react-router-dom';
import { Veiculo } from '../../types';
import { formatarKm } from '../../lib/utils';
import iconSeloOferta from '../../assets/icons/public/veiculos/oferta/selo-oferta-empresa.png';
import iconCambio from '../../assets/icons/public/veiculos/catalogo/Cambio.png';
import iconKm from '../../assets/icons/public/veiculos/catalogo/Km.png';
import iconCombustivel from '../../assets/icons/public/veiculos/catalogo/Combustivel.png';

interface Props {
  veiculo: Veiculo;
  isVendido?: boolean;
  detailPath?: string;
}

export default function VehicleCard({ veiculo, isVendido = false, detailPath }: Props) {
  const navigate = useNavigate();
  const imageSrc = veiculo.Imagens[0]
    ? `/uploads/${isVendido ? 'vehiclesSold' : 'vehicles'}/${veiculo.Imagens[0]}`
    : '/icons/veiculos/semimagem.png';

  const path = detailPath ?? (isVendido ? `/detalhes-vendido/${veiculo.ID}` : `/veiculo/${veiculo.ID}`);

  return (
    <div
      data-aos="fade-up"
      className="group relative bg-white shadow-[0px_0px_6px_rgba(0,0,0,0.08)] transition-all duration-[650ms] delay-[40ms] hover:-translate-y-[3px] hover:shadow-[0_8px_22px_rgba(0,0,0,0.11)] flex flex-col cursor-pointer w-[300px] rounded-[10px]"
      onClick={() => navigate(path)}
    >
      {/* Ícone oferta — fora do container da imagem para poder ultrapassar a borda */}
      {veiculo.Oferta && !isVendido && (
        <img src={iconSeloOferta} alt="Oferta" className="absolute top-[-5px] left-[3px] w-[90px] z-20 drop-shadow-md pointer-events-none" />
      )}

      {/* Imagem */}
      <div className="relative w-full aspect-square bg-[#1a1a1a] overflow-hidden rounded-t-[10px]">
        <img
          src={imageSrc}
          alt={veiculo.Nome}
          className={`w-full h-full object-cover object-bottom transition-transform duration-500 group-hover:scale-105 ${isVendido ? 'opacity-60' : ''}`}
          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
        />

        {isVendido && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-base tracking-widest uppercase bg-black/60 px-5 py-2">VENDIDO</span>
          </div>
        )}
      </div>

      {/* Dados */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.65rem] font-bold px-[6px] py-[2px] text-white" style={{ backgroundColor: 'var(--cor-primaria)' }}>
            {veiculo.TipoVeiculo}
          </span>
          <span className="text-[0.72rem] text-[#aaa]">#{veiculo.CodigoSequencial}</span>
        </div>

        <div className="flex gap-[5px] items-baseline font-bold uppercase">
          <span className="text-[0.82rem] text-[#6b6b6b]">{veiculo.Marca}</span>
          <span className="text-[0.92rem]" style={{ color: 'var(--cor-primaria)' }}>{veiculo.Nome}</span>
        </div>

        <p className="text-[0.72rem] uppercase text-[#aaa] mt-[2px] mb-2">
          {veiculo.Modelo} · {veiculo.Ano}
        </p>

        <p className="text-[1.35rem] font-bold leading-none mb-3" style={{ color: 'var(--cor-primaria)' }}>
          R$ {veiculo.Valor}
        </p>

        <div className="flex justify-between border-t border-[#f0f0f0] pt-2 mt-auto">
          {[
            { icon: iconCambio, label: veiculo.Cambio },
            { icon: iconKm, label: `${formatarKm(veiculo.Km)} km` },
            { icon: iconCombustivel, label: veiculo.Combustivel },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
              <img src={item.icon} className="w-4 h-4 opacity-60" alt="" />
              <span className="text-[#535353] text-[0.68rem] text-center leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
