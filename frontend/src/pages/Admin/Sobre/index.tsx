import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { sobreApi } from '../../../api/sobre';
import { invalidateSobre } from '../../../hooks/useSobre';
import { SobreDados } from '../../../types';

export default function AdminSobre() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [dados, setDados] = useState<SobreDados>({});
  const [msg, setMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  useEffect(() => {
    sobreApi.getDados().then(setDados);
  }, []);

  function setField(path: string, value: string) {
    setDados((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj: Record<string, unknown> = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMsg('');

    const fd = new FormData(e.target as HTMLFormElement);

    // Adicionar campos de texto que não estão no form
    fd.set('nomeEmpresa', dados.empresa?.nomeEmpresa || '');
    fd.set('sobreTexto1', dados.sobre?.texto1 || '');
    fd.set('sobreTexto2', dados.sobre?.texto2 || '');
    fd.set('whatsappNumero', dados.whatsapp?.numero || '');
    fd.set('whatsappLink', dados.whatsapp?.link || '');
    fd.set('instagramNome', dados.instagram?.nome || '');
    fd.set('instagramLink', dados.instagram?.link || '');
    fd.set('facebookNome', dados.facebook?.nome || '');
    fd.set('facebookLink', dados.facebook?.link || '');
    fd.set('corPrimaria', dados.cores?.corPrimaria || '');
    fd.set('corSecundaria', dados.cores?.corSecundaria || '');
    fd.set('corBotao', dados.cores?.corBotao || '');
    fd.set('corHover', dados.cores?.corHover || '');
    fd.set('corActive', dados.cores?.corActive || '');
    fd.set('endereco', dados.localizacao?.endereco || '');
    fd.set('horario', dados.localizacao?.horario || '');
    fd.set('mapa', dados.localizacao?.mapa || '');
    fd.set('rodape', dados.rodape || '');
    fd.set('idInstagramLoja', dados.instagramLoja?.id || '');
    fd.set('nomeInstagramLoja', dados.instagramLoja?.nome || '');
    fd.set('seguidoresInstagramLoja', dados.instagramLoja?.seguidores || '');
    fd.set('publiInstagramLoja', dados.instagramLoja?.publicacoes || '');

    try {
      await sobreApi.salvar(fd);
      invalidateSobre();
      setMsg('Configurações salvas com sucesso!');
    } catch { setMsg('Erro ao salvar.'); }
    finally { setEnviando(false); }
  }

  const inputClass = "w-full border border-[#ccc] rounded-[3px] px-3 py-2 text-sm outline-none focus:border-[#535353]";
  const labelClass = "text-sm font-bold text-[#333] block mb-1";
  const sectionClass = "bg-white rounded-[10px] shadow-sm p-6 mb-5";

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Configurações da Loja</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[900px] mx-auto py-8 px-5">
        <form onSubmit={handleSalvar}>
          {/* Empresa */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Empresa</h2>
            <label className={labelClass}>Nome da Empresa</label>
            <input className={inputClass} value={dados.empresa?.nomeEmpresa || ''} onChange={(e) => setField('empresa.nomeEmpresa', e.target.value)} />
          </div>

          {/* Imagens */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Imagens</h2>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              {[
                { name: 'logo', label: 'Logo', folder: 'logos' },
                { name: 'favicon', label: 'Favicon', folder: 'icons' },
              ].map(({ name, label, folder }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  {dados.imagens?.[name as keyof typeof dados.imagens] && typeof dados.imagens[name as keyof typeof dados.imagens] === 'string' && (
                    <img src={`/uploads/${folder}/${dados.imagens[name as keyof typeof dados.imagens]}`} className="h-[40px] mb-2" alt={label} />
                  )}
                  <input type="file" name={name} accept="image/*" className="w-full text-sm" />
                </div>
              ))}
              <div>
                <label className={labelClass}>Imagens de Destaque (header)</label>
                <input type="file" name="imagemDestaque" accept="image/*" multiple className="w-full text-sm" />
              </div>
              <div>
                <label className={labelClass}>Imagens da Empresa</label>
                <input type="file" name="imagemEmpresa" accept="image/*" multiple className="w-full text-sm" />
              </div>
              <div>
                <label className={labelClass}>Imagem Sobre 1</label>
                <input type="file" name="imagemSobre1" accept="image/*" className="w-full text-sm" />
              </div>
              <div>
                <label className={labelClass}>Imagem Sobre 2</label>
                <input type="file" name="imagemSobre2" accept="image/*" className="w-full text-sm" />
              </div>
            </div>
          </div>

          {/* Cores */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Cores</h2>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              {[
                { key: 'corPrimaria', label: 'Cor Primária' },
                { key: 'corSecundaria', label: 'Cor Secundária' },
                { key: 'corBotao', label: 'Cor Botão' },
                { key: 'corHover', label: 'Cor Hover' },
                { key: 'corActive', label: 'Cor Active' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      className="w-10 h-9 border border-[#ccc] cursor-pointer"
                      value={dados.cores?.[key as keyof typeof dados.cores] || '#000000'}
                      onChange={(e) => setField(`cores.${key}`, e.target.value)}
                    />
                    <input
                      className={`${inputClass} flex-1`}
                      value={dados.cores?.[key as keyof typeof dados.cores] || ''}
                      onChange={(e) => setField(`cores.${key}`, e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sobre textos */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Sobre a Loja</h2>
            <label className={labelClass}>Texto 1</label>
            <textarea className={`${inputClass} h-[80px] resize-none mb-3`} value={dados.sobre?.texto1 || ''} onChange={(e) => setField('sobre.texto1', e.target.value)} />
            <label className={labelClass}>Texto 2</label>
            <textarea className={`${inputClass} h-[80px] resize-none`} value={dados.sobre?.texto2 || ''} onChange={(e) => setField('sobre.texto2', e.target.value)} />
          </div>

          {/* Contatos */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Contatos</h2>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              <div>
                <label className={labelClass}>WhatsApp - Número</label>
                <input className={inputClass} value={dados.whatsapp?.numero || ''} onChange={(e) => setField('whatsapp.numero', e.target.value)} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className={labelClass}>WhatsApp - Link</label>
                <input className={inputClass} value={dados.whatsapp?.link || ''} onChange={(e) => setField('whatsapp.link', e.target.value)} placeholder="https://wa.me/..." />
              </div>
              <div>
                <label className={labelClass}>Instagram - Nome</label>
                <input className={inputClass} value={dados.instagram?.nome || ''} onChange={(e) => setField('instagram.nome', e.target.value)} placeholder="@usuario" />
              </div>
              <div>
                <label className={labelClass}>Instagram - Link</label>
                <input className={inputClass} value={dados.instagram?.link || ''} onChange={(e) => setField('instagram.link', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Facebook - Nome</label>
                <input className={inputClass} value={dados.facebook?.nome || ''} onChange={(e) => setField('facebook.nome', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Facebook - Link</label>
                <input className={inputClass} value={dados.facebook?.link || ''} onChange={(e) => setField('facebook.link', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Instagram Painel */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Painel Instagram</h2>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
              {[
                { key: 'id', label: 'ID / @usuario' },
                { key: 'nome', label: 'Nome' },
                { key: 'seguidores', label: 'Seguidores' },
                { key: 'publicacoes', label: 'Publicações' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input className={inputClass} value={(dados.instagramLoja as Record<string, string> | undefined)?.[key] || ''} onChange={(e) => setField(`instagramLoja.${key}`, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 max-lg:grid-cols-1">
              <div>
                <label className={labelClass}>Ícone Instagram</label>
                <input type="file" name="imagemIconeInstagram" accept="image/*" className="w-full text-sm" />
              </div>
              {['Uma', 'Duas', 'Tres', 'Quatro', 'Cinco', 'Seis'].map((n) => (
                <div key={n}>
                  <label className={labelClass}>Foto Feed {n}</label>
                  <input type="file" name={`imagem${n}Instagram`} accept="image/*" className="w-full text-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Localização */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Localização</h2>
            <label className={labelClass}>Endereço</label>
            <input className={`${inputClass} mb-3`} value={dados.localizacao?.endereco || ''} onChange={(e) => setField('localizacao.endereco', e.target.value)} />
            <label className={labelClass}>Horário de Atendimento</label>
            <input className={`${inputClass} mb-3`} value={dados.localizacao?.horario || ''} onChange={(e) => setField('localizacao.horario', e.target.value)} />
            <label className={labelClass}>Link do Google Maps (embed src)</label>
            <input className={inputClass} value={dados.localizacao?.mapa || ''} onChange={(e) => setField('localizacao.mapa', e.target.value)} placeholder="https://maps.google.com/maps?..." />
          </div>

          {/* Rodapé */}
          <div className={sectionClass}>
            <h2 className="text-[1.1rem] font-bold mb-4">Rodapé</h2>
            <textarea className={`${inputClass} h-[80px] resize-none`} value={dados.rodape || ''} onChange={(e) => setDados((d) => ({ ...d, rodape: e.target.value }))} />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 text-white font-bold uppercase text-base border-none cursor-pointer rounded-[5px] disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            {enviando ? 'SALVANDO...' : 'SALVAR CONFIGURAÇÕES'}
          </button>
        </form>
      </div>
    </div>
  );
}
