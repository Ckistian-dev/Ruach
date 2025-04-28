import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Header from './components/Header';
import Footer from './components/Footer';
import Carrinho from "./pages/Carrinho";
import FinalizarPedido from "./pages/FinalizarPedido";
import PedidoConfirmado from "./pages/PedidoConfirmado";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ToastContainer configurado para seu estilo */}
        <ToastContainer
          position="top-left"   // 👈 canto superior direito
          autoClose={2000}        // fecha em 2 segundos
          closeOnClick
          pauseOnHover={false}  
          draggable={false}
          style={{
            width: "auto",
            minWidth: "unset",
          }}
        />
        {/* Fundo decorativo preenchendo tudo */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat bg-[url('https://i.ibb.co/S403bxSD/imagem-2025-04-26-230838496.png')] bg-cover opacity-5 brightness-50 pointer-events-none z-0"
        />

        {/* Conteúdo principal */}
        <div className="relative z-10">
          <Router>
            <ScrollToTop />
            <AnimatePresence mode="wait">
              {/* Header fixo */}
              <Header />

              {/* Conteúdo das rotas */}
              <main className="pt-24 min-h-[calc(100vh-80px)]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/produtos" element={<Catalogo />} />
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/finalizar-pedido" element={<FinalizarPedido />} />
                  <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/produtos" element={<AdminDashboard />} />
                </Routes>
              </main>

              {/* Footer */}
              <Footer />
            </AnimatePresence>
          </Router>
        </div>

      </div>
      );
}

      export default App;
