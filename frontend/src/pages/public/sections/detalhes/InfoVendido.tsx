import { Veiculo } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';
import iconCambio from '../../../../assets/icons/public/veiculos/catalogo/Cambio.png';
import iconKm from '../../../../assets/icons/public/veiculos/catalogo/Km.png';
import iconCombustivel from '../../../../assets/icons/public/veiculos/catalogo/Combustivel.png';

interface Props { veiculo: Veiculo; }

export default function InfoVendido({ veiculo }: Props) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.7rem] font-bold px-2 py-[2px] rounded-[5px] text-white" style={{ backgroundColor: 'var(--cor-primaria)' }}>{veiculo.TipoVeiculo}</span>
        <span className="text-[0.8rem] text-[#6b6b6b]">Código: {veiculo.CodigoSequencial}</span>
      </div>

      <h1 className="text-[1.8rem] font-bold uppercase max-lg:text-[1.4rem]" style={{ color: 'var(--cor-primaria)' }}>{veiculo.Marca} {veiculo.Nome}</h1>
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
  );
}
