import { useState, useEffect } from 'react';
import { Veiculo } from '../../../../types';
import VehicleCard from '../../../../components/VehicleCard';

interface Props {
  veiculos: Veiculo[];
  carregando: boolean;
  ordem: string;
  onOrdem: (o: string) => void;
  onAbrirFiltros: () => void;
  onLimpar: () => void;
}

const POR_PAGINA = 12;

function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-[10px] overflow-hidden w-[300px] shadow-sm animate-pulse">
      <div className="aspect-square bg-[#e8e8e8]" />
      <div className="p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="h-4 bg-[#e8e8e8] rounded w-14" />
          <div className="h-4 bg-[#e8e8e8] rounded w-10" />
        </div>
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

export default function CatalogGrid({ veiculos, carregando, ordem, onOrdem, onAbrirFiltros, onLimpar }: Props) {
  const [pagina, setPagina] = useState(1);

  // Reseta para página 1 sempre que os filtros mudam (veiculos array muda)
  useEffect(() => { setPagina(1); }, [veiculos]);

  const totalPaginas = Math.ceil(veiculos.length / POR_PAGINA);
  const paginados = veiculos.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  // Janela de páginas para não mostrar 50 botões
  function paginasVisiveis(): (number | '...')[] {
    if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (pagina > 3) pages.push('...');
    for (let p = Math.max(2, pagina - 1); p <= Math.min(totalPaginas - 1, pagina + 1); p++) pages.push(p);
    if (pagina < totalPaginas - 2) pages.push('...');
    pages.push(totalPaginas);
    return pages;
  }

  return (
    <div className="flex-1 min-w-0">

      {/* Header */}
      <div className="mt-3 mb-5">
        <h1 className="text-[1.75rem] font-extrabold text-[#1a1a1a] leading-none tracking-tight max-lg:text-[1.4rem]">
          Nosso Estoque
        </h1>
        <p className="text-sm text-[#999] mt-1">Encontre o veículo ideal para você</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-3 min-w-0 flex-wrap">
          <button
            className="flex-shrink-0 max-[1200px]:flex hidden items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-lg cursor-pointer border-none"
            style={{ backgroundColor: 'var(--cor-botao)' }}
            onClick={onAbrirFiltros}
          >
            ☰ Filtros
          </button>
          <button
            className="flex-shrink-0 max-[1200px]:hidden flex items-center gap-1.5 text-sm text-[#666] px-3 py-2 rounded-lg border border-[#e0e0e0] hover:bg-[#f5f5f5] hover:border-[#ccc] transition-all cursor-pointer bg-white"
            onClick={onLimpar}
          >
            ✕ Limpar filtros
          </button>
          <span className="text-sm text-[#999]">
            {carregando
              ? <span className="inline-block w-16 h-4 bg-[#e8e8e8] rounded animate-pulse" />
              : <><span className="font-bold text-[#333]">{veiculos.length}</span> veículo{veiculos.length !== 1 ? 's' : ''}</>
            }
          </span>
        </div>

        <select
          className="flex-shrink-0 border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm font-medium text-[#444] cursor-pointer outline-none bg-white hover:border-[#aaa] transition-colors"
          value={ordem}
          onChange={(e) => onOrdem(e.target.value)}
        >
          <option value="ordenar">Ordenar por</option>
          <option value="maiorValor">Maior Valor</option>
          <option value="menorValor">Menor Valor</option>
          <option value="anoMaisNovo">Ano Mais Novo</option>
          <option value="menorKm">Menor Km</option>
        </select>
      </div>

      {/* Grid — skeleton enquanto carrega */}
      {carregando ? (
        <div className="grid justify-center gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, auto))' }}>
          {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
        </div>
      ) : veiculos.length > 0 ? (
        <>
          <div className="grid justify-center gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, auto))' }}>
            {paginados.map((v) => <VehicleCard key={v.ID} veiculo={v} />)}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-8 flex-wrap">
              <button
                onClick={() => { setPagina((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={pagina === 1}
                className="w-9 h-9 rounded-lg border border-[#e0e0e0] bg-white text-sm font-medium text-[#555] hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                ‹
              </button>

              {paginasVisiveis().map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-[#aaa] text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => { setPagina(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold border cursor-pointer transition-all ${
                      pagina === p
                        ? 'text-white border-transparent'
                        : 'border-[#e0e0e0] bg-white text-[#555] hover:bg-[#f5f5f5]'
                    }`}
                    style={pagina === p ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)' } : {}}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => { setPagina((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={pagina === totalPaginas}
                className="w-9 h-9 rounded-lg border border-[#e0e0e0] bg-white text-sm font-medium text-[#555] hover:bg-[#f5f5f5] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-[#e8e8e8] bg-[#fafafa] text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#eeeeee] flex items-center justify-center text-[#ccc] text-2xl font-light select-none">⊘</div>
          <div>
            <p className="text-[#888] font-semibold text-sm">Nenhum veículo encontrado</p>
            <p className="text-[#bbb] text-xs mt-1">Tente ajustar ou limpar os filtros</p>
          </div>
          <button
            className="mt-1 text-sm font-bold text-white px-5 py-2 rounded-lg border-none cursor-pointer"
            style={{ backgroundColor: 'var(--cor-botao)' }}
            onClick={onLimpar}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
