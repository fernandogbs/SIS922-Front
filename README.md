# Restaurant App - Front-End
## Funcionalidades

### Para Usuários
- **Login/Registro** - Autenticação simples com nome e telefone
- **Cardápio** - Navegação por categorias com busca
- **Carrinho** - Adicionar/remover produtos com observações
- **Pedidos** - Acompanhamento em tempo real do status dos pedidos
- **Atualização Automática** - Status dos pedidos atualizado automaticamente

### Para Administradores
- **Dashboard** - Estatísticas em tempo real (pedidos, receita, produtos)
- **Gestão de Pedidos** - Aceitar, recusar e concluir pedidos
- **Gestão de Produtos** - CRUD completo de produtos
- **Filtros** - Visualização por status de pedido
- **Métricas** - Acompanhamento de vendas e receita

## Tecnologias

- **Ionic React** - Framework UI mobile-first
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **SWR** - Data fetching e cache
- **React Router** - Roteamento
- **React Context** - Gerenciamento de estado de autenticação

## Instalação

```bash
# Navegue até a pasta do front-end
cd restaurant

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com a URL da API

# Inicie o servidor de desenvolvimento
npm run dev
```

## Configuração

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── LoadingSpinner   # Spinner de carregamento
│   ├── OrderCard        # Card de pedido
│   ├── ProductCard      # Card de produto
│   └── StatusBadge      # Badge de status
├── contexts/            # Contextos React
│   └── AuthContext      # Contexto de autenticação
├── hooks/              # Hooks customizados
│   ├── useCart         # Hook do carrinho
│   ├── useOrders       # Hook de pedidos
│   └── useProducts     # Hook de produtos
├── pages/              # Páginas da aplicação
│   ├── Login           # Tela de login
│   ├── Products        # Cardápio (usuário)
│   ├── Cart            # Carrinho
│   ├── Orders          # Pedidos do usuário
│   ├── AdminDashboard  # Dashboard admin
│   └── AdminProducts   # Gestão de produtos (admin)
├── services/           # Serviços de API
│   ├── api             # Configuração Axios
│   ├── authService     # Serviços de autenticação
│   ├── cartService     # Serviços do carrinho
│   ├── orderService    # Serviços de pedidos
│   └── productService  # Serviços de produtos
├── theme/              # Estilos e temas
│   └── variables.css   # Variáveis CSS customizadas
└── types/              # Definições TypeScript
    └── index.ts        # Interfaces e tipos
```

## Design

O design utiliza:
- **Cores quentes** - Paleta laranja/vermelho para representar comida
- **Cards elegantes** - Com sombras e bordas arredondadas
- **Responsivo** - Layout adaptável para mobile e desktop
- **Animações suaves** - Transições e hover effects
- **Ionic Components** - Componentes nativos e acessíveis

## Autenticação

### Fluxo de Login
1. Usuário insere nome e telefone
2. API verifica se usuário existe
3. Se não existe, cria novo usuário (tipo: default)
4. Retorna dados do usuário
5. Front-end armazena no localStorage e Context
6. Redireciona baseado no tipo (admin ou default)

### Rotas Protegidas
- **Públicas**: `/login`
- **Usuário**: `/products`, `/cart`, `/orders`
- **Admin**: `/admin/dashboard`, `/admin/products`

## Funcionalidades Principais

### Carrinho
- Adicionar produtos com quantidade
- Remover produtos individualmente
- Limpar carrinho
- Adicionar observações ao pedido
- Cálculo automático do total

### Pedidos
- Criação a partir do carrinho
- Atualização automática a cada 10 segundos
- Estados: Pendente, Aceito, Concluído, Recusado
- Histórico completo de pedidos

### Dashboard Admin
- Estatísticas em tempo real
- Pedidos pendentes destacados
- Filtros por status
- Ações rápidas (aceitar/recusar)
- Atualização automática a cada 5 segundos

### Gestão de Produtos (Admin)
- Criar novo produto
- Editar produto existente
- Excluir produto
- Upload de imagem (URL)
- Controle de disponibilidade
- Categorização

## Data Fetching com SWR

- **Revalidação automática** - Dados sempre atualizados
- **Cache inteligente** - Reduz chamadas à API
- **Otimistic Updates** - UI responsiva
- **Error Handling** - Tratamento de erros

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Como Usar

### Como Usuário
1. Acesse a aplicação
2. Faça login com nome e telefone
3. Navegue pelo cardápio
4. Adicione produtos ao carrinho
5. Finalize o pedido
6. Acompanhe o status em "Meus Pedidos"

### Como Administrador
1. Crie um usuário admin via API (`POST /api/auth/create-admin`)
2. Faça login com as credenciais admin
3. Acesse o Dashboard
4. Gerencie pedidos e produtos
5. Visualize estatísticas

## Licença

Este projeto é um MVP para demonstração.

---
