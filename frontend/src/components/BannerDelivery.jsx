import { motion } from "framer-motion";

export default function BannerDelivery() {
  return (
    <motion.section
      className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-24 py-20 space-y-12 md:space-y-0 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Esquerda: Textos */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-start space-y-6"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Selo Delivery */}
        <motion.div
          className="flex items-center space-x-2 bg-[#561c1c] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <img src="https://cdn-icons-png.freepik.com/512/11948/11948049.png" alt="Ícone Delivery" className="h-8 w-8" />
          <span>Delivery em até 40min</span>
        </motion.div>

        {/* Título */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight text-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Delivery <span className="text-red-600">Rápido</span> e <span className="text-red-600">Delicioso</span>!
        </motion.h2>

        {/* Descrição */}
        <motion.p
          className="text-gray-600 text-lg md:text-xl text-left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Faça seu pedido agora e receba em tempo recorde, com a qualidade que nossos clientes aprovam!
        </motion.p>
      </motion.div>

      {/* Direita: Imagem */}
      <motion.div
        className="flex-1 flex justify-center relative"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <img
          src="https://i.ibb.co/nVdSpGN/imagem-2025-04-26-123715262.png"
          alt="Delivery Banner"
          className="w-80 md:w-[450px] object-contain drop-shadow-2xl"
        />

        {/* Card Avaliação sobreposto */}
        <motion.div
          className="absolute bottom-0 right-0 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3 translate-x-1/4 translate-y-1/4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex -space-x-2 overflow-hidden">
            <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="" className="h-8 w-8 rounded-full ring-2 ring-white" />
            <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="" className="h-8 w-8 rounded-full ring-2 ring-white" />
            <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" className="h-8 w-8 rounded-full ring-2 ring-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-800 text-sm font-bold">4.9 ⭐</span>
            <span className="text-gray-500 text-xs">+500 avaliações</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );

}
