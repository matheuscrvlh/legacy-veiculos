import { useState } from 'react';
import type { ReactNode } from 'react';
import { veiculosApi } from '../../../../api/veiculos';
import ImageUploader from '../../../../components/ImageUploader';
import { Veiculo } from '../../../../types';

interface Props {
  veiculo: Veiculo;
  onSuccess: () => void;
  onCancelar: () => void;
}

interface FormFields {
  nome: string; modelo: string; marca: string; categoria: string;
  combustivel: string; cambio: string; cor: string; portas: string;
  km: string; sobre: string; opcionais: string; ano: string;
  valor: string; tipoVeiculo: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

const ANO_ATUAL = new Date().getFullYear();

function applyKmMask(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('pt-BR');
}

function applyValorMask(raw: string): string {
  const cleaned = raw.replace(/[^\d,.]/g, '');
  if (!cleaned) return '';
  const hasComma = cleaned.includes(',');
  if (hasComma) {
    const [intPart, decPart = ''] = cleaned.split(',');
    const digits = intPart.replace(/\D/g, '');
    const int = digits ? parseInt(digits, 10).toLocaleString('pt-BR') : '0';
    return `${int},${decPart.slice(0, 2)}`;
  }
  const digits = cleaned.replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('pt-BR');
}

function formatValorBlur(raw: string): string {
  if (!raw) return '';
  const normalized = raw.replace(/\./g, '').replace(',', '.');
  const n = parseFloat(normalized);
  if (isNaN(n)) return raw;
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBR(str: string): number {
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

function validar(form: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!form.nome.trim()) e.nome = 'Campo obrigatório';
  if (!form.marca.trim()) e.marca = 'Campo obrigatório';
  if (!form.ano.trim()) {
    e.ano = 'Campo obrigatório';
  } else {
    const ano = Number(form.ano);
    if (!Number.isInteger(ano) || ano < 1960 || ano > ANO_ATUAL + 1)
      e.ano = `Informe entre 1960 e ${ANO_ATUAL + 1}`;
  }
  if (form.km.trim() === '') {
    e.km = 'Campo obrigatório';
  } else {
    const km = parseInt(form.km.replace(/\./g, ''), 10);
    if (isNaN(km) || km < 0) e.km = 'KM inválido';
  }
  if (!form.valor.trim()) {
    e.valor = 'Campo obrigatório';
  } else {
    const v = parseBR(form.valor);
    if (isNaN(v) || v <= 0) e.valor = 'Valor inválido';
  }
  return e;
}

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.68rem] font-bold text-[#666] uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error
        ? <p className="text-xs text-red-500 mt-0.5">{error}</p>
        : hint && <p className="text-xs text-[#aaa] mt-0.5">{hint}</p>
      }
    </div>
  );
}

function Divider({ title }: { title: string }) {
  return (
    <div className="col-span-2 flex items-center gap-3 mt-1 max-lg:col-span-1">
      <span className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-widest whitespace-nowrap">{title}</span>
      <div className="flex-1 border-t border-[#f0f0f0]" />
    </div>
  );
}

