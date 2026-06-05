import { useState } from 'react';
import type { ReactNode } from 'react';
import { clientesApi } from '../../../../api/clientes';
import ImageUploader from '../../../../components/ImageUploader';

interface Props { whatsappLink?: string; }

interface FormData {
  nome: string; marca: string; categoria: string; cambio: string; cor: string;
  portas: string; km: string; ano: string; combustivel: string;
  valorFipe: string; valorDesejado: string; placa: string;
  cidade: string; bairro: string; observacao: string;
  gnv: string; infoGnv: string; leilao: string; infoLeilao: string;
  anuncio: string; infoAnuncio: string;
  nomeCliente: string; emailCliente: string;
  ddi: string; ddd: string; telefone: string;
}

type FormErrors = Partial<Record<keyof FormData | 'imagens', string>>;

const ANO_ATUAL = new Date().getFullYear();

const formInicial: FormData = {
  nome: '', marca: '', categoria: '', cambio: '', cor: '', portas: '', km: '', ano: '', combustivel: '',
  valorFipe: '', valorDesejado: '', placa: '', cidade: '', bairro: '', observacao: '',
  gnv: '', infoGnv: '', leilao: '', infoLeilao: '', anuncio: '', infoAnuncio: '',
  nomeCliente: '', emailCliente: '', ddi: '55', ddd: '', telefone: '',
};

const toggleFields: { field: keyof FormData; infoField: keyof FormData; label: string; infoPlaceholder: string }[] = [
  { field: 'gnv', infoField: 'infoGnv', label: 'O veículo tem ou já teve GNV?', infoPlaceholder: 'Descreva as informações sobre o GNV' },
  { field: 'leilao', infoField: 'infoLeilao', label: 'O veículo já foi de leilão?', infoPlaceholder: 'Descreva as informações sobre o leilão' },
  { field: 'anuncio', infoField: 'infoAnuncio', label: 'Já anunciou em alguma loja?', infoPlaceholder: 'Descreva em qual loja foi anunciado' },
];

function validar(form: FormData, imagens: File[]): FormErrors {
  const e: FormErrors = {};
  if (!form.nome.trim()) e.nome = 'Campo obrigatório';
  if (!form.marca.trim()) e.marca = 'Campo obrigatório';
  if (form.ano && (Number(form.ano) < 1960 || Number(form.ano) > ANO_ATUAL + 1))
    e.ano = `Informe entre 1960 e ${ANO_ATUAL + 1}`;
  if (form.km && Number(form.km) < 0) e.km = 'KM não pode ser negativo';
  if (form.placa && !/^[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}$/i.test(form.placa.replace(/[-\s]/g, '')))
    e.placa = 'Placa inválida (ex: ABC1234 ou ABC1D23)';
  if (!form.nomeCliente.trim()) e.nomeCliente = 'Campo obrigatório';
  if (!form.emailCliente.trim()) e.emailCliente = 'Campo obrigatório';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailCliente)) e.emailCliente = 'E-mail inválido';
  if (!form.ddd.trim()) e.ddd = 'Obrigatório';
  else if (!/^\d{2}$/.test(form.ddd)) e.ddd = '2 dígitos';
  if (!form.telefone.trim()) e.telefone = 'Campo obrigatório';
  else if (form.telefone.replace(/\D/g, '').length < 8) e.telefone = 'Mínimo 8 dígitos';
  if (imagens.length === 0) e.imagens = 'Adicione ao menos uma imagem';
  return e;
}

