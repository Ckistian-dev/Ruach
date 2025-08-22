import { memo, useMemo, useCallback } from 'react';
import { useCarrinho } from "../context/CarrinhoContext";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react"; // Importando ícone de lixeira
import { motion, AnimatePresence } from "framer-motion";

// ===================================================================
// COMPONENTE OTIMIZADO PARA O ITEM DO CARRINHO
// ===================================================================
const ItemCarrinho = memo(({ produto, onAdicionar, onRemover }) => {
    return (
        <motion.div
            // 👇 MUDANÇA: Removida a propriedade 'layout' que é pesada.
            key={produto.ID}
            className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300 gap-6 sm:gap-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Imagem e detalhes */}
            <div className="flex items-center gap-4 w-full">
                <img
                    // 👇 MUDANÇAS: Usando 'Imagem' e 'Nome'
                    src={produto.Imagem}
                    alt={produto.Nome}
                    className="w-24 h-24 object-contain rounded-2xl flex-shrink-0"
                />
                <div className="flex-grow">
                    <h2 className="text-lg font-bold text-[#561c1c]">{produto.Nome}</h2>
                    <p className="text-gray-500 mt-1">
                        {/* 👇 MUDANÇA: Usando 'Preço' */}
                        R$ {produto.Preço?.toFixed(2).replace('.', ',')}
                    </p>
                </div>
            </div>

            {/* Controle de Quantidade */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onRemover(produto)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
                    aria-label="Remover um item"
                >
                    <Minus size={18} className="text-[#561c1c]" />
                </button>
                <span className="text-lg font-bold w-8 text-center">{produto.quantidade}</span>
                <button
                    onClick={() => onAdicionar(produto)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
                    aria-label="Adicionar um item"
                >
                    <Plus size={18} className="text-[#561c1c]" />
                </button>
            </div>
        </motion.div>
    );
});


// ===================================================================
// COMPONENTE PRINCIPAL DA PÁGINA DO CARRINHO
// ===================================================================
export default function Carrinho() {
    const { carrinho, adicionarAoCarrinho, removerDoCarrinho, esvaziarCarrinho } = useCarrinho();

    const produtos = useMemo(() => {
        const produtosAgrupados = carrinho.reduce((acc, item) => {
            // 👇 MUDANÇA: Usando 'ID' como chave
            const key = item.ID;
            if (!acc[key]) {
                acc[key] = { ...item, quantidade: 0 };
            }
            acc[key].quantidade += 1;
            return acc;
        }, {});
        return Object.values(produtosAgrupados);
    }, [carrinho]);

    const total = useMemo(() => {
        // 👇 MUDANÇA: Usando 'Preço' para calcular o total
        return produtos.reduce((sum, item) => sum + item.Preço * item.quantidade, 0);
    }, [produtos]);

    const handleAdicionar = useCallback((produto) => {
        adicionarAoCarrinho(produto);
    }, [adicionarAoCarrinho]);

    const handleRemover = useCallback((produto) => {
        removerDoCarrinho(produto);
    }, [removerDoCarrinho]);

    return (
        <section className="min-h-screen pt-16 px-6 md:px-24 pb-16">
            {/* Título */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1a1a1a] mb-4">
                    Confira seu <span className="text-red-600">Carrinho</span> de Compras!
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Revise seus produtos antes de finalizar seu pedido.
                </p>
            </motion.div>

            {/* Conteúdo */}
            <AnimatePresence mode="wait">
                {produtos.length === 0 ? (
                    <motion.div
                        key="vazio"
                        className="text-center space-y-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <img
                            src="https://lagreepe.com.br/Content/projeto/img/cesta-vazia.png"
                            alt="Carrinho Vazio"
                            className="w-64 mx-auto opacity-80"
                        />
                        <h2 className="text-2xl font-semibold text-gray-700">Seu carrinho está vazio</h2>
                        <Link
                            to="/produtos"
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
                        >
                            Ver Cardápio
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="carrinho"
                        className="space-y-8 max-w-5xl mx-auto"
                        initial="initial"
                        animate="animate"
                        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                    >
                        {/* Lista de produtos */}
                        <div className="space-y-6">
                            <AnimatePresence>
                                {produtos.map((produto) => (
                                    <ItemCarrinho
                                        key={produto.ID}
                                        produto={produto}
                                        onAdicionar={handleAdicionar}
                                        onRemover={handleRemover}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Resumo Total */}
                        <motion.div
                            className="bg-white p-6 rounded-3xl shadow-xl space-y-6 mt-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex justify-between items-center">
                               <h3 className="text-2xl font-bold text-[#561c1c]">
                                   Resumo do Pedido
                               </h3>
                               <button onClick={esvaziarCarrinho} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
                                  <Trash2 size={16} />
                               </button>
                            </div>
                            
                            <div className="flex justify-between items-center text-xl font-semibold text-gray-700">
                                <span>Total</span>
                                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                            </div>

                            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
                                <Link
                                    to="/finalizar-pedido"
                                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition text-center shadow-md"
                                >
                                    Finalizar Pedido
                                </Link>
                                <Link
                                    to="/produtos"
                                    className="px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full transition text-center shadow-md"
                                >
                                    Continuar Comprando
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}