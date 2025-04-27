import Hero from "../components/Hero";
import BannerDelivery from "../components/BannerDelivery";
import Categorias from "../components/Categorias";
import Contato from "../components/Contato"; // 👈 importa o novo componente

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Conteúdo por cima */}
      <div className="relative z-10">
        <Hero />
        <BannerDelivery />
        <Categorias />
        <Contato /> {/* 👈 adiciona o novo componente de contato */}
      </div>

    </div>
  );
}
