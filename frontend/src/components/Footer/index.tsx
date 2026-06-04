import { Link } from 'react-router-dom';
import { useSobre } from '../../hooks/useSobre';

export default function Footer() {
  const { dados } = useSobre();

  return (
    <footer className="bg-[#232323] text-white py-5 flex flex-col items-center">
      <h2 className="text-[30px] mb-[25px]">Mapa do site</h2>
      <div className="flex justify-center w-full gap-[30px] flex-wrap">
        <ul className="list-none p-0 ml-[90px] w-[200px] flex flex-col items-start">
          <li className="mb-[10px]"><Link to="/" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Página inicial</Link></li>
          <li className="mb-[10px]"><Link to="/quem-somos" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Quem Somos</Link></li>
          <li className="mb-[10px]"><Link to="/estoque" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Estoque</Link></li>
          <li className="mb-[10px]"><Link to="/consignado" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Venda seu Carro</Link></li>
          <li className="mb-[10px]"><Link to="/quem-somos" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Contato</Link></li>
        </ul>
        <ul className="list-none p-0 ml-[90px] w-[200px] flex flex-col items-start">
          <li className="mb-[10px]"><Link to="/quem-somos" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Localização</Link></li>
          <li className="mb-[10px]"><Link to="/vendidos" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Veículos vendidos</Link></li>
          <li className="mb-[10px]"><Link to="#" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Política de privacidade</Link></li>
          <li className="mb-[10px]"><Link to="#" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">Termo de uso</Link></li>
          <li className="mb-[10px]"><Link to="/login" className="text-white no-underline py-[3px] block hover:text-[#00aaff] transition-colors">ADM</Link></li>
        </ul>
      </div>

      <div className="flex flex-col justify-center items-center text-center mt-[60px]">
        <p>DESENVOLVIDO POR</p>
        <a
          href="https://www.mthcode.com.br"
          target="_blank"
          rel="noreferrer"
          className="text-white no-underline text-base font-bold hover:text-[#00aaff]"
        >
          MTHCODE
        </a>
      </div>

      {dados.rodape && (
        <p className="w-full text-left mt-5 p-5 text-sm text-[#ddd] bg-[#333]">
          {dados.rodape}
        </p>
      )}
    </footer>
  );
}
