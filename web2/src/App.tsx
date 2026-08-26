//import { useState } from 'react'
import heroImg from './assets/hero.png'
import './assets/lanchonete.css';
import logoBanner from './assets/img/logo-banner.png';
 
function App() {
 // const [count, setCount] = useState(0)

  return (
    <>
   <div className="app-container">
      {/* Header / Navbar */}
      <header className="header">
        <div className="brand-container">
          <div className="brand-logo">🍔</div>
          <div>
            <h1 className="brand-title">Sabor da Casa</h1>
            <span className="brand-subtitle">BURGER & SNACKS</span>
          </div>
        </div>

        <nav className="nav-menu">
          <a href="#" className="nav-link active">Cardápio</a>
          <a href="#" className="nav-link">Nossa História</a>
          <a href="#" className="nav-link">Unidades</a>
          <a href="#" className="nav-link">Promoções</a>
        </nav>

        <button className="cart-header-btn">
          <span>🛒</span> 3 itens
        </button>
      </header>

      {/* Main Layout */}
      <main className="main-layout">
        {/* Coluna Esquerda: Conteúdo Principal */}
        <section className="content-section">
          
          {/* Banner Hero */}
          <div className="hero-banner">
            <img src={logoBanner} alt="Logo Banner" className="banner-image"></img>

            <button className="arrow-btn prev">‹</button>
            <button className="arrow-btn next">›</button>

            <div className="dots-container">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>

          {/* Filtros de Categoria */}
          <div className="category-filter">
            <h2 className="section-title">Explore nosso Cardápio</h2>
            
            <div className="categories-list">
              <button className="category-btn active">Todos</button>
              <button className="category-btn">Burgers</button>
              <button className="category-btn">Snacks</button>
              <button className="category-btn">Bebidas</button>
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image-placeholder" ></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Smash Duplo Cheddar</h3>
                  <p className="product-price">R$ 28,90</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-placeholder"></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Bacon Prime Burger</h3>
                  <p className="product-price">R$ 34,90</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-placeholder"></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Dogão Especial da Casa</h3>
                  <p className="product-price">R$ 21,50</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-placeholder"></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Batata Rústica Crocante</h3>
                  <p className="product-price">R$ 16,00</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-placeholder"></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Milkshake Nutella Raiz</h3>
                  <p className="product-price">R$ 19,90</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>

            <div className="product-card">
              <div className="product-image-placeholder"></div>
              <div className="product-details">
                <div>
                  <h3 className="product-name">Soda Italiana de Frutas Vermelhas</h3>
                  <p className="product-price">R$ 11,50</p>
                </div>
                <button className="add-button"><span>+</span> Adicionar</button>
              </div>
            </div>
          </div>
        </section>

        {/* Coluna Direita: Sidebar Carrinho */}
        <aside>
          <div className="cart-sidebar">
            <div className="cart-header">
              <div className="cart-header-title">
                <span style={{ fontSize: '18px' }}>🛍️</span>
                <h3>Seu Carrinho</h3>
              </div>
              <span className="cart-badge">3 itens</span>
            </div>

            {/* Lista de Itens estáticos */}
            <div className="cart-items-list">
              <div className="cart-item">
                <div className="cart-item-info">
                  <h4 className="cart-item-name">Smash Duplo Cheddar</h4>
                  <p className="cart-item-obs">Sem cebola, maionese extra</p>
                  <span className="cart-item-price">R$ 28,90</span>
                </div>
                <div className="quantity-controls">
                  <button className="quantity-btn">-</button>
                  <span>1</span>
                  <button className="quantity-btn">+</button>
                </div>
              </div>

              <div className="cart-item">
                <div className="cart-item-info">
                  <h4 className="cart-item-name">Monster Bacon Smash</h4>
                  <p className="cart-item-obs">Ponto bem passado</p>
                  <span className="cart-item-price">R$ 29,90</span>
                </div>
                <div className="quantity-controls">
                  <button className="quantity-btn">-</button>
                  <span>1</span>
                  <button className="quantity-btn">+</button>
                </div>
              </div>

              <div className="cart-item">
                <div className="cart-item-info">
                  <h4 className="cart-item-name">Soda Italiana Frutas Vermelhas</h4>
                  <p className="cart-item-obs">Com gelo e limão</p>
                  <span className="cart-item-price">R$ 11,50</span>
                </div>
                <div className="quantity-controls">
                  <button className="quantity-btn">-</button>
                  <span>1</span>
                  <button className="quantity-btn">+</button>
                </div>
              </div>
            </div>

            {/* Resumo de Valores */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>R$ 70,30</span>
              </div>
              <div className="summary-row">
                <span>Taxa de Entrega</span>
                <span>R$ 6,00</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span className="total-price">R$ 76,30</span>
              </div>
            </div>

            {/* Botão Finalizar */}
            <button className="checkout-btn">
              Finalizar Pedido ➔
            </button>

            <p className="delivery-estimate">
              Tempo estimado de entrega: 30 - 45 min
            </p>
          </div>
        </aside>
      </main>
    </div>
    </>
  )
}

export default App
