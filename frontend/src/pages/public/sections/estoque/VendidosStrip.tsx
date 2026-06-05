import { Veiculo } from '../../../../types';
import VehicleCard from '../../../../components/VehicleCard';

interface Props { vendidos: Veiculo[]; }

export default function VendidosStrip({ vendidos }: Props) {
  if (vendidos.length === 0) return null;
  return (
    <section className="w-full mt-[100px] mb-[100px] max-lg:mt-[50px] max-lg:mb-[50px]">
      <p className="text-center text-[1.8rem] font-semibold text-[#535353] max-lg:text-[1.5rem]">VEICULOS VENDIDOS</p>
      <p className="text-center text-[1.1rem] text-[#535353] max-lg:text-base">VEJA TAMBÉM NOSSOS VEÍCULOS JÁ VENDIDOS</p>
      <div className="flex justify-start flex-nowrap overflow-x-auto scroll-smooth gap-[15px] p-[30px] max-w-[1600px] w-[90vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]">
        {vendidos.map((v) => <VehicleCard key={v.ID} veiculo={v} isVendido />)}
      </div>
    </section>
  );
}
