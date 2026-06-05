import { useState } from 'react';
import { usuariosApi } from '../../../../api/usuarios';

interface Props {
  onSuccess: () => void;
  showMsg: (t: string) => void;
  showErro: (t: string) => void;
}

export default function NovoUsuarioForm({ onSuccess, showMsg, showErro }: Props) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroUsuario, setErroUsuario] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [criando, setCriando] = useState(false);

  const inp = (hasError: boolean) =>
    `border rounded-lg px-3 py-2 text-sm outline-none transition-colors w-full ${
      hasError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-[#e0e0e0] bg-white focus:border-[#888]'
    }`;

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    let ok = true;
    if (!usuario.trim()) { setErroUsuario('Campo obrigatório'); ok = false; }
    if (!senha.trim()) { setErroSenha('Campo obrigatório'); ok = false; }
    else if (senha.length < 4) { setErroSenha('Mínimo 4 caracteres'); ok = false; }
    if (!ok) return;

    setCriando(true);
    try {
      await usuariosApi.criar(usuario.trim(), senha.trim());
      showMsg('Usuário criado com sucesso!');
      setUsuario('');
      setSenha('');
      setErroUsuario('');
      setErroSenha('');
      onSuccess();
    } catch (err: unknown) {
      const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showErro(m || 'Erro ao criar usuário.');
    } finally {
      setCriando(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#ebebeb] p-6">
      <h2 className="text-sm font-bold text-[#222] uppercase tracking-wide mb-4">Novo Usuário</h2>
      <form onSubmit={handleCriar} className="flex gap-4 flex-wrap items-end">
        <div className="flex flex-col gap-1 min-w-[180px] flex-1">
          <label className="text-[0.68rem] font-bold text-[#666] uppercase tracking-wide">
            Usuário<span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            className={inp(!!erroUsuario)}
            placeholder="Nome de usuário"
            value={usuario}
            onChange={(e) => { setUsuario(e.target.value); if (erroUsuario) setErroUsuario(''); }}
          />
          {erroUsuario && <p className="text-xs text-red-500">{erroUsuario}</p>}
        </div>

        <div className="flex flex-col gap-1 min-w-[180px] flex-1">
          <label className="text-[0.68rem] font-bold text-[#666] uppercase tracking-wide">
            Senha<span className="text-red-400 ml-0.5">*</span>
          </label>
          <input
            type="password"
            className={inp(!!erroSenha)}
            placeholder="Mínimo 4 caracteres"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); if (erroSenha) setErroSenha(''); }}
          />
          {erroSenha && <p className="text-xs text-red-500">{erroSenha}</p>}
        </div>

        <button
          type="submit"
          disabled={criando}
          className="px-5 py-2 text-white font-bold text-sm rounded-lg border-none cursor-pointer disabled:opacity-60 hover:opacity-90 transition-opacity flex-shrink-0 self-end"
          style={{ backgroundColor: 'var(--cor-botao)' }}
        >
          {criando ? 'Criando...' : '+ Criar'}
        </button>
      </form>
    </div>
  );
}
