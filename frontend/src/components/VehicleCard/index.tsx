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
    ? `/uploads/vehicles/${veiculo.Imagens[0]}`
    : '/icons/veiculos/semimagem.png';

  const path = detailPath ?? (isVendido ? `/detalhes-vendido/${veiculo.ID}` : `/veiculo/${veiculo.ID}`);

  return (
    <div
      className="bg-white shadow-[0px_0px_5px_rgba(0,0,0,0.212)] transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_15px_rgba(0,0,0,0.2)] flex flex-col cursor-pointer w-[320px] rounded-[10px]"
      onClick={() => navigate(path)}
    >
      {/* Offer badge */}
      {veiculo.Oferta && !isVendido && (
        <div className="relative">
          <img
            src={iconSeloOferta}
            alt="Oferta"
            className="absolute top-[-6px] right-[7px] w-[100px] z-10"
          />
        </div>
      )}

      {/* Image */}
      <div className="w-[320px] h-[220px] overflow-hidden relative mb-[10px] rounded-t-[10px]">
        <img
          src={imageSrc}
          alt={veiculo.Nome}
          className="w-full h-full object-fill object-center"
          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
        />
      </div>

      {/* Box 1: type + code */}
      <div className="flex gap-[15px] h-[18px] px-[10px]">
        <span
          className="inline-block text-[0.7rem] font-bold rounded-[5px] px-[5px] text-white"
          style={{ backgroundColor: 'var(--cor-primaria)' }}
        >
          {veiculo.TipoVeiculo}
        </span>
        <span className="text-[0.8rem] text-[#6b6b6b]">Código: {veiculo.CodigoSequencial}</span>
      </div>

      {/* Box 2: brand + name */}
      <div className="flex gap-[7px] items-center font-bold uppercase mt-[8px] px-[10px]">
        <span className="text-base text-[#6b6b6b]">{veiculo.Marca}</span>
        <span className="text-base" style={{ color: 'var(--cor-primaria)' }}>{veiculo.Nome}</span>
      </div>

      {/* Model + year */}
      <p className="mx-[10px] my-[8px] text-[0.8rem] uppercase text-[#6b6b6b]">
        {veiculo.Modelo} — {veiculo.Ano}
      </p>

      {/* Price */}
      <p className="mx-[10px] text-[1.5rem] font-bold uppercase" style={{ color: 'var(--cor-primaria)' }}>
        R$ {veiculo.Valor}
      </p>

      {/* Icons */}
      <div className="flex justify-center gap-[5px] mt-[10px] mb-[10px]">
        <div className="flex flex-col items-center gap-[5px] w-[30%] rounded-[5px] p-[5px]">
          <img src={iconCambio} className="w-5 h-5" alt="Câmbio" />
          <span className="text-[#535353] text-[0.8rem]">{veiculo.Cambio}</span>
        </div>
        <div className="flex flex-col items-center gap-[5px] w-[30%] rounded-[5px] p-[5px]">
          <img src={iconKm} className="w-5 h-5" alt="KM" />
          <span className="text-[#535353] text-[0.8rem]">{formatarKm(veiculo.Km)} KM</span>
        </div>
        <div className="flex flex-col items-center gap-[5px] w-[30%] rounded-[5px] p-[5px]">
          <img src={iconCombustivel} className="w-5 h-5" alt="Combustível" />
          <span className="text-[#535353] text-[0.8rem]">{veiculo.Combustivel}</span>
        </div>
      </div>
    </div>
  );
}