function Field({ id, label, required, error, children }: { id?: string; label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div id={id} className="flex flex-col gap-1">
      <label className="text-[0.7rem] font-bold text-[#666] uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function SectionCard({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f0f0] bg-[#fafafa]">
        <span
          className="w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--cor-primaria)' }}
        >
          {number}
        </span>
        <span className="font-bold text-[#222]">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function FormConsignado({ whatsappLink }: Props) {
  const [form, setForm] = useState<FormData>(formInicial);
  const [imagens, setImagens] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function handleImagens(imgs: File[]) {
    setImagens(imgs);
    if (imgs.length > 0) setErrors((e) => { const n = { ...e }; delete n.imagens; return n; });
  }

  async function handleEnviar() {
    const erros = validar(form, imagens);
    if (Object.keys(erros).length > 0) {
      setErrors(erros);
      const firstKey = Object.keys(erros)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setEnviando(true);
    setErroGeral('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (['ddi', 'ddd', 'telefone'].includes(k)) return;
        fd.append(k, v);
      });
      fd.append('telefoneCliente', `+${form.ddi}${form.ddd}${form.telefone}`);
      imagens.forEach((img) => fd.append('imagens', img));
      await clientesApi.enviarConsignado(fd);
      setEnviado(true);
      setForm(formInicial);
      setImagens([]);
    } catch {
      setErroGeral('Erro ao enviar. Tente novamente mais tarde.');
    } finally {
      setEnviando(false);
    }
  }

  const inp = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${
      hasError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-[#ddd] bg-white focus:border-[#888]'
    }`;

  const sel = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer transition-colors ${
      hasError ? 'border-red-400 bg-red-50' : 'border-[#ddd] bg-white focus:border-[#888]'
    }`;

  return (
    <>
      {/* Modal de sucesso */}
      {enviado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-[440px] w-full text-center shadow-2xl">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--cor-primaria)' }}
            >
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <p className="text-lg font-bold text-[#222] mb-2">Veículo enviado com sucesso!</p>
            <p className="text-sm text-[#666] mb-1">Nossa equipe irá analisar em breve.</p>
            <p className="text-sm text-[#666]">Também pode nos informar pelo WhatsApp para agilizar!</p>
            <div className="flex gap-3 justify-center mt-6">
              <button
                type="button"
                onClick={() => setEnviado(false)}
                className="px-5 py-2 border border-[#ddd] rounded-lg text-sm font-medium text-[#555] hover:bg-[#f5f5f5] cursor-pointer transition-colors bg-white"
              >
                Fechar
              </button>
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  <button
                    type="button"
                    className="px-5 py-2 text-white text-sm font-bold rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    Enviar pelo WhatsApp
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast de erro geral */}
      {erroGeral && (
        <div className="fixed top-5 right-5 bg-red-500 text-white text-sm px-4 py-3 rounded-xl z-50 flex items-center gap-3 shadow-lg max-w-[320px]">
          <span className="flex-1">{erroGeral}</span>
          <button type="button" onClick={() => setErroGeral('')} className="font-bold cursor-pointer bg-transparent border-none text-white flex-shrink-0">✕</button>
        </div>
      )}

      {/* Cabeçalho da página */}
      <div className="text-center mb-8">
        <h1 className="text-[2rem] font-extrabold text-[#1a1a1a] leading-none tracking-tight max-lg:text-[1.5rem]">
          Venda seu veículo aqui
        </h1>
        <p className="text-sm text-[#999] mt-2">Preencha o formulário e nossa equipe entrará em contato</p>
      </div>

      <div className="flex flex-col gap-5">

        {/* Seção 1 — Dados do Veículo */}
        <SectionCard number={1} title="Dados do Veículo">
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

            <Field id="field-nome" label="Nome do Veículo" required error={errors.nome}>
              <input type="text" placeholder="Ex: Onix LTZ" className={inp(!!errors.nome)} value={form.nome} onChange={(e) => set('nome', e.target.value)} />
            </Field>

            <Field id="field-marca" label="Marca" required error={errors.marca}>
              <input type="text" placeholder="Ex: Chevrolet" className={inp(!!errors.marca)} value={form.marca} onChange={(e) => set('marca', e.target.value)} />
            </Field>

            <Field label="Categoria" error={errors.categoria}>
              <input type="text" placeholder="Ex: Hatch, Sedan, SUV" className={inp(!!errors.categoria)} value={form.categoria} onChange={(e) => set('categoria', e.target.value)} />
            </Field>

            <Field label="Cor" error={errors.cor}>
              <input type="text" placeholder="Ex: Prata" className={inp(!!errors.cor)} value={form.cor} onChange={(e) => set('cor', e.target.value)} />
            </Field>

            <Field label="Câmbio" error={errors.cambio}>
              <select className={sel(!!errors.cambio)} value={form.cambio} onChange={(e) => set('cambio', e.target.value)}>
                <option value="">Selecione</option>
                <option>Manual</option>
                <option>Automático</option>
                <option>CVT</option>
                <option>Automatizado</option>
              </select>
            </Field>

            <Field label="Combustível" error={errors.combustivel}>
              <select className={sel(!!errors.combustivel)} value={form.combustivel} onChange={(e) => set('combustivel', e.target.value)}>
                <option value="">Selecione</option>
                <option>Gasolina</option>
                <option>Etanol</option>
                <option>Flex</option>
                <option>Diesel</option>
                <option>Elétrico</option>
                <option>Híbrido</option>
                <option>GNV</option>
              </select>
            </Field>

            <Field label="Portas" error={errors.portas}>
              <select className={sel(!!errors.portas)} value={form.portas} onChange={(e) => set('portas', e.target.value)}>
                <option value="">Selecione</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </Field>

            <Field id="field-ano" label="Ano" error={errors.ano}>
              <input
                type="number"
                placeholder={`Ex: ${ANO_ATUAL}`}
                min={1960}
                max={ANO_ATUAL + 1}
                className={inp(!!errors.ano)}
                value={form.ano}
                onChange={(e) => set('ano', e.target.value)}
              />
            </Field>

            <Field id="field-km" label="Quilometragem (KM)" error={errors.km}>
              <input
                type="number"
                placeholder="Ex: 45000"
                min={0}
                className={inp(!!errors.km)}
                value={form.km}
                onChange={(e) => set('km', e.target.value)}
              />
            </Field>

            <Field id="field-placa" label="Placa" error={errors.placa}>
              <input
                type="text"
                placeholder="Ex: ABC1234"
                maxLength={8}
                className={`${inp(!!errors.placa)} uppercase`}
                value={form.placa}
                onChange={(e) => set('placa', e.target.value.toUpperCase())}
              />
            </Field>

            <Field label="Valor FIPE (R$)" error={errors.valorFipe}>
              <input type="text" placeholder="Ex: 45.000" className={inp(!!errors.valorFipe)} value={form.valorFipe} onChange={(e) => set('valorFipe', e.target.value)} />
            </Field>

            <Field label="Valor Desejado (R$)" error={errors.valorDesejado}>
              <input type="text" placeholder="Ex: 43.000" className={inp(!!errors.valorDesejado)} value={form.valorDesejado} onChange={(e) => set('valorDesejado', e.target.value)} />
            </Field>

            <Field label="Cidade" error={errors.cidade}>
              <input type="text" placeholder="Ex: São Paulo" className={inp(!!errors.cidade)} value={form.cidade} onChange={(e) => set('cidade', e.target.value)} />
            </Field>

            <Field label="Bairro" error={errors.bairro}>
              <input type="text" placeholder="Ex: Centro" className={inp(!!errors.bairro)} value={form.bairro} onChange={(e) => set('bairro', e.target.value)} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Observações" error={errors.observacao}>
              <textarea
                placeholder="Alguma informação adicional sobre o veículo..."
                rows={3}
                className={`${inp(!!errors.observacao)} resize-none`}
                value={form.observacao}
                onChange={(e) => set('observacao', e.target.value)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* Seção 2 — Informações Adicionais */}
        <SectionCard number={2} title="Informações Adicionais">
          <div className="flex flex-col gap-5">
            {toggleFields.map(({ field, infoField, label, infoPlaceholder }) => (
              <div key={field}>
                <p className="text-sm font-semibold text-[#333] mb-2">{label}</p>
                <div className="flex gap-2">
                  {(['sim', 'nao'] as const).map((v) => {
                    const selected = form[field] === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        className={`px-5 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                          selected ? 'text-white border-transparent' : 'text-[#666] border-[#ddd] hover:border-[#aaa] bg-white'
                        }`}
                        style={selected ? { backgroundColor: 'var(--cor-primaria)', borderColor: 'var(--cor-primaria)' } : {}}
                        onClick={() => set(field, v)}
                      >
                        {v === 'sim' ? 'Sim' : 'Não'}
                      </button>
                    );
                  })}
                </div>
                {form[field] === 'sim' && (
                  <input
                    type="text"
                    placeholder={infoPlaceholder}
                    className={`${inp(false)} mt-3`}
                    value={form[infoField] as string}
                    onChange={(e) => set(infoField, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Seção 3 — Fotos */}
        <SectionCard number={3} title="Fotos do Veículo">
          <div id="field-imagens">
            <ImageUploader imagens={imagens} onChange={handleImagens} error={errors.imagens} />
          </div>
        </SectionCard>

        {/* Seção 4 — Seus Dados */}
        <SectionCard number={4} title="Seus Dados">
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

            <Field id="field-nomeCliente" label="Seu Nome" required error={errors.nomeCliente}>
              <input type="text" placeholder="Nome completo" className={inp(!!errors.nomeCliente)} value={form.nomeCliente} onChange={(e) => set('nomeCliente', e.target.value)} />
            </Field>

            <Field id="field-emailCliente" label="Seu E-mail" required error={errors.emailCliente}>
              <input type="email" placeholder="email@exemplo.com" className={inp(!!errors.emailCliente)} value={form.emailCliente} onChange={(e) => set('emailCliente', e.target.value)} />
            </Field>

            <div id="field-telefone" className="col-span-2 max-sm:col-span-1">
              <Field label="Telefone / WhatsApp" required error={errors.ddd || errors.telefone}>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+DDI"
                    maxLength={3}
                    className="w-[64px] border border-[#ddd] rounded-lg px-2 py-2.5 text-sm outline-none focus:border-[#888] text-center transition-colors"
                    value={form.ddi}
                    onChange={(e) => set('ddi', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  />
                  <input
                    type="tel"
                    placeholder="DDD"
                    maxLength={2}
                    className={`w-[64px] border rounded-lg px-2 py-2.5 text-sm outline-none focus:border-[#888] text-center transition-colors ${errors.ddd ? 'border-red-400 bg-red-50' : 'border-[#ddd]'}`}
                    value={form.ddd}
                    onChange={(e) => set('ddd', e.target.value.replace(/\D/g, '').slice(0, 2))}
                  />
                  <input
                    type="tel"
                    placeholder="Número"
                    maxLength={9}
                    className={`flex-1 border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#888] transition-colors ${errors.telefone ? 'border-red-400 bg-red-50' : 'border-[#ddd]'}`}
                    value={form.telefone}
                    onChange={(e) => set('telefone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                  />
                </div>
              </Field>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEnviar}
            disabled={enviando}
            className="w-full mt-6 py-3 text-white font-bold text-base rounded-xl border-none cursor-pointer disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            {enviando ? 'Enviando...' : 'Enviar para Avaliação'}
          </button>
        </SectionCard>
      </div>
    </>
  );
}
