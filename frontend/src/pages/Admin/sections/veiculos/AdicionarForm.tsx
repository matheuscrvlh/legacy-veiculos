import { useState } from 'react';
import { veiculosApi } from '../../../../api/veiculos';

interface Props { onSuccess: () => void; }

const inputClass = 'w-full border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]';

export default function AdicionarForm({ onSuccess }: Props) {
  const [form, setForm] = useState({
    nome: '', modelo: '', marca: '', categoria: '', combustivel: '', cambio: '',
    cor: '', portas: '', km: '', sobre: '', opcionais: '', ano: '', valor: '', tipoVeiculo: 'Usado',
  });
  const [imagens, setImagens] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); }

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

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-6 max-w-[700px]">
      <h2 className="text-[1.3rem] font-bold mb-5">Adicionar Veículo</h2>
      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
      <form onSubmit={handleEnviar} className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {[
          { field: 'nome', placeholder: 'Nome *' }, { field: 'modelo', placeholder: 'Modelo' },
          { field: 'marca', placeholder: 'Marca *' }, { field: 'categoria', placeholder: 'Categoria' },
          { field: 'combustivel', placeholder: 'Combustível' }, { field: 'cambio', placeholder: 'Câmbio' },
          { field: 'cor', placeholder: 'Cor' }, { field: 'portas', placeholder: 'Portas' },
          { field: 'km', placeholder: 'KM' }, { field: 'ano', placeholder: 'Ano' },
          { field: 'valor', placeholder: 'Valor' },
        ].map(({ field, placeholder }) => (
          <input key={field} type="text" placeholder={placeholder} className={inputClass} value={form[field as keyof typeof form]} onChange={(e) => set(field, e.target.value)} />
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
