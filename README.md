# Legacy Veículos

Sistema web para gestão e exibição de estoque de uma concessionária de veículos, com painel administrativo e área pública.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Client** | React 18 + TypeScript + Tailwind CSS (Vite) |
| **Server** | Node.js + Express + TypeScript + SQLite nativo (`node:sqlite`) |
| **Auth** | JWT — token salvo no `localStorage` |
| **Deploy** | Docker Compose com bind mounts |

---

## Como rodar localmente

### Server
```bash
cd backend
npm install
npm run dev        # porta 3000
```

### Client
```bash
cd frontend
npm install
npm run dev        # porta 5173 (proxy → 3000)
```

### Tudo junto (produção)
```bash
docker compose up -d --build
# client → :8081 | server → :3001
```

---

## Credenciais admin padrão
```
Usuário: vinicius
Senha:   062025
```

---

## Rotas do client

| Rota | Descrição |
|------|-----------|
| `/` | Home com destaques e ofertas |
| `/estoque` | Estoque completo com filtros |
| `/vendidos` | Veículos já vendidos |
| `/veiculo/:id` | Detalhes do veículo |
| `/detalhes-vendido/:id` | Detalhes do veículo vendido |
| `/consignado` | Formulário de venda consignada |
| `/quem-somos` | Sobre a loja |
| `/login` | Login admin |
| `/admin` | Dashboard admin |
| `/admin/veiculos` | Gerenciar veículos |
| `/admin/clientes` | Gerenciar consignados |
| `/admin/sobre` | Configurações da loja |

---

## Estrutura

```
backend/                   ← server
  src/
    config/                → database.ts, env.ts
    routes/                → auth, veiculos, vendidos, clientes, sobre
    middlewares/           → autenticação JWT
    utils/                 → upload de imagens
  data/                    → banco SQLite + schema SQL
  uploads/                 → imagens dos veículos e da loja

frontend/                  ← client
  src/
    api/                   → chamadas HTTP (axios)
    hooks/                 → useSobre, useAuth
    components/            → Header, Footer, VehicleCard, etc.
    pages/
      public/              → páginas públicas
      Admin/               → painel administrativo
    types/                 → interfaces TypeScript
    lib/                   → utilitários
```
