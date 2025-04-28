import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* HERO */}
      <motion.section
        className="flex flex-col items-center px-8 md:px-24 py-24 space-y-10 relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        {/* Selo destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-2 bg-[#561c1c] text-white text-sm font-semibold rounded-full px-5 py-2 uppercase tracking-wider shadow-lg animate-bounce"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Delivery" className="w-5 h-5" />
          O melhor delivery
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1a1a1a]"
        >
          Preço bom e <span className="text-red-600">Qualidade</span> na sua casa!
        </motion.h1>

        {/* Parágrafo */}
        <motion.p
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-gray-600 text-lg md:text-xl max-w-2xl"
        >
          Receba os melhores produtos com o melhor custo-benefício! Oferecemos <span className="font-semibold text-gray-800">entrega rápida</span>, <span className="font-semibold text-gray-800">qualidade garantida</span> e <span className="font-semibold text-gray-800">preços que cabem no seu bolso</span>. Faça seu pedido agora!
        </motion.p>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col md:flex-row items-center gap-6 mt-8"
        >
          <Link
            to="/produtos"
            className="px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition duration-300 text-lg shadow-lg"
          >
            Ver Cardápio
          </Link>
          <a
            href="https://wa.me/554591542767?text=Olá%2C%20gostaria%20de%20fazer%20um%20pedido!"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 bg-white border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition duration-300 text-lg shadow-lg"
          >
            Falar com a gente
          </a>

        </motion.div>
      </motion.section>
    </motion.div>
  );
}
