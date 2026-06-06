import { useNavigate } from 'react-router-dom';
import { Veiculo } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';

interface Props {
  veiculos: Veiculo[];
  vendidos: Veiculo[];
  onIrParaAba: (aba: 'estoque' | 'vendidos' | 'adicionar') => void;
}

function parseValor(v: string): number {
  return parseFloat(v.replace(/\./g, '').replace(',', '.')) || 0;
}

function formatBR(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatCard({
  label, value, sub, accent, onClick,
}: {
  label: string; value: string | number; sub?: string; accent: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5 flex flex-col gap-1 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-[1px] transition-all' : ''}`}
    >
      <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: accent }} />
      <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-extrabold text-[#1a1a1a] leading-none max-sm:text-sm truncate">{value}</p>
      {sub && <p className="text-xs text-[#aaa] mt-0.5">{sub}</p>}
    </div>
  );
}

function BarRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#555] w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-[#555] w-6 text-right flex-shrink-0">{count}</span>
    </div>
  );
}

export default function DashboardTab({ veiculos, vendidos, onIrParaAba }: Props) {
  const navigate = useNavigate();

  const emOferta = veiculos.filter((v) => v.Oferta).length;
  const total = veiculos.length + vendidos.length;

  const valores = veiculos.map((v) => parseValor(v.Valor)).filter((n) => n > 0);
  const mediaValor = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
  const mediaKm = veiculos.length > 0 ? veiculos.reduce((a, v) => a + v.Km, 0) / veiculos.length : 0;

  // Breakdown por tipo
  const TIPOS = ['Usado', 'Semi-Novo', 'Zero Km'] as const;
  const porTipo = TIPOS.map((t) => ({ label: t, count: veiculos.filter((v) => v.TipoVeiculo === t).length }));

  // Breakdown por marca (top 6)
  const marcaMap: Record<string, number> = {};
  veiculos.forEach((v) => { marcaMap[v.Marca] = (marcaMap[v.Marca] || 0) + 1; });
  const porMarca = Object.entries(marcaMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([label, count]) => ({ label, count }));

  // Breakdown por combustível
  const combMap: Record<string, number> = {};
  veiculos.forEach((v) => { if (v.Combustivel) combMap[v.Combustivel] = (combMap[v.Combustivel] || 0) + 1; });
  const porCombustivel = Object.entries(combMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, count]) => ({ label, count }));

  // Recentes (últimos 6)
  const recentes = [...veiculos].slice(0, 6);

  const maxMarca = porMarca[0]?.count ?? 1;
  const maxTipo = Math.max(...porTipo.map((t) => t.count), 1);
  const maxComb = porCombustivel[0]?.count ?? 1;

  return (
    <div className="flex flex-col gap-6">

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-2">
        <StatCard
          label="Em estoque"
          value={veiculos.length}
          sub={`${emOferta} em oferta`}
          accent="#3b82f6"
          onClick={() => onIrParaAba('estoque')}
        />
        <StatCard
          label="Vendidos"
          value={vendidos.length}
          sub={total > 0 ? `${Math.round((vendidos.length / total) * 100)}% do total` : undefined}
          accent="#10b981"
          onClick={() => onIrParaAba('vendidos')}
        />
        <StatCard
          label="Ticket médio"
          value={mediaValor > 0 ? `R$ ${formatBR(mediaValor)}` : 'Sem dados'}
          sub={mediaValor > 0 ? 'valor médio do estoque' : undefined}
          accent="#8b5cf6"
        />
        <StatCard
          label="KM médio"
          value={mediaKm > 0 ? `${formatarKm(Math.round(mediaKm))} km` : 'Sem dados'}
          sub={mediaKm > 0 ? 'quilometragem média' : undefined}
          accent="#f59e0b"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">

        {/* Por tipo */}
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Tipo</p>
          <div className="flex flex-col gap-3">
            {porTipo.map(({ label, count }, i) => (
              <BarRow
                key={label}
                label={label}
                count={count}
                max={maxTipo}
                color={['#3b82f6', '#8b5cf6', '#10b981'][i]}
              />
            ))}
          </div>
        </div>

        {/* Por marca */}
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Marca</p>
          {porMarca.length === 0 ? (
            <p className="text-xs text-[#ccc] text-center py-4">Sem dados</p>
          ) : (
            <div className="flex flex-col gap-3">
              {porMarca.map(({ label, count }) => (
                <BarRow key={label} label={label} count={count} max={maxMarca} color="#3b82f6" />
              ))}
            </div>
          )}
        </div>

        {/* Por combustível */}
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Combustível</p>
          {porCombustivel.length === 0 ? (
            <p className="text-xs text-[#ccc] text-center py-4">Sem dados</p>
          ) : (
            <div className="flex flex-col gap-3">
              {porCombustivel.map(({ label, count }) => (
                <BarRow key={label} label={label} count={count} max={maxComb} color="#f59e0b" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recentes */}
      {recentes.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Adicionados Recentemente</p>
            <button
              type="button"
              onClick={() => onIrParaAba('estoque')}
              className="text-xs text-[#888] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer"
            >
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-6 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
            {recentes.map((v) => (
              <div
                key={v.ID}
                onClick={() => navigate(`/veiculo/${v.ID}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a] mb-2">
                  <img
                    src={v.Imagens[0] ? `/uploads/vehicles/${v.Imagens[0]}` : '/icons/veiculos/semimagem.png'}
                    className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-300"
                    alt={v.Nome}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
                  />
                </div>
                <p className="text-xs font-semibold text-[#1a1a1a] truncate leading-tight">{v.Marca} {v.Nome}</p>
                <p className="text-xs text-[#aaa]">{v.Ano} · R$ {v.Valor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {veiculos.length === 0 && vendidos.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] py-16 text-center">
          <p className="text-[#888] font-semibold text-sm mb-1">Nenhum dado disponível</p>
          <p className="text-[#bbb] text-xs mb-4">Adicione veículos para visualizar o dashboard</p>
          <button
            type="button"
            onClick={() => onIrParaAba('adicionar')}
            className="text-sm font-bold text-white px-5 py-2 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            + Adicionar veículo
          </button>
        </div>
      )}
    </div>
  );
}
