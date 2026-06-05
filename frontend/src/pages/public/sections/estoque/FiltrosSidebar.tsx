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

const inputClass = 'outline-none border border-[#ccc] rounded-[3px] px-3 py-2 text-sm text-[#606060] font-bold w-full cursor-pointer';

export default function FiltrosSidebar({ filtros, onChange, marcas, categorias, cambios, combustiveis, cores, portasOpts, aberto, onFechar }: Props) {
  function set(patch: Partial<Filtros>) { onChange({ ...filtros, ...patch }); }

  return (
    <>
      {aberto && <div className="fixed inset-0 bg-black/30 z-[99] lg:hidden" onClick={onFechar} />}

      <aside className={`bg-white min-w-[350px] h-full max-[1200px]:fixed max-[1200px]:top-0 max-[1200px]:right-0 max-[1200px]:w-[80vw] max-[1200px]:min-w-[350px] max-[1200px]:overflow-y-auto max-[1200px]:z-[1000] max-[1200px]:transition-transform max-[1200px]:duration-300 max-[1200px]:pt-5 ${aberto ? 'max-[1200px]:translate-x-0' : 'max-[1200px]:translate-x-full'}`}>
        <button className="hidden max-[1200px]:block ml-auto mr-[5%] border-none bg-white px-2 py-1 rounded-[3px] cursor-pointer text-base font-bold" onClick={onFechar}>X</button>

        <div className="max-[1200px]:w-[90%] max-[1200px]:mx-auto">
          <button className="hidden max-[1200px]:block mb-[15px] text-white text-base border-none rounded-[3px] cursor-pointer h-[35px] w-[130px]" style={{ backgroundColor: 'var(--cor-botao)' }} onClick={() => onChange(filtrosIniciais)}>
            Limpar Filtros
          </button>

          {/* Marcas */}
          <div className="max-w-full text-[#606060] border-b border-[#F1F1F1] pb-[3px]">
            <p className="text-base font-semibold">Marcas Populares</p>
            <div className="flex flex-wrap">
              {marcas.map((m) => (
                <div key={m} className="flex flex-col items-center m-[5px] w-[60px] cursor-pointer max-[1200px]:m-[6px] max-[1200px]:w-[50px]" onClick={() => set({ marca: filtros.marca === m ? 'Todos' : m })}>
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
              <input type="text" placeholder="Buscar por código" className="outline-none border border-[#33333357] rounded-[3px] px-[10px] h-[35px] w-[90%]" value={filtros.codigo} onChange={(e) => set({ codigo: e.target.value })} />
              <div className="w-[35px] h-[35px] p-[10px] rounded-[3px] bg-[#606060] flex items-center justify-center cursor-pointer">
                <img src={iconLupaBranca} alt="Pesquisar" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* Oferta */}
          <div className="flex flex-row mt-[10px] w-full gap-[10px] border-t border-[#F1F1F1] pt-[13px]">
            <div className="w-5 h-5 rounded-full border border-[#33333357] cursor-pointer transition-colors duration-200 flex-shrink-0" style={{ backgroundColor: filtros.oferta ? 'var(--cor-primaria)' : 'transparent' }} onClick={() => set({ oferta: !filtros.oferta })} />
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
                <select className={inputClass} value={filtros[field] as string} onChange={(e) => set({ [field]: e.target.value })}>
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Ranges */}
          <div className="mt-5 border-t border-[#F1F1F1] text-[#606060]">
            <div className="py-[10px]">
              <p>Ano: {filtros.anoMin || ANO_MIN} - {filtros.anoMax}</p>
              <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMin || ANO_MIN} className="w-full" onChange={(e) => set({ anoMin: parseInt(e.target.value) })} />
              <input type="range" min={ANO_MIN} max={ANO_MAX} value={filtros.anoMax} className="w-full" onChange={(e) => set({ anoMax: parseInt(e.target.value) })} />
            </div>
            <div className="py-[10px] border-t border-[#F1F1F1]">
              <p>KM: {filtros.kmMin.toLocaleString()} - {filtros.kmMax.toLocaleString()}</p>
              <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMin} className="w-full" onChange={(e) => set({ kmMin: parseInt(e.target.value) })} />
              <input type="range" min={0} max={KM_MAX} step={1000} value={filtros.kmMax} className="w-full" onChange={(e) => set({ kmMax: parseInt(e.target.value) })} />
            </div>
          </div>

          {/* Cores */}
          <div className="mt-5 pt-[10px] border-t border-[#F1F1F1] text-[#606060]">
            <p className="mb-[10px]">Cor</p>
            <div className="flex flex-col gap-1">
              {cores.map((cor) => (
                <label key={cor} className="flex items-center gap-[5px] text-[#838383] cursor-pointer">
                  <input type="checkbox" checked={filtros.cores.includes(cor)} onChange={(e) => set({ cores: e.target.checked ? [...filtros.cores, cor] : filtros.cores.filter((c) => c !== cor) })} className="appearance-none w-[15px] h-[15px] border border-[#33333357] rounded-[3px] checked:bg-primaria cursor-pointer" />
                  {cor}
                </label>
              ))}
            </div>
          </div>

          {/* Portas */}
          <div className="mt-5 pt-[10px] border-t border-[#F1F1F1] text-[#606060]">
            <p className="mb-[10px]">Portas</p>
            <div className="flex flex-col gap-1">
              {portasOpts.map((p) => (
                <label key={p} className="flex items-center gap-[5px] text-[#838383] cursor-pointer">
                  <input type="checkbox" checked={filtros.portas.includes(p)} onChange={(e) => set({ portas: e.target.checked ? [...filtros.portas, p] : filtros.portas.filter((x) => x !== p) })} className="appearance-none w-[15px] h-[15px] border border-[#33333357] rounded-[3px] checked:bg-primaria cursor-pointer" />
                  {p} portas
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
