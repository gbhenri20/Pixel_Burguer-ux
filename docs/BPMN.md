# Pixel Burguer — Documento BPMN e Processos

> **Versão visual (PDF):** abra [`BPMN.html`](./BPMN.html) e use **Ctrl+P → Salvar como PDF**,  
> ou execute [`gerar-bpmn-pdf.ps1`](./gerar-bpmn-pdf.ps1) para gerar `BPMN-Pixel-Burguer.pdf` automaticamente.

**Projeto:** Pixel Burguer (cardápio e pedidos online)  
**Escopo:** Aplicação front-end em `web2/` (React + Vite)  
**Data:** setembro/2026  

---

## 1. Visão geral

O Pixel Burguer é um site de lanchonete com tema gamer/arcade. O cliente navega pelo cardápio, monta o carrinho, finaliza o pedido em etapas e pode acompanhar o status (simulado). Login, cadastro e perfil existem de forma mockada (sem API real). Dados do carrinho e do usuário ficam no `localStorage` do navegador.

### Atores

| Ator | Papel |
|------|--------|
| **Cliente** | Navega, compra, autentica, envia contato, acompanha pedido |
| **Sistema (front-end)** | Valida formulários, persiste estado local, gera ID do pedido, simula status, exibe toasts |

### Processos principais

1. Navegação e consulta de cardápio  
2. Montagem do carrinho e aplicação de cupom  
3. Checkout e finalização do pedido  
4. Acompanhamento do pedido  
5. Autenticação e perfil  
6. Contato institucional  

---

## 2. Diagrama BPMN — visão completa

```mermaid
flowchart TB
  subgraph CLIENTE["Pool: Cliente"]
    direction TB

    Start((Início)) --> Nav{O que deseja fazer?}

    Nav -->|Explorar / comprar| Browse[Navegar Início / Cardápio / Combos / Promoções]
    Nav -->|Conta| AuthGate{Já tem conta?}
    Nav -->|Institucional| Info[Ver Sobre ou Contato]
    Nav -->|Ver pedido| TrackAsk{Há pedido ativo?}

    Browse --> Select[Selecionar produto]
    Select --> Detail{Ver detalhes?}
    Detail -->|Sim| Modal[Abrir modal do produto]
    Detail -->|Não| AddCart
    Modal --> Qty[Definir quantidade]
    Qty --> AddCart[Adicionar ao carrinho]
    AddCart --> ContShop{Continuar comprando?}
    ContShop -->|Sim| Browse
    ContShop -->|Não| OpenCart[Abrir carrinho]

    OpenCart --> CartEmpty{Carrinho vazio?}
    CartEmpty -->|Sim| Browse
    CartEmpty -->|Não| EditCart[Ajustar quantidades / remover itens]
    EditCart --> Coupon{Aplicar cupom?}
    Coupon -->|Sim| ValidateCoupon{Cupom válido?}
    ValidateCoupon -->|Não| ToastErr[Ver toast de erro]
    ToastErr --> EditCart
    ValidateCoupon -->|Sim| ApplyDisc[Aplicar desconto]
    Coupon -->|Não| CheckoutBtn
    ApplyDisc --> CheckoutBtn[Ir para checkout]

    CheckoutBtn --> Step1[Identificação]
    Step1 --> Step1Ok{Dados OK?}
    Step1Ok -->|Não| Step1
    Step1Ok -->|Sim| Step2[Entrega]
    Step2 --> DeliveryType{Delivery ou retirada?}
    DeliveryType -->|Retirada| Step3
    DeliveryType -->|Delivery| AddrOk{Endereço OK?}
    AddrOk -->|Não| Step2
    AddrOk -->|Sim| Step3[Pagamento]
    Step3 --> Step4[Revisão]
    Step4 --> Confirm[Confirmar pedido]
    Confirm --> EndOrder((Pedido finalizado))

    AuthGate -->|Sim| Login[Login]
    AuthGate -->|Não| Register[Cadastro]
    Login --> Logged[Perfil]
    Register --> Logged
    Logged --> ProfileAct{Ação?}
    ProfileAct -->|Continuar| Browse
    ProfileAct -->|Sair| Logout[Logout] --> Start

    Info --> ContactForm{Enviar mensagem?}
    ContactForm -->|Sim| SendMsg[Enviar formulário]
    ContactForm -->|Não| Start
    SendMsg --> Start

    TrackAsk -->|Não| Browse
    TrackAsk -->|Sim| TrackView[Acompanhar status]
    TrackView --> EndTrack((Fim))
  end

  subgraph SISTEMA["Pool: Sistema front-end"]
    S_Persist[(localStorage)]
    S_Toast[Toasts]
    S_Place[placeOrder]
    S_TrackSim[Simulação de status]
    S_Auth[Auth mock]
    S_Contact[Toast contato]
  end

  AddCart -.-> S_Persist
  ApplyDisc -.-> S_Persist
  AddCart -.-> S_Toast
  ToastErr -.-> S_Toast
  Confirm -.-> S_Place
  Login -.-> S_Auth
  Register -.-> S_Auth
  TrackView -.-> S_TrackSim
  SendMsg -.-> S_Contact
```

