import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { useSobre } from '../../hooks/useSobre';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/estoque', label: 'Estoque' },
  { to: '/consignado', label: 'Venda seu Carro' },
  { to: '/vendidos', label: 'Vendidos' },
];

export default function Footer() {
  const { dados } = useSobre();
  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';

  const sociais = [
    dados.whatsapp?.link && { href: dados.whatsapp.link, Icon: FaWhatsapp, label: 'WhatsApp' },
    dados.instagram?.link && { href: dados.instagram.link, Icon: FaInstagram, label: 'Instagram' },
    dados.facebook?.link && { href: dados.facebook.link, Icon: FaFacebook, label: 'Facebook' },
  ].filter(Boolean) as { href: string; Icon: React.ElementType; label: string }[];

  return (
    <footer className="bg-[#111] text-white">
      <div className="h-[3px] w-full" style={{ backgroundColor: 'var(--cor-primaria)' }} />

      <div className="max-w-[1200px] mx-auto px-[6vw] py-14 grid grid-cols-3 gap-10 max-lg:grid-cols-1 max-lg:gap-8">

        {/* Marca */}
        <div className="flex flex-col gap-5">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="max-h-[48px] max-w-[180px] object-contain" />
          ) : (
            <span className="font-black text-xl tracking-tight">{dados.empresa?.nomeEmpresa || ''}</span>
          )}
          <p className="text-white/40 text-sm leading-relaxed max-w-[260px]">
            {dados.rodape || 'Encontre o veículo dos seus sonhos com a nossa equipe especializada.'}
          </p>
          {sociais.length > 0 && (
            <div className="flex gap-2 mt-1">
              {sociais.map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/15 transition-colors text-white/60 hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Navegação */}
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[4px] text-white/30 mb-5">Navegação</p>
          <ul className="list-none p-0 flex flex-col gap-3">
            {nav.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/60 text-sm no-underline hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[4px] text-white/30 mb-5">Contato</p>
          <div className="flex flex-col gap-3 text-sm text-white/60">
            {dados.whatsapp?.numero && <p>{dados.whatsapp.numero}</p>}
            {dados.localizacao?.endereco && <p className="leading-relaxed">{dados.localizacao.endereco}</p>}
            {dados.localizacao?.horario && <p className="leading-relaxed">{dados.localizacao.horario}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-[6vw] py-5 flex items-center justify-between flex-wrap gap-3 max-lg:flex-col max-lg:text-center">
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} {dados.empresa?.nomeEmpresa || ''}. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-xs text-white/25">
          <Link to="/login" className="text-white/25 no-underline hover:text-white/60 transition-colors">ADM</Link>
          <span>·</span>
          <span>Desenvolvido por{' '}
            <a href="https://www.mthcode.com.br" target="_blank" rel="noreferrer"
              className="text-white/40 no-underline hover:text-white transition-colors font-semibold">
              MTHCODE
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
