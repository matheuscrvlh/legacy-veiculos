import { Link } from 'react-router-dom';
import { useSobre } from '../../hooks/useSobre';
import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: string;
  padding?: string;
}

export default function AdminLayout({ titulo, children, actions, maxWidth = '1200px', padding = 'py-8 px-5' }: Props) {
  const { dados } = useSobre();
  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';
  const isDashboard = titulo === 'Painel Admin';

  return (
    <div className="min-h-screen bg-[#f0f0f2]">
      {/* Topbar */}
      <div className="bg-[#1c1c1e] sticky top-0 z-40 border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 h-[54px] flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            {logoSrc && (
              <Link to="/admin" className="no-underline flex-shrink-0">
                <img src={logoSrc} alt="Logo" className="max-h-[26px] w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </Link>
            )}
            {logoSrc && <span className="text-white/15 text-sm">|</span>}
            <Link to="/admin" className="no-underline text-sm font-medium text-white/50 hover:text-white/80 transition-colors flex-shrink-0">
              Painel
            </Link>
            {!isDashboard && (
              <>
                <span className="text-white/20 text-xs">›</span>
                <span className="text-sm font-semibold text-white truncate">{titulo}</span>
              </>
            )}
          </div>

          {/* Ações */}
          {actions && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth }} className={`mx-auto ${padding}`}>
        {children}
      </div>
    </div>
  );
}
