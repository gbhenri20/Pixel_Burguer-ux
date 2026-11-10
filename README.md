# Pixel Burguer

Site da lanchonete **Pixel Burguer**: cardápio, carrinho, cupons, pedidos e painel da operação. O frontend React fica em `web2/` e o backend local em `server/`.

Não há API externa, banco na nuvem nem gateway de pagamento. Tudo roda nesta máquina: Express grava os dados em um arquivo SQLite.

## O que o sistema faz

- O visitante vê o cardápio, monta o carrinho e aplica cupom.
- O checkout grava o pedido, baixa o estoque e registra a forma de pagamento escolhida (Pix, cartão ou dinheiro). O valor não é cobrado por nenhum serviço externo.
- A cozinha e o admin atualizam o status em `/admin`. A tela de acompanhamento lê esse status no servidor.
- Conta, endereços, mensagens de contato, produtos, cupons e usuários ficam no banco local.

## Como iniciar

É preciso ter **Node.js 20 ou mais recente**.

Na raiz do projeto:

```bash
npm run dev
```

Na primeira execução o comando instala as dependências que faltarem, cria `server/.env` se ele não existir, prepara o SQLite e sobe os dois processos:

| Processo | Endereço |
|----------|----------|
| API Express | http://localhost:3333 |
| Site Vite | http://localhost:5173 |

Abra **http://localhost:5173**. O Vite encaminha `/api` para o Express, então o navegador fala só com a origem do site.

Para instalar sem subir o sistema:

```bash
npm run setup
```

## Configuração

O arquivo `server/.env` (copie de `server/.env.example` se for criar à mão):

```env
DATABASE_URL="file:./dev.db"
PORT=3333
JWT_SECRET="um-segredo-só-desta-máquina"
```

O arquivo do banco fica em `server/prisma/dev.db`. Apagá-lo zera produtos, contas e pedidos; ao subir de novo, o seed recria o cardápio, os cupons e os usuários de demonstração. Alterações feitas pelo painel permanecem enquanto o arquivo existir. Itens novos acrescentados em `web2/src/data/products.ts` entram no banco na próxima subida, sem sobrescrever o que já foi editado.

## Contas de demonstração

| Papel | E-mail | Senha |
|-------|--------|-------|
| Administrador | admin@pixelburguer.com | admin123 |
| Cozinha | cozinha@pixelburguer.com | cozinha123 |
| Cliente | player@pixelburguer.com | player123 |

O administrador gerencia produtos, cupons, usuários e mensagens. A cozinha só avança e cancela pedidos. O cliente vê os próprios pedidos e endereços em `/perfil`. Visitante também pode pedir; o carrinho fica ligado a um identificador local até o login, quando os itens são unidos à conta.

## Regras de negócio

- Preço, desconto, taxa e estoque são calculados no servidor. O frontend não decide o total do pedido.
- Entrega custa R$ 5,99. Retirada no balcão não tem taxa.
- Cada item aceita no máximo 20 unidades e nunca acima do estoque.
- Cupons iniciais: `PIXEL10` (10%), `GAMER20` (20%, pedido mínimo de R$ 40) e `LEVEL50` (50%, mínimo de R$ 20, até 100 usos).
- O pedido nasce como recebido e segue preparando → pronto → a caminho → entregue. Retirada pula “a caminho”. Cancelar devolve estoque e o uso do cupom. Pedido entregue não cancela.
- A forma de pagamento é só o registro da escolha do cliente.

## Rotas locais

Todas ficam em `http://localhost:3333/api` e também em `http://localhost:5173/api` durante o desenvolvimento.

| Método | Rota | Quem acessa |
|--------|------|-------------|
| GET | `/health` | público |
| POST | `/auth/register`, `/auth/login` | público |
| GET, PATCH | `/auth/me` | autenticado |
| GET | `/products`, `/products/:id` | público (inativos só admin) |
| POST, PATCH, DELETE | `/products/:id` | admin |
| GET, POST, PATCH, DELETE | `/cart` e `/cart/items` | sessão ou conta |
| POST, DELETE | `/cart/coupon` | sessão ou conta |
| GET | `/coupons` | público (só ativos) |
| POST | `/coupons/validate` | sessão ou conta |
| GET | `/coupons/manage` | admin |
| POST, PATCH, DELETE | `/coupons` | admin |
| POST | `/orders` | sessão ou conta |
| GET | `/orders/mine` | autenticado |
| GET | `/orders/code/:code` | quem souber o código |
| GET | `/orders/manage` | admin ou cozinha |
| POST | `/orders/code/:code/advance` e `/cancel` | admin ou cozinha |
| GET, PATCH, DELETE | `/users` | admin |
| GET, POST, PATCH, DELETE | `/users/me/addresses` | autenticado |
| POST | `/messages` | público |
| GET | `/messages` | admin |

A sessão do navegador usa o cabeçalho `Authorization: Bearer <token>` e, para o carrinho de visitante, `X-Session-Id`.

## Ferramentas

- **React 19**, **TypeScript**, **Vite**, **React Router** e **Tailwind CSS 4** no frontend
- **Express**, **TypeScript**, **Prisma** e **SQLite** no backend
- **Zod** nas validações, **bcrypt** na senha e **JWT** na sessão local

Comandos úteis dentro de `server/`:

```bash
npm run db:setup
npm run typecheck
```
