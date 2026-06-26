import { Usuario } from '../../../../api/usuarios';

interface Props {
  usuarios: Usuario[];
  onIrParaGerenciar: () => void;
}

const CORES_AVATAR = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

function corAvatar(nome: string): string {
  return CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length];
}

function diasDesde(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (dias === 0) return 'hoje';
  if (dias < 30) return `há ${dias} dia${dias !== 1 ? 's' : ''}`;
  const meses = Math.floor(dias / 30);
  if (meses < 12) return `há ${meses} mês${meses !== 1 ? 'es' : ''}`;
  const anos = Math.floor(dias / 365);
  return `há ${anos} ano${anos !== 1 ? 's' : ''}`;
}

function formatData(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DashboardUsuarios({ usuarios, onIrParaGerenciar }: Props) {
  const total = usuarios.length;
  const ordenados = [...usuarios].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const maisAntigo = ordenados[0];
  const maisRecente = ordenados[ordenados.length - 1];

  return (
    <div className="flex flex-col gap-6">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="w-2 h-2 rounded-full bg-[#3b82f6] mb-2" />
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Total de Usuários</p>
          <p className="text-3xl font-extrabold text-[#1a1a1a] leading-none mt-1">{total}</p>
          <button
            type="button"
            onClick={onIrParaGerenciar}
            className="text-xs text-[#888] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer mt-2 p-0"
          >
            Gerenciar →
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="w-2 h-2 rounded-full bg-[#10b981] mb-2" />
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Administrador Inicial</p>
          {maisAntigo ? (
            <>
              <p className="text-lg font-extrabold text-[#1a1a1a] leading-tight mt-1 truncate">{maisAntigo.usuario}</p>
              <p className="text-xs text-[#aaa] mt-0.5">desde {formatData(maisAntigo.created_at)}</p>
            </>
          ) : <p className="text-sm text-[#ccc] mt-2">Sem registros</p>}
        </div>

        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6] mb-2" />
          <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Adicionado Recentemente</p>
          {maisRecente && maisRecente.id !== maisAntigo?.id ? (
            <>
              <p className="text-lg font-extrabold text-[#1a1a1a] leading-tight mt-1 truncate">{maisRecente.usuario}</p>
              <p className="text-xs text-[#aaa] mt-0.5">criado {diasDesde(maisRecente.created_at)}</p>
            </>
          ) : (
            <p className="text-sm text-[#ccc] mt-2">Apenas um usuário</p>
          )}
        </div>
      </div>

      {/* Cards de usuários */}
      {total > 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest">Todos os Usuários</p>
            <button
              type="button"
              onClick={onIrParaGerenciar}
              className="text-xs text-[#888] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer"
            >
              Gerenciar →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            {ordenados.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#f0f0f0] hover:border-[#e0e0e0] hover:bg-[#fafafa] transition-colors">
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                  style={{ backgroundColor: corAvatar(u.usuario) }}
                >
                  {u.usuario.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#1a1a1a] truncate">{u.usuario}</p>
                    {i === 0 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#888] flex-shrink-0">ADMIN</span>
                    )}
                  </div>
                  <p className="text-xs text-[#aaa]">
                    {formatData(u.created_at)} · {diasDesde(u.created_at)}
                  </p>
                </div>

                {/* ID */}
                <span className="text-[10px] font-mono text-[#ccc] flex-shrink-0">#{u.id}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8e8e8] py-16 text-center">
          <p className="text-[#888] font-semibold text-sm mb-1">Nenhum usuário cadastrado</p>
          <p className="text-[#bbb] text-xs mb-4">Crie usuários para acessar o painel admin</p>
          <button
            type="button"
            onClick={onIrParaGerenciar}
            className="text-sm font-bold text-white px-5 py-2 rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            + Novo usuário
          </button>
        </div>
      )}
    </div>
  );
}
