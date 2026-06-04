import { useState, useEffect } from 'react';
import { useSobre } from '../../hooks/useSobre';
import { veiculosApi } from '../../api/veiculos';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import iconLupaBranca from '../../assets/icons/public/filtros/lupa branca.png';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import VehicleCard from '../../components/VehicleCard';
import LocalizacaoSection from '../../components/LocalizacaoSection';

interface Filtros {
  codigo: string;
  oferta: boolean;
  tipo: string;
  marca: string;
  categoria: string;
  cambio: string;
  combustivel: string;
  cores: string[];
  portas: string[];
  anoMin: number;
  anoMax: number;
  precoMin: number;
  precoMax: number;
  kmMin: number;
  kmMax: number;
  ordem: string;
}

const ANO_MIN = 1990;
const ANO_MAX = new Date().getFullYear() + 1;
const KM_MAX = 500000;

const filtrosIniciais: Filtros = {
  codigo: '', oferta: false, tipo: 'Todos', marca: 'Todos', categoria: 'Todos',
  cambio: 'Todos', combustivel: 'Todos', cores: [], portas: [],
  anoMin: 0, anoMax: ANO_MAX, precoMin: 0, precoMax: 10000000,
  kmMin: 0, kmMax: KM_MAX, ordem: 'ordenar',
};

