import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { veiculosApi } from '../../api/veiculos';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import AdminLayout from '../../components/AdminLayout';
import AdminToast from '../../components/AdminToast';
import EstoqueTable from './sections/veiculos/EstoqueTable';
import VendidosTable from './sections/veiculos/VendidosTable';
import AdicionarForm from './sections/veiculos/AdicionarForm';
import EditarForm from './sections/veiculos/EditarForm';
import DashboardTab from './sections/veiculos/DashboardTab';

const ABAS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'estoque',   label: 'Estoque'   },
  { key: 'vendidos',  label: 'Vendidos'  },
  { key: 'adicionar', label: '+ Adicionar' },
] as const;

export default function AdminVeiculos() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [vendidos, setVendidos] = useState<Veiculo[]>([]);
  const [aba, setAba] = useState<'dashboard' | 'estoque' | 'vendidos' | 'adicionar'>('dashboard');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAcao, setConfirmAcao] = useState('');
  const [msg, setMsg] = useState('');
  const [veiculoEditando, setVeiculoEditando] = useState<Veiculo | null>(null);

  useEffect(() => { if (!loading && !isLoggedIn) navigate('/login'); }, [isLoggedIn, loading]);
  useEffect(() => { carregarDados(); }, []);

  async function carregarDados() {
    const [v, vd] = await Promise.all([veiculosApi.listar(), vendidosApi.listar()]);
    setVeiculos(v);
    setVendidos(vd);
  }

  function showMsg(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function confirmarAcao() {
    if (!confirmId) return;
    try {
      if (confirmAcao === 'remover') { await veiculosApi.remover(confirmId); showMsg('Veículo removido!'); }
      else if (confirmAcao === 'vender') { await veiculosApi.marcarVendido(confirmId); showMsg('Marcado como vendido!'); }
      else if (confirmAcao === 'reativar') { await vendidosApi.reativar(confirmId); showMsg('Veículo reativado!'); }
      else if (confirmAcao === 'remover-vendido') { await vendidosApi.remover(confirmId); showMsg('Veículo removido!'); }
      await carregarDados();
    } catch { showMsg('Erro ao executar ação.'); }
    setConfirmId(null);
  }

  const labels: Record<string, string> = {
    remover: 'Remover este veículo permanentemente?',
    vender: 'Marcar este veículo como vendido?',
    reativar: 'Reativar este veículo para o estoque?',
    'remover-vendido': 'Remover este veículo da lista de vendidos?',
  };

  return (
    <AdminLayout titulo="Gerenciar Veículos">
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
            <p className="text-sm text-[#888] mb-5">{labels[confirmAcao] ?? 'Esta ação não pode ser desfeita.'}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2 border border-[#e0e0e0] rounded-lg text-sm font-semibold text-[#555] hover:bg-[#f5f5f5] transition-colors cursor-pointer bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAcao}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold border-none cursor-pointer transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs estilo segmented control */}
      <div className="flex gap-1 bg-[#e8e8ea] p-1 rounded-xl mb-6 overflow-x-auto max-sm:w-full">
        {ABAS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all duration-150 whitespace-nowrap flex-shrink-0 max-sm:flex-1 max-sm:text-xs max-sm:px-2 ${
              aba === a.key
                ? 'bg-white shadow-sm text-[#1a1a1a]'
                : 'bg-transparent text-[#888] hover:text-[#444]'
            }`}
          >
            {a.label}
            {a.key === 'estoque' && veiculos.length > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${aba === 'estoque' ? 'bg-[#f0f0f0] text-[#555]' : 'bg-[#ddd] text-[#777]'}`}>{veiculos.length}</span>
            )}
            {a.key === 'vendidos' && vendidos.length > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${aba === 'vendidos' ? 'bg-[#f0f0f0] text-[#555]' : 'bg-[#ddd] text-[#777]'}`}>{vendidos.length}</span>
            )}
          </button>
        ))}
      </div>

      {aba === 'dashboard' && (
        <DashboardTab veiculos={veiculos} vendidos={vendidos} onIrParaAba={setAba} />
      )}
      {aba === 'estoque' && !veiculoEditando && (
        <EstoqueTable
          veiculos={veiculos}
          onToggleOferta={async (id) => { await veiculosApi.toggleOferta(id); await carregarDados(); }}
          onVender={(id) => { setConfirmId(id); setConfirmAcao('vender'); }}
          onRemover={(id) => { setConfirmId(id); setConfirmAcao('remover'); }}
          onEditar={(v) => setVeiculoEditando(v)}
        />
      )}
      {aba === 'estoque' && veiculoEditando && (
        <EditarForm
          veiculo={veiculoEditando}
          onCancelar={() => setVeiculoEditando(null)}
          onSuccess={() => { carregarDados(); setVeiculoEditando(null); showMsg('Veículo atualizado!'); }}
        />
      )}
      {aba === 'vendidos' && (
        <VendidosTable
          vendidos={vendidos}
          onReativar={(id) => { setConfirmId(id); setConfirmAcao('reativar'); }}
          onRemover={(id) => { setConfirmId(id); setConfirmAcao('remover-vendido'); }}
        />
      )}
      {aba === 'adicionar' && (
        <AdicionarForm onSuccess={() => { carregarDados(); setAba('dashboard'); }} />
      )}
    </AdminLayout>
  );
}
