# Legacy Veículos - Nova Versão

## Stack
- **Frontend:** React + TypeScript + Tailwind CSS (Vite) — porta 5173
- **Backend:** Node.js + Express + SQLite nativo (node:sqlite) — porta 3001
- **Auth:** JWT (token salvo no localStorage)

## Como rodar

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Credenciais admin (padrão)
- Usuário: `vinicius`
- Senha: `062025`

## Rotas frontend
| Rota | Descrição |
|------|-----------|
| `/` | Home com ofertas |
| `/estoque` | Estoque completo com filtros |
| `/consignado` | Formulário venda consignado |
| `/quem-somos` | Sobre a loja |
| `/vendidos` | Veículos vendidos |
| `/veiculo/:id` | Detalhes do veículo |
| `/login` | Login admin |
| `/admin` | Dashboard admin |
| `/admin/veiculos` | Gerenciar veículos |
| `/admin/clientes` | Gerenciar consignados |
| `/admin/sobre` | Configurações da loja |

## Estrutura
```
backend/
  src/
    config/    → database.ts, env.ts
    routes/    → auth, veiculos, vendidos, clientes, sobre
    middlewares/ → JWT auth
    utils/     → upload de imagens
  data/        → banco SQLite + schema SQL
  uploads/     → imagens dos veículos e loja

frontend/
  src/
    api/       → chamadas HTTP
    hooks/     → useSobre, useAuth
    components/ → Header, Footer, VehicleCard, etc.
    pages/     → Home, Estoque, Consignado, etc.
    types/     → interfaces TypeScript
    lib/       → utilitários
```
