import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { clientesApi } from '../../api/clientes';
import { Cliente } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import AdminToast from '../../components/AdminToast';
import DashboardConsignado from './sections/clientes/DashboardConsignado';
import ClientesTable from './sections/clientes/ClientesTable';
import ClienteDetalhe from './sections/clientes/ClienteDetalhe';

const ABAS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'lista',     label: 'Consignados' },
] as const;

export default function AdminClientes() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [aba, setAba] = useState<'dashboard' | 'lista'>('dashboard');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!loading && !isLoggedIn) navigate('/login'); }, [isLoggedIn, loading]);
  useEffect(() => { carregar(); }, []);

  async function carregar() { clientesApi.listar().then(setClientes); }
  function showMsg(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function remover() {
    if (!confirmId) return;
    try {
      await clientesApi.remover(confirmId);
      showMsg('Removido!');
      await carregar();
      setSelecionado(null);
    } catch { showMsg('Erro ao remover.'); }
    setConfirmId(null);
  }

  return (
    <AdminLayout titulo="Consignados" maxWidth="1200px">
      <AdminToast msg={msg} />

      {/* Modal de confirmação */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <p className="font-bold text-[#1a1a1a] mb-1">Tem certeza?</p>
            <p className="text-sm text-[#888] mb-5">Remover este registro de consignado?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmId(null)} className="flex-1 py-2 border border-[#e0e0e0] rounded-lg text-sm font-semibold text-[#555] hover:bg-[#f5f5f5] transition-colors cursor-pointer bg-white">Cancelar</button>
              <button onClick={remover} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors">Remover</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#e8e8ea] p-1 rounded-xl w-fit mb-6">
        {ABAS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all duration-150 ${
              aba === a.key ? 'bg-white shadow-sm text-[#1a1a1a]' : 'bg-transparent text-[#888] hover:text-[#444]'
            }`}
          >
            {a.label}
            {a.key === 'lista' && clientes.length > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${aba === 'lista' ? 'bg-[#f0f0f0] text-[#555]' : 'bg-[#ddd] text-[#777]'}`}>
                {clientes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {aba === 'dashboard' && (
        <DashboardConsignado
          clientes={clientes}
          onIrParaLista={() => setAba('lista')}
          onSelecionar={(c) => { setSelecionado(c); setAba('lista'); }}
        />
      )}

      {/* Lista + detalhe */}
      {aba === 'lista' && (
        <div className="flex gap-5 max-lg:flex-col items-start">
          <ClientesTable
            clientes={clientes}
            selecionado={selecionado}
            onSelecionar={setSelecionado}
            onRemover={(id) => setConfirmId(id)}
          />
          {selecionado && (
            <ClienteDetalhe
              cliente={selecionado}
              onFechar={() => setSelecionado(null)}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
}
