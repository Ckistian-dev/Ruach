// src/pages/Carrinho.jsx (ou onde quer que seu arquivo esteja)

import { memo, useMemo, useCallback } from 'react';
import { useCarrinho } from "../context/CarrinhoContext";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ===================================================================
// 1. COMPONENTE INTERNO PARA O ITEM DO CARRINHO
//    (Não precisa ser exportado, pois só é usado aqui dentro)
// ===================================================================

const ItemCarrinho = memo(({ produto, onAdicionar, onRemover }) => {
    return (
        <motion.div
            layout // Anima a mudança de posição na lista
            key={produto.id}
            className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-3xl p-5 shadow-xl hover:shadow-2xl transition-all duration-300 gap-6 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Imagem e detalhes */}
            <div className="flex items-center gap-4 w-full">
                <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-24 h-24 object-scale-down rounded-2xl flex-shrink-0"
                />
                <div className="flex-grow">
                    <h2 className="text-lg font-bold text-[#561c1c]">{produto.nome}</h2>
                    <p className="text-gray-500 mt-1">
                        R$ {produto.valor?.toFixed(2).replace('.', ',')}
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
// 2. COMPONENTE PRINCIPAL DA PÁGINA DO CARRINHO (Exportação Padrão)
// ===================================================================

export default function Carrinho() {
    const { carrinho, adicionarAoCarrinho, removerDoCarrinho } = useCarrinho();

    const produtos = useMemo(() => {
        const produtosAgrupados = carrinho.reduce((acc, item) => {
            const key = item.id;
            if (!acc[key]) {
                acc[key] = { ...item, quantidade: 0 };
            }
            acc[key].quantidade += 1;
            return acc;
        }, {});
        return Object.values(produtosAgrupados);
    }, [carrinho]);

    const total = useMemo(() => {
        return produtos.reduce((sum, item) => sum + item.valor * item.quantidade, 0);
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
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1a1a1a] mb-4">
                    Confira seu <span className="text-red-600">Carrinho</span> de Compras!
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Revise seus produtos antes de finalizar seu pedido. Entrega rápida e qualidade garantida!
                </p>
            </motion.div>

            {/* Conteúdo */}
            <AnimatePresence mode="wait">
                {produtos.length === 0 ? (
                    <motion.div
                        key="vazio"
                        className="text-center space-y-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img
                            src="https://lagreepe.com.br/Content/projeto/img/cesta-vazia.png"
                            alt="Carrinho Vazio"
                            className="w-64 mx-auto opacity-80 mb-24"
                        />
                        <Link
                            to="/produtos"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
                        >
                            Ver Cardápio
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="carrinho"
                        className="space-y-8 max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Lista de produtos */}
                        <div className="space-y-6">
                            <AnimatePresence>
                                {produtos.map((produto) => (
                                    <ItemCarrinho
                                        key={produto.id}
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
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-[#561c1c] text-center mb-4">
                                Resumo do Pedido
                            </h3>
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
                                <span>Total</span>
                                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col md:flex-row justify-center gap-6 mt-6">
                                <Link
                                    to="/produtos"
                                    className="px-8 py-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full transition text-center shadow-md"
                                >
                                    Continuar Comprando
                                </Link>
                                <Link
                                    to="/finalizar-pedido"
                                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition text-center shadow-md"
                                >
                                    Finalizar Pedido
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}