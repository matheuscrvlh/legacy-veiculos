import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSobre } from '../../hooks/useSobre';
import { veiculosApi } from '../../api/veiculos';
import { Veiculo, FiltrosVeiculo } from '../../types';
import carImg from '../../assets/sectionCar/car.png';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import VehicleCard from '../../components/VehicleCard';
import InstagramPanel from '../../components/InstagramPanel';
import ContatoSection from '../../components/ContatoSection';
import LocalizacaoSection from '../../components/LocalizacaoSection';

export default function Home() {
  const { dados } = useSobre();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filtrados, setFiltrados] = useState<Veiculo[]>([]);
  const [filtros, setFiltros] = useState<FiltrosVeiculo>({});
  const [marcas, setMarcas] = useState<string[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    veiculosApi.listarOferta().then((data) => {
      setVeiculos(data);
      setFiltrados(data);
      setMarcas([...new Set(data.map((v) => v.Marca))]);
      setCategorias([...new Set(data.map((v) => v.Categoria))]);
    });
  }, []);

  useEffect(() => {
    let result = veiculos;
    if (filtros.marca && filtros.marca !== 'Todas') result = result.filter((v) => v.Marca === filtros.marca);
    if (filtros.categoria && filtros.categoria !== 'Todas') result = result.filter((v) => v.Categoria === filtros.categoria);
    if (filtros.anoDe) result = result.filter((v) => v.Ano >= filtros.anoDe!);
    if (filtros.anoAte) result = result.filter((v) => v.Ano <= filtros.anoAte!);
    setFiltrados(result);
  }, [filtros, veiculos]);

  const imagens = dados.imagens?.imagemDestaque ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSlider imagens={imagens} />

      <main className="flex flex-col items-center mt-[30px] flex-1">
        <WhatsAppButton />

        {/* Title */}
        <div className="flex flex-col w-full text-center gap-[5px] max-lg:w-[80vw]">
          <p className="text-center text-[1.5rem] font-bold text-[#535353] uppercase max-lg:text-[1.3rem]">VEÍCULOS EM DESTAQUE</p>
          <p className="text-center text-base text-[#535353] uppercase max-lg:text-[0.8rem]">VEJA OS VEÍCULOS COM UMA SUPER OFERTA ESPECIALMENTE PARA VOCÊ</p>
        </div>

        {/* Filters */}
        <div className="flex justify-between text-center flex-wrap p-5 w-full max-w-[1400px] gap-[1px] mt-[10px] max-lg:hidden">
          <h1 className="text-[1.2rem] text-[#535353] my-[5px] uppercase w-full">FILTRE SEU VEÍCULO!</h1>
          <select
            className="p-[10px] m-[10px_5px] border border-[#ccc] text-base bg-white text-[#333] shadow-sm cursor-pointer flex-grow min-w-[10%] max-w-[350px]"
            value={filtros.marca ?? 'Todas'}
            onChange={(e) => setFiltros((f) => ({ ...f, marca: e.target.value }))}
          >
            <option value="Todas">Marca</option>
            {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            className="p-[10px] m-[10px_5px] border border-[#ccc] text-base bg-white text-[#333] shadow-sm cursor-pointer flex-grow min-w-[10%] max-w-[350px]"
            value={filtros.categoria ?? 'Todas'}
            onChange={(e) => setFiltros((f) => ({ ...f, categoria: e.target.value }))}
          >
            <option value="Todas">Categoria</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="Do ano"
            className="p-[10px] m-[10px_5px] border border-[#ccc] text-base bg-white text-[#333] shadow-sm flex-grow min-w-[10%] max-w-[200px]"
            onChange={(e) => setFiltros((f) => ({ ...f, anoDe: e.target.value ? parseInt(e.target.value) : undefined }))}
          />
          <input
            type="number"
            placeholder="Ao ano"
            className="p-[10px] m-[10px_5px] border border-[#ccc] text-base bg-white text-[#333] shadow-sm flex-grow min-w-[10%] max-w-[200px]"
            onChange={(e) => setFiltros((f) => ({ ...f, anoAte: e.target.value ? parseInt(e.target.value) : undefined }))}
          />
        </div>

        {/* Catalog */}
        {filtrados.length > 0 ? (
          <div className="grid justify-center items-center gap-[15px] p-[30px] max-w-[1600px] w-[90vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-lg:mt-[25px]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, auto))' }}>
            {filtrados.map((v) => <VehicleCard key={v.ID} veiculo={v} />)}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center my-[50px] gap-[10px] text-center max-w-[1300px] w-[70vw] py-[30px] rounded-[10px] bg-[#f4f4f4] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-lg:w-[95vw]">
            <p className="text-[1.1rem]">Nenhum veículo em oferta encontrado.</p>
            <p className="text-[1.1rem]">Tente verificar nosso estoque completo.</p>
          </div>
        )}

        {/* Estoque completo */}
        <div className="flex justify-between my-[40px] w-full h-[400px] relative max-lg:flex-col max-lg:h-[500px] max-lg:items-center max-[500px]:h-auto">
          <div className="w-[40%] p-5 bg-[#232323] text-white text-left max-lg:w-full min-h-[300px]">
            <p className="text-[2.4rem] uppercase m-0 ml-[35%] max-[1550px]:ml-[8%] max-lg:ml-0 max-lg:text-[2.1rem]">CONHEÇA</p>
            <h1 className="text-[2.4rem] font-bold uppercase my-[-15px] ml-[35%] max-[1550px]:ml-[8%] max-lg:ml-0 max-lg:text-[2.1rem]" style={{ color: 'var(--cor-primaria)' }}>NOSSO</h1>
            <p className="text-[2.4rem] uppercase m-0 ml-[35%] max-[1550px]:ml-[8%] max-lg:ml-0 max-lg:text-[2.1rem]">ESTOQUE</p>
            <img
              src={carImg}
              alt="Carro"
              className="absolute z-10 max-w-[700px] ml-[12%] top-[53%] left-[1%] max-lg:top-1/2 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:-translate-y-1/2 max-lg:max-w-[90%] max-lg:ml-0"
            />
          </div>
          <div className="w-[60%] p-5 text-[#333] text-center bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-lg:w-full">
            <h1 className="text-[1.8rem] font-bold uppercase mb-5 mr-[20%] text-[#3b3b3b] max-[1550px]:mr-[5%] max-lg:mt-[90px] max-lg:mr-0">VEJA NOSSO ESTOQUE COMPLETO!</h1>
            <h3 className="text-base text-[#555] mb-[15px] mr-[20%] max-[1550px]:mr-[5%] max-lg:mr-0">TEMOS VÁRIAS MARCAS E MODELOS DIFERENTES</h3>
            <Link to="/estoque">
              <button className="border-none text-white px-[30px] py-[15px] text-[1.2rem] font-bold uppercase cursor-pointer transition-all duration-300 mr-[20%] shadow-sm hover:scale-105 max-[1550px]:mr-[5%] max-lg:mr-0" style={{ backgroundColor: 'var(--cor-botao)' }}>
                ESTOQUE COMPLETO
              </button>
            </Link>
          </div>
        </div>

        <InstagramPanel />
        <ContatoSection />
        <LocalizacaoSection />
      </main>

      <Footer />
    </div>
  );
}
