import { useSobre } from '../../hooks/useSobre';

export default function LocalizacaoSection() {
  const { dados } = useSobre();
  const loc = dados.localizacao;

  if (!loc) return null;

  return (
    <div className="px-[30px] max-w-[80vw] w-[1600px] mx-auto my-[10px] flex flex-row justify-between gap-[30px] max-[1500px]:max-w-full max-lg:flex-col max-lg:items-center max-lg:max-w-full">
      <div className="w-[600px] text-left max-lg:w-[80vw]">
        <div className="text-[1.5rem] font-bold uppercase text-[#333] text-center mt-[30px] mb-[70px] max-lg:text-[1.2rem] max-lg:w-[80vw] max-[500px]:mt-[30px] max-[500px]:mb-[30px]">
          <p className="text-[60px] font-light text-left mt-[-30px] p-0 max-[500px]:text-[2.5rem]">CONFIRA</p>
          <p className="text-[60px] font-bold text-left mt-[-30px] p-0 max-[500px]:text-[2.5rem]" style={{ color: 'var(--cor-primaria)' }}>NOSSA</p>
          <p className="text-[60px] font-light text-left mt-[-30px] p-0 max-[500px]:text-[2.5rem]">LOCALIZAÇÃO</p>
        </div>
        <div className="mt-[20px]">
          <h2 className="text-[1.2rem] font-bold text-[#333] mb-[5px]">Endereço:</h2>
          <h3 className="text-base text-[#666] mb-[20px]">{loc.endereco || 'Endereço não disponível'}</h3>
          <h2 className="text-[1.2rem] font-bold text-[#333] mb-[5px]">Horário de atendimento:</h2>
          <h3 className="text-base text-[#666] mb-[20px]">{loc.horario || 'Horário não disponível'}</h3>
        </div>
      </div>
      <div>
        {loc.mapa && (
          <iframe
            src={loc.mapa}
            className="w-[50vw] h-[500px] border-none max-lg:w-[80vw] max-lg:h-[300px]"
            allowFullScreen
            title="Localização"
          />
        )}
      </div>
    </div>
  );
}
