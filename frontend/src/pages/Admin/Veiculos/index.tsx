import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { veiculosApi } from '../../../api/veiculos';
import { vendidosApi } from '../../../api/vendidos';
import iconLupa from '../../../assets/icons/admin/veiculo/lupa.png';
import iconCarrinho from '../../../assets/icons/admin/veiculo/carrinho-compras.png';
import iconLixeira from '../../../assets/icons/admin/veiculo/lixeira.png';
import iconLoja from '../../../assets/icons/admin/veiculo/loja.png';
import iconEstrelaPreenchida from '../../../assets/icons/admin/veiculo/estrela-preenchida.png';
import iconEstrelaVazia from '../../../assets/icons/admin/veiculo/estrela-vazia.png';
import { Veiculo } from '../../../types';
import { formatarKm } from '../../../lib/utils';

export default function AdminVeiculos() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [vendidos, setVendidos] = useState<Veiculo[]>([]);
  const [aba, setAba] = useState<'estoque' | 'vendidos' | 'adicionar'>('estoque');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmAcao, setConfirmAcao] = useState<string>('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const [v, vd] = await Promise.all([veiculosApi.listar(), vendidosApi.listar()]);
    setVeiculos(v);
    setVendidos(vd);
  }

  function showMsg(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  }

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

  async function toggleOferta(id: string) {
    await veiculosApi.toggleOferta(id);
    await carregarDados();
  }

  const thClass = "px-3 py-2 text-left text-xs font-bold text-[#535353] uppercase";
  const tdClass = "px-3 py-3 text-sm text-[#333] border-b border-[#f0f0f0]";

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
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['estoque', 'vendidos', 'adicionar'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setAba(t)}
              className={`px-5 py-2 rounded-[5px] font-bold text-sm border-none cursor-pointer capitalize ${aba === t ? 'text-white' : 'bg-white text-[#535353]'}`}
              style={aba === t ? { backgroundColor: 'var(--cor-botao)' } : {}}
            >
              {t === 'adicionar' ? '+ Adicionar' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Estoque */}
        {aba === 'estoque' && (
          <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9f9f9]">
                <tr>
                  <th className={thClass}>Imagem</th>
                  <th className={thClass}>Código</th>
                  <th className={thClass}>Veículo</th>
                  <th className={thClass}>KM</th>
                  <th className={thClass}>Valor</th>
                  <th className={thClass}>Oferta</th>
                  <th className={thClass}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v.ID}>
                    <td className={tdClass}>
                      <img src={v.Imagens[0] ? `/uploads/vehicles/${v.Imagens[0]}` : ''} className="w-[80px] h-[55px] object-cover rounded-[5px]" alt="" />
                    </td>
                    <td className={tdClass}>{v.CodigoSequencial}</td>
                    <td className={tdClass}><p className="font-bold">{v.Marca} {v.Nome}</p><p className="text-[#888] text-xs">{v.Modelo} • {v.Ano}</p></td>
                    <td className={tdClass}>{formatarKm(v.Km)} km</td>
                    <td className={tdClass} style={{ color: 'var(--cor-primaria)' }}>R$ {v.Valor}</td>
                    <td className={tdClass}>
                      <button
                        onClick={() => toggleOferta(v.ID)}
                        title={v.Oferta ? 'Remover oferta' : 'Marcar como oferta'}
                        className={`p-1 rounded border-none cursor-pointer ${v.Oferta ? 'bg-yellow-100' : 'bg-gray-100'}`}
                      >
                        <img src={v.Oferta ? iconEstrelaPreenchida : iconEstrelaVazia} className="w-5 h-5" alt={v.Oferta ? 'Oferta' : 'Sem oferta'} />
                      </button>
                    </td>
                    <td className={tdClass}>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => navigate(`/veiculo/${v.ID}`)} title="Ver detalhes" className="p-1 bg-blue-50 rounded border-none cursor-pointer"><img src={iconLupa} className="w-5 h-5" alt="Ver" /></button>
                        <button onClick={() => { setConfirmId(v.ID); setConfirmAcao('vender'); }} title="Marcar como vendido" className="p-1 bg-green-50 rounded border-none cursor-pointer"><img src={iconCarrinho} className="w-5 h-5" alt="Vendido" /></button>
                        <button onClick={() => { setConfirmId(v.ID); setConfirmAcao('remover'); }} title="Remover veículo" className="p-1 bg-red-50 rounded border-none cursor-pointer"><img src={iconLixeira} className="w-5 h-5" alt="Remover" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {veiculos.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo no estoque.</p>}
          </div>
        )}

        {/* Vendidos */}
        {aba === 'vendidos' && (
          <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9f9f9]">
                <tr>
                  <th className={thClass}>Imagem</th>
                  <th className={thClass}>Código</th>
                  <th className={thClass}>Veículo</th>
                  <th className={thClass}>Valor</th>
                  <th className={thClass}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {vendidos.map((v) => (
                  <tr key={v.ID}>
                    <td className={tdClass}>
                      <img src={v.Imagens[0] ? `/uploads/vehiclesSold/${v.Imagens[0]}` : ''} className="w-[80px] h-[55px] object-cover rounded-[5px] opacity-70" alt="" />
                    </td>
                    <td className={tdClass}>{v.CodigoSequencial}</td>
                    <td className={tdClass}><p className="font-bold">{v.Marca} {v.Nome}</p><p className="text-[#888] text-xs">{v.Modelo} • {v.Ano}</p></td>
                    <td className={tdClass}>R$ {v.Valor}</td>
                    <td className={tdClass}>
                      <div className="flex gap-2">
                        <button onClick={() => { setConfirmId(v.ID); setConfirmAcao('reativar'); }} title="Reativar para estoque" className="p-1 bg-green-50 rounded border-none cursor-pointer"><img src={iconLoja} className="w-5 h-5" alt="Reativar" /></button>
                        <button onClick={() => { setConfirmId(v.ID); setConfirmAcao('remover-vendido'); }} title="Remover definitivamente" className="p-1 bg-red-50 rounded border-none cursor-pointer"><img src={iconLixeira} className="w-5 h-5" alt="Remover" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vendidos.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo vendido.</p>}
          </div>
        )}

        {/* Adicionar */}
        {aba === 'adicionar' && <AdicionarVeiculo onSuccess={() => { carregarDados(); setAba('estoque'); }} />}
      </div>
    </div>
  );
}

