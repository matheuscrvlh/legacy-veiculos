import { useState } from 'react';
import { usuariosApi, Usuario } from '../../../../api/usuarios';

interface Props {
  usuarios: Usuario[];
  onRefresh: () => void;
  showMsg: (t: string) => void;
  showErro: (t: string) => void;
}

const ic = 'border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]';
const th = 'px-4 py-2 text-left text-xs font-bold text-[#535353] uppercase';
const td = 'px-4 py-3 text-sm text-[#333] border-b border-[#f0f0f0]';

export default function UsuariosTable({ usuarios, onRefresh, showMsg, showErro }: Props) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [senhaEdicao, setSenhaEdicao] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function handleAtualizarSenha(id: number) {
    if (!senhaEdicao.trim()) { showErro('Digite a nova senha.'); return; }
    try {
      await usuariosApi.atualizarSenha(id, senhaEdicao.trim());
      showMsg('Senha atualizada!');
      setEditandoId(null);
      setSenhaEdicao('');
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

  return (
    <>
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-8 max-w-[400px] w-[90%] text-center">
            <p className="font-bold text-[1.1rem] mb-4">Remover usuário?</p>
            <p className="text-sm text-[#535353] mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2 border border-[#ccc] rounded cursor-pointer bg-white text-sm">Cancelar</button>
              <button onClick={handleRemover} className="px-5 py-2 bg-red-500 text-white rounded cursor-pointer border-none text-sm">Remover</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f9f9f9]">
            <tr>
              <th className={th}>#</th>
              <th className={th}>Usuário</th>
              <th className={th}>Criado em</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className={td}>{u.id}</td>
                <td className={td + ' font-bold'}>{u.usuario}</td>
                <td className={td}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                <td className={td}>
                  {editandoId === u.id ? (
                    <div className="flex gap-2 items-center flex-wrap">
                      <input type="password" className={ic + ' w-[140px]'} placeholder="Nova senha" value={senhaEdicao} onChange={(e) => setSenhaEdicao(e.target.value)} autoFocus />
                      <button onClick={() => handleAtualizarSenha(u.id)} className="px-3 py-1 bg-green-500 text-white rounded text-xs border-none cursor-pointer">Salvar</button>
                      <button onClick={() => { setEditandoId(null); setSenhaEdicao(''); }} className="px-3 py-1 bg-gray-100 text-[#535353] rounded text-xs border-none cursor-pointer">Cancelar</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditandoId(u.id); setSenhaEdicao(''); }} className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs border-none cursor-pointer">Alterar senha</button>
                      <button onClick={() => setConfirmId(u.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs border-none cursor-pointer">Remover</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum usuário cadastrado.</p>}
      </div>
    </>
  );
}
