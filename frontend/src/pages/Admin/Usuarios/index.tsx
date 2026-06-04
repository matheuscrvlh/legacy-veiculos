import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { usuariosApi, Usuario } from '../../../api/usuarios';

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [novoUsuario, setNovoUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [criando, setCriando] = useState(false);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [senhaEdicao, setSenhaEdicao] = useState('');

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setUsuarios(await usuariosApi.listar());
    } catch {
      setErro('Erro ao carregar usuários.');
    }
  }

  function showMsg(text: string) {
    setMsg(text);
    setErro('');
    setTimeout(() => setMsg(''), 3000);
  }

  function showErro(text: string) {
    setErro(text);
    setMsg('');
    setTimeout(() => setErro(''), 3000);
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!novoUsuario.trim() || !novaSenha.trim()) {
      showErro('Preencha usuário e senha.');
      return;
    }
    setCriando(true);
    try {
      await usuariosApi.criar(novoUsuario.trim(), novaSenha.trim());
      showMsg('Usuário criado com sucesso!');
      setNovoUsuario('');
      setNovaSenha('');
      await carregarUsuarios();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErro(msg || 'Erro ao criar usuário.');
    } finally {
      setCriando(false);
    }
  }

  async function handleAtualizarSenha(id: number) {
    if (!senhaEdicao.trim()) {
      showErro('Digite a nova senha.');
      return;
    }
    try {
      await usuariosApi.atualizarSenha(id, senhaEdicao.trim());
      showMsg('Senha atualizada!');
      setEditandoId(null);
      setSenhaEdicao('');
    } catch {
      showErro('Erro ao atualizar senha.');
    }
  }

  async function handleRemover() {
    if (confirmId === null) return;
    try {
      await usuariosApi.remover(confirmId);
      showMsg('Usuário removido.');
      await carregarUsuarios();
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErro(m || 'Erro ao remover usuário.');
    } finally {
      setConfirmId(null);
    }
  }

  const inputClass = 'border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]';
  const thClass = 'px-4 py-2 text-left text-xs font-bold text-[#535353] uppercase';
  const tdClass = 'px-4 py-3 text-sm text-[#333] border-b border-[#f0f0f0]';

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}
      {erro && <div className="fixed top-5 right-5 bg-red-500 text-white px-5 py-3 rounded-[8px] z-50">{erro}</div>}

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

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Gerenciar Usuários</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[800px] mx-auto py-8 px-5 flex flex-col gap-6">

        {/* Cadastrar novo */}
        <div className="bg-white rounded-[10px] shadow-sm p-6">
          <h2 className="text-[1.1rem] font-bold mb-4">Novo Usuário</h2>
          <form onSubmit={handleCriar} className="flex gap-3 flex-wrap items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#535353] uppercase">Usuário</label>
              <input
                className={inputClass}
                placeholder="Nome de usuário"
                value={novoUsuario}
                onChange={(e) => setNovoUsuario(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#535353] uppercase">Senha</label>
              <input
                type="password"
                className={inputClass}
                placeholder="Senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={criando}
              className="px-5 py-2 text-white font-bold text-sm rounded-[5px] border-none cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: 'var(--cor-botao)' }}
            >
              {criando ? 'Criando...' : '+ Criar'}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9f9f9]">
              <tr>
                <th className={thClass}>#</th>
                <th className={thClass}>Usuário</th>
                <th className={thClass}>Criado em</th>
                <th className={thClass}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className={tdClass}>{u.id}</td>
                  <td className={tdClass + ' font-bold'}>{u.usuario}</td>
                  <td className={tdClass}>{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className={tdClass}>
                    {editandoId === u.id ? (
                      <div className="flex gap-2 items-center flex-wrap">
                        <input
                          type="password"
                          className={inputClass + ' w-[140px]'}
                          placeholder="Nova senha"
                          value={senhaEdicao}
                          onChange={(e) => setSenhaEdicao(e.target.value)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAtualizarSenha(u.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs border-none cursor-pointer"
                        >Salvar</button>
                        <button
                          onClick={() => { setEditandoId(null); setSenhaEdicao(''); }}
                          className="px-3 py-1 bg-gray-100 text-[#535353] rounded text-xs border-none cursor-pointer"
                        >Cancelar</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditandoId(u.id); setSenhaEdicao(''); }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs border-none cursor-pointer"
                        >Alterar senha</button>
                        <button
                          onClick={() => setConfirmId(u.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs border-none cursor-pointer"
                        >Remover</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuarios.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum usuário cadastrado.</p>}
        </div>
      </div>
    </div>
  );
}
