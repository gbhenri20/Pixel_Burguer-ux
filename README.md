# Pixel Burguer

Site da lanchonete **Pixel Burguer**: cardápio digital, carrinho e fluxo de pedido com visual inspirado em jogos e arcade. A aplicação fica na pasta `web2/`.

## Ferramentas utilizadas

- **React 19** — interface e componentes
- **TypeScript** — tipagem do código
- **Vite** — servidor de desenvolvimento e build
- **React Router** — navegação entre páginas
- **Tailwind CSS 4** — estilos e layout responsivo

## Como funciona o site

O visitante navega pelas páginas pelo menu superior (Início, Cardápio, Combos, Promoções, Sobre, Contato). No **cardápio**, escolhe produtos, vê detalhes no modal e adiciona itens ao **carrinho**. No carrinho, ajusta quantidades, pode aplicar cupom e segue para o **checkout** com endereço e forma de pagamento. Após confirmar, aparece a **confirmação do pedido** e é possível **acompanhar** o status. Há também **login/cadastro** e **perfil** (fluxo simulado, sem backend real).

O estado do carrinho e do usuário logado fica no navegador (`localStorage`), então os dados persistem entre recarregamentos na mesma máquina. Os produtos e preços vêm de dados estáticos em `web2/src/data/products.ts`.

Para rodar localmente: entre em `web2`, execute `npm install` e `npm run dev`, e abra no navegador o endereço **Local** que o Vite mostrar (por exemplo `http://localhost:5173/`).
