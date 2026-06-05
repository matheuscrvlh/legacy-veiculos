interface Props {
  imagens: string[];
  nome: string;
  folder: 'vehicles' | 'vehiclesSold';
  imgAtiva: number;
  onSelect: (i: number) => void;
  soldOverlay?: boolean;
}

export default function GaleriaVeiculo({ imagens, nome, folder, imgAtiva, onSelect, soldOverlay }: Props) {
  return (
    <div className="flex-1">
      {/* Imagem principal — proporção 3:4 */}
      <div className="relative w-full aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
        <img
          src={imagens[imgAtiva] ? `/uploads/${folder}/${imagens[imgAtiva]}` : '/icons/veiculos/semimagem.png'}
          alt={nome}
          className={`w-full h-full object-cover ${soldOverlay ? 'opacity-60' : ''}`}
        />
        {soldOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-2xl bg-black/60 px-8 py-3 tracking-widest uppercase">VENDIDO</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {imagens.length > 1 && (
        <div className="flex gap-[3px] mt-[3px]">
          {imagens.map((img, i) => (
            <div
              key={img}
              onClick={() => onSelect(i)}
              className={`aspect-[3/4] bg-[#1a1a1a] overflow-hidden cursor-pointer flex-1 transition-opacity ${
                imgAtiva === i ? 'opacity-100 outline outline-2 outline-offset-0' : 'opacity-40 hover:opacity-70'
              }`}
              style={imgAtiva === i ? { outlineColor: 'var(--cor-primaria)' } : {}}
            >
              <img
                src={`/uploads/${folder}/${img}`}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
