import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";

import ModalProduto from "../components/ModalProduto";

export default function Catalogo() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");


  const location = useLocation();

  // Capturar a categoria vinda pela URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaURL = params.get("categoria");

    if (categoriaURL && categorias.includes(categoriaURL)) {
      setCategoriaSelecionada(categoriaURL);
    }
  }, [location.search]);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/produtos`);
        const data = await resposta.json();
        setProdutos(data);

        const categoriasValidas = data
          .map(produto => produto.categoria?.trim())
          .filter(categoria => categoria && categoria !== "");

        const categoriasUnicas = Array.from(new Set(categoriasValidas));

        setCategorias(["Todos", ...categoriasUnicas]);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }

    carregarProdutos();
  }, []);


  const produtosFiltrados = categoriaSelecionada === "Todos"
    ? produtos
    : produtos.filter(p => p.categoria === categoriaSelecionada);


  return (
    <section className="min-h-screen px-6 md:px-24 py-16">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1a1a1a] mb-4">
          Descubra o <span className="text-red-600">Melhor</span> do Nosso <span className="text-red-600">Cardápio</span>!
        </h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Escolha entre nossos produtos deliciosos e receba com qualidade e rapidez!
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar Filtros */}
        <aside className="md:w-1/4 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              layout
              layoutTransition={{ duration: 0.5, ease: "easeInOut" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="origin-top bg-[#561c1c] text-white rounded-2xl p-6 shadow-xl transition-all duration-300"
            >

              <h3 className="text-2xl font-bold mb-6 text-center">Categorias</h3>

              {/* Botões */}
              <div className="flex flex-col gap-4">
                {categorias.map((cat, index) => (
                  <motion.button
                    initial={false} // 👈 agora o botão não tem animação pesada
                    animate={false}
                    whileTap={{ scale: 0.97 }} // 👈 só um pequeno toque quando clicar
                    whileHover={{ scale: 1.02 }} // 👈 levemente maior no hover
                    onClick={() => setCategoriaSelecionada(cat)}
                    className={`w-full px-5 py-3 rounded-xl text-lg font-semibold ${categoriaSelecionada === cat
                      ? "bg-white text-[#561c1c] shadow-md scale-105"
                      : "hover:bg-red-700 hover:text-white"
                      }`}
                  >
                    {cat}
                  </motion.button>
                ))}

              </div>
            </motion.div>
          </AnimatePresence>
        </aside>

        {/* Grid de Produtos */}
        <main className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {produtosFiltrados.map((produto, index) => (
            <motion.div
              key={produto.id}
              className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => {
                setProdutoSelecionado(produto);
                setMostrarModal(true);
              }}
            >

              {/* Botão adicionar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProdutoSelecionado(produto);
                  setMostrarModal(true);
                }}
                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-all duration-300 shadow-md"
              >
                <Plus className="text-white w-5 h-5" />
              </button>

              {/* Imagem do Produto */}
              <div className="w-32 h-32 md:w-40 md:h-40">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              {/* Informações */}
              <div className="flex flex-col mb-2">
                <span className="text-xl font-bold text-[#561c1c]">
                  R$ {produto.valor?.toFixed(2).replace('.', ',')}
                </span>
                <h4 className="text-gray-700 text-base font-semibold">{produto.nome}</h4>
              </div>

            </motion.div>
          ))}
        </main>

      </div>

      {/* Modal de Produto */}
      {mostrarModal && (
        <ModalProduto
          produto={produtoSelecionado}
          onClose={() => setMostrarModal(false)}
          onAdicionar={(produto) => {
            console.log("Produto adicionado:", produto);
            setMostrarModal(false);
          }}
        />
      )}
    </section>
  );
}
