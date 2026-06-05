import { useState } from 'react';
import { usuariosApi, Usuario } from '../../../../api/usuarios';

interface Props {
  usuarios: Usuario[];
  onRefresh: () => void;
  showMsg: (t: string) => void;
  showErro: (t: string) => void;
}

const CORES_AVATAR = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
function corAvatar(nome: string): string {
  return CORES_AVATAR[nome.charCodeAt(0) % CORES_AVATAR.length];
}

export default function UsuariosTable({ usuarios, onRefresh, showMsg, showErro }: Props) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [senhaEdicao, setSenhaEdicao] = useState('');
  const [senhaErro, setSenhaErro] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function handleAtualizarSenha(id: number) {
    if (!senhaEdicao.trim()) { setSenhaErro('Campo obrigatório'); return; }
    if (senhaEdicao.length < 4) { setSenhaErro('Mínimo 4 caracteres'); return; }
    try {
      await usuariosApi.atualizarSenha(id, senhaEdicao.trim());
      showMsg('Senha atualizada!');
      setEditandoId(null);
      setSenhaEdicao('');
      setSenhaErro('');
    } catch { showErro('Erro ao atualizar senha.'); }
  }

  async function handleRemover() {
    if (confirmId === null) return;
    try {
      await usuariosApi.remover(confirmId);
      showMsg('Usuário removido.');
      onRefresh();
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErro(m || 'Erro ao remover usuário.');
    } finally { setConfirmId(null); }
  }

  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm flex items-center justify-center py-12 text-center">
        <p className="text-[#888] text-sm">Nenhum usuário cadastrado.</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal de confirmação */}
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="font-bold text-[#1a1a1a] mb-1">Remover usuário?</p>
            <p className="text-sm text-[#888] mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2 border border-[#e0e0e0] rounded-lg text-sm font-semibold text-[#555] hover:bg-[#f5f5f5] transition-colors cursor-pointer bg-white">Cancelar</button>
              <button onClick={handleRemover} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors">Remover</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-5 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
          <p className="text-sm font-bold text-[#222]">Usuários cadastrados</p>
        </div>

        <div className="divide-y divide-[#f5f5f5]">
          {usuarios.map((u, i) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#fafafa] transition-colors">

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
                style={{ backgroundColor: corAvatar(u.usuario) }}
              >
                {u.usuario.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-[#1a1a1a]">{u.usuario}</p>
                  {i === 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-[#888]">ADMIN</span>
                  )}
                </div>
                <p className="text-xs text-[#aaa]">
                  #{u.id} · {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>

              {/* Ações / edição inline */}
              {editandoId === u.id ? (
                <div className="flex items-start gap-2 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <input
                      type="password"
                      placeholder="Nova senha"
                      autoFocus
                      value={senhaEdicao}
                      onChange={(e) => { setSenhaEdicao(e.target.value); setSenhaErro(''); }}
                      className={`border rounded-lg px-3 py-1.5 text-sm outline-none w-[160px] transition-colors ${
                        senhaErro ? 'border-red-400 bg-red-50' : 'border-[#e0e0e0] focus:border-[#888]'
                      }`}
                    />
                    {senhaErro && <p className="text-[10px] text-red-500">{senhaErro}</p>}
                  </div>
                  <button
                    onClick={() => handleAtualizarSenha(u.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold border-none cursor-pointer transition-colors self-start"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setEditandoId(null); setSenhaEdicao(''); setSenhaErro(''); }}
                    className="px-3 py-1.5 bg-[#f0f0f0] hover:bg-[#e8e8e8] text-[#555] rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors self-start"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditandoId(u.id); setSenhaEdicao(''); }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors"
                  >
                    Alterar senha
                  </button>
                  <button
                    onClick={() => setConfirmId(u.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
