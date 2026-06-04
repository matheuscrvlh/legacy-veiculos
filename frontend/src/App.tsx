import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Estoque from './pages/Estoque';
import Consignado from './pages/Consignado';
import SobreLoja from './pages/SobreLoja';
import Vendidos from './pages/Vendidos';
import DetalhesVeiculo from './pages/DetalhesVeiculo';
import DetalhesVendido from './pages/DetalhesVendido';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminVeiculos from './pages/Admin/Veiculos';
import AdminClientes from './pages/Admin/Clientes';
import AdminSobre from './pages/Admin/Sobre';
import AdminUsuarios from './pages/Admin/Usuarios';

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
