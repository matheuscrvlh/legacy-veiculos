import { Link } from 'react-router-dom';
import carImg from '../../../../assets/sectionCar/car.png';

export default function EstoqueBannerSection() {
  return (
    <section className="relative w-full flex h-[420px] max-lg:flex-col max-lg:h-auto">

      {/* Lado esquerdo — escuro (texto + carro saindo pelo topo) */}
      <div className="relative w-[40%] bg-[#181818] flex flex-col justify-center pl-[8vw] pr-6 overflow-visible max-lg:w-full max-lg:px-6 max-lg:pt-10 max-lg:pb-[120px]">
        <p className="text-[0.7rem] font-bold uppercase tracking-[5px] mb-3 relative z-10" style={{ color: 'var(--cor-primaria)' }}>
          EXPLORE
        </p>
        <h2 className="text-[3rem] font-black uppercase text-white leading-[1.05] relative z-10 max-lg:text-[2.2rem]">CONHEÇA</h2>
        <h2 className="text-[3rem] font-black uppercase leading-[1.05] relative z-10 max-lg:text-[2.2rem]" style={{ color: 'var(--cor-primaria)' }}>NOSSO</h2>
        <h2 className="text-[3rem] font-black uppercase text-white leading-[1.05] relative z-10 max-lg:text-[2.2rem]">ESTOQUE</h2>

        {/* Carro — saindo pelo topo, centralizado entre os dois painéis */}
        <img
          src={carImg}
          alt="Carro"
          className="absolute z-20 w-[640px] max-[1400px]:w-[500px] drop-shadow-2xl
            bottom-[-10px] left-[40%]
            max-lg:w-[88vw] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bottom-[-80px]"
        />
      </div>

      {/* Lado direito — claro */}
      <div className="w-[60%] bg-[#f7f7f7] flex flex-col justify-center items-center text-center px-10 py-12 max-lg:w-full max-lg:px-6 max-lg:pt-[110px] max-lg:pb-10">
        <div className="flex flex-col items-stretch w-fit">
          <p className="text-[#888] text-sm uppercase tracking-[2px] mb-3 max-lg:text-xs text-center">
            Várias marcas e modelos esperando por você
          </p>
          <h3 className="text-[1.4rem] font-black uppercase text-[#232323] mb-4 max-lg:text-[1.1rem] text-center">
            VEJA NOSSO ESTOQUE COMPLETO!
          </h3>
          <Link to="/estoque">
            <button
              className="w-full text-white font-bold uppercase text-sm tracking-[3px] py-4 border-none cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:brightness-110"
              style={{ backgroundColor: 'var(--cor-botao)' }}
            >
              ESTOQUE COMPLETO →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
