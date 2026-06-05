import { Cliente } from '../../../../types';

interface Props {
  clientes: Cliente[];
  onIrParaLista: () => void;
  onSelecionar: (c: Cliente) => void;
}

function parseValor(v: string): number {
  if (!v) return 0;
  const clean = v.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function formatBR(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function StatCard({
  label, value, sub, accent, onClick,
}: {
  label: string; value: string | number; sub?: string; accent: string; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5 flex flex-col gap-1 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-[1px] transition-all' : ''}`}
    >
      <div className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: accent }} />
      <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-extrabold text-[#1a1a1a] leading-none">{value}</p>
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

export default function DashboardConsignado({ clientes, onIrParaLista, onSelecionar }: Props) {
  const total = clientes.length;

  const comGnv    = clientes.filter((c) => c.Gnv === 'sim').length;
  const deLeilao  = clientes.filter((c) => c.Leilao === 'sim').length;
  const jaAnunciado = clientes.filter((c) => c.Anuncio === 'sim').length;

  const valores = clientes.map((c) => parseValor(c.ValorDesejado)).filter((n) => n > 0);
  const totalValor = valores.reduce((a, b) => a + b, 0);
  const mediaValor = valores.length > 0 ? totalValor / valores.length : 0;

  // Breakdowns
  const count = (field: keyof Cliente) => {
    const map: Record<string, number> = {};
    clientes.forEach((c) => { const v = String(c[field] || ''); if (v) map[v] = (map[v] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, count]) => ({ label, count }));
  };

  const porMarca      = count('Marca');
  const porCidade     = count('Cidade');
  const porCombustivel = count('Combustivel');

  const maxMarca  = porMarca[0]?.count  ?? 1;
  const maxCidade = porCidade[0]?.count ?? 1;
  const maxComb   = porCombustivel[0]?.count ?? 1;

  const recentes = [...clientes].slice(0, 6);

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-2">
        <StatCard
          label="Recebidos"
          value={total}
          sub="veículos de clientes"
          accent="#3b82f6"
          onClick={total > 0 ? onIrParaLista : undefined}
        />
        <StatCard
          label="Valor médio desejado"
          value={mediaValor > 0 ? `R$ ${formatBR(mediaValor)}` : 'Sem dados'}
          sub={totalValor > 0 ? `R$ ${formatBR(totalValor)} no total` : undefined}
          accent="#10b981"
        />
        <StatCard
          label="Com GNV"
          value={comGnv}
          sub={total > 0 ? `${Math.round((comGnv / total) * 100)}% dos recebidos` : undefined}
          accent="#f59e0b"
        />
        <StatCard
          label="De leilão"
          value={deLeilao}
          sub={jaAnunciado > 0 ? `${jaAnunciado} já anunciado${jaAnunciado > 1 ? 's' : ''}` : undefined}
          accent="#ef4444"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Marca</p>
          {porMarca.length === 0
            ? <p className="text-xs text-[#ccc] text-center py-4">Sem dados</p>
            : <div className="flex flex-col gap-3">{porMarca.map(({ label, count }) => <BarRow key={label} label={label} count={count} max={maxMarca} color="#3b82f6" />)}</div>
          }
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Cidade</p>
          {porCidade.length === 0
            ? <p className="text-xs text-[#ccc] text-center py-4">Sem dados</p>
            : <div className="flex flex-col gap-3">{porCidade.map(({ label, count }) => <BarRow key={label} label={label} count={count} max={maxCidade} color="#10b981" />)}</div>
          }
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest mb-4">Por Combustível</p>
          {porCombustivel.length === 0
            ? <p className="text-xs text-[#ccc] text-center py-4">Sem dados</p>
            : <div className="flex flex-col gap-3">{porCombustivel.map(({ label, count }) => <BarRow key={label} label={label} count={count} max={maxComb} color="#8b5cf6" />)}</div>
          }
        </div>
      </div>

      {/* Recentes */}
      {recentes.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Recebidos Recentemente</p>
            <button type="button" onClick={onIrParaLista} className="text-xs text-[#888] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer">
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-6 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2">
            {recentes.map((c) => (
              <div key={c.ID} onClick={() => onSelecionar(c)} className="cursor-pointer group">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#1a1a1a] mb-2">
                  <img
                    src={c.Imagens[0] ? `/uploads/clientes/${c.Imagens[0]}` : '/icons/veiculos/semimagem.png'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={c.Nome}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/icons/veiculos/semimagem.png'; }}
                  />
                </div>
                <p className="text-xs font-semibold text-[#1a1a1a] truncate leading-tight">{c.Marca} {c.Nome}</p>
                <p className="text-xs text-[#aaa] truncate">{c.NomeCliente}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {clientes.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e8e8e8] py-16 text-center">
          <p className="text-[#888] font-semibold text-sm mb-1">Nenhum consignado recebido</p>
          <p className="text-[#bbb] text-xs">Veículos enviados pelo formulário aparecerão aqui</p>
        </div>
      )}
    </div>
  );
}
