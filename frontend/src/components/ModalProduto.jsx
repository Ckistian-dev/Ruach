import { motion, AnimatePresence } from "framer-motion";
import { useCarrinho } from "../context/CarrinhoContext";

// Variantes para as animações do Framer Motion
const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "50px", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { y: "50px", opacity: 0 },
};


export default function ModalProduto({ produto, onClose }) {
  const { adicionarAoCarrinho } = useCarrinho();

  // O componente AnimatePresence precisa estar aqui para animar a SAÍDA do modal
  return (
    <AnimatePresence>
      {produto && ( // Só renderiza se houver um produto selecionado
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Permite fechar o modal clicando fora dele
        >
          <motion.div
            className="bg-white rounded-2xl p-8 w-3/4 max-w-md shadow-2xl relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl leading-none"
              aria-label="Fechar"
            >
              ×
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <img
                src={produto.Imagem}
                alt={produto.Nome}
                className="w-48 h-48 object-contain"
              />
              
              <h2 className="text-2xl font-bold text-[#561c1c]">{produto.Nome}</h2>
              
              {produto.Descrição && (
                <p className="text-base text-gray-600 leading-relaxed">
                  {produto.Descrição}
                </p>
              )}
              
              <p className="text-xl font-bold text-gray-800">
                R$ {produto.Preço?.toFixed(2).replace('.', ',')}
              </p>

              <button
                onClick={() => {
                  adicionarAoCarrinho(produto);
                  onClose();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full transition-colors duration-300 shadow-md"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}