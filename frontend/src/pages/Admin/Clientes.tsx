import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { clientesApi } from '../../api/clientes';
import { Cliente } from '../../types';
import ClientesTable from './sections/clientes/ClientesTable';
import ClienteDetalhe from './sections/clientes/ClienteDetalhe';

export default function AdminClientes() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (!loading && !isLoggedIn) navigate('/login'); }, [isLoggedIn, loading]);
  useEffect(() => { carregar(); }, []);

  async function carregar() { clientesApi.listar().then(setClientes); }
  function showMsg(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function remover() {
    if (!confirmId) return;
    try { await clientesApi.remover(confirmId); showMsg('Removido!'); await carregar(); setSelecionado(null); }
    catch { showMsg('Erro ao remover.'); }
    setConfirmId(null);
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-8 max-w-[400px] w-[90%] text-center">
            <p className="font-bold text-[1.1rem] mb-4">Remover este veículo de cliente?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2 border border-[#ccc] rounded cursor-pointer bg-white">Cancelar</button>
              <button onClick={remover} className="px-5 py-2 bg-red-500 text-white rounded cursor-pointer border-none">Remover</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Veículos de Clientes (Consignado)</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[1200px] mx-auto py-8 px-5 flex gap-6 max-lg:flex-col">
        <ClientesTable clientes={clientes} selecionado={selecionado} onSelecionar={setSelecionado} onRemover={(id) => setConfirmId(id)} />
        {selecionado && <ClienteDetalhe cliente={selecionado} onFechar={() => setSelecionado(null)} />}
      </div>
    </div>
  );
}
