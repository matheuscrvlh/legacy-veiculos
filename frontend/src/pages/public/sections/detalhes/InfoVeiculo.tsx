import { Veiculo } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';
import iconSeloOferta from '../../../../assets/icons/public/veiculos/oferta/selo-oferta-empresa.png';
import iconCambio from '../../../../assets/icons/public/veiculos/catalogo/Cambio.png';
import iconKm from '../../../../assets/icons/public/veiculos/catalogo/Km.png';
import iconCombustivel from '../../../../assets/icons/public/veiculos/catalogo/Combustivel.png';
import iconCor from '../../../../assets/icons/public/veiculos/detalhes/Cor.png';
import iconPortas from '../../../../assets/icons/public/veiculos/detalhes/Portas.png';
import iconCategoria from '../../../../assets/icons/public/veiculos/detalhes/Categoria.png';
import iconMarca from '../../../../assets/icons/public/veiculos/detalhes/Marca.png';
import iconAno from '../../../../assets/icons/public/veiculos/detalhes/Ano.png';

interface Props { veiculo: Veiculo; wppLink: string; }

export default function InfoVeiculo({ veiculo, wppLink }: Props) {
  return (
    <div className="flex-1">
      {veiculo.Oferta && <img src={iconSeloOferta} alt="Oferta" className="w-[100px] mb-3" />}

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.7rem] font-bold px-2 py-[2px] rounded-[5px] text-white" style={{ backgroundColor: 'var(--cor-primaria)' }}>{veiculo.TipoVeiculo}</span>
        <span className="text-[0.8rem] text-[#6b6b6b]">Código: {veiculo.CodigoSequencial}</span>
      </div>

      <h1 className="text-[1.8rem] font-bold uppercase max-lg:text-[1.4rem]" style={{ color: 'var(--cor-primaria)' }}>{veiculo.Marca} {veiculo.Nome}</h1>
      <p className="text-[#6b6b6b] text-base uppercase mb-2">{veiculo.Modelo} · {veiculo.Ano}</p>
      <p className="text-[2rem] font-bold mb-4 max-lg:text-[1.5rem]" style={{ color: 'var(--cor-primaria)' }}>R$ {veiculo.Valor}</p>

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
          FALAR NO WHATSAPP
        </button>
      </a>
    </div>
  );
}
