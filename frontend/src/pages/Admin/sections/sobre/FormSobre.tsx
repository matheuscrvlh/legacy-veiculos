import { SobreDados } from '../../../../types';

interface Props {
  dados: SobreDados;
  onSetField: (path: string, value: string) => void;
  onSetDados: (fn: (d: SobreDados) => SobreDados) => void;
  onSubmit: (e: React.FormEvent) => void;
  enviando: boolean;
}

const ic = 'w-full border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]';
const lc = 'text-sm font-bold text-[#333] block mb-1';
const sc = 'bg-white rounded-[10px] shadow-sm p-6 mb-5';

export default function FormSobre({ dados, onSetField, onSetDados, onSubmit, enviando }: Props) {
  return (
    <form onSubmit={onSubmit}>
      {/* Empresa */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Empresa</h2>
        <label className={lc}>Nome da Empresa</label>
        <input className={ic} value={dados.empresa?.nomeEmpresa || ''} onChange={(e) => onSetField('empresa.nomeEmpresa', e.target.value)} />
      </div>

      {/* Imagens */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Imagens</h2>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            { name: 'logo', label: 'Logo', folder: 'logos' },
            { name: 'favicon', label: 'Favicon', folder: 'icons' },
          ].map(({ name, label, folder }) => (
            <div key={name}>
              <label className={lc}>{label}</label>
              {dados.imagens?.[name as keyof typeof dados.imagens] && typeof dados.imagens[name as keyof typeof dados.imagens] === 'string' && (
                <img src={`/uploads/${folder}/${dados.imagens[name as keyof typeof dados.imagens]}`} className="h-[40px] mb-2" alt={label} />
              )}
              <input type="file" name={name} accept="image/*" className="w-full text-sm" />
            </div>
          ))}
          <div><label className={lc}>Imagens de Destaque (header)</label><input type="file" name="imagemDestaque" accept="image/*" multiple className="w-full text-sm" /></div>
          <div><label className={lc}>Imagens da Empresa</label><input type="file" name="imagemEmpresa" accept="image/*" multiple className="w-full text-sm" /></div>
          <div><label className={lc}>Imagem Sobre 1</label><input type="file" name="imagemSobre1" accept="image/*" className="w-full text-sm" /></div>
          <div><label className={lc}>Imagem Sobre 2</label><input type="file" name="imagemSobre2" accept="image/*" className="w-full text-sm" /></div>
        </div>
      </div>

      {/* Cores */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Cores</h2>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            { key: 'corPrimaria', label: 'Cor Primária' }, { key: 'corSecundaria', label: 'Cor Secundária' },
            { key: 'corBotao', label: 'Cor Botão' }, { key: 'corHover', label: 'Cor Hover' },
            { key: 'corActive', label: 'Cor Active' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={lc}>{label}</label>
              <div className="flex gap-2 items-center">
                <input type="color" className="w-10 h-9 border border-[#ccc] cursor-pointer" value={dados.cores?.[key as keyof typeof dados.cores] || '#000000'} onChange={(e) => onSetField(`cores.${key}`, e.target.value)} />
                <input className={`${ic} flex-1`} value={dados.cores?.[key as keyof typeof dados.cores] || ''} onChange={(e) => onSetField(`cores.${key}`, e.target.value)} placeholder="#000000" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sobre */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Sobre a Loja</h2>
        <label className={lc}>Texto 1</label>
        <textarea className={`${ic} h-[80px] resize-none mb-3`} value={dados.sobre?.texto1 || ''} onChange={(e) => onSetField('sobre.texto1', e.target.value)} />
        <label className={lc}>Texto 2</label>
        <textarea className={`${ic} h-[80px] resize-none`} value={dados.sobre?.texto2 || ''} onChange={(e) => onSetField('sobre.texto2', e.target.value)} />
      </div>

      {/* Contatos */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Contatos</h2>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            { path: 'whatsapp.numero', label: 'WhatsApp - Número', placeholder: '(00) 00000-0000' },
            { path: 'whatsapp.link', label: 'WhatsApp - Link', placeholder: 'https://wa.me/...' },
            { path: 'instagram.nome', label: 'Instagram - Nome', placeholder: '@usuario' },
            { path: 'instagram.link', label: 'Instagram - Link', placeholder: '' },
            { path: 'facebook.nome', label: 'Facebook - Nome', placeholder: '' },
            { path: 'facebook.link', label: 'Facebook - Link', placeholder: '' },
          ].map(({ path, label, placeholder }) => {
            const [root, key] = path.split('.') as [keyof SobreDados, string];
            const val = (dados[root] as Record<string, string> | undefined)?.[key] || '';
            return (
              <div key={path}>
                <label className={lc}>{label}</label>
                <input className={ic} value={val} onChange={(e) => onSetField(path, e.target.value)} placeholder={placeholder} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Instagram Painel */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Painel Instagram</h2>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            { key: 'id', label: 'ID / @usuario' }, { key: 'nome', label: 'Nome' },
            { key: 'seguidores', label: 'Seguidores' }, { key: 'publicacoes', label: 'Publicações' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={lc}>{label}</label>
              <input className={ic} value={(dados.instagramLoja as Record<string, string> | undefined)?.[key] || ''} onChange={(e) => onSetField(`instagramLoja.${key}`, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 max-lg:grid-cols-1">
          <div><label className={lc}>Ícone Instagram</label><input type="file" name="imagemIconeInstagram" accept="image/*" className="w-full text-sm" /></div>
          {['Uma', 'Duas', 'Tres', 'Quatro', 'Cinco', 'Seis'].map((n) => (
            <div key={n}><label className={lc}>Foto Feed {n}</label><input type="file" name={`imagem${n}Instagram`} accept="image/*" className="w-full text-sm" /></div>
          ))}
        </div>
      </div>

      {/* Localização */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Localização</h2>
        <label className={lc}>Endereço</label>
        <input className={`${ic} mb-3`} value={dados.localizacao?.endereco || ''} onChange={(e) => onSetField('localizacao.endereco', e.target.value)} />
        <label className={lc}>Horário de Atendimento</label>
        <input className={`${ic} mb-3`} value={dados.localizacao?.horario || ''} onChange={(e) => onSetField('localizacao.horario', e.target.value)} />
        <label className={lc}>Link do Google Maps (embed src)</label>
        <input className={ic} value={dados.localizacao?.mapa || ''} onChange={(e) => onSetField('localizacao.mapa', e.target.value)} placeholder="https://maps.google.com/maps?..." />
      </div>

      {/* Rodapé */}
      <div className={sc}>
        <h2 className="text-[1.1rem] font-bold mb-4">Rodapé</h2>
        <textarea className={`${ic} h-[80px] resize-none`} value={dados.rodape || ''} onChange={(e) => onSetDados((d) => ({ ...d, rodape: e.target.value }))} />
      </div>

      <button type="submit" disabled={enviando} className="w-full py-4 text-white font-bold uppercase text-base border-none cursor-pointer rounded-[5px] disabled:opacity-60 transition-opacity" style={{ backgroundColor: 'var(--cor-botao)' }}>
        {enviando ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
      </button>
    </form>
  );
}
