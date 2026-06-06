import { Link } from 'react-router-dom';
import carImg from '../../../../assets/sectionCar/car.png';

export default function EstoqueBannerSection() {
  return (
    <section className="relative w-full flex h-[420px] overflow-visible max-lg:flex-col max-lg:h-auto">

      {/* Carro desktop */}
      <img
        src={carImg}
        alt="Carro"
        data-aos="fade-right"
        data-aos-delay="200"
        data-aos-duration="800"
        className="lg:block hidden absolute z-30 w-[640px] max-[1400px]:w-[500px] drop-shadow-2xl pointer-events-none bottom-[-10px] left-[16%]"
      />

      {/* Carro mobile — wrapper posiciona no centro da section, img recebe o AOS sem conflito de transform */}
      <div className="lg:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-center pointer-events-none">
        <img
          src={carImg}
          alt=""
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-duration="800"
          className="w-[88vw] drop-shadow-2xl"
        />
      </div>

      {/* Lado esquerdo — escuro */}
      <div className="relative w-[40%] bg-[#181818] flex flex-col justify-center pl-[8vw] pr-6 max-lg:w-full max-lg:px-6 max-lg:pt-10 max-lg:pb-[80px]">
        <p data-aos="fade-up" className="text-[0.7rem] font-bold uppercase tracking-[5px] mb-3 relative z-10" style={{ color: 'var(--cor-primaria)' }}>
          EXPLORE
        </p>
        <h2 data-aos="fade-up" data-aos-delay="60" className="text-[3rem] font-black uppercase text-white leading-[1.05] relative z-10 max-lg:text-[1.7rem]">CONHEÇA</h2>
        <h2 data-aos="fade-up" data-aos-delay="120" className="text-[3rem] font-black uppercase leading-[1.05] relative z-10 max-lg:text-[1.7rem]" style={{ color: 'var(--cor-primaria)' }}>NOSSO</h2>
        <h2 data-aos="fade-up" data-aos-delay="180" className="text-[3rem] font-black uppercase text-white leading-[1.05] relative z-10 max-lg:text-[1.7rem]">ESTOQUE</h2>
      </div>

      {/* Lado direito — claro */}
      <div className="w-[60%] bg-[#f7f7f7] flex flex-col justify-center items-end pr-[8vw] py-12 max-lg:w-full max-lg:px-6 max-lg:pt-[80px] max-lg:pb-10 max-lg:items-center">
        <div data-aos="fade-up" className="flex flex-col items-end gap-3 max-lg:items-center">
          <p className="text-[#888] text-sm uppercase tracking-[2px] text-right max-lg:text-center max-lg:text-xs">
            Várias marcas e modelos esperando por você
          </p>
          <h3 className="text-[1.4rem] font-black uppercase text-[#232323] text-right max-lg:text-center max-lg:text-[0.95rem]">
            VEJA NOSSO ESTOQUE COMPLETO!
          </h3>
          <Link to="/estoque">
            <button
              className="text-[1.4rem] text-white font-bold uppercase tracking-[3px] py-4 px-10 border-none cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:brightness-110 max-lg:text-[0.85rem] max-lg:py-3 max-lg:px-6 max-lg:tracking-[2px]"
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
