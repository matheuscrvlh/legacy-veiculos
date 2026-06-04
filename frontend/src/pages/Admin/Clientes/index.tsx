import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { clientesApi } from '../../../api/clientes';
import { Cliente } from '../../../types';

export default function AdminClientes() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selecionado, setSelecionado] = useState<Cliente | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    clientesApi.listar().then(setClientes);
  }

  function showMsg(t: string) { setMsg(t); setTimeout(() => setMsg(''), 3000); }

  async function remover() {
    if (!confirmId) return;
    try { await clientesApi.remover(confirmId); showMsg('Removido!'); await carregar(); setSelecionado(null); }
    catch { showMsg('Erro ao remover.'); }
    setConfirmId(null);
  }

  const thClass = "px-3 py-2 text-left text-xs font-bold text-[#535353] uppercase";
  const tdClass = "px-3 py-3 text-sm text-[#333] border-b border-[#f0f0f0]";

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
        {/* List */}
        <div className="flex-1 bg-white rounded-[10px] shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9f9f9]">
              <tr>
                <th className={thClass}>Imagem</th>
                <th className={thClass}>Veículo</th>
                <th className={thClass}>Cliente</th>
                <th className={thClass}>Valor Desejado</th>
                <th className={thClass}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.ID} className={selecionado?.ID === c.ID ? 'bg-blue-50' : ''}>
                  <td className={tdClass}>
                    <img src={c.Imagens[0] ? `/uploads/clientes/${c.Imagens[0]}` : ''} className="w-[80px] h-[55px] object-cover rounded-[5px]" alt="" />
                  </td>
                  <td className={tdClass}><p className="font-bold">{c.Marca} {c.Nome}</p><p className="text-[#888] text-xs">{c.Ano} • {c.Km}km</p></td>
                  <td className={tdClass}><p>{c.NomeCliente}</p><p className="text-[#888] text-xs">{c.TelefoneCliente}</p></td>
                  <td className={tdClass}>R$ {c.ValorDesejado}</td>
                  <td className={tdClass}>
                    <div className="flex gap-2">
                      <button onClick={() => setSelecionado(c)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs border-none cursor-pointer">Detalhes</button>
                      <button onClick={() => setConfirmId(c.ID)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs border-none cursor-pointer">Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clientes.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo de cliente.</p>}
        </div>

        {/* Detail panel */}
        {selecionado && (
          <div className="w-[350px] max-lg:w-full bg-white rounded-[10px] shadow-sm p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-[1.1rem]">{selecionado.Marca} {selecionado.Nome}</h3>
              <button onClick={() => setSelecionado(null)} className="bg-transparent border-none cursor-pointer text-[#888] text-lg">×</button>
            </div>

            <div className="flex gap-2 mb-3 flex-wrap">
              {selecionado.Imagens.map((img) => (
                <img key={img} src={`/uploads/clientes/${img}`} className="w-[80px] h-[60px] object-cover rounded-[5px]" alt="" />
              ))}
            </div>

            {[
              ['Marca', selecionado.Marca], ['Categoria', selecionado.Categoria],
              ['Ano', selecionado.Ano], ['KM', selecionado.Km],
              ['Combustível', selecionado.Combustivel], ['Câmbio', selecionado.Cambio],
              ['Cor', selecionado.Cor], ['Portas', selecionado.Portas],
              ['Placa', selecionado.Placa], ['Cidade', selecionado.Cidade],
              ['Bairro', selecionado.Bairro], ['Valor FIPE', selecionado.ValorFipe],
              ['Valor Desejado', selecionado.ValorDesejado],
              ['GNV', selecionado.Gnv], ['Leilão', selecionado.Leilao],
              ['Anúncio', selecionado.Anuncio], ['Observação', selecionado.Observacao],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={String(label)} className="flex gap-2 mb-1 text-sm">
                <span className="font-bold text-[#333] shrink-0">{label}:</span>
                <span className="text-[#6b6b6b]">{String(value)}</span>
              </div>
            ))}

            <hr className="my-3" />
            <p className="font-bold text-[#333] mb-1">Cliente:</p>
            <p className="text-sm text-[#6b6b6b]">{selecionado.NomeCliente}</p>
            <p className="text-sm text-[#6b6b6b]">{selecionado.EmailCliente}</p>
            <p className="text-sm text-[#6b6b6b]">{selecionado.TelefoneCliente}</p>

            {selecionado.TelefoneCliente && (
              <a href={`https://wa.me/${selecionado.TelefoneCliente.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                <button className="mt-4 w-full py-2 text-white font-bold text-sm rounded border-none cursor-pointer" style={{ backgroundColor: '#25D366' }}>
                  Contato via WhatsApp
                </button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
