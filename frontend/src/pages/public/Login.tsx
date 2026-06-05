import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSobre } from '../../hooks/useSobre';

export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, loading, login } = useAuth();
  const { dados } = useSobre();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) navigate('/admin');
  }, [isLoggedIn, loading]);

  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(usuario, senha);
      navigate('/admin');
    } catch {
      setErro('Usuário ou Senha inválidos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      <div className="bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-10 w-full max-w-[400px]">
        {logoSrc && (
          <div className="flex justify-center mb-6">
            <img src={logoSrc} alt="Logo" className="max-h-[80px] max-w-[200px]" />
          </div>
        )}
        <h1 className="text-center text-[1.5rem] font-bold text-[#333] mb-6">Área Administrativa</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuário"
            className="w-full px-4 py-3 border border-[#ccc] rounded-[5px] text-base outline-none focus:border-[#535353]"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 border border-[#ccc] rounded-[5px] text-base outline-none focus:border-[#535353]"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />

          {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 text-white font-bold uppercase text-base border-none cursor-pointer rounded-[5px] transition-all duration-300 hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            {enviando ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