---

## 3. Processo detalhado — Pedido (P1)

### Objetivo

Permitir que o cliente escolha produtos, monte o carrinho e conclua um pedido com entrega ou retirada.

### Fluxo resumido

| Etapa | Atividade | Gateway / regra |
|-------|-----------|-----------------|
| 1 | Acessar Início, Cardápio, Combos ou Promoções | — |
| 2 | Selecionar produto (card ou modal) | Quantidade ≥ 1 no modal |
| 3 | Adicionar ao carrinho | Toast de sucesso; persiste em `localStorage` |
| 4 | Abrir carrinho | Se vazio → redireciona ao cardápio |
| 5 | Editar itens / cupom | Cupons: `PIXEL10`, `GAMER20`, `LEVEL50` |
| 6 | Checkout — Identificação | Nome, e-mail e telefone obrigatórios |
| 7 | Checkout — Entrega | Retirada **ou** endereço completo |
| 8 | Checkout — Pagamento | Pix, cartão ou dinheiro (somente seleção) |
| 9 | Checkout — Revisão e confirmação | `placeOrder` gera ID, limpa carrinho |
| 10 | Confirmação | Link para acompanhamento |

### Eventos de fim

- **Pedido finalizado** — tela `/confirmacao` com resumo  
- **Carrinho abandonado** — cliente sai sem checkout (não modelado como erro)

### Observações técnicas

- Não há gateway de pagamento real nem integração com cozinha.  
- Taxa de entrega fixa no front (`DELIVERY_FEE`).  
- Status do pedido após confirmação é simulado no cliente.

---

## 4. Processo — Acompanhamento (P2)

| Passo simulado | Label |
|----------------|--------|
| 0 | Pedido recebido |
| 1 | Preparando |
| 2 | Pronto |
| 3 | A caminho |
| 4 | Entregue |

O status avança a cada **8 segundos** no navegador. Se não houver `lastOrder` em memória, a tela informa que não há pedido ativo.

---

## 5. Processo — Autenticação (P3)

| Atividade | Comportamento atual |
|-----------|---------------------|
| Login | Aceita qualquer e-mail/senha preenchidos; grava usuário mock |
| Cadastro | Cria usuário local com nome, e-mail, telefone |
| Perfil | Abas: visão geral, pedidos (mock), endereços, config. |
| Logout | Remove usuário do `localStorage` e volta ao início |

**Gateway:** perfil exige usuário logado; caso contrário, CTA para login.

---

## 6. Processo — Contato (P4)

Cliente preenche formulário em `/contato` → sistema exibe toast de sucesso. **Não há envio real de e-mail ou ticket.**

---

## 7. Mapa de rotas (referência)

| Rota | Página | Processo |
|------|--------|----------|
| `/` | Home | P1 |
| `/cardapio` | Menu | P1 |
| `/combos` | Combos | P1 |
| `/promocoes` | Promoções | P1 |
| `/carrinho` | Carrinho | P1 |
| `/checkout` | Checkout | P1 |
| `/confirmacao` | Confirmação | P1 |
| `/acompanhar` | Tracking | P2 |
| `/login` | Login | P3 |
| `/cadastro` | Cadastro | P3 |
| `/perfil` | Perfil | P3 |
| `/sobre` | Sobre | Institucional |
| `/contato` | Contato | P4 |
| `*` | 404 | Exceção |

---

## 8. Diagrama BPMN — só o pedido (versão apresentação)

```mermaid
flowchart LR
  A((Início)) --> B[Escolher produtos]
  B --> C[Adicionar ao carrinho]
  C --> D{Carrinho OK?}
  D -->|Não| B
  D -->|Sim| E[Cupom opcional]
  E --> F[Checkout 4 etapas]
  F --> G{Dados válidos?}
  G -->|Não| F
  G -->|Sim| H[Confirmar pedido]
  H --> I[Confirmação]
  I --> J[Acompanhar status]
  J --> K((Fim))
```

---

## 9. Limitações do modelo atual

- Sem pool de “Cozinha / Operação” real — status é fake no front.  
- Sem gateway financeiro.  
- Auth sem validação de credenciais no servidor.  
- Pedidos do perfil são dados estáticos mock.  
- Contato sem persistência.

Essas limitações alimentam o backlog em `docs/BACKLOG.md`.
