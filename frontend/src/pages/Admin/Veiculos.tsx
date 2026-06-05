import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { veiculosApi } from '../../api/veiculos';
import { vendidosApi } from '../../api/vendidos';
import { Veiculo } from '../../types';
import EstoqueTable from './sections/veiculos/EstoqueTable';
import VendidosTable from './sections/veiculos/VendidosTable';
import AdicionarForm from './sections/veiculos/AdicionarForm';

export default function AdminVeiculos() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [vendidos, setVendidos] = useState<Veiculo[]>([]);
  const [aba, setAba] = useState<'estoque' | 'vendidos' | 'adicionar'>('estoque');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAcao, setConfirmAcao] = useState('');
  const [msg, setMsg] = useState('');

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

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-8 max-w-[400px] w-[90%] text-center">
            <p className="font-bold text-[1.1rem] mb-4">Tem certeza?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmId(null)} className="px-5 py-2 border border-[#ccc] rounded cursor-pointer bg-white">Cancelar</button>
              <button onClick={confirmarAcao} className="px-5 py-2 bg-red-500 text-white rounded cursor-pointer border-none">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Gerenciar Veículos</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[1200px] mx-auto py-8 px-5">
        <div className="flex gap-2 mb-6">
          {(['estoque', 'vendidos', 'adicionar'] as const).map((t) => (
            <button key={t} onClick={() => setAba(t)} className={`px-5 py-2 rounded-[5px] font-bold text-sm border-none cursor-pointer capitalize ${aba === t ? 'text-white' : 'bg-white text-[#535353]'}`} style={aba === t ? { backgroundColor: 'var(--cor-botao)' } : {}}>
              {t === 'adicionar' ? '+ Adicionar' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {aba === 'estoque' && (
          <EstoqueTable
            veiculos={veiculos}
            onToggleOferta={async (id) => { await veiculosApi.toggleOferta(id); await carregarDados(); }}
            onVender={(id) => { setConfirmId(id); setConfirmAcao('vender'); }}
            onRemover={(id) => { setConfirmId(id); setConfirmAcao('remover'); }}
          />
        )}
        {aba === 'vendidos' && (
          <VendidosTable
            vendidos={vendidos}
            onReativar={(id) => { setConfirmId(id); setConfirmAcao('reativar'); }}
            onRemover={(id) => { setConfirmId(id); setConfirmAcao('remover-vendido'); }}
          />
        )}
        {aba === 'adicionar' && <AdicionarForm onSuccess={() => { carregarDados(); setAba('estoque'); }} />}
      </div>
    </div>
  );
}
