import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/AdminLayout';
import iconVeiculo from '../../assets/icons/admin/modal/icon-veiculo.png';
import iconCliente from '../../assets/icons/admin/modal/icon-cliente.png';
import iconEmpresa from '../../assets/icons/admin/modal/icon-empresa.png';
import iconDashboard from '../../assets/icons/admin/modal/icon-dashboard.png';

const cards = [
  { title: 'Veículos', desc: 'Gerenciar estoque e veículos vendidos', href: '/admin/veiculos', icon: iconVeiculo, accent: '#3b82f6' },
  { title: 'Clientes', desc: 'Consignados enviados pelos clientes', href: '/admin/clientes', icon: iconCliente, accent: '#10b981' },
  { title: 'Configurações', desc: 'Cores, imagens, contatos e textos', href: '/admin/sobre', icon: iconEmpresa, accent: '#8b5cf6' },
  { title: 'Usuários', desc: 'Gerenciar acessos ao painel', href: '/admin/usuarios', icon: iconDashboard, accent: '#f59e0b' },
];

export default function Admin() {
  const navigate = useNavigate();
  const { isLoggedIn, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f0f0f2]">
      <div className="w-6 h-6 border-2 border-[#555] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <AdminLayout
      titulo="Painel Admin"
      maxWidth="960px"
      padding="py-10 px-5"
      actions={
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/50 hover:text-white/90 text-sm no-underline transition-colors">
            ← Ver site
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-white/50 hover:text-white/90 text-sm cursor-pointer bg-transparent border-none transition-colors"
          >
            Sair
          </button>
        </div>
      }
    >
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Bem-vindo ao Painel</h1>
        <p className="text-sm text-[#888] mt-1">Gerencie seu conteúdo pelo menu abaixo.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            to={card.href}
            className="no-underline group"
            data-aos="fade-up"
            data-aos-delay={i * 60}
          >
            <div className="bg-white rounded-xl border border-[#e8e8e8] shadow-sm p-5 hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 cursor-pointer h-full">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.accent}18` }}
                >
                  <img src={card.icon} alt="" className="w-5 h-5 object-contain" />
                </div>
                <svg
                  className="w-4 h-4 text-[#ccc] group-hover:text-[#999] group-hover:translate-x-0.5 transition-all duration-150 mt-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-[0.95rem] font-bold text-[#1a1a1a] mb-1">{card.title}</h2>
              <p className="text-sm text-[#888] leading-snug">{card.desc}</p>
              <div
                className="mt-4 h-[2px] rounded-full opacity-20"
                style={{ backgroundColor: card.accent }}
              />
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
