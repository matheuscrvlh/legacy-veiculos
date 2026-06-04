import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSobre } from '../../hooks/useSobre';
import iconVeiculo from '../../assets/icons/admin/modal/icon-veiculo.png';
import iconCliente from '../../assets/icons/admin/modal/icon-cliente.png';
import iconEmpresa from '../../assets/icons/admin/modal/icon-empresa.png';
import iconDashboard from '../../assets/icons/admin/modal/icon-dashboard.png';

export default function Admin() {
  const navigate = useNavigate();
  const { isLoggedIn, loading, logout } = useAuth();
  const { dados } = useSobre();

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate('/login');
  }, [isLoggedIn, loading]);

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  const logoSrc = dados.imagens?.logo ? `/uploads/logos/${dados.imagens.logo}` : '';

  const cards = [
    { title: 'Veículos', desc: 'Gerenciar estoque de veículos', href: '/admin/veiculos', icon: iconVeiculo },
    { title: 'Clientes', desc: 'Veículos enviados por clientes (consignado)', href: '/admin/clientes', icon: iconCliente },
    { title: 'Configurações', desc: 'Cores, imagens, contatos e informações da loja', href: '/admin/sobre', icon: iconEmpresa },
    { title: 'Usuários', desc: 'Gerenciar usuários do painel administrativo', href: '/admin/usuarios', icon: iconDashboard },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Top bar */}
      <div className="bg-[#232323] text-white flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-4">
          {logoSrc && <img src={logoSrc} alt="Logo" className="max-h-[40px]" />}
          <span className="text-lg font-bold">Painel Admin</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-white no-underline text-sm hover:text-[#00aaff]">← Ver site</Link>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-transparent border border-white text-white px-4 py-1 rounded cursor-pointer text-sm hover:bg-white hover:text-[#232323] transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto py-12 px-5">
        <h1 className="text-[1.8rem] font-bold text-[#333] mb-2">Bem-vindo ao Painel</h1>
        <p className="text-[#535353] mb-8">Gerencie seu conteúdo pelo menu abaixo.</p>

        <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {cards.map((card) => (
            <Link key={card.href} to={card.href} className="no-underline">
              <div className="bg-white rounded-[10px] shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <img src={card.icon} alt={card.title} className="w-10 h-10 mb-3 object-contain" />
                <h2 className="text-[1.2rem] font-bold text-[#333] mb-1">{card.title}</h2>
                <p className="text-sm text-[#535353]">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
