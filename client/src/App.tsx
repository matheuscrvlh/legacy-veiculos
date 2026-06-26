import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import Home from './pages/public/Home';
import Estoque from './pages/public/Estoque';
import Consignado from './pages/public/Consignado';
import SobreLoja from './pages/public/SobreLoja';
import Vendidos from './pages/public/Vendidos';
import DetalhesVeiculo from './pages/public/DetalhesVeiculo';
import DetalhesVendido from './pages/public/DetalhesVendido';
import Login from './pages/public/Login';
import Admin from './pages/admin';
import AdminVeiculos from './pages/admin/Veiculos';
import AdminClientes from './pages/admin/Clientes';
import AdminSobre from './pages/admin/Sobre';
import AdminUsuarios from './pages/admin/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Re-escaneia novos elementos com data-aos após a troca de rota
    const t = setTimeout(() => AOS.refresh(), 80);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div key={pathname} className="page-fade">
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/consignado" element={<Consignado />} />
        <Route path="/quem-somos" element={<SobreLoja />} />
        <Route path="/vendidos" element={<Vendidos />} />
        <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
        <Route path="/detalhes-vendido/:id" element={<DetalhesVendido />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin — protegido */}
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/veiculos" element={<ProtectedRoute><AdminVeiculos /></ProtectedRoute>} />
        <Route path="/admin/clientes" element={<ProtectedRoute><AdminClientes /></ProtectedRoute>} />
        <Route path="/admin/sobre" element={<ProtectedRoute><AdminSobre /></ProtectedRoute>} />
        <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsuarios /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
