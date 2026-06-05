import { Veiculo } from '../../../../types';
import VehicleCard from '../../../../components/VehicleCard';

interface Props {
  veiculos: Veiculo[];
  ordem: string;
  onOrdem: (o: string) => void;
  onAbrirFiltros: () => void;
  onLimpar: () => void;
}

export default function CatalogGrid({ veiculos, ordem, onOrdem, onAbrirFiltros, onLimpar }: Props) {
  return (
    <div className="w-auto flex-1">
      <div className="mt-5 mb-5 text-center">
        <p className="text-[2rem] font-bold text-[#535353] max-lg:text-[1.5rem]">NOSSO ESTOQUE</p>
        <p className="text-base font-bold text-[#535353] max-lg:text-[0.8rem]">ENCONTRE SEU VEÍCULO!</p>
      </div>

      <div className="flex justify-between">
        <button className="hidden max-[1200px]:block text-white font-bold uppercase px-[10px] py-[10px] rounded-[5px] border-none cursor-pointer text-base" style={{ backgroundColor: 'var(--cor-botao)' }} onClick={onAbrirFiltros}>
          ☰ Filtros
        </button>
        <button className="max-[1200px]:hidden text-white text-base border-none rounded-[3px] cursor-pointer h-[40px] w-[150px]" style={{ backgroundColor: 'var(--cor-botao)' }} onClick={onLimpar}>
          Limpar Filtros
        </button>
        <select className="border-b border-[#606060] border-l-0 border-r-0 border-t-0 px-[10px] h-[40px] rounded-[5px] text-base font-bold text-[#535353] cursor-pointer outline-none" value={ordem} onChange={(e) => onOrdem(e.target.value)}>
          <option value="ordenar">Ordenar por:</option>
          <option value="maiorValor">Maior Valor</option>
          <option value="menorValor">Menor Valor</option>
          <option value="anoMaisNovo">Ano Mais Novo</option>
          <option value="menorKm">Menor Km</option>
        </select>
      </div>

      {veiculos.length > 0 ? (
        <div className="grid justify-center items-center gap-[15px] p-[30px] max-w-[1300px] w-[70vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, auto))' }}>
          {veiculos.map((v) => <VehicleCard key={v.ID} veiculo={v} />)}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center my-[50px] gap-[10px] text-center max-w-[1300px] w-[70vw] py-[30px] rounded-[10px] bg-[#f4f4f4] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]">
          <p>Nenhum veículo encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
}
