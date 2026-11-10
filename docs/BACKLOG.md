# Pixel Burguer — Product Backlog

**Produto:** site de pedidos da lanchonete Pixel Burguer  
**Fonte:** funcionalidades implementadas em `web2/` + gaps identificados no BPMN  
**Prioridade:** Must = essencial · Should = importante · Could = desejável · Won’t = fora do escopo agora  

---

## Como ler o backlog

| Campo | Significado |
|-------|-------------|
| **ID** | Identificador da história |
| **Épico** | Agrupamento de valor |
| **História** | Formato “Como… quero… para…” |
| **Prioridade** | Must / Should / Could |
| **Status** | Feito · Em progresso · Pendente |
| **Estimativa** | T-shirt (S / M / L / XL) — relativa |

---

## Épicos

| ID | Épico | Objetivo |
|----|--------|----------|
| E1 | Catálogo e descoberta | Exibir produtos, combos, promoções e home |
| E2 | Carrinho e cupons | Montar pedido antes do checkout |
| E3 | Checkout e pedido | Finalizar compra e confirmar |
| E4 | Acompanhamento | Ver status do pedido |
| E5 | Conta do cliente | Login, cadastro, perfil |
| E6 | Conteúdo institucional | Sobre e contato |
| E7 | Plataforma e DX | Build Vite, docs, qualidade |
| E8 | Backend e operação | API, pagamentos, cozinha (ainda não existe) |

---

## Backlog — o que já está feito (MVP front)

| ID | Épico | História | Prioridade | Status | Est. |
|----|--------|----------|------------|--------|------|
| US-01 | E1 | Como visitante, quero ver a home com destaque e CTAs para o cardápio, para entender a marca e começar o pedido | Must | Feito | M |
| US-02 | E1 | Como visitante, quero filtrar/ver produtos no cardápio, para escolher o que pedir | Must | Feito | L |
| US-03 | E1 | Como visitante, quero ver combos e promoções, para aproveitar ofertas | Must | Feito | M |
| US-04 | E1 | Como visitante, quero abrir o modal de um produto com ingredientes e quantidade, para decidir com confiança | Should | Feito | M |
| US-05 | E2 | Como cliente, quero adicionar itens ao carrinho e ver toast de confirmação, para saber que o item entrou | Must | Feito | S |
| US-06 | E2 | Como cliente, quero alterar quantidade ou remover itens, para ajustar o pedido | Must | Feito | S |
| US-07 | E2 | Como cliente, quero aplicar cupom (PIXEL10, GAMER20, LEVEL50), para obter desconto | Should | Feito | S |
| US-08 | E2 | Como cliente, quero que o carrinho persista no navegador, para não perder itens ao recarregar | Should | Feito | S |
| US-09 | E3 | Como cliente, quero um checkout em 4 etapas (identificação, entrega, pagamento, revisão), para finalizar com clareza | Must | Feito | L |
| US-10 | E3 | Como cliente, quero escolher delivery ou retirada, para adequar a entrega | Must | Feito | M |
| US-11 | E3 | Como cliente, quero escolher Pix, cartão ou dinheiro (seleção), para indicar a forma de pagamento | Should | Feito | S |
| US-12 | E3 | Como cliente, quero ver a confirmação com ID do pedido, para ter comprovante visual | Must | Feito | S |
| US-13 | E4 | Como cliente, quero acompanhar o status do pedido na tela de tracking, para saber a evolução | Should | Feito | M |
| US-14 | E5 | Como usuário, quero fazer login/cadastro mock e acessar o perfil, para personalizar a experiência | Should | Feito | M |
| US-15 | E5 | Como usuário logado, quero fazer logout, para encerrar a sessão local | Should | Feito | S |
| US-16 | E6 | Como visitante, quero ler a página Sobre e enviar mensagem em Contato (toast), para conhecer a marca e falar com a casa | Could | Feito | M |
| US-17 | E7 | Como desenvolvedor, quero rodar o projeto só com Vite (`npm run dev`), sem Figma Make, para desenvolver localmente | Must | Feito | M |
| US-18 | E7 | Como desenvolvedor, quero README e documento BPMN, para entender produto e processos | Should | Feito | S |

---

## Backlog — pendente (próximas entregas)

### E8 — Backend e operação (maior gap)

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-19 | E8 | Como sistema, quero uma API de produtos, para não depender só de dados estáticos no front | Must | Pendente | L | CRUD ou sync do cardápio |
| US-20 | E8 | Como cliente, quero autenticação real (JWT/sessão), para proteger conta e pedidos | Must | Pendente | XL | Substituir mock |
| US-21 | E8 | Como cliente, quero que o pedido seja gravado no servidor, para não perder ao fechar o navegador | Must | Pendente | L | Persistência `lastOrder` |
| US-22 | E8 | Como cliente, quero pagamento real (ex.: Pix/Stripe), para concluir a compra de verdade | Must | Pendente | XL | Integração gateway |
| US-23 | E8 | Como operação da lanchonete, quero painel de pedidos (recebido → preparando → …), para atualizar status real | Must | Pendente | XL | Pool BPMN “Cozinha” |
| US-24 | E8 | Como cliente, quero receber e-mail/SMS de confirmação, para ter comprovante fora do site | Should | Pendente | M | Notificações |
| US-25 | E8 | Como admin, quero gerenciar cupons e estoque, para controlar promoções | Should | Pendente | L | Backoffice |

