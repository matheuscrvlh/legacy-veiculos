import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import { SobreDados } from '../../../../types';

interface Props {
  dados: SobreDados;
  onSetField: (path: string, value: string) => void;
  onSetDados: (fn: (d: SobreDados) => SobreDados) => void;
  onSubmit: (e: React.FormEvent) => void;
  enviando: boolean;
}

// ── Helpers de estilo ────────────────────────────────────────────────────────

const ic = 'w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#888] bg-white transition-colors';
const lc = 'text-[0.68rem] font-bold text-[#666] uppercase tracking-wide block mb-1';

function Card({ title, children, description }: { title: string; children: ReactNode; description?: string }) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="px-5 py-3.5 border-b border-[#f0f0f0] bg-[#fafafa]">
        <h2 className="text-sm font-bold text-[#222]">{title}</h2>
        {description && <p className="text-xs text-[#aaa] mt-0.5">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Imagem única com preview ─────────────────────────────────────────────────

function SingleImageInput({
  label, name, folder, currentFile,
}: {
  label: string; name: string; folder: string; currentFile?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  const src = preview || (currentFile ? `/uploads/${folder}/${currentFile}` : null);

  return (
    <div>
      <span className={lc}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg border border-[#e0e0e0] bg-[#f5f5f5] overflow-hidden flex items-center justify-center flex-shrink-0">
          {src
            ? <img src={src} className="w-full h-full object-contain" alt="" />
            : <svg className="w-5 h-5 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          }
        </div>
        <label className="flex-1 cursor-pointer">
          <input
            ref={ref}
            type="file"
            name={name}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          <div
            className={`border-2 border-dashed rounded-lg px-4 py-2 text-center text-sm transition-colors cursor-pointer ${
              preview ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-medium' : 'border-[#e0e0e0] hover:border-[#999] text-[#888]'
            }`}
          >
            {preview ? '✓ Nova imagem selecionada' : 'Clique para trocar'}
          </div>
        </label>
      </div>
    </div>
  );
}

// ── Imagens em array (destaque / empresa) ────────────────────────────────────

function ArrayImagesInput({
  label, name, folder, current, description,
}: {
  label: string; name: string; folder: string; current?: string[]; description?: string;
}) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className={lc}>{label}</span>
      {description && <p className="text-xs text-[#aaa] mb-2">{description}</p>}

      {/* Imagens atuais */}
      {current && current.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {current.map((img, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5]">
              <img src={`/uploads/${folder}/${img}`} className="w-full h-full object-cover" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] text-center leading-4">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
          newFiles.length > 0 ? 'border-emerald-400 bg-emerald-50' : 'border-[#e0e0e0] hover:border-[#999] bg-[#fafafa]'
        }`}
        onClick={() => ref.current?.click()}
      >
        <input
          ref={ref}
          type="file"
          name={name}
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
        />
        {newFiles.length > 0 ? (
          <p className="text-sm text-emerald-700 font-semibold">
            ✓ {newFiles.length} imagem{newFiles.length > 1 ? 'ns' : ''} — substituirá as atuais ao salvar
          </p>
        ) : (
          <p className="text-sm text-[#888]">
            {current?.length ? `Clique para substituir (${current.length} atual${current.length > 1 ? 'is' : ''})` : 'Clique para adicionar imagens'}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Feed do Instagram (6 slots individuais) ───────────────────────────────────

const FEED_SLOTS = [
  { num: 1, name: 'imagemUmaInstagram',    key: 'imagem1' },
  { num: 2, name: 'imagemDuasInstagram',   key: 'imagem2' },
  { num: 3, name: 'imagemTresInstagram',   key: 'imagem3' },
  { num: 4, name: 'imagemQuatroInstagram', key: 'imagem4' },
  { num: 5, name: 'imagemCincoInstagram',  key: 'imagem5' },
  { num: 6, name: 'imagemSeisInstagram',   key: 'imagem6' },
] as const;

function InstagramFeedGrid({ feedAtual }: { feedAtual?: Record<string, string> }) {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  return (
    <div className="grid grid-cols-3 gap-2">
      {FEED_SLOTS.map(({ num, name, key }) => {
        const current = feedAtual?.[key] ? `/uploads/bannersInstagram/${feedAtual[key]}` : null;
        const preview = previews[key];
        const src = preview || current;

        return (
          <label key={key} className="cursor-pointer group block">
            <input
              type="file"
              name={name}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreviews((p) => ({ ...p, [key]: URL.createObjectURL(f) }));
              }}
            />
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-[#e0e0e0] group-hover:border-[#999] transition-colors bg-[#f5f5f5]">
              {src ? (
                <img src={src} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <svg className="w-5 h-5 text-[#ccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="text-[#ccc] text-[10px]">Foto {num}</span>
                </div>
              )}

              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold">{src ? 'Trocar' : 'Adicionar'}</span>
              </div>

              {/* Badge de nova imagem */}
              {preview && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-[8px] font-bold">✓</span>
                </div>
              )}

              {/* Número do slot */}
              {!src && (
                <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] text-[#ccc]">{num}/6</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function FormSobre({ dados, onSetField, onSetDados, onSubmit, enviando }: Props) {
  return (
    <form onSubmit={onSubmit}>

      {/* Empresa */}
      <Card title="Empresa">
        <label className={lc}>Nome da Empresa</label>
        <input className={ic} value={dados.empresa?.nomeEmpresa || ''} onChange={(e) => onSetField('empresa.nomeEmpresa', e.target.value)} />
      </Card>

      {/* Cores */}
      <Card title="Cores" description="Defina a identidade visual do site">
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {([
            { key: 'corPrimaria', label: 'Cor Primária' },
            { key: 'corSecundaria', label: 'Cor Secundária' },
            { key: 'corBotao', label: 'Cor Botão' },
            { key: 'corHover', label: 'Cor Hover' },
            { key: 'corActive', label: 'Cor Active' },
          ] as const).map(({ key, label }) => (
            <div key={key}>
              <label className={lc}>{label}</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  className="w-9 h-9 border border-[#e0e0e0] rounded-lg cursor-pointer p-0.5 flex-shrink-0"
                  value={dados.cores?.[key] || '#000000'}
                  onChange={(e) => onSetField(`cores.${key}`, e.target.value)}
                />
                <input
                  className={`${ic} flex-1 font-mono`}
                  value={dados.cores?.[key] || ''}
                  onChange={(e) => onSetField(`cores.${key}`, e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preview das cores */}
        {dados.cores && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {Object.entries(dados.cores).map(([key, cor]) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg border border-[#e0e0e0] shadow-sm" style={{ backgroundColor: cor || '#eee' }} title={cor} />
                <span className="text-[9px] text-[#aaa] uppercase">{key.replace('cor', '')}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Imagens */}
      <Card title="Imagens" description="Logo, banners e imagens do site">
        <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
          <SingleImageInput label="Logo" name="logo" folder="logos" currentFile={dados.imagens?.logo} />
          <SingleImageInput label="Favicon" name="favicon" folder="icons" currentFile={dados.imagens?.favicon} />
          <SingleImageInput label="Sobre — Imagem 1" name="imagemSobre1" folder="bannersAbout" currentFile={dados.imagens?.imagemSobre1} />
          <SingleImageInput label="Sobre — Imagem 2" name="imagemSobre2" folder="bannersAbout" currentFile={dados.imagens?.imagemSobre2} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4">
          <ArrayImagesInput
            label="Imagens de Destaque (Hero/Header)"
            name="imagemDestaque"
            folder="banners"
            current={dados.imagens?.imagemDestaque}
            description="Aparecem no slider da página inicial e estoque."
          />
          <ArrayImagesInput
            label="Imagens da Empresa"
            name="imagemEmpresa"
            folder="bannersAbout"
            current={dados.imagens?.imagemEmpresa}
            description="Aparecem na seção Quem Somos."
          />
        </div>
      </Card>

      {/* Sobre */}
      <Card title="Sobre a Loja">
        <div className="flex flex-col gap-3">
          <div>
            <label className={lc}>Texto 1</label>
            <textarea className={`${ic} h-[80px] resize-none`} value={dados.sobre?.texto1 || ''} onChange={(e) => onSetField('sobre.texto1', e.target.value)} />
          </div>
          <div>
            <label className={lc}>Texto 2</label>
            <textarea className={`${ic} h-[80px] resize-none`} value={dados.sobre?.texto2 || ''} onChange={(e) => onSetField('sobre.texto2', e.target.value)} />
          </div>
        </div>
      </Card>

      {/* Contatos */}
      <Card title="Contatos">
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          {[
            { path: 'whatsapp.numero', label: 'WhatsApp — Número', placeholder: '(00) 00000-0000' },
            { path: 'whatsapp.link', label: 'WhatsApp — Link', placeholder: 'https://wa.me/...' },
            { path: 'instagram.nome', label: 'Instagram — Nome', placeholder: '@usuario' },
            { path: 'instagram.link', label: 'Instagram — Link', placeholder: 'https://instagram.com/...' },
            { path: 'facebook.nome', label: 'Facebook — Nome', placeholder: 'Nome da página' },
            { path: 'facebook.link', label: 'Facebook — Link', placeholder: 'https://facebook.com/...' },
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
      </Card>

      {/* Instagram Painel */}
      <Card title="Painel Instagram" description="Informações exibidas no painel de redes sociais">

        {/* Perfil */}
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 mb-5">
          {[
            { key: 'id', label: 'ID / @usuario' },
            { key: 'nome', label: 'Nome exibido' },
            { key: 'seguidores', label: 'Seguidores' },
            { key: 'publicacoes', label: 'Publicações' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={lc}>{label}</label>
              <input
                className={ic}
                value={(dados.instagramLoja as Record<string, string> | undefined)?.[key] || ''}
                onChange={(e) => onSetField(`instagramLoja.${key}`, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Ícone */}
        <div className="mb-5">
          <SingleImageInput
            label="Ícone do perfil"
            name="imagemIconeInstagram"
            folder="bannersInstagram"
            currentFile={dados.instagramLoja?.icone}
          />
        </div>

        {/* Feed */}
        <div>
          <span className={lc}>Fotos do feed (6 slots)</span>
          <p className="text-xs text-[#aaa] mb-3">Clique em qualquer slot para trocar a imagem individualmente.</p>
          <InstagramFeedGrid feedAtual={dados.instagramLoja?.feed as Record<string, string> | undefined} />
        </div>
      </Card>

      {/* Localização */}
      <Card title="Localização">
        <div className="flex flex-col gap-3">
          <div>
            <label className={lc}>Endereço</label>
            <input className={ic} value={dados.localizacao?.endereco || ''} onChange={(e) => onSetField('localizacao.endereco', e.target.value)} />
          </div>
          <div>
            <label className={lc}>Horário de Atendimento</label>
            <input className={ic} value={dados.localizacao?.horario || ''} onChange={(e) => onSetField('localizacao.horario', e.target.value)} />
          </div>
          <div>
            <label className={lc}>Link Google Maps (embed src)</label>
            <input className={ic} value={dados.localizacao?.mapa || ''} onChange={(e) => onSetField('localizacao.mapa', e.target.value)} placeholder="https://maps.google.com/maps?..." />
          </div>
        </div>
      </Card>

      {/* Frase Topbar */}
      <Card title="Frase do Topo" description="Aparece em destaque acima do header em todas as páginas. Deixe em branco para ocultar.">
        <div>
          <input
            className={ic}
            placeholder="Ex: Financiamento facilitado! Fale conosco agora."
            value={dados.fraseTopbar || ''}
            maxLength={80}
            onChange={(e) => onSetDados((d) => ({ ...d, fraseTopbar: e.target.value }))}
          />
          <p className={`text-xs text-right mt-1 ${(dados.fraseTopbar || '').length >= 70 ? 'text-red-400 font-semibold' : 'text-[#aaa]'}`}>
            {(dados.fraseTopbar || '').length}/80
          </p>
        </div>
      </Card>

      {/* Rodapé */}
      <Card title="Rodapé" description="Texto exibido no rodapé do site. Máximo 100 caracteres.">
        <div>
          <textarea
            className={`${ic} h-[80px] resize-none`}
            value={dados.rodape || ''}
            maxLength={100}
            onChange={(e) => onSetDados((d) => ({ ...d, rodape: e.target.value }))}
          />
          <p className={`text-xs text-right mt-1 ${(dados.rodape || '').length >= 90 ? 'text-red-400 font-semibold' : 'text-[#aaa]'}`}>
            {(dados.rodape || '').length}/100
          </p>
        </div>
      </Card>

      <button
        type="submit"
        disabled={enviando}
        className="w-full py-3 text-white font-bold text-sm uppercase rounded-xl border-none cursor-pointer disabled:opacity-60 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: 'var(--cor-botao)' }}
      >
        {enviando ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  );
}
