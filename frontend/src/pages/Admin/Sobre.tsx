import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { sobreApi } from '../../api/sobre';
import { invalidateSobre } from '../../hooks/useSobre';
import { SobreDados } from '../../types';
import FormSobre from './sections/sobre/FormSobre';

export default function AdminSobre() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useAuth();
  const [dados, setDados] = useState<SobreDados>({});
  const [msg, setMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => { if (!loading && !isLoggedIn) navigate('/login'); }, [isLoggedIn, loading]);
  useEffect(() => { sobreApi.getDados().then(setDados); }, []);

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

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {msg && <div className="fixed top-5 right-5 bg-green-500 text-white px-5 py-3 rounded-[8px] z-50">{msg}</div>}

      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <span className="text-lg font-bold">Configurações da Loja</span>
        <Link to="/admin" className="text-white no-underline text-sm hover:text-[#00aaff]">← Painel</Link>
      </div>

      <div className="max-w-[900px] mx-auto py-8 px-5">
        <FormSobre dados={dados} onSetField={setField} onSetDados={setDados} onSubmit={handleSalvar} enviando={enviando} />
      </div>
    </div>
  );
}
