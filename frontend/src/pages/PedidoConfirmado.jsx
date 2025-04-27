import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PedidoConfirmado() {

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: false, amount: 0.3 }}
        className="flex flex-col items-center space-y-6"
      >
        <CheckCircle size={96} className="text-green-500" />
        <h1 className="text-4xl font-extrabold text-[#561c1c]">Pedido Confirmado!</h1>
        <p className="text-gray-600 text-lg">Seu pedido foi enviado com sucesso pelo WhatsApp! Entraremos em contato em breve 🚀</p>

        <Link
          to="/"
          className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition"
        >
          Voltar para Início
        </Link>
      </motion.div>
    </section>
  );
}
