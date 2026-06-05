import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { veiculosApi } from '../../../../api/veiculos';
import { Veiculo } from '../../../../types';
import VehicleCard from '../../../../components/VehicleCard';

export default function DestaquesSection() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    veiculosApi.listarOferta().then((data) => setVeiculos(data.slice(0, 4)));
  }, []);

  if (veiculos.length === 0) return null;

  return (
    <section className="w-full py-[70px] px-5">
      {/* Cabeçalho */}
      <div className="text-center mb-12">
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
        {veiculos.map((v) => <VehicleCard key={v.ID} veiculo={v} />)}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link to="/estoque">
          <button
            className="border-2 font-bold uppercase text-sm tracking-[3px] px-10 py-4 cursor-pointer transition-all duration-300 hover:text-white hover:scale-[1.03]"
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