export default function EditarForm({ veiculo, onSuccess, onCancelar }: Props) {
  const kmFormatado = veiculo.Km != null ? veiculo.Km.toLocaleString('pt-BR') : '';

  const [form, setForm] = useState<FormFields>({
    nome: veiculo.Nome,
    modelo: veiculo.Modelo,
    marca: veiculo.Marca,
    categoria: veiculo.Categoria,
    combustivel: veiculo.Combustivel,
    cambio: veiculo.Cambio,
    cor: veiculo.Cor,
    portas: veiculo.Portas ? String(veiculo.Portas) : '',
    km: kmFormatado,
    sobre: veiculo.Sobre,
    opcionais: veiculo.Opcionais,
    ano: veiculo.Ano ? String(veiculo.Ano) : '',
    valor: veiculo.Valor,
    tipoVeiculo: veiculo.TipoVeiculo || 'Usado',
  });

  const [imagensExistentes, setImagensExistentes] = useState<string[]>(veiculo.Imagens);
  const [imagensNovas, setImagensNovas] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  function set(field: keyof FormFields, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  function removerExistente(filename: string) {
    setImagensExistentes((prev) => prev.filter((f) => f !== filename));
  }

  function moverExistente(idx: number, dir: -1 | 1) {
    const next = [...imagensExistentes];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setImagensExistentes(next);
  }

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    const erros = validar(form);
    if (Object.keys(erros).length > 0) {
      setErrors(erros);
      setErroGeral('Corrija os campos obrigatórios antes de salvar.');
      return;
    }
    setErroGeral('');
    if (imagensExistentes.length === 0 && imagensNovas.length === 0) {
      setErroGeral('Adicione ao menos uma imagem.');
      return;
    }
    setEnviando(true);
    setErroGeral('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'km') fd.append(k, v.replace(/\./g, ''));
        else fd.append(k, v);
      });
      fd.append('imagensExistentes', JSON.stringify(imagensExistentes));
      imagensNovas.forEach((img) => fd.append('imagens', img));
      await veiculosApi.editar(veiculo.ID, fd);
      onSuccess();
    } catch {
      setErroGeral('Erro ao salvar veículo. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  const inp = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
      hasError ? 'border-red-400 bg-red-50 focus:border-red-500' : 'border-[#e0e0e0] bg-white focus:border-[#888]'
    }`;

  const sel = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none cursor-pointer transition-colors ${
      hasError ? 'border-red-400 bg-red-50' : 'border-[#e0e0e0] bg-white focus:border-[#888]'
    }`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#ebebeb] p-6 max-w-[760px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#222]">Editar Veículo</h2>
          <p className="text-xs text-[#aaa] mt-0.5">#{veiculo.CodigoSequencial} · {veiculo.Marca} {veiculo.Nome}</p>
        </div>
        <button
          type="button"
          onClick={onCancelar}
          className="text-sm text-[#888] hover:text-[#444] transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Voltar
        </button>
      </div>

      {erroGeral && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
          <span>{erroGeral}</span>
          <button type="button" onClick={() => setErroGeral('')} className="font-bold ml-3 cursor-pointer bg-transparent border-none text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <form onSubmit={handleEnviar} className="grid grid-cols-2 gap-x-4 gap-y-3 max-lg:grid-cols-1">

        <Divider title="Identificação" />

        <Field label="Nome" required error={errors.nome}>
          <input type="text" placeholder="Ex: Onix LTZ" className={inp(!!errors.nome)} value={form.nome} onChange={(e) => set('nome', e.target.value)} />
        </Field>

        <Field label="Modelo" error={errors.modelo}>
          <input type="text" placeholder="Ex: 1.0 Turbo" className={inp(!!errors.modelo)} value={form.modelo} onChange={(e) => set('modelo', e.target.value)} />
        </Field>

        <Field label="Marca" required error={errors.marca}>
          <input type="text" placeholder="Ex: Chevrolet" className={inp(!!errors.marca)} value={form.marca} onChange={(e) => set('marca', e.target.value)} />
        </Field>

        <Field label="Categoria" error={errors.categoria}>
          <input type="text" placeholder="Ex: Hatch, Sedan, SUV" className={inp(!!errors.categoria)} value={form.categoria} onChange={(e) => set('categoria', e.target.value)} />
        </Field>

        <Divider title="Características" />

        <Field label="Tipo de Veículo">
          <select className={sel(false)} value={form.tipoVeiculo} onChange={(e) => set('tipoVeiculo', e.target.value)}>
            <option value="Usado">Usado</option>
            <option value="Semi-Novo">Semi-Novo</option>
            <option value="Zero Km">Zero Km</option>
          </select>
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

        <Field label="Ano" required error={errors.ano}>
          <input type="number" placeholder={`Ex: ${ANO_ATUAL}`} min={1960} max={ANO_ATUAL + 1} className={inp(!!errors.ano)} value={form.ano} onChange={(e) => set('ano', e.target.value)} />
        </Field>

        <Field label="Quilometragem (KM)" required error={errors.km} hint="Ex: 45.000">
          <input type="text" inputMode="numeric" placeholder="Ex: 45.000" className={inp(!!errors.km)} value={form.km} onChange={(e) => set('km', applyKmMask(e.target.value))} />
        </Field>

        <Field label="Valor (R$)" required error={errors.valor} hint="Ex: 45.000,00">
          <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${errors.valor ? 'border-red-400 bg-red-50' : 'border-[#e0e0e0] bg-white focus-within:border-[#888]'}`}>
            <span className={`px-3 text-sm font-semibold select-none ${errors.valor ? 'text-red-400' : 'text-[#aaa]'}`}>R$</span>
            <input
              type="text" inputMode="decimal" placeholder="0,00"
              className="flex-1 py-2 pr-3 text-sm outline-none bg-transparent"
              value={form.valor}
              onChange={(e) => set('valor', applyValorMask(e.target.value))}
              onBlur={() => set('valor', formatValorBlur(form.valor))}
            />
          </div>
        </Field>

        <Divider title="Descrição" />

        <div className="col-span-2 max-lg:col-span-1">
          <Field label="Sobre o Veículo" error={errors.sobre}>
            <textarea placeholder="Descreva o veículo..." rows={3} className={`${inp(!!errors.sobre)} resize-none`} value={form.sobre} onChange={(e) => set('sobre', e.target.value)} />
          </Field>
        </div>

        <div className="col-span-2 max-lg:col-span-1">
          <Field label="Opcionais" error={errors.opcionais}>
            <textarea placeholder="Ex: Ar-condicionado, câmera de ré..." rows={2} className={`${inp(!!errors.opcionais)} resize-none`} value={form.opcionais} onChange={(e) => set('opcionais', e.target.value)} />
          </Field>
        </div>

        <Divider title="Imagens" />

        <div className="col-span-2 max-lg:col-span-1 flex flex-col gap-3">

          {/* Imagens existentes */}
          {imagensExistentes.length > 0 && (
            <div>
              <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-wide mb-2">Fotos atuais</p>
              <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-3">
                {imagensExistentes.map((filename, idx) => (
                  <div key={filename} className="relative aspect-square rounded-lg overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5] group">
                    <img
                      src={`/uploads/vehicles/${filename}`}
                      className="w-full h-full object-cover object-bottom"
                      alt={`Foto ${idx + 1}`}
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">
                        Capa
                      </span>
                    )}
                    {idx > 0 && (
                      <span className="absolute top-1 left-1 bg-black/50 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {idx + 1}
                      </span>
                    )}
                    <button
                      type="button"
                      title="Remover"
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center transition-colors shadow-sm"
                      onClick={() => removerExistente(filename)}
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/55 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        disabled={idx === 0}
                        className="w-6 h-6 text-white text-sm flex items-center justify-center hover:bg-white/20 rounded transition-colors disabled:opacity-25"
                        onClick={() => moverExistente(idx, -1)}
                      >‹</button>
                      <span className="text-white/60 text-[9px]">{idx + 1}/{imagensExistentes.length}</span>
                      <button
                        type="button"
                        disabled={idx === imagensExistentes.length - 1}
                        className="w-6 h-6 text-white text-sm flex items-center justify-center hover:bg-white/20 rounded transition-colors disabled:opacity-25"
                        onClick={() => moverExistente(idx, 1)}
                      >›</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Novas imagens */}
          <div>
            <p className="text-[0.68rem] font-bold text-[#aaa] uppercase tracking-wide mb-2">
              {imagensExistentes.length > 0 ? 'Adicionar novas fotos' : 'Fotos'}
            </p>
            <ImageUploader imagens={imagensNovas} onChange={setImagensNovas} />
          </div>
        </div>

        <div className="col-span-2 mt-2 flex gap-3 max-lg:col-span-1">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 py-3 border border-[#e0e0e0] text-[#555] font-bold text-sm uppercase rounded-xl cursor-pointer hover:bg-[#f5f5f5] transition-colors bg-white max-sm:py-2 max-sm:text-xs"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="flex-1 py-3 text-white font-bold text-sm uppercase rounded-xl border-none cursor-pointer disabled:opacity-60 hover:opacity-90 transition-opacity max-sm:py-2 max-sm:text-xs"
            style={{ backgroundColor: 'var(--cor-botao)' }}
          >
            {enviando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
