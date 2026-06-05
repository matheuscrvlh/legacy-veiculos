import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usuariosApi, Usuario } from '../../api/usuarios';
import NovoUsuarioForm from './sections/usuarios/NovoUsuarioForm';
import UsuariosTable from './sections/usuarios/UsuariosTable';

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [msg, setMsg] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => { if (!loading && !isLoggedIn) navigate('/login'); }, [isLoggedIn, loading]);
  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try { setUsuarios(await usuariosApi.listar()); }
    catch { showErro('Erro ao carregar usuários.'); }
  }

  function showMsg(t: string) { setMsg(t); setErro(''); setTimeout(() => setMsg(''), 3000); }
  function showErro(t: string) { setErro(t); setMsg(''); setTimeout(() => setErro(''), 3000); }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}
      {erro && <div className="fixed top-5 right-5 bg-red-500 text-white px-5 py-3 rounded-[8px] z-50">{erro}</div>}

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Gerenciar Usuários</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[800px] mx-auto py-8 px-5 flex flex-col gap-6">
        <NovoUsuarioForm onSuccess={carregar} showMsg={showMsg} showErro={showErro} />
        <UsuariosTable usuarios={usuarios} onRefresh={carregar} showMsg={showMsg} showErro={showErro} />
      </div>
    </div>
  );
}
