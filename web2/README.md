# Pixel Burguer (web2)

Interface React do projeto. O backend local fica em `../server`.

Na raiz do repositório, `npm run dev` sobe o site e a API juntos. Sozinho, este pacote continua abrindo o Vite:

```bash
npm install
npm run dev
```

As chamadas usam `/api`, que o Vite encaminha para `http://localhost:3333`. Sem o Express no ar, o cardápio estático ainda aparece, mas carrinho, login e pedidos não são gravados.
