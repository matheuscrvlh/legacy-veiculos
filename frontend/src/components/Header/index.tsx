import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSobre } from '../../hooks/useSobre';
import iconWhatsapp from '../../assets/icons/public/all/whatsappsemfundo.png';
import iconInstagram from '../../assets/icons/public/all/instagramsemfundo.png';
import iconMenu from '../../assets/icons/public/filtros/menuicon.png';
import iconMenuX from '../../assets/icons/public/filtros/menu-x-icon.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/estoque', label: 'Estoque' },
  { href: '/consignado', label: 'Consignado' },
];

export default function Header() {
  const { dados } = useSobre();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnimating, setMenuAnimating] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() {
    setMenuOpen(true);
    setMenuAnimating(false);
  }

  function closeMenu() {
    setMenuAnimating(true);
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      setMenuAnimating(false);
    }, 350);
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';

  return (
    <header className="w-full bg-white">
      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-center h-[85px] shadow-md bg-white max-lg:h-[50px]">
        {/* Logo */}
        <div className="flex items-center justify-center ml-[6vw] w-[280px] max-lg:ml-[7vw] max-lg:w-[130px]">
          <Link to="/" className="flex items-center">
            {logoSrc ? (
              <img src={logoSrc} alt="Logo da Loja" className="max-w-[280px] max-h-[75px] max-lg:max-w-[130px] max-lg:max-h-[45px]" />
            ) : (
              <span className="font-bold text-lg">{dados.empresa?.nomeEmpresa || ''}</span>
            )}
          </Link>
        </div>

        {/* Nav TG */}
        <div className="flex items-center gap-[80px] max-lg:gap-[50px]">
          <nav className="flex items-center lg:flex hidden">
            <div className="flex gap-[50px]">
              {navLinks.map((link) => (
                <p key={link.href} className="whitespace-nowrap">
                  <Link
                    to={link.href}
                    className={`font-bold no-underline text-base transition-colors duration-300 ${
                      location.pathname === link.href ? 'text-primaria' : 'text-[#535353] hover:text-primaria'
                    }`}
                  >
                    {link.label}
                  </Link>
                </p>
              ))}
            </div>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5 mr-[7vw] max-lg:mr-0 max-lg:gap-[10px]">
            {dados.whatsapp?.link && (
              <a href={dados.whatsapp.link} target="_blank" rel="noreferrer" className="flex items-center">
                <img src={iconWhatsapp} className="w-[35px] h-[35px] max-lg:w-[30px] max-lg:h-[30px] hover:p-[1px] cursor-pointer" alt="WhatsApp" />
              </a>
            )}
            {dados.instagram?.link && (
              <a href={dados.instagram.link} target="_blank" rel="noreferrer" className="flex items-center">
                <img src={iconInstagram} className="w-[35px] h-[35px] max-lg:w-[30px] max-lg:h-[30px] hover:p-[1px] cursor-pointer" alt="Instagram" />
              </a>
            )}
          </div>

          {/* Menu TP */}
          <div className="lg:hidden block relative mr-[3vw]">
            <div className="flex items-center p-[10px] rounded-[3px]">
              {!menuOpen ? (
                <img
                  src={iconMenu}
                  className="cursor-pointer w-5 h-5"
                  onClick={openMenu}
                  alt="Menu"
                />
              ) : (
                <img
                  src={iconMenuX}
                  className="cursor-pointer w-5 h-5"
                  onClick={closeMenu}
                  alt="Fechar"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {(menuOpen || menuAnimating) && (
        <div
          className={`lg:hidden absolute w-full bg-[#232323] z-[5] transition-transform duration-[400ms] cubic-bezier-menu ${
            menuAnimating ? '-translate-y-1/2' : 'translate-y-0'
          }`}
          style={{ top: '10px' }}
        >
          {navLinks.map((link) => (
            <p key={link.href} className="py-[10px]">
              <Link
                to={link.href}
                onClick={closeMenu}
                className={`ml-5 text-base font-bold no-underline ${
                  location.pathname === link.href ? 'text-primaria' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            </p>
          ))}
        </div>
      )}
    </header>
  );
}
