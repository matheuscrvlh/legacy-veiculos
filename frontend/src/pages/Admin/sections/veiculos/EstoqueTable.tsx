import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Veiculo } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';
import iconLupa from '../../../../assets/icons/admin/veiculo/lupa.png';
import iconCarrinho from '../../../../assets/icons/admin/veiculo/carrinho-compras.png';
import iconLixeira from '../../../../assets/icons/admin/veiculo/lixeira.png';
import iconEstrelaPreenchida from '../../../../assets/icons/admin/veiculo/estrela-preenchida.png';
import iconEstrelaVazia from '../../../../assets/icons/admin/veiculo/estrela-vazia.png';

interface Props {
  veiculos: Veiculo[];
  onToggleOferta: (id: string) => void;
  onVender: (id: string) => void;
  onRemover: (id: string) => void;
}

export default function EstoqueTable({ veiculos, onToggleOferta, onVender, onRemover }: Props) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');

  const filtrados = busca.trim()
    ? veiculos.filter((v) =>
        `${v.Marca} ${v.Nome} ${v.Modelo} ${v.CodigoSequencial}`
          .toLowerCase()
          .includes(busca.toLowerCase())
      )
    : veiculos;

  return (
    <div>
      {/* Barra de busca + contador */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-[360px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por marca, nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-[#e0e0e0] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#888] bg-white transition-colors"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#777] text-xs font-bold bg-transparent border-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        <span className="text-sm text-[#aaa] flex-shrink-0">
          <span className="font-semibold text-[#555]">{filtrados.length}</span> veículo{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Estado vazio */}
      {veiculos.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm flex flex-col items-center justify-center py-16 text-center gap-2">
          <p className="text-[#888] font-semibold text-sm">Nenhum veículo no estoque</p>
          <p className="text-[#bbb] text-xs">Adicione veículos pela aba "+ Adicionar"</p>
        </div>
      )}

      {/* Sem resultado de busca */}
      {veiculos.length > 0 && filtrados.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] py-12 text-center">
          <p className="text-[#888] text-sm">Nenhum resultado para <span className="font-semibold">"{busca}"</span></p>
        </div>
      )}

      {/* Grid de cards */}
      {filtrados.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {filtrados.map((v) => (
            <div key={v.ID} className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">

              {/* Imagem */}
              <div className="relative w-full aspect-[4/3] bg-[#1a1a1a] overflow-hidden">
                <img
                  src={v.Imagens[0] ? `/uploads/vehicles/${v.Imagens[0]}` : '/icons/veiculos/semimagem.png'}
                  className="w-full h-full object-cover"
                  alt={v.Nome}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {v.Oferta && (
                    <span className="bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">
                      OFERTA
                    </span>
                  )}
                  <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">
                    {v.TipoVeiculo}
                  </span>
                </div>

                {/* Código */}
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-mono px-1.5 py-0.5 rounded leading-none">
                  #{v.CodigoSequencial}
                </span>
              </div>

              {/* Dados */}
              <div className="p-3 flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1a1a1a] leading-tight truncate">{v.Marca} {v.Nome}</p>
                    <p className="text-xs text-[#aaa] mt-0.5 truncate">{v.Modelo} · {v.Ano}</p>
                  </div>
                  <p className="text-sm font-bold flex-shrink-0 leading-tight" style={{ color: 'var(--cor-primaria)' }}>
                    R$ {v.Valor}
                  </p>
                </div>
                <p className="text-xs text-[#999]">{formatarKm(v.Km)} km</p>
              </div>

              {/* Ações */}
              <div className="flex border-t border-[#f0f0f0]">
                <button
                  onClick={() => onToggleOferta(v.ID)}
                  title={v.Oferta ? 'Remover oferta' : 'Marcar como oferta'}
                  className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-none cursor-pointer transition-colors text-[11px] font-semibold ${
                    v.Oferta
                      ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700'
                      : 'bg-white hover:bg-[#f5f5f5] text-[#999]'
                  }`}
                >
                  <img src={v.Oferta ? iconEstrelaPreenchida : iconEstrelaVazia} className="w-3.5 h-3.5" alt="" />
                  {v.Oferta ? 'Oferta' : 'Destacar'}
                </button>

                <div className="w-px bg-[#f0f0f0]" />

                <button
                  onClick={() => navigate(`/veiculo/${v.ID}`)}
                  title="Ver no site"
                  className="w-10 py-2.5 flex items-center justify-center bg-white hover:bg-blue-50 border-none cursor-pointer transition-colors"
                >
                  <img src={iconLupa} className="w-[15px] h-[15px]" alt="" />
                </button>

                <div className="w-px bg-[#f0f0f0]" />

                <button
                  onClick={() => onVender(v.ID)}
                  title="Marcar como vendido"
                  className="w-10 py-2.5 flex items-center justify-center bg-white hover:bg-emerald-50 border-none cursor-pointer transition-colors"
                >
                  <img src={iconCarrinho} className="w-[15px] h-[15px]" alt="" />
                </button>

                <div className="w-px bg-[#f0f0f0]" />

                <button
                  onClick={() => onRemover(v.ID)}
                  title="Remover"
                  className="w-10 py-2.5 flex items-center justify-center bg-white hover:bg-red-50 border-none cursor-pointer transition-colors"
                >
                  <img src={iconLixeira} className="w-[15px] h-[15px]" alt="" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
