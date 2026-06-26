import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usuariosApi, Usuario } from '../../api/usuarios';
import AdminLayout from '../../components/AdminLayout';
import AdminToast from '../../components/AdminToast';
import DashboardUsuarios from './sections/usuarios/DashboardUsuarios';
import NovoUsuarioForm from './sections/usuarios/NovoUsuarioForm';
import UsuariosTable from './sections/usuarios/UsuariosTable';

const ABAS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'gerenciar', label: 'Gerenciar' },
] as const;

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [aba, setAba] = useState<'dashboard' | 'gerenciar'>('dashboard');
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
    <AdminLayout titulo="Usuários" maxWidth="800px">
      <AdminToast msg={msg} erro={erro} />

      {/* Tabs */}
      <div className="flex gap-1 bg-[#e8e8ea] p-1 rounded-xl mb-6 overflow-x-auto max-sm:w-full">
        {ABAS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all duration-150 whitespace-nowrap flex-shrink-0 max-sm:flex-1 max-sm:text-xs max-sm:px-2 ${
              aba === a.key ? 'bg-white shadow-sm text-[#1a1a1a]' : 'bg-transparent text-[#888] hover:text-[#444]'
            }`}
          >
            {a.label}
            {a.key === 'gerenciar' && usuarios.length > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${aba === 'gerenciar' ? 'bg-[#f0f0f0] text-[#555]' : 'bg-[#ddd] text-[#777]'}`}>
                {usuarios.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {aba === 'dashboard' && (
        <DashboardUsuarios
          usuarios={usuarios}
          onIrParaGerenciar={() => setAba('gerenciar')}
        />
      )}

      {aba === 'gerenciar' && (
        <div className="flex flex-col gap-5">
          <NovoUsuarioForm onSuccess={carregar} showMsg={showMsg} showErro={showErro} />
          <UsuariosTable usuarios={usuarios} onRefresh={carregar} showMsg={showMsg} showErro={showErro} />
        </div>
      )}
    </AdminLayout>
  );
}
