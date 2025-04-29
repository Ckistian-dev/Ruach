import Hero from "../components/Hero";
import BannerDelivery from "../components/BannerDelivery";
import Categorias from "../components/Categorias";
import Contato from "../components/Contato";
import { SiWhatsapp } from "react-icons/si"; // 👈 agora sim o ícone real do WhatsApp

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Conteúdo */}
      <div className="relative z-10">
        <Hero />
        <BannerDelivery />
        <Categorias />
        <Contato />
      </div>

      {/* Botão WhatsApp Fixo */}
      <a
        href="https://wa.me/55991010879?text=Olá%2C%20gostaria%20de%20fazer%20um%20pedido!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-10 right-8 z-50"
      >
        <div className="relative">
          {/* Círculo de pulsação */}
          <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping"></span>

          {/* Botão */}
          <div className="relative bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110">
            <SiWhatsapp className="w-7 h-7" />
          </div>
        </div>
      </a>

    </div>
  );
}
