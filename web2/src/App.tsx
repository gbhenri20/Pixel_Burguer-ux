import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router";
import { AppProvider } from "./contexts/AppContext";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/Toast";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Combos from "./pages/Combos";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import Promotions from "./pages/Promotions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function Root() {
  return (
    <AppProvider>
      <div style={{ height: "100%", background: "#080812", position: "relative" }}>
        <Navbar />
        {/* Each page manages its own height as calc(100vh - 64px) */}
        <div style={{ paddingTop: 64, height: "100%" }}>
          <Outlet />
        </div>
        <ToastContainer />
      </div>
      <ScrollRestoration />
    </AppProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center text-center px-4" style={{ background: "#080812" }}>
      <div>
        <p className="font-pixel text-4xl neon-text-pink mb-4">404</p>
        <h1 className="font-display font-black text-3xl text-white mb-2">GAME OVER</h1>
        <p className="text-slate-500 text-sm mb-8">Página não encontrada. Esta rota não existe no mapa.</p>
        <a href="/" className="btn-primary text-sm py-3 px-8">🎮 Voltar ao início</a>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "cardapio", Component: Menu },
      { path: "combos", Component: Combos },
      { path: "promocoes", Component: Promotions },
      { path: "sobre", Component: About },
      { path: "contato", Component: Contact },
      { path: "carrinho", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "confirmacao", Component: OrderConfirmation },
      { path: "acompanhar", Component: OrderTracking },
      { path: "login", Component: Login },
      { path: "cadastro", Component: Register },
      { path: "perfil", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
