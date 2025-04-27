import { Link } from "react-router-dom";
import { ShoppingCart, Utensils } from "lucide-react";
import { useCarrinho } from "../context/CarrinhoContext";

export default function Header() {
  const { carrinho } = useCarrinho();

  return (
    <header className="fixed w-full bg-gradient-to-r from-[#561c1c] via-[#6f2525] to-[#561c1c] shadow-2xl z-50 h-24 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <img
            src="https://i.ibb.co/YTbNvRZS/imagem-2025-04-26-222340940-removebg-preview.png"
            alt="Logo Ruach"
            className="h-20 w-auto object-contain drop-shadow-lg"
          />
        </Link>

        {/* Carrinho + Menu */}
        <div className="flex items-center gap-8">

          {/* Link para Cardápio com ícone */}
          <nav className="flex items-center gap-10 text-white font-semibold text-lg">
            <Link
              to="/produtos"
              className="flex items-center gap-2 hover:scale-110 transition-transform duration-300"
            >
              {/* Ícone de Cardápio real */}
              <Utensils className="w-8 h-8 text-white drop-shadow-md" />
              <span className="hidden md:inline">Cardápio</span>
            </Link>
          </nav>

          {/* Carrinho */}
          <div className="relative group">
            <Link to="/carrinho" className="relative flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white hover:scale-110 transition-transform duration-300" />
              {carrinho.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {carrinho.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );

}
