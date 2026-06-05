import { useRef, useEffect, useState } from 'react';

interface Props {
  imagens: File[];
  onChange: (imagens: File[]) => void;
  error?: string;
}

export default function ImageUploader({ imagens, onChange, error }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cria URLs de preview e revoga as antigas para evitar memory leak
  useEffect(() => {
    const urls = imagens.map((img) => URL.createObjectURL(img));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imagens]);

  function add(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    if (!imgs.length) return;
    onChange([...imagens, ...imgs]);
  }

  function remove(idx: number) {
    onChange(imagens.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...imagens];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  const dropProps = {
    onDrop: (e: React.DragEvent) => { e.preventDefault(); add(Array.from(e.dataTransfer.files)); },
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => { add(Array.from(e.target.files ?? [])); e.target.value = ''; }}
      />

      {imagens.length === 0 ? (
        <div
          {...dropProps}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors select-none ${
            error ? 'border-red-300 bg-red-50' : 'border-[#e0e0e0] hover:border-[#999] bg-[#fafafa]'
          }`}
        >
          <svg
            className="w-8 h-8 mx-auto mb-2"
            style={{ color: error ? '#f87171' : '#ccc' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className={`text-sm font-semibold ${error ? 'text-red-500' : 'text-[#666]'}`}>
            Clique ou arraste as fotos aqui
          </p>
          <p className="text-xs text-[#aaa] mt-1">JPG, PNG, WEBP — múltiplas imagens</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 max-sm:grid-cols-3">
          {imagens.map((_img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5] group"
            >
              <img
                src={previewUrls[idx] ?? ''}
                className="w-full h-full object-cover"
                alt={`Foto ${idx + 1}`}
              />

              {/* Badge capa */}
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1.5 py-0.5 rounded leading-none uppercase tracking-wide">
                  Capa
                </span>
              )}

              {/* Número da posição */}
              {idx > 0 && (
                <span className="absolute top-1 left-1 bg-black/50 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {idx + 1}
                </span>
              )}

              {/* Botão excluir — sempre visível */}
              <button
                type="button"
                title="Remover"
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center transition-colors shadow-sm"
                onClick={() => remove(idx)}
              >
                ✕
              </button>

              {/* Controles de ordem — aparecem no hover */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/55 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Mover para esquerda"
                  disabled={idx === 0}
                  className="w-6 h-6 text-white text-sm flex items-center justify-center hover:bg-white/20 rounded transition-colors disabled:opacity-25"
                  onClick={() => move(idx, -1)}
                >
                  ‹
                </button>
                <span className="text-white/60 text-[9px]">{idx + 1}/{imagens.length}</span>
                <button
                  type="button"
                  title="Mover para direita"
                  disabled={idx === imagens.length - 1}
                  className="w-6 h-6 text-white text-sm flex items-center justify-center hover:bg-white/20 rounded transition-colors disabled:opacity-25"
                  onClick={() => move(idx, 1)}
                >
                  ›
                </button>
              </div>
            </div>
          ))}

          {/* Célula para adicionar mais */}
          <div
            {...dropProps}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-[#e0e0e0] hover:border-[#999] bg-[#fafafa] flex flex-col items-center justify-center cursor-pointer transition-colors gap-0.5 select-none"
          >
            <span className="text-[#ccc] text-2xl font-light leading-none">+</span>
            <span className="text-[#ccc] text-[9px] uppercase tracking-wide">Adicionar</span>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
