import { Veiculo } from '../../../../types';
import iconLoja from '../../../../assets/icons/admin/veiculo/loja.png';
import iconLixeira from '../../../../assets/icons/admin/veiculo/lixeira.png';

interface Props {
  vendidos: Veiculo[];
  onReativar: (id: string) => void;
  onRemover: (id: string) => void;
}

const th = 'px-3 py-2 text-left text-xs font-bold text-[#535353] uppercase';
const td = 'px-3 py-3 text-sm text-[#333] border-b border-[#f0f0f0]';

export default function VendidosTable({ vendidos, onReativar, onRemover }: Props) {
  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#f9f9f9]">
          <tr>
            <th className={th}>Imagem</th>
            <th className={th}>Código</th>
            <th className={th}>Veículo</th>
            <th className={th}>Valor</th>
            <th className={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vendidos.map((v) => (
            <tr key={v.ID}>
              <td className={td}>
                <div className="w-[60px] aspect-[3/4] bg-[#1a1a1a] overflow-hidden opacity-60">
                  <img src={v.Imagens[0] ? `/uploads/vehiclesSold/${v.Imagens[0]}` : ''} className="w-full h-full object-cover" alt="" />
                </div>
              </td>
              <td className={td}>{v.CodigoSequencial}</td>
              <td className={td}><p className="font-bold">{v.Marca} {v.Nome}</p><p className="text-[#888] text-xs">{v.Modelo} • {v.Ano}</p></td>
              <td className={td}>R$ {v.Valor}</td>
              <td className={td}>
                <div className="flex gap-2">
                  <button onClick={() => onReativar(v.ID)} title="Reativar para estoque" className="p-1 bg-green-50 rounded border-none cursor-pointer"><img src={iconLoja} className="w-5 h-5" alt="Reativar" /></button>
                  <button onClick={() => onRemover(v.ID)} title="Remover definitivamente" className="p-1 bg-red-50 rounded border-none cursor-pointer"><img src={iconLixeira} className="w-5 h-5" alt="Remover" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vendidos.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo vendido.</p>}
    </div>
  );
}
