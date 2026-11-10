# Pixel Burguer — Lean Canvas

**Produto:** plataforma web de cardápio e pedidos da lanchonete Pixel Burguer  
**Posicionamento:** pedido online com identidade gamer/arcade, experiência divertida sem parecer infantil  
**Data:** setembro/2026 · **Versão:** 1.0  

> Modelo adaptado de Ash Maurya (Lean Canvas). Preenchido com o estado atual do MVP front-end e a visão de evolução (API, pagamento, operação).

---

## Canvas (visão em grid)

| | | |
|:---|:---|:---|
| **1. Problema** | **4. Solução** | **3. Proposta única de valor** |
| Pedir delivery/retirada em lanchonete ainda é confuso ou genérico em muitos sites. | Site responsivo com cardápio, combos, promoções, carrinho e checkout em etapas. | “Seu próximo nível de sabor” — pedir burger com a vibe de um jogo: rápido, visual e memorável. |
| Falta de identidade forte; cardápios frios e pouco engajadores. | Fluxo de confirmação + acompanhamento de status (hoje simulado). | Diferencial: linguagem e UI pixel/arcade + jornada completa de pedido. |
| Cliente não sabe em que estágio está o pedido. | Conta mock (login/perfil) e cupons promocionais. | *High-level concept:* lanchonete real + cultura gamer. |
| | | |
| **2. Segmentos de clientes** | **9. Vantagem injusta** | **5. Canais** |
| **Primário:** jovens e adultos 16–35 que pedem delivery e curtem games/cultura pop. | Marca + UX proprietária (Pixel Burguer) difícil de copiar só com template genérico. | Site próprio (Vite/React) — canal digital principal. |
| **Secundário:** grupos de amigos, streamers amadores, “noite de jogo”. | Cardápio e tom de voz alinhados (MODO DEUS, Level Up, etc.). | Redes sociais / indicação (potencial). |
| **Early adopters:** comunidade gamer local + clientes da lanchonete física (quando houver). | (Futuro) dados de pedidos + operação integrada. | WhatsApp / mapa / busca local (futuro). |
| | | |
| **7. Estrutura de custos** | **8. Métricas-chave** | **6. Fontes de receita** |
| Hospedagem e domínio. | Taxa de conversão visita → pedido iniciado. | Venda de produtos (burgers, combos, drinks, sobremesas). |
| Manutenção do front (e futuro back). | Ticket médio e itens por pedido. | Taxa de entrega (quando delivery). |
| Marketing / promoções (cupons). | Uso de cupons; abandono de carrinho. | (Futuro) combos sazonais, parcerias. |
| Gateway de pagamento e SMS/e-mail (futuro). | Tempo até confirmação; pedidos concluídos/dia. | |

---

## Detalhamento dos blocos

### 1. Problema

1. Sites de lanchonete pouco atrativos e difíceis de usar no celular.  
2. Processo de pedido longo ou sem feedback claro (carrinho → pagamento → status).  
3. Pouca conexão emocional com a marca — o cliente não “lembra” da experiência.

**Alternativas atuais:** telefone/WhatsApp, iFood/Rappi, cardápio PDF, site institucional sem checkout.

### 2. Segmentos de clientes

| Segmento | Necessidade principal |
|----------|------------------------|
| Gamers / cultura pop | Experiência divertida + pedido rápido |
| Clientes delivery | Conveniência, preço, status do pedido |
| Retirada no balcão | Pedir antes e só buscar |
| Operação da loja *(futuro)* | Receber e atualizar pedidos |

### 3. Proposta única de valor (UVP)

**Pixel Burguer — peça online como quem sobe de nível.**

Cardápio digital com visual arcade, fluxo completo de pedido e acompanhamento, feito para quem quer sabor premium com personalidade gamer.

### 4. Solução (MVP atual × visão)

| Já existe (MVP front) | Próximo passo (Lean) |
|------------------------|----------------------|
| Home, cardápio, combos, promoções | API de produtos |
| Carrinho + cupons + `localStorage` | Pedidos no servidor |
| Checkout 4 etapas | Pagamento real |
| Confirmação + tracking simulado | Painel da cozinha |
| Login/perfil mock | Auth real + histórico |

### 5. Canais

1. **Direto:** `web2` em produção (Vercel/Netlify — backlog).  
2. **Descoberta:** Instagram, TikTok, indicação de amigos.  
3. **Retenção:** e-mail/SMS de status (backlog), cupons (`PIXEL10`, `GAMER20`, `LEVEL50`).

### 6. Fontes de receita

- Margem sobre itens do cardápio.  
- Taxa de entrega (hoje valor fixo no front).  
- Promoções estratégicas (desconto via cupom × volume).

*No MVP atual a receita é apenas modelada no front — não há cobrança real.*

### 7. Estrutura de custos

| Tipo | Itens |
|------|--------|
| Fixo / semi | Domínio, hosting, ferramentas de dev |
| Variável (futuro) | Taxa do gateway, envio de SMS, anúncios |
| Pessoas | Desenvolvimento, design, operação da loja |

### 8. Métricas-chave (norte)

| Métrica | Por que importa |
|---------|-----------------|
| Conversão cardápio → checkout | Saúde do funil |
| Abandono de carrinho | Fricção no pedido |
| Ticket médio | Receita por pedido |
| % pedidos com cupom | Eficácia de promo |
| Tempo até “pedido confirmado” | UX do checkout |

### 9. Vantagem injusta

- Identidade visual e copy exclusivas (difícil replicar só com tema genérico).  
- Jornada unificada (descoberta → pedido → tracking) no mesmo tom de voz.  
- *(Visão)* integração loja + dados de comportamento dos “players”.

---

## Hipóteses a validar

1. A estética gamer **aumenta** conversão vs. site “lanchonete tradicional”.  
2. Checkout em 4 etapas é mais claro do que um formulário único.  
3. Acompanhamento de status reduz ansiedade e suporte via WhatsApp.  
4. Cupons com nomes temáticos aumentam compartilhamento/recall.

---

## Relação com outros docs

| Documento | Uso |
|-----------|-----|
| [`BPMN.md`](./BPMN.md) / [`BPMN.html`](./BPMN.html) | Como o pedido funciona (processo) |
| [`BACKLOG.md`](./BACKLOG.md) | O que construir em seguida |
| [`EAP.md`](./EAP.md) | Como o trabalho do projeto está decomposto |
