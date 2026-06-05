import { useState, useEffect } from 'react';
import { useSobre } from '../../hooks/useSobre';
import { veiculosApi } from '../../api/veiculos';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSlider from '../../components/HeroSlider';
import WhatsAppButton from '../../components/WhatsAppButton';
import LocalizacaoSection from '../../components/LocalizacaoSection';
import FiltrosSidebar from './sections/estoque/FiltrosSidebar';
import CatalogGrid from './sections/estoque/CatalogGrid';
import VendidosStrip from './sections/estoque/VendidosStrip';
import { Filtros, filtrosIniciais, ANO_MAX, KM_MAX } from './sections/estoque/types';

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
    if (filtros.codigo) result = result.filter((v) => String(v.CodigoSequencial).includes(filtros.codigo));
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSlider imagens={imagens} />
      <main className="flex justify-center w-[80vw] mx-auto my-[30px] gap-[30px] max-[1200px]:flex-col max-[1200px]:w-full max-[1200px]:mx-0">
        <WhatsAppButton />
        <FiltrosSidebar
          filtros={filtros} onChange={setFiltros}
          marcas={marcas} categorias={categorias} cambios={cambios}
          combustiveis={combustiveis} cores={cores} portasOpts={portasOpts}
          aberto={filtrosAberto} onFechar={() => setFiltrosAberto(false)}
        />
        <CatalogGrid
          veiculos={filtrados} ordem={filtros.ordem}
          onOrdem={(o) => setFiltros((f) => ({ ...f, ordem: o }))}
          onAbrirFiltros={() => setFiltrosAberto(true)}
          onLimpar={() => setFiltros(filtrosIniciais)}
        />
      </main>
      <VendidosStrip vendidos={vendidos} />
      <LocalizacaoSection />
      <Footer />
    </div>
  );
}
