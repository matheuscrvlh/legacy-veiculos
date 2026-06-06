import { useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import iconLupaBranca from '../../../../assets/icons/public/filtros/lupa branca.png';
import { Filtros, filtrosIniciais, ANO_MIN, ANO_MAX, KM_MAX } from './types';

interface Props {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  marcas: string[];
  categorias: string[];
  cambios: string[];
  combustiveis: string[];
  cores: string[];
  portasOpts: string[];
  aberto: boolean;
  onFechar: () => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f0f0f0] py-3 last:border-b-0">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[0.7rem] font-bold text-[#555] uppercase tracking-widest">{title}</span>
        <span className={`text-[#bbb] text-[9px] transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>▼</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const selectClass = 'outline-none border border-[#e0e0e0] rounded-md px-3 py-2 text-sm text-[#444] w-full cursor-pointer bg-white hover:border-[#bbb] focus:border-[#888] transition-colors';

export default function FiltrosSidebar({ filtros, onChange, marcas, categorias, cambios, combustiveis, cores, portasOpts, aberto, onFechar }: Props) {
  function set(patch: Partial<Filtros>) { onChange({ ...filtros, ...patch }); }

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  const activeCount = [
    filtros.codigo !== '',
    filtros.oferta,
    filtros.tipo !== 'Todos',
    filtros.marca !== 'Todos',
    filtros.categoria !== 'Todos',
    filtros.cambio !== 'Todos',
    filtros.combustivel !== 'Todos',
    filtros.cores.length > 0,
    filtros.portas.length > 0,
    filtros.anoMin > 0,
    filtros.anoMax < ANO_MAX,
    filtros.kmMin > 0,
    filtros.kmMax < KM_MAX,
  ].filter(Boolean).length;

  const header = (
    <div className="flex-shrink-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-[#222] uppercase tracking-wide">Filtros</span>
        {activeCount > 0 && (
          <span
            className="text-[11px] font-bold text-white w-5 h-5 rounded-full flex items-center justify-center leading-none"
            style={{ backgroundColor: 'var(--cor-primaria)' }}
          >
            {activeCount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {activeCount > 0 && (
          <button
            type="button"
            className="text-xs text-[#999] hover:text-[#333] underline transition-colors"
            onClick={() => onChange(filtrosIniciais)}
          >
            Limpar
          </button>
        )}
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#f4f4f4] text-[#555] text-sm font-bold hover:bg-[#eee] transition-colors lg:hidden"
          onClick={onFechar}
        >
          ✕
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="px-4 pb-4">

      {/* Super Oferta */}
      <div className="py-3 border-b border-[#f0f0f0]">
        <button
          type="button"
          onClick={() => set({ oferta: !filtros.oferta })}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
            filtros.oferta ? 'text-white border-transparent' : 'text-[#444] bg-[#f8f8f8] border-transparent hover:bg-[#f0f0f0]'
          }`}
          style={filtros.oferta ? { backgroundColor: 'var(--cor-primaria)' } : {}}
        >
          <span>Super Ofertas</span>
          <span
            className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              filtros.oferta ? 'bg-white' : 'border-[#ccc] bg-white'
            }`}
            style={filtros.oferta ? { borderColor: 'white' } : {}}
          >
            {filtros.oferta && (
              <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: 'var(--cor-primaria)' }} />
            )}
          </span>
        </button>
      </div>

      {/* Marcas */}
      {marcas.length > 0 && (
        <Section title="Marca">
          <div className="grid grid-cols-4 gap-1.5">
            {marcas.map((m) => {
              const selected = filtros.marca === m;
              return (
                <button
                  key={m}
                  type="button"
                  className={`flex flex-col items-center p-1.5 rounded-lg border-2 text-[0.58rem] font-semibold transition-all gap-1 ${
                    selected ? '' : 'border-transparent bg-[#f7f7f7] hover:bg-[#eeeeee] text-[#666]'
                  }`}
                  style={selected ? { borderColor: 'var(--cor-primaria)', color: 'var(--cor-primaria)', backgroundColor: '#f9f9f9' } : {}}
                  onClick={() => set({ marca: selected ? 'Todos' : m })}
                >
                  <img
                    src={`/icons/marcas/${m.toLowerCase()}.png`}
                    className="w-7 h-7 object-contain"
                    alt={m}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {m}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* Código */}
      <Section title="Código de Referência">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: 001"
            className="outline-none border border-[#e0e0e0] rounded-md px-3 py-2 text-sm text-[#444] flex-1 min-w-0 hover:border-[#bbb] focus:border-[#888] transition-colors"
            value={filtros.codigo}
            onChange={(e) => set({ codigo: e.target.value })}
          />
          <button
            type="button"
            className="w-9 h-9 rounded-md flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: 'var(--cor-primaria)' }}
          >
            <img src={iconLupaBranca} alt="Pesquisar" className="w-4 h-4 object-contain" />
          </button>
        </div>
      </Section>

      {/* Tipo de Veículo */}
      <Section title="Tipo de Veículo">
        <div className="flex flex-wrap gap-1.5">
          {['Todos', 'Usado', 'Semi-Novo', 'Zero Km'].map((opt) => {
            const selected = filtros.tipo === opt;
            return (
              <button
                key={opt}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selected ? 'text-white border-transparent' : 'text-[#666] border-[#ddd] hover:border-[#aaa] bg-white'
                }`}
                style={selected ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)' } : {}}
                onClick={() => set({ tipo: opt })}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Selects */}
      {([
        { label: 'Categoria', field: 'categoria' as keyof Filtros, opts: ['Todos', ...categorias] },
        { label: 'Câmbio', field: 'cambio' as keyof Filtros, opts: ['Todos', ...cambios] },
        { label: 'Combustível', field: 'combustivel' as keyof Filtros, opts: ['Todos', ...combustiveis] },
      ] as const).map(({ label, field, opts }) => (
        <Section key={field} title={label} defaultOpen={false}>
          <select className={selectClass} value={filtros[field] as string} onChange={(e) => set({ [field]: e.target.value })}>
            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Section>
      ))}

      {/* Ano */}
      <Section title="Ano" defaultOpen={false}>
        <div className="flex justify-between text-xs font-semibold text-[#444] mb-2">
          <span>{filtros.anoMin || ANO_MIN}</span>
          <span>{filtros.anoMax}</span>
        </div>
        <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMin || ANO_MIN} className="w-full mb-2" onChange={(e) => set({ anoMin: parseInt(e.target.value) })} />
        <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMax} className="w-full" onChange={(e) => set({ anoMax: parseInt(e.target.value) })} />
      </Section>

      {/* KM */}
      <Section title="Quilometragem" defaultOpen={false}>
        <div className="flex justify-between text-xs font-semibold text-[#444] mb-2">
          <span>{filtros.kmMin.toLocaleString()} km</span>
          <span>{filtros.kmMax.toLocaleString()} km</span>
        </div>
        <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMin} className="w-full mb-2" onChange={(e) => set({ kmMin: parseInt(e.target.value) })} />
        <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMax} className="w-full" onChange={(e) => set({ kmMax: parseInt(e.target.value) })} />
      </Section>

      {/* Cores */}
      {cores.length > 0 && (
        <Section title="Cor" defaultOpen={false}>
          <div className="flex flex-col gap-2">
            {cores.map((cor) => {
              const checked = filtros.cores.includes(cor);
              return (
                <label key={cor} className="flex items-center gap-3 text-sm text-[#555] cursor-pointer select-none">
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={checked ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)' } : { borderColor: '#ccc' }}
                  >
                    {checked && <span className="text-white text-[9px] leading-none font-bold">✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => set({ cores: e.target.checked ? [...filtros.cores, cor] : filtros.cores.filter((c) => c !== cor) })}
                    className="hidden"
                  />
                  {cor}
                </label>
              );
            })}
          </div>
        </Section>
      )}

      {/* Portas */}
      {portasOpts.length > 0 && (
        <Section title="Portas" defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {portasOpts.map((p) => {
              const selected = filtros.portas.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    selected ? 'text-white border-transparent' : 'text-[#666] border-[#ddd] hover:border-[#aaa] bg-white'
                  }`}
                  style={selected ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)' } : {}}
                  onClick={() => set({ portas: selected ? filtros.portas.filter((x) => x !== p) : [...filtros.portas, p] })}
                >
                  {p} portas
                </button>
              );
            })}
          </div>
        </Section>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col bg-white self-start sticky top-4 rounded-xl shadow-sm border border-[#ebebeb] min-w-[300px] max-w-[300px] max-h-[calc(100vh-2rem)]">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] rounded-t-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#222] uppercase tracking-wide">Filtros</span>
            {activeCount > 0 && (
              <span
                className="text-[11px] font-bold text-white w-5 h-5 rounded-full flex items-center justify-center leading-none"
                style={{ backgroundColor: 'var(--cor-primaria)' }}
              >
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              className="text-xs text-[#999] hover:text-[#333] underline transition-colors"
              onClick={() => onChange(filtrosIniciais)}
            >
              Limpar
            </button>
          )}
        </div>
        <div className="overflow-y-auto flex-1">{content}</div>
      </aside>

      {/* Mobile modal via portal — escapa qualquer overflow do pai */}
      {createPortal(
        <>
          <div
            className={`fixed inset-0 bg-black/40 z-[999] lg:hidden transition-opacity duration-300 ${aberto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onFechar}
          />
          <aside
            className={`fixed top-0 right-0 h-screen w-[85vw] max-w-[340px] bg-white z-[1000] flex flex-col shadow-2xl lg:hidden transition-transform duration-300 ${aberto ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {header}
            <div className="flex-1 overflow-y-auto">{content}</div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
