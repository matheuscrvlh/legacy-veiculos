import { useState } from 'react';
import { usuariosApi } from '../../../../api/usuarios';

interface Props {
  onSuccess: () => void;
  showMsg: (t: string) => void;
  showErro: (t: string) => void;
}

const ic = 'border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]';

export default function NovoUsuarioForm({ onSuccess, showMsg, showErro }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [criando, setCriando] = useState(false);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario.trim() || !senha.trim()) { showErro('Preencha usuário e senha.'); return; }
    setCriando(true);
    try {
      await usuariosApi.criar(usuario.trim(), senha.trim());
      showMsg('Usuário criado com sucesso!');
      setUsuario('');
      setSenha('');
      onSuccess();
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErro(m || 'Erro ao criar usuário.');
    } finally { setCriando(false); }
  }

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-6">
      <h2 className="text-[1.1rem] font-bold mb-4">Novo Usuário</h2>
      <form onSubmit={handleCriar} className="flex gap-3 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#535353] uppercase">Usuário</label>
          <input className={ic} placeholder="Nome de usuário" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-[#535353] uppercase">Senha</label>
          <input type="password" className={ic} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <button type="submit" disabled={criando} className="px-5 py-2 text-white font-bold text-sm rounded-[5px] border-none cursor-pointer disabled:opacity-60" style={{ backgroundColor: 'var(--cor-botao)' }}>
          {criando ? 'Criando...' : '+ Criar'}
        </button>
      </form>
    </div>
  );
}
