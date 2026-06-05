import { useState } from 'react';
import { Cliente } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';

interface Props {
  clientes: Cliente[];
  selecionado: Cliente | null;
  onSelecionar: (c: Cliente) => void;
  onRemover: (id: string) => void;
}

export default function ClientesTable({ clientes, selecionado, onSelecionar, onRemover }: Props) {
  const [busca, setBusca] = useState('');

  const filtrados = busca.trim()
    ? clientes.filter((c) =>
        `${c.Marca} ${c.Nome} ${c.NomeCliente} ${c.Cidade}`
          .toLowerCase()
          .includes(busca.toLowerCase())
      )
    : clientes;

  return (
    <div className="flex-1 min-w-0">
      {/* Barra de busca */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-[360px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por marca, nome ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-[#e0e0e0] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#888] bg-white transition-colors"
          />
          {busca && (
            <button type="button" onClick={() => setBusca('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#777] text-xs font-bold bg-transparent border-none cursor-pointer">✕</button>
          )}
        </div>
        <span className="text-sm text-[#aaa] flex-shrink-0">
          <span className="font-semibold text-[#555]">{filtrados.length}</span> consignado{filtrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Vazio */}
      {clientes.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm flex flex-col items-center justify-center py-16 text-center gap-2">
          <p className="text-[#888] font-semibold text-sm">Nenhum consignado recebido</p>
          <p className="text-[#bbb] text-xs">Veículos enviados pelo formulário aparecerão aqui</p>
        </div>
      )}

      {clientes.length > 0 && filtrados.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] py-12 text-center">
          <p className="text-[#888] text-sm">Nenhum resultado para <span className="font-semibold">"{busca}"</span></p>
        </div>
      )}

      {/* Grid */}
      {filtrados.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {filtrados.map((c) => {
            const ativo = selecionado?.ID === c.ID;
            return (
              <div
                key={c.ID}
                className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                  ativo ? 'border-blue-400 shadow-blue-100' : 'border-[#e8e8e8]'
                }`}
              >
                {/* Imagem */}
                <div className="relative w-full aspect-[4/3] bg-[#1a1a1a] overflow-hidden">
                  <img
                    src={c.Imagens[0] ? `/uploads/clientes/${c.Imagens[0]}` : '/icons/veiculos/semimagem.png'}
                    className="w-full h-full object-cover"
                    alt={c.Nome}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
                  />
                  {c.Gnv === 'sim' && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">GNV</span>
                  )}
                  {c.Leilao === 'sim' && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Leilão</span>
                  )}
                </div>

                {/* Dados */}
                <div className="p-3 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1a1a1a] leading-tight truncate">{c.Marca} {c.Nome}</p>
                      <p className="text-xs text-[#aaa] mt-0.5">{c.Ano} · {formatarKm(c.Km)} km</p>
                    </div>
                    {c.ValorDesejado && (
                      <p className="text-xs font-bold flex-shrink-0 text-emerald-600">R$ {c.ValorDesejado}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#f5f5f5]">
                    <div className="w-5 h-5 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-[#888]">{c.NomeCliente.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#333] truncate">{c.NomeCliente}</p>
                      {c.Cidade && <p className="text-[10px] text-[#aaa] truncate">{c.Cidade}{c.Bairro ? ` · ${c.Bairro}` : ''}</p>}
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex border-t border-[#f0f0f0]">
                  <button
                    onClick={() => onSelecionar(c)}
                    className={`flex-1 py-2.5 text-[11px] font-semibold border-none cursor-pointer transition-colors ${
                      ativo ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-white text-[#555] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {ativo ? 'Aberto' : 'Ver detalhes'}
                  </button>

                  {c.TelefoneCliente && (
                    <>
                      <div className="w-px bg-[#f0f0f0]" />
                      <a
                        href={`https://wa.me/${c.TelefoneCliente.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 flex items-center justify-center bg-white hover:bg-emerald-50 transition-colors"
                        title="Contato WhatsApp"
                      >
                        <svg className="w-[15px] h-[15px] text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </a>
                    </>
                  )}

                  <div className="w-px bg-[#f0f0f0]" />
                  <button
                    onClick={() => onRemover(c.ID)}
                    title="Remover"
                    className="w-10 py-2.5 flex items-center justify-center bg-white hover:bg-red-50 border-none cursor-pointer transition-colors"
                  >
                    <svg className="w-[14px] h-[14px] text-[#ccc] hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
