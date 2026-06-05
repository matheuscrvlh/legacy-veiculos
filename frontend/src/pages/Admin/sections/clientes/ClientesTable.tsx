import { Cliente } from '../../../../types';

interface Props {
  clientes: Cliente[];
  selecionado: Cliente | null;
  onSelecionar: (c: Cliente) => void;
  onRemover: (id: string) => void;
}

const th = 'px-3 py-2 text-left text-xs font-bold text-[#535353] uppercase';
const td = 'px-3 py-3 text-sm text-[#333] border-b border-[#f0f0f0]';

export default function ClientesTable({ clientes, selecionado, onSelecionar, onRemover }: Props) {
  return (
    <div className="flex-1 bg-white rounded-[10px] shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#f9f9f9]">
          <tr>
            <th className={th}>Imagem</th>
            <th className={th}>Veículo</th>
            <th className={th}>Cliente</th>
            <th className={th}>Valor Desejado</th>
            <th className={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.ID} className={selecionado?.ID === c.ID ? 'bg-blue-50' : ''}>
              <td className={td}>
                <div className="w-[60px] aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
                  <img src={c.Imagens[0] ? `/uploads/clientes/${c.Imagens[0]}` : ''} className="w-full h-full object-cover" alt="" />
                </div>
              </td>
              <td className={td}><p className="font-bold">{c.Marca} {c.Nome}</p><p className="text-[#888] text-xs">{c.Ano} • {c.Km}km</p></td>
              <td className={td}><p>{c.NomeCliente}</p><p className="text-[#888] text-xs">{c.TelefoneCliente}</p></td>
              <td className={td}>R$ {c.ValorDesejado}</td>
              <td className={td}>
                <div className="flex gap-2">
                  <button onClick={() => onSelecionar(c)} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs border-none cursor-pointer">Detalhes</button>
                  <button onClick={() => onRemover(c.ID)} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs border-none cursor-pointer">Remover</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clientes.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo de cliente.</p>}
    </div>
  );
}
