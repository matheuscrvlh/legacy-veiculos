import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/consignado" element={<Consignado />} />
        <Route path="/quem-somos" element={<SobreLoja />} />
        <Route path="/vendidos" element={<Vendidos />} />
        <Route path="/veiculo/:id" element={<DetalhesVeiculo />} />
        <Route path="/detalhes-vendido/:id" element={<DetalhesVendido />} />

        {/* Admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/veiculos" element={<AdminVeiculos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/admin/sobre" element={<AdminSobre />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}
