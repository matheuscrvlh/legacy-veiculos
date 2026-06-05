import { useNavigate } from 'react-router-dom';
import { Veiculo } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';
import iconLupa from '../../../../assets/icons/admin/veiculo/lupa.png';
import iconCarrinho from '../../../../assets/icons/admin/veiculo/carrinho-compras.png';
import iconLixeira from '../../../../assets/icons/admin/veiculo/lixeira.png';
import iconEstrelaPreenchida from '../../../../assets/icons/admin/veiculo/estrela-preenchida.png';
import iconEstrelaVazia from '../../../../assets/icons/admin/veiculo/estrela-vazia.png';

interface Props {
  veiculos: Veiculo[];
  onToggleOferta: (id: string) => void;
  onVender: (id: string) => void;
  onRemover: (id: string) => void;
}

const th = 'px-3 py-2 text-left text-xs font-bold text-[#535353] uppercase';
const td = 'px-3 py-3 text-sm text-[#333] border-b border-[#f0f0f0]';

export default function EstoqueTable({ veiculos, onToggleOferta, onVender, onRemover }: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#f9f9f9]">
          <tr>
            <th className={th}>Imagem</th>
            <th className={th}>Código</th>
            <th className={th}>Veículo</th>
            <th className={th}>KM</th>
            <th className={th}>Valor</th>
            <th className={th}>Oferta</th>
            <th className={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((v) => (
            <tr key={v.ID}>
              <td className={td}>
                <div className="w-[60px] aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
                  <img src={v.Imagens[0] ? `/uploads/vehicles/${v.Imagens[0]}` : ''} className="w-full h-full object-cover" alt="" />
                </div>
              </td>
              <td className={td}>{v.CodigoSequencial}</td>
              <td className={td}><p className="font-bold">{v.Marca} {v.Nome}</p><p className="text-[#888] text-xs">{v.Modelo} • {v.Ano}</p></td>
              <td className={td}>{formatarKm(v.Km)} km</td>
              <td className={td} style={{ color: 'var(--cor-primaria)' }}>R$ {v.Valor}</td>
              <td className={td}>
                <button onClick={() => onToggleOferta(v.ID)} title={v.Oferta ? 'Remover oferta' : 'Marcar como oferta'} className={`p-1 rounded border-none cursor-pointer ${v.Oferta ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <img src={v.Oferta ? iconEstrelaPreenchida : iconEstrelaVazia} className="w-5 h-5" alt={v.Oferta ? 'Oferta' : 'Sem oferta'} />
                </button>
              </td>
              <td className={td}>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => navigate(`/veiculo/${v.ID}`)} title="Ver detalhes" className="p-1 bg-blue-50 rounded border-none cursor-pointer"><img src={iconLupa} className="w-5 h-5" alt="Ver" /></button>
                  <button onClick={() => onVender(v.ID)} title="Marcar como vendido" className="p-1 bg-green-50 rounded border-none cursor-pointer"><img src={iconCarrinho} className="w-5 h-5" alt="Vendido" /></button>
                  <button onClick={() => onRemover(v.ID)} title="Remover veículo" className="p-1 bg-red-50 rounded border-none cursor-pointer"><img src={iconLixeira} className="w-5 h-5" alt="Remover" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {veiculos.length === 0 && <p className="text-center py-8 text-[#535353]">Nenhum veículo no estoque.</p>}
    </div>
  );
}
