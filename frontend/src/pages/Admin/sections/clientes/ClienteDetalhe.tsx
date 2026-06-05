import { Cliente } from '../../../../types';

interface Props {
  cliente: Cliente;
  onFechar: () => void;
}

export default function ClienteDetalhe({ cliente, onFechar }: Props) {
  return (
    <div className="w-[350px] max-lg:w-full bg-white rounded-[10px] shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-[1.1rem]">{cliente.Marca} {cliente.Nome}</h3>
        <button onClick={onFechar} className="bg-transparent border-none cursor-pointer text-[#888] text-lg">×</button>
      </div>

      <div className="flex gap-[3px] mb-3 flex-wrap">
        {cliente.Imagens.map((img) => (
          <div key={img} className="w-[70px] aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
            <img src={`/uploads/clientes/${img}`} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
      </div>

      {[
        ['Marca', cliente.Marca], ['Categoria', cliente.Categoria],
        ['Ano', cliente.Ano], ['KM', cliente.Km],
        ['Combustível', cliente.Combustivel], ['Câmbio', cliente.Cambio],
        ['Cor', cliente.Cor], ['Portas', cliente.Portas],
        ['Placa', cliente.Placa], ['Cidade', cliente.Cidade],
        ['Bairro', cliente.Bairro], ['Valor FIPE', cliente.ValorFipe],
        ['Valor Desejado', cliente.ValorDesejado],
        ['GNV', cliente.Gnv], ['Leilão', cliente.Leilao],
        ['Anúncio', cliente.Anuncio], ['Observação', cliente.Observacao],
      ].filter(([, v]) => v).map(([label, value]) => (
        <div key={String(label)} className="flex gap-2 mb-1 text-sm">
          <span className="font-bold text-[#333] shrink-0">{label}:</span>
          <span className="text-[#6b6b6b]">{String(value)}</span>
        </div>
      ))}

      <hr className="my-3" />
      <p className="font-bold text-[#333] mb-1">Cliente:</p>
      <p className="text-sm text-[#6b6b6b]">{cliente.NomeCliente}</p>
      <p className="text-sm text-[#6b6b6b]">{cliente.EmailCliente}</p>
      <p className="text-sm text-[#6b6b6b]">{cliente.TelefoneCliente}</p>

      {cliente.TelefoneCliente && (
        <a href={`https://wa.me/${cliente.TelefoneCliente.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
          <button className="mt-4 w-full py-2 text-white font-bold text-sm rounded border-none cursor-pointer" style={{ backgroundColor: '#25D366' }}>
            Contato via WhatsApp
          </button>
        </a>
      )}
    </div>
  );
}