export default function Estoque() {
  const { dados } = useSobre();
  const [todos, setTodos] = useState<Veiculo[]>([]);
  const [vendidos, setVendidos] = useState<Veiculo[]>([]);
  const [filtrados, setFiltrados] = useState<Veiculo[]>([]);
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);
  const [filtrosAberto, setFiltrosAberto] = useState(false);

  const marcas = [...new Set(todos.map((v) => v.Marca))];
  const categorias = [...new Set(todos.map((v) => v.Categoria))];
  const cambios = [...new Set(todos.map((v) => v.Cambio))];
  const combustiveis = [...new Set(todos.map((v) => v.Combustivel))];
  const cores = [...new Set(todos.map((v) => v.Cor))];
  const portasOpts = [...new Set(todos.map((v) => String(v.Portas)))];

  useEffect(() => {
    veiculosApi.listar().then(setTodos).catch(() => setTodos([]));
    vendidosApi.listar().then(setVendidos).catch(() => setVendidos([]));
  }, []);

  useEffect(() => {
    let result = [...todos];

    if (filtros.codigo) {
      result = result.filter((v) => String(v.CodigoSequencial).includes(filtros.codigo));
    }
    if (filtros.oferta) result = result.filter((v) => v.Oferta);
    if (filtros.tipo !== 'Todos') result = result.filter((v) => v.TipoVeiculo === filtros.tipo);
    if (filtros.marca !== 'Todos') result = result.filter((v) => v.Marca === filtros.marca);
    if (filtros.categoria !== 'Todos') result = result.filter((v) => v.Categoria === filtros.categoria);
    if (filtros.cambio !== 'Todos') result = result.filter((v) => v.Cambio === filtros.cambio);
    if (filtros.combustivel !== 'Todos') result = result.filter((v) => v.Combustivel === filtros.combustivel);
    if (filtros.cores.length > 0) result = result.filter((v) => filtros.cores.includes(v.Cor));
    if (filtros.portas.length > 0) result = result.filter((v) => filtros.portas.includes(String(v.Portas)));

    if (filtros.anoMin > 0 || filtros.anoMax < ANO_MAX) {
      result = result.filter((v) => !v.Ano || (v.Ano >= filtros.anoMin && v.Ano <= filtros.anoMax));
    }
    if (filtros.kmMin > 0 || filtros.kmMax < KM_MAX) {
      result = result.filter((v) => v.Km >= filtros.kmMin && v.Km <= filtros.kmMax);
    }

    if (filtros.ordem === 'maiorValor') result.sort((a, b) => parseFloat(b.Valor.replace(/\./g, '').replace(',', '.')) - parseFloat(a.Valor.replace(/\./g, '').replace(',', '.')));
    if (filtros.ordem === 'menorValor') result.sort((a, b) => parseFloat(a.Valor.replace(/\./g, '').replace(',', '.')) - parseFloat(b.Valor.replace(/\./g, '').replace(',', '.')));
    if (filtros.ordem === 'anoMaisNovo') result.sort((a, b) => b.Ano - a.Ano);
    if (filtros.ordem === 'menorKm') result.sort((a, b) => a.Km - b.Km);

    setFiltrados(result);
  }, [filtros, todos]);

  const imagens = dados.imagens?.imagemDestaque ?? [];

  const inputClass = "outline-none border border-[#ccc] rounded-[3px] px-3 py-2 text-sm text-[#606060] font-bold w-full cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSlider imagens={imagens} />

      <main className="flex justify-center w-[80vw] mx-auto my-[30px] gap-[30px] max-[1200px]:flex-col max-[1200px]:w-full max-[1200px]:mx-0">
        <WhatsAppButton />

        {/* Filtros overlay mobile */}
        {filtrosAberto && (
          <div
            className="fixed inset-0 bg-black/30 z-[99] lg:hidden"
            onClick={() => setFiltrosAberto(false)}
          />
        )}

        {/* Filtros sidebar */}
        <div
          className={`bg-white min-w-[350px] h-full max-[1200px]:fixed max-[1200px]:top-0 max-[1200px]:right-0 max-[1200px]:w-[80vw] max-[1200px]:min-w-[350px] max-[1200px]:overflow-y-auto max-[1200px]:z-[1000] max-[1200px]:transition-transform max-[1200px]:duration-300 max-[1200px]:pt-5 ${
            filtrosAberto ? 'max-[1200px]:translate-x-0' : 'max-[1200px]:translate-x-full'
          }`}
        >
          {/* Close btn mobile */}
          <button
            className="hidden max-[1200px]:block ml-auto mr-[5%] border-none bg-white px-2 py-1 rounded-[3px] cursor-pointer text-base font-bold"
            onClick={() => setFiltrosAberto(false)}
          >X</button>

          <div className="max-[1200px]:w-[90%] max-[1200px]:mx-auto">
            <button
              className="hidden max-[1200px]:block mb-[15px] text-white text-base border-none rounded-[3px] cursor-pointer transition-all duration-300 h-[35px] w-[130px]"
              style={{ backgroundColor: 'var(--cor-botao)' }}
              onClick={() => setFiltros(filtrosIniciais)}
            >Limpar Filtros</button>

            {/* Marcas populares */}
            <div className="max-w-full text-[#606060] border-b border-[#F1F1F1] pb-[3px]">
              <p className="text-base font-semibold">Marcas Populares</p>
              <div className="flex flex-wrap">
                {marcas.map((m) => (
                  <div key={m} className="flex flex-col items-center m-[5px] w-[60px] cursor-pointer max-[1200px]:m-[6px] max-[1200px]:w-[50px]" onClick={() => setFiltros((f) => ({ ...f, marca: f.marca === m ? 'Todos' : m }))}>
                    <img src={`/icons/marcas/${m.toLowerCase()}.png`} className="w-[35px] h-[35px] object-contain max-[1200px]:w-[30px] max-[1200px]:h-[30px]" alt={m} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <span className="text-[0.8rem]">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Código */}
            <div className="w-full text-[#606060] h-[80px] mt-[10px]">
              <p className="mb-[5px]">Código de Referência</p>
              <div className="flex gap-[5px] w-full">
                <input
                  type="text"
                  placeholder="Buscar por código"
                  className="outline-none border border-[#33333357] rounded-[3px] px-[10px] h-[35px] w-[90%]"
                  value={filtros.codigo}
                  onChange={(e) => setFiltros((f) => ({ ...f, codigo: e.target.value }))}
                />
                <div className="w-[35px] h-[35px] p-[10px] rounded-[3px] bg-[#606060] flex items-center justify-center cursor-pointer">
                  <img src={iconLupaBranca} alt="Pesquisar" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Oferta */}
            <div className="flex flex-row mt-[10px] w-full gap-[10px] border-t border-[#F1F1F1] pt-[13px]">
              <div
                className="w-5 h-5 rounded-full border border-[#33333357] cursor-pointer transition-colors duration-200 flex-shrink-0"
                style={{ backgroundColor: filtros.oferta ? 'var(--cor-primaria)' : 'transparent' }}
                onClick={() => setFiltros((f) => ({ ...f, oferta: !f.oferta }))}
              />
              <p className="text-[1.2rem] font-bold" style={{ color: 'var(--cor-primaria)' }}>Super Ofertas</p>
            </div>

            {/* Selects */}
            <div className="flex flex-col gap-[15px] border-t border-[#F1F1F1] mt-[10px] pt-[10px] w-full text-[#606060]">
              {[
                { label: 'Tipo de Veículos', field: 'tipo' as keyof Filtros, opts: ['Todos', 'Usado', 'Semi-Novo', 'Zero Km'] },
                { label: 'Marcas', field: 'marca' as keyof Filtros, opts: ['Todos', ...marcas] },
                { label: 'Categorias', field: 'categoria' as keyof Filtros, opts: ['Todos', ...categorias] },
                { label: 'Câmbio', field: 'cambio' as keyof Filtros, opts: ['Todos', ...cambios] },
                { label: 'Combustível', field: 'combustivel' as keyof Filtros, opts: ['Todos', ...combustiveis] },
              ].map(({ label, field, opts }) => (
                <div key={field}>
                  <p>{label}</p>
                  <select className={inputClass} value={filtros[field] as string} onChange={(e) => setFiltros((f) => ({ ...f, [field]: e.target.value }))}>
                    {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Ranges */}
            <div className="mt-5 border-t border-[#F1F1F1] text-[#606060]">
              <div className="py-[10px]">
                <p>Ano: {filtros.anoMin || ANO_MIN} - {filtros.anoMax}</p>
                <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMin || ANO_MIN} className="w-full" onChange={(e) => setFiltros((f) => ({ ...f, anoMin: parseInt(e.target.value) }))} />
                <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMax} className="w-full" onChange={(e) => setFiltros((f) => ({ ...f, anoMax: parseInt(e.target.value) }))} />
              </div>
              <div className="py-[10px] border-t border-[#F1F1F1]">
                <p>KM: {filtros.kmMin.toLocaleString()} - {filtros.kmMax.toLocaleString()}</p>
                <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMin} className="w-full" onChange={(e) => setFiltros((f) => ({ ...f, kmMin: parseInt(e.target.value) }))} />
                <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMax} className="w-full" onChange={(e) => setFiltros((f) => ({ ...f, kmMax: parseInt(e.target.value) }))} />
              </div>
            </div>

            {/* Checkboxes cores */}
            <div className="mt-5 pt-[10px] border-t border-[#F1F1F1] text-[#606060]">
              <p className="mb-[10px]">Cor</p>
              <div className="flex flex-col gap-1">
                {cores.map((cor) => (
                  <label key={cor} className="flex items-center gap-[5px] text-[#838383] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filtros.cores.includes(cor)}
                      onChange={(e) => setFiltros((f) => ({
                        ...f,
                        cores: e.target.checked ? [...f.cores, cor] : f.cores.filter((c) => c !== cor),
                      }))}
                      className="appearance-none w-[15px] h-[15px] border border-[#33333357] rounded-[3px] checked:bg-primaria cursor-pointer"
                    />
                    {cor}
                  </label>
                ))}
              </div>
            </div>

            {/* Checkboxes portas */}
            <div className="mt-5 pt-[10px] border-t border-[#F1F1F1] text-[#606060]">
              <p className="mb-[10px]">Portas</p>
              <div className="flex flex-col gap-1">
                {portasOpts.map((p) => (
                  <label key={p} className="flex items-center gap-[5px] text-[#838383] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filtros.portas.includes(p)}
                      onChange={(e) => setFiltros((f) => ({
                        ...f,
                        portas: e.target.checked ? [...f.portas, p] : f.portas.filter((x) => x !== p),
                      }))}
                      className="appearance-none w-[15px] h-[15px] border border-[#33333357] rounded-[3px] checked:bg-primaria cursor-pointer"
                    />
                    {p} portas
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div className="w-auto">
          <div className="mt-5 mb-5 text-center">
            <p className="text-[2rem] font-bold text-[#535353] max-lg:text-[1.5rem]">NOSSO ESTOQUE</p>
            <p className="text-base font-bold text-[#535353] max-lg:text-[0.8rem]">ENCONTRE SEU VEÍCULO!</p>
          </div>

          <div className="flex justify-between">
            <button className="hidden max-[1200px]:block text-white font-bold uppercase px-[10px] py-[10px] rounded-[5px] border-none cursor-pointer text-base" style={{ backgroundColor: 'var(--cor-botao)' }} onClick={() => setFiltrosAberto(true)}>
              ☰ Filtros
            </button>
            <button className="max-[1200px]:hidden text-white text-base border-none rounded-[3px] cursor-pointer h-[40px] w-[150px]" style={{ backgroundColor: 'var(--cor-botao)' }} onClick={() => setFiltros(filtrosIniciais)}>
              Limpar Filtros
            </button>
            <select
              className="border-b border-[#606060] border-l-0 border-r-0 border-t-0 px-[10px] h-[40px] rounded-[5px] text-base font-bold text-[#535353] cursor-pointer outline-none"
              value={filtros.ordem}
              onChange={(e) => setFiltros((f) => ({ ...f, ordem: e.target.value }))}
            >
              <option value="ordenar">Ordenar por:</option>
              <option value="maiorValor">Maior Valor</option>
              <option value="menorValor">Menor Valor</option>
              <option value="anoMaisNovo">Ano Mais Novo</option>
              <option value="menorKm">Menor Km</option>
            </select>
          </div>

          {filtrados.length > 0 ? (
            <div className="grid justify-center items-center gap-[15px] p-[30px] max-w-[1300px] w-[70vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, auto))' }}>
              {filtrados.map((v) => <VehicleCard key={v.ID} veiculo={v} />)}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center my-[50px] gap-[10px] text-center max-w-[1300px] w-[70vw] py-[30px] rounded-[10px] bg-[#f4f4f4] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]">
              <p>Nenhum veículo encontrado com os filtros aplicados.</p>
            </div>
          )}
        </div>
      </main>

      {/* Vendidos */}
      {vendidos.length > 0 && (
        <div className="w-full mt-[100px] mb-[100px] max-lg:mt-[50px] max-lg:mb-[50px]">
          <p className="text-center text-[1.8rem] font-semibold text-[#535353] max-lg:text-[1.5rem]">VEICULOS VENDIDOS</p>
          <p className="text-center text-[1.1rem] text-[#535353] max-lg:text-base">VEJA TAMBÉM NOSSOS VEÍCULOS JÁ VENDIDOS</p>
          <div className="flex justify-start flex-nowrap overflow-x-auto scroll-smooth gap-[15px] p-[30px] max-w-[1600px] w-[90vw] rounded-[10px] mx-auto my-[10px] bg-[#FBFBFB] shadow-[inset_0px_0px_5px_rgba(0,0,0,0.11)] max-[1200px]:w-[95vw]">
            {vendidos.map((v) => <VehicleCard key={v.ID} veiculo={v} isVendido />)}
          </div>
        </div>
      )}

      <LocalizacaoSection />
      <Footer />
    </div>
  );
}
