import { useState } from 'react';
import { clientesApi } from '../../api/clientes';
import { useSobre } from '../../hooks/useSobre';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WhatsAppButton from '../../components/WhatsAppButton';
import ContatoSection from '../../components/ContatoSection';
import LocalizacaoSection from '../../components/LocalizacaoSection';

interface FormData {
  nome: string; marca: string; categoria: string; cambio: string; cor: string;
  portas: string; km: string; ano: string; combustivel: string;
  valorFipe: string; valorDesejado: string; placa: string;
  cidade: string; bairro: string; observacao: string;
  gnv: string; infoGnv: string;
  leilao: string; infoLeilao: string;
  anuncio: string; infoAnuncio: string;
  nomeCliente: string; emailCliente: string;
  ddi: string; ddd: string; telefone: string;
}

const formInicial: FormData = {
  nome: '', marca: '', categoria: '', cambio: '', cor: '', portas: '', km: '', ano: '', combustivel: '',
  valorFipe: '', valorDesejado: '', placa: '', cidade: '', bairro: '', observacao: '',
  gnv: '', infoGnv: '', leilao: '', infoLeilao: '', anuncio: '', infoAnuncio: '',
  nomeCliente: '', emailCliente: '', ddi: '55', ddd: '', telefone: '',
};

export default function Consignado() {
  const { dados } = useSobre();
  const [form, setForm] = useState<FormData>(formInicial);
  const [imagens, setImagens] = useState<File[]>([]);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleChange(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleEnviar() {
    if (!form.nome || !form.marca || !form.nomeCliente || !form.emailCliente || imagens.length === 0) {
      setErro('Preencha todos os campos obrigatórios e adicione ao menos uma imagem.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'ddi' || k === 'ddd' || k === 'telefone') return;
        fd.append(k, v);
      });
      fd.append('telefoneCliente', `+${form.ddi}${form.ddd}${form.telefone}`);
      imagens.forEach((img) => fd.append('imagens', img));

      await clientesApi.enviarConsignado(fd);
      setEnviado(true);
      setForm(formInicial);
      setImagens([]);
    } catch {
      setErro('Erro ao enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  const inputClass = "w-full border border-[#ccc] rounded-[3px] px-3 py-2 text-base outline-none focus:border-[#ff5722]";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <WhatsAppButton />

        {enviado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-[10px] p-8 max-w-[500px] w-[90%] text-center">
              <p className="text-[1.2rem] font-bold mb-2">Seu veículo foi enviado!</p>
              <p className="text-[#535353] mb-2">Pode também nos informar por Whatsapp!</p>
              <p className="text-[#535353] mb-2">Assim, nosso time pode verificar mais rápido.</p>
              <div className="flex gap-3 justify-center mt-5">
                <button onClick={() => setEnviado(false)} className="px-5 py-2 border border-[#ccc] rounded-[5px] cursor-pointer bg-white">Fechar</button>
                {dados.whatsapp?.link && (
                  <a href={dados.whatsapp.link} target="_blank" rel="noreferrer">
                    <button className="px-5 py-2 text-white rounded-[5px] cursor-pointer border-none" style={{ backgroundColor: '#25D366' }}>Enviar por WhatsApp</button>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {erro && (
          <div className="fixed top-5 right-5 bg-red-500 text-white px-5 py-3 rounded-[8px] z-50">
            {erro}
            <button onClick={() => setErro('')} className="ml-3 font-bold cursor-pointer bg-transparent border-none text-white">×</button>
          </div>
        )}

        <div className="max-w-[900px] mx-auto px-5 py-[30px]">
          <div className="text-center mb-8">
            <h1 className="text-[2rem] font-bold text-[#333] max-lg:text-[1.5rem]">Venda seu veículo aqui!</h1>
            <h3 className="text-base text-[#535353]">Seu carro merece a melhor oferta. Venda aqui!</h3>
          </div>

          <div className="flex gap-[30px] max-lg:flex-col">
            {/* Vehicle form */}
            <div className="flex-1">
              <p className="text-[1.2rem] font-bold text-[#333] mb-4">Formulário de Envio</p>
              <div className="flex flex-col gap-3">
                {[
                  { field: 'nome', placeholder: 'Nome do Veículo' },
                  { field: 'marca', placeholder: 'Marca do Veículo' },
                  { field: 'categoria', placeholder: 'Categoria do Veículo' },
                  { field: 'cambio', placeholder: 'Câmbio do Veículo' },
                  { field: 'cor', placeholder: 'Cor do Veículo' },
                  { field: 'combustivel', placeholder: 'Combustível do Veículo' },
                ].map(({ field, placeholder }) => (
                  <input key={field} type="text" placeholder={placeholder} className={inputClass}
                    value={form[field as keyof FormData]}
                    onChange={(e) => handleChange(field as keyof FormData, e.target.value)} />
                ))}
                {[
                  { field: 'portas', placeholder: 'Portas do Veículo' },
                  { field: 'km', placeholder: 'KM do Veículo' },
                  { field: 'ano', placeholder: 'Ano do Veículo' },
                ].map(({ field, placeholder }) => (
                  <input key={field} type="number" placeholder={placeholder} className={inputClass}
                    value={form[field as keyof FormData]}
                    onChange={(e) => handleChange(field as keyof FormData, e.target.value)} />
                ))}
                <input type="text" placeholder="Valor FIPE" className={inputClass} value={form.valorFipe} onChange={(e) => handleChange('valorFipe', e.target.value)} />
                <input type="text" placeholder="Valor Desejado" className={inputClass} value={form.valorDesejado} onChange={(e) => handleChange('valorDesejado', e.target.value)} />
                <input type="text" placeholder="Placa do Veículo" className={inputClass} value={form.placa} onChange={(e) => handleChange('placa', e.target.value)} />
                <input type="text" placeholder="Cidade" className={inputClass} value={form.cidade} onChange={(e) => handleChange('cidade', e.target.value)} />
                <input type="text" placeholder="Bairro" className={inputClass} value={form.bairro} onChange={(e) => handleChange('bairro', e.target.value)} />
                <input type="text" placeholder="Observação" className={inputClass} value={form.observacao} onChange={(e) => handleChange('observacao', e.target.value)} />

                {/* GNV */}
                <div>
                  <p className="text-[0.9rem] font-bold mb-1">Este veículo tem ou já teve Combustível GNV?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gnv" value="sim" checked={form.gnv === 'sim'} onChange={() => handleChange('gnv', 'sim')} /> Sim</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gnv" value="nao" checked={form.gnv === 'nao'} onChange={() => handleChange('gnv', 'nao')} /> Não</label>
                  </div>
                  {form.gnv === 'sim' && <input type="text" placeholder="Informações sobre GNV" className={`${inputClass} mt-2`} value={form.infoGnv} onChange={(e) => handleChange('infoGnv', e.target.value)} />}
                </div>

                {/* Leilão */}
                <div>
                  <p className="text-[0.9rem] font-bold mb-1">Este veículo já foi de leilão?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="leilao" value="sim" checked={form.leilao === 'sim'} onChange={() => handleChange('leilao', 'sim')} /> Sim</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="leilao" value="nao" checked={form.leilao === 'nao'} onChange={() => handleChange('leilao', 'nao')} /> Não</label>
                  </div>
                  {form.leilao === 'sim' && <input type="text" placeholder="Informações sobre leilão" className={`${inputClass} mt-2`} value={form.infoLeilao} onChange={(e) => handleChange('infoLeilao', e.target.value)} />}
                </div>

                {/* Anúncio */}
                <div>
                  <p className="text-[0.9rem] font-bold mb-1">Já o anunciou em alguma loja?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="anuncio" value="sim" checked={form.anuncio === 'sim'} onChange={() => handleChange('anuncio', 'sim')} /> Sim</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="anuncio" value="nao" checked={form.anuncio === 'nao'} onChange={() => handleChange('anuncio', 'nao')} /> Não</label>
                  </div>
                  {form.anuncio === 'sim' && <input type="text" placeholder="Informações sobre anúncio" className={`${inputClass} mt-2`} value={form.infoAnuncio} onChange={(e) => handleChange('infoAnuncio', e.target.value)} />}
                </div>

                <div>
                  <label className="text-[0.9rem] font-bold mb-1 block">Imagens do Veículo</label>
                  <input type="file" multiple accept="image/*" className="w-full"
                    onChange={(e) => setImagens(Array.from(e.target.files ?? []))} />
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="w-[300px] max-lg:w-full">
              <p className="text-[1.2rem] font-bold text-[#333] mb-4">Dados Pessoais</p>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Seu Nome" className={inputClass} value={form.nomeCliente} onChange={(e) => handleChange('nomeCliente', e.target.value)} />
                <input type="text" placeholder="Seu Email" className={inputClass} value={form.emailCliente} onChange={(e) => handleChange('emailCliente', e.target.value)} />
                <div className="flex gap-2">
                  <input type="number" placeholder="DDI" className="w-[60px] border border-[#ccc] rounded-[3px] px-2 py-2 outline-none" value={form.ddi} onChange={(e) => handleChange('ddi', e.target.value)} />
                  <input type="number" placeholder="DDD" className="w-[70px] border border-[#ccc] rounded-[3px] px-2 py-2 outline-none" value={form.ddd} onChange={(e) => handleChange('ddd', e.target.value)} />
                  <input type="number" placeholder="Telefone" className="flex-1 border border-[#ccc] rounded-[3px] px-2 py-2 outline-none" value={form.telefone} onChange={(e) => handleChange('telefone', e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={handleEnviar}
                  disabled={enviando}
                  className="w-full py-3 text-white font-bold uppercase text-base border-none cursor-pointer rounded-[5px] mt-3 disabled:opacity-60"
                  style={{ backgroundColor: 'var(--cor-botao)' }}
                >
                  {enviando ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <ContatoSection />
        <LocalizacaoSection />
      </main>
      <Footer />
    </div>
  );
}
