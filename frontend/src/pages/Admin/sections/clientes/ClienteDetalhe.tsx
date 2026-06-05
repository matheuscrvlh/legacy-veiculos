import { Cliente } from '../../../../types';
import { formatarKm } from '../../../../lib/utils';

interface Props {
  cliente: Cliente;
  onFechar: () => void;
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-2 py-1.5 border-b border-[#f5f5f5] last:border-b-0">
      <span className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[#333] flex-1">{String(value)}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[0.65rem] font-bold text-[#bbb] uppercase tracking-widest mb-2">{title}</p>
      <div className="bg-[#fafafa] rounded-lg px-3 py-1">{children}</div>
    </div>
  );
}

export default function ClienteDetalhe({ cliente: c, onFechar }: Props) {
  return (
    <div className="w-[360px] max-lg:w-full bg-white rounded-xl border border-[#e8e8e8] shadow-sm overflow-hidden flex flex-col flex-shrink-0">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0] bg-[#fafafa]">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1a1a1a] truncate">{c.Marca} {c.Nome}</p>
          <p className="text-xs text-[#aaa]">{c.Ano} · {formatarKm(c.Km)} km</p>
        </div>
        <button
          onClick={onFechar}
          className="w-7 h-7 rounded-full bg-[#f0f0f0] hover:bg-[#e8e8e8] flex items-center justify-center border-none cursor-pointer transition-colors flex-shrink-0 ml-2 text-sm text-[#666]"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Fotos */}
        {c.Imagens.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {c.Imagens.map((img, i) => (
              <div key={img} className={`rounded-lg overflow-hidden bg-[#1a1a1a] ${i === 0 ? 'w-full aspect-[4/3]' : 'w-[calc(33.3%-4px)] aspect-square'}`}>
                <img src={`/uploads/clientes/${img}`} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        )}

        {/* Veículo */}
        <Section title="Veículo">
          <Row label="Marca"      value={c.Marca} />
          <Row label="Modelo"     value={c.Nome} />
          <Row label="Categoria"  value={c.Categoria} />
          <Row label="Ano"        value={c.Ano} />
          <Row label="KM"         value={c.Km ? `${formatarKm(c.Km)} km` : null} />
          <Row label="Combustível" value={c.Combustivel} />
          <Row label="Câmbio"     value={c.Cambio} />
          <Row label="Cor"        value={c.Cor} />
          <Row label="Portas"     value={c.Portas} />
          <Row label="Placa"      value={c.Placa} />
        </Section>

        {/* Valores */}
        <Section title="Valores">
          <Row label="Valor FIPE"     value={c.ValorFipe ? `R$ ${c.ValorFipe}` : null} />
          <Row label="Valor desejado" value={c.ValorDesejado ? `R$ ${c.ValorDesejado}` : null} />
        </Section>

        {/* Localização */}
        {(c.Cidade || c.Bairro) && (
          <Section title="Localização">
            <Row label="Cidade" value={c.Cidade} />
            <Row label="Bairro" value={c.Bairro} />
          </Section>
        )}

        {/* Informações adicionais */}
        <Section title="Informações adicionais">
          <Row label="GNV"      value={c.Gnv === 'sim' ? `Sim${c.InfoGnv ? ` — ${c.InfoGnv}` : ''}` : c.Gnv === 'nao' ? 'Não' : null} />
          <Row label="Leilão"   value={c.Leilao === 'sim' ? `Sim${c.InfoLeilao ? ` — ${c.InfoLeilao}` : ''}` : c.Leilao === 'nao' ? 'Não' : null} />
          <Row label="Anunciado" value={c.Anuncio === 'sim' ? `Sim${c.InfoAnuncio ? ` — ${c.InfoAnuncio}` : ''}` : c.Anuncio === 'nao' ? 'Não' : null} />
          <Row label="Observação" value={c.Observacao} />
        </Section>

        {/* Cliente */}
        <Section title="Cliente">
          <Row label="Nome"     value={c.NomeCliente} />
          <Row label="E-mail"   value={c.EmailCliente} />
          <Row label="Telefone" value={c.TelefoneCliente} />
        </Section>
      </div>

      {/* Ação WhatsApp */}
      {c.TelefoneCliente && (
        <div className="p-4 border-t border-[#f0f0f0]">
          <a
            href={`https://wa.me/${c.TelefoneCliente.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="no-underline block"
          >
            <button
              className="w-full py-2.5 text-white text-sm font-bold rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contato via WhatsApp
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
