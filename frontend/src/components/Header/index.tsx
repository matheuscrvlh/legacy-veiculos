import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSobre } from '../../hooks/useSobre';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openMenu() { setMenuOpen(true); }
  function closeMenu() {
    closeTimerRef.current = setTimeout(() => setMenuOpen(false), 300);
  }

  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); }, []);

  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Topbar */}
      {dados.whatsapp?.numero && (
        <div className="hidden lg:flex items-center justify-end gap-6 px-[7vw] py-[6px] text-[0.72rem] font-medium text-[#232323]/70" style={{ backgroundColor: 'var(--cor-primaria)' }}>
          <span className="tracking-wide">📞 {dados.whatsapp.numero}</span>
          <div className="flex items-center gap-3">
            {dados.whatsapp?.link && (
              <a href={dados.whatsapp.link} target="_blank" rel="noreferrer" className="text-[#232323]/60 hover:text-[#232323] transition-colors">
                <FaWhatsapp size={15} />
              </a>
            )}
            {dados.instagram?.link && (
              <a href={dados.instagram.link} target="_blank" rel="noreferrer" className="text-[#232323]/60 hover:text-[#232323] transition-colors">
                <FaInstagram size={15} />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Navbar principal */}
      <div className="relative flex justify-between items-center h-[72px] bg-white border-b border-[#ebebeb] px-[6vw] max-lg:h-[56px] max-lg:px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="max-h-[48px] max-w-[200px] max-lg:max-h-[36px] max-lg:max-w-[140px] object-contain" />
          ) : (
            <span className="font-black text-xl tracking-tight text-[#232323]">{dados.empresa?.nomeEmpresa || ''}</span>
          )}
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-[36px]">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-[0.85rem] font-bold uppercase tracking-[1.5px] no-underline transition-colors duration-200 pb-[2px] ${active ? 'text-[#232323]' : 'text-[#888] hover:text-[#232323]'}`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-200 ${active ? 'w-full' : 'w-0'}`}
                  style={{ backgroundColor: 'var(--cor-primaria)' }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Ações desktop */}
        <div className="hidden lg:flex items-center gap-4">
          {dados.whatsapp?.link && (
            <a href={dados.whatsapp.link} target="_blank" rel="noreferrer">
              <button
                className="text-[0.78rem] font-bold uppercase tracking-[1.5px] px-5 py-2 text-white border-none cursor-pointer transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: 'var(--cor-primaria)' }}
              >
                Falar no WhatsApp
              </button>
            </a>
          )}
        </div>

        {/* Botão menu mobile */}
        <button className="lg:hidden flex items-center justify-center p-2 border-none bg-transparent cursor-pointer text-[#232323]" onClick={menuOpen ? closeMenu : openMenu}>
          {menuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        </button>
      </div>

      {/* Menu mobile */}
      <div className={`lg:hidden bg-[#181818] transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-6 py-4 gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={`py-3 text-[0.9rem] font-bold uppercase tracking-[2px] no-underline border-b border-white/5 ${active ? 'text-white' : 'text-white/50'}`}
                style={active ? { color: 'var(--cor-primaria)' } : {}}
              >
                {link.label}
              </Link>
            );
          })}
          {dados.whatsapp?.link && (
            <a href={dados.whatsapp.link} target="_blank" rel="noreferrer" className="mt-4 no-underline">
              <button className="w-full py-3 text-white font-bold uppercase tracking-[2px] text-sm border-none cursor-pointer" style={{ backgroundColor: 'var(--cor-primaria)' }}>
                Falar no WhatsApp
              </button>
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