function AdicionarVeiculo({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    nome: '', modelo: '', marca: '', categoria: '', combustivel: '', cambio: '',
    cor: '', portas: '', km: '', sobre: '', opcionais: '', ano: '', valor: '', tipoVeiculo: 'Usado',
  });
  const [imagens, setImagens] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.marca || imagens.length === 0) {
      setErro('Nome, marca e ao menos uma imagem são obrigatórios.');
      return;
    }
    setEnviando(true);
    setErro('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      imagens.forEach((img) => fd.append('imagens', img));
      await veiculosApi.adicionar(fd);
      onSuccess();
    } catch { setErro('Erro ao adicionar veículo.'); }
    finally { setEnviando(false); }
  }

  const inputClass = "w-full border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]";

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-6 max-w-[700px]">
      <h2 className="text-[1.3rem] font-bold mb-5">Adicionar Veículo</h2>
      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
      <form onSubmit={handleEnviar} className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {[
          { field: 'nome', placeholder: 'Nome *' },
          { field: 'modelo', placeholder: 'Modelo' },
          { field: 'marca', placeholder: 'Marca *' },
          { field: 'categoria', placeholder: 'Categoria' },
          { field: 'combustivel', placeholder: 'Combustível' },
          { field: 'cambio', placeholder: 'Câmbio' },
          { field: 'cor', placeholder: 'Cor' },
          { field: 'portas', placeholder: 'Portas' },
          { field: 'km', placeholder: 'KM' },
          { field: 'ano', placeholder: 'Ano' },
          { field: 'valor', placeholder: 'Valor' },
        ].map(({ field, placeholder }) => (
          <input key={field} type="text" placeholder={placeholder} className={inputClass}
            value={form[field as keyof typeof form]}
            onChange={(e) => set(field, e.target.value)} />
        ))}
        <select className={inputClass} value={form.tipoVeiculo} onChange={(e) => set('tipoVeiculo', e.target.value)}>
          <option value="Usado">Usado</option>
          <option value="Semi-Novo">Semi-Novo</option>
          <option value="Zero Km">Zero Km</option>
        </select>
        <div className="col-span-2 max-lg:col-span-1">
          <textarea placeholder="Sobre o veículo" className={`${inputClass} h-[80px] resize-none`} value={form.sobre} onChange={(e) => set('sobre', e.target.value)} />
        </div>
        <div className="col-span-2 max-lg:col-span-1">
          <textarea placeholder="Opcionais" className={`${inputClass} h-[60px] resize-none`} value={form.opcionais} onChange={(e) => set('opcionais', e.target.value)} />
        </div>
        <div className="col-span-2 max-lg:col-span-1">
          <label className="text-sm font-bold block mb-1">Imagens *</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImagens(Array.from(e.target.files ?? []))} />
        </div>
        <div className="col-span-2 max-lg:col-span-1">
          <button type="submit" disabled={enviando} className="w-full py-3 text-white font-bold uppercase border-none cursor-pointer rounded-[5px] disabled:opacity-60" style={{ backgroundColor: 'var(--cor-botao)' }}>
            {enviando ? 'Salvando...' : 'SALVAR VEÍCULO'}
          </button>
        </div>
      </form>
    </div>
  );
}
