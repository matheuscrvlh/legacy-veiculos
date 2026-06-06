import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { veiculosApi } from '../../../../api/veiculos';
import { Veiculo } from '../../../../types';
import VehicleCard from '../../../../components/VehicleCard';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[300px] shadow-sm animate-pulse">
      <div className="aspect-square bg-[#e8e8e8]" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex gap-2"><div className="h-4 bg-[#e8e8e8] rounded w-14" /><div className="h-4 bg-[#e8e8e8] rounded w-10" /></div>
        <div className="h-4 bg-[#e8e8e8] rounded w-3/4" />
        <div className="h-3 bg-[#e8e8e8] rounded w-1/2" />
        <div className="h-6 bg-[#e8e8e8] rounded w-2/3 mt-1" />
        <div className="border-t border-[#f5f5f5] pt-2 mt-1 flex justify-between gap-2">
          <div className="h-3 bg-[#e8e8e8] rounded flex-1" />
          <div className="h-3 bg-[#e8e8e8] rounded flex-1" />
          <div className="h-3 bg-[#e8e8e8] rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function DestaquesSection() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    veiculosApi.listarOferta()
      .then((data) => setVeiculos(data.slice(0, 4)))
      .finally(() => setCarregando(false));
  }, []);

  if (!carregando && veiculos.length === 0) return null;

  return (
    <section className="w-full py-[70px] px-5">
      {/* Cabeçalho */}
      <div data-aos="fade-up" className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-[5px] mb-3" style={{ color: 'var(--cor-primaria)' }}>
          OFERTAS ESPECIAIS
        </p>
        <h2 className="text-[2.2rem] font-black uppercase text-[#232323] leading-tight max-lg:text-[1.6rem]">
          VEÍCULOS EM DESTAQUE
        </h2>
        <div className="w-[48px] h-[3px] mx-auto mt-4" style={{ backgroundColor: 'var(--cor-primaria)' }} />
      </div>

      {/* Grid — 4 cards */}
      <div
        className="grid justify-center gap-6 max-w-[1400px] mx-auto"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 300px))' }}
      >
        {carregando
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : veiculos.map((v, i) => (
              <div key={v.ID} data-aos="fade-up" data-aos-delay={i * 100}>
                <VehicleCard veiculo={v} />
              </div>
            ))
        }
      </div>

      {/* CTA */}
      <div data-aos="fade-up" className="text-center mt-12">
        <Link to="/estoque">
          <button
            className="border-2 font-bold uppercase text-sm tracking-[3px] px-10 py-4 cursor-pointer transition-all duration-300 hover:text-white hover:scale-[1.03] max-lg:text-xs max-lg:tracking-[2px] max-lg:px-6 max-lg:py-3"
            style={{
              borderColor: 'var(--cor-primaria)',
              color: 'var(--cor-primaria)',
            }}
            onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'var(--cor-primaria)'; b.style.color = 'white'; }}
            onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = 'transparent'; b.style.color = 'var(--cor-primaria)'; }}
          >
            VER TODAS AS OFERTAS →
          </button>
        </Link>
      </div>
    </section>
  );
}
