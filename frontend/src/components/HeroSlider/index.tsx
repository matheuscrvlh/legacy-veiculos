import { useState, useEffect, useRef } from 'react';

interface Props {
  imagens: string[];
}

export default function HeroSlider({ imagens }: Props) {
  const [indice, setIndice] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (imagens.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagens.length);
    }, 5000);
  }

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [imagens]);

  function avancar() {
    setIndice((prev) => (prev + 1) % imagens.length);
    resetTimer();
  }

  function retornar() {
    setIndice((prev) => (prev - 1 + imagens.length) % imagens.length);
    resetTimer();
  }

  if (imagens.length === 0) {
    return <div className="w-full h-[450px] max-lg:h-[300px] bg-gray-200" />;
  }

  return (
    <div className="relative">
      <div className="w-full h-[450px] max-lg:h-[300px] bg-black overflow-hidden">
        <img
          key={indice}
          src={`/uploads/bannersMain/${imagens[indice]}`}
          alt="Destaque"
          className="absolute top-0 left-0 w-full h-full object-cover object-right"
        />
      </div>
      {imagens.length > 1 && (
        <div className="absolute flex justify-between text-center top-[170px] max-lg:top-[110px] w-full px-[10px] z-[4]">
          <button
            onClick={retornar}
            className="text-[20px] text-white px-[10px] py-[10px] rounded-[20px] border-none cursor-pointer transition-all duration-300"
            style={{ backgroundColor: 'rgba(0,0,0,0.32)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cor-primaria)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.32)')}
          >
            ◀
          </button>
          <button
            onClick={avancar}
            className="text-[20px] text-white px-[10px] py-[10px] rounded-[20px] border-none cursor-pointer transition-all duration-300"
            style={{ backgroundColor: 'rgba(0,0,0,0.32)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--cor-primaria)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.32)')}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