### E2 / E3 — Pedido (melhorias no front)

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-26 | E2 | Como cliente, quero bloquear checkout se o carrinho estiver vazio ao acessar `/checkout` direto | Must | Pendente | S | Guard de rota |
| US-27 | E3 | Como cliente, quero validação de CEP (ViaCEP ou similar), para preencher endereço automaticamente | Should | Pendente | M | UX entrega |
| US-28 | E3 | Como cliente, quero salvar endereços no perfil e reutilizar no checkout | Should | Pendente | M | Depende de US-20 |
| US-29 | E2 | Como cliente, quero montar burger customizado (ingredientes extras), para personalizar o pedido | Could | Pendente | L | Fora do MVP atual |
| US-30 | E3 | Como cliente, quero taxa de entrega calculada por distância/bairro, para preço justo | Could | Pendente | L | Hoje é fixa |

### E4 — Acompanhamento

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-31 | E4 | Como cliente, quero acompanhar pedido por ID (mesmo sem sessão), para consultar depois | Should | Pendente | M | Busca por código |
| US-32 | E4 | Como cliente, quero atualização de status via WebSocket/polling no servidor, para status real | Must | Pendente | L | Depende de US-23 |

### E5 — Conta

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-33 | E5 | Como usuário, quero ver histórico real de pedidos no perfil, para repetir compras | Should | Pendente | M | Hoje é MOCK_ORDERS |
| US-34 | E5 | Como usuário, quero editar dados pessoais e senha, para manter conta atualizada | Should | Pendente | M | Depende de API |
| US-35 | E5 | Como usuário, quero “esqueci minha senha”, para recuperar acesso | Could | Pendente | M | E-mail |

### E6 — Contato e conteúdo

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-36 | E6 | Como visitante, quero que a mensagem de contato seja enviada de verdade (e-mail/ticket), para ser respondido | Should | Pendente | M | Substituir toast-only |
| US-37 | E6 | Como visitante, quero ver mapa/horários de funcionamento, para planejar retirada | Could | Pendente | S | Conteúdo |

### E7 — Qualidade e plataforma

| ID | Épico | História | Prioridade | Status | Est. | Notas |
|----|--------|----------|------------|--------|------|-------|
| US-38 | E7 | Como time, quero testes automatizados (unit + e2e do checkout), para regressão segura | Should | Pendente | L | Vitest / Playwright |
| US-39 | E7 | Como time, quero CI (build + lint) no GitHub, para validar PRs | Should | Pendente | M | Actions |
| US-40 | E7 | Como time, quero deploy em hosting estático (Vercel/Netlify), para demo pública | Should | Pendente | S | Após Vite OK |
| US-41 | E7 | Como acessibilidade, quero navegação por teclado e labels adequados em todo o fluxo de pedido | Should | Pendente | M | a11y |
| US-42 | E7 | Como cliente mobile, quero performance otimizada (imagens lazy, LCP), para carregar rápido | Could | Pendente | M | Perf |

---

## Won’t (agora)

| ID | Item | Motivo |
|----|------|--------|
| W-01 | App nativo iOS/Android | Escopo web SPA |
| W-02 | Programa de fidelidade / pontos | Não há backend nem regras definidas |
| W-03 | Chat ao vivo com atendimento | Fora do MVP acadêmico/comercial inicial |
| W-04 | Dependência Figma Make | Removida de propósito |

---

## Sugestão de sprints (ordem)

### Sprint 1 — Endurecer o MVP front
- US-26 (guard checkout)  
- US-41 (a11y básica no checkout)  
- US-38 (testes do fluxo pedido)  

### Sprint 2 — Fundação backend
- US-19 (API produtos)  
- US-20 (auth real)  
- US-21 (persistir pedidos)  

### Sprint 3 — Operação real
- US-23 (painel cozinha)  
- US-32 (status real)  
- US-22 (pagamento)  

### Sprint 4 — Polimento
- US-27, US-28, US-33, US-36, US-39, US-40  

---

## Critérios de pronto (Definition of Done)

Uma história só entra em **Feito** quando:

1. Comportamento conferido no fluxo BPMN correspondente  
2. Funciona em desktop e mobile (layout não quebra)  
3. Sem erros no console no caminho feliz  
4. (Se houver API) contrato e tratamento de erro documentados  
5. README ou este backlog atualizado se mudar o processo  

---

## Rastreio BPMN ↔ backlog

| Processo BPMN | Histórias relacionadas |
|---------------|------------------------|
| P1 Pedido | US-01 … US-12, US-26 … US-30 |
| P2 Acompanhamento | US-13, US-31, US-32 |
| P3 Autenticação | US-14, US-15, US-33 … US-35 |
| P4 Contato | US-16, US-36 |
| Plataforma | US-17, US-18, US-38 … US-42 |
| Operação futura | US-19 … US-25 |

Documento de processos: [`BPMN.md`](./BPMN.md).
