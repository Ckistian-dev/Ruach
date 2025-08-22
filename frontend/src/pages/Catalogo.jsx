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
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Hooks para carregar dados (sem alterações)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoriaURL = params.get("categoria");
    if (categoriaURL && categorias.includes(categoriaURL)) {
      setCategoriaSelecionada(categoriaURL);
    }
  }, [location.search, categorias]);

  useEffect(() => {
    async function carregarProdutos() {
      const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
      const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
      const SHEET_NAME = "Produtos";
      const RANGE = "A:G";
      const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!${RANGE}?valueRenderOption=FORMULA&key=${API_KEY}`;
      try {
        const resposta = await fetch(URL);
        const data = await resposta.json();
        const values = data.values;
        if (!values || values.length <= 1) {
          setProdutos([]);
          throw new Error("Nenhum dado encontrado na planilha.");
        }
        const headers = values.shift();
        const produtosFormatados = values
          .map((row) => {
            const produto = {};
            headers.forEach((header, index) => {
              produto[header] = row[index] || "";
            });
            if (produto.Preço) {
              if (typeof produto.Preço === 'string') {
                const valorLimpo = produto.Preço.replace("R$", "").trim().replace(".", "").replace(",", ".");
                produto.Preço = parseFloat(valorLimpo) || 0;
              } else if (typeof produto.Preço !== 'number') {
                produto.Preço = 0;
              }
            } else {
              produto.Preço = 0;
            }
            if (produto.Imagem && produto.Imagem.startsWith('=IMAGE("')) {
              produto.Imagem = produto.Imagem.match(/"(.*?)"/)[1] || "";
            }
            return produto;
          })
          .filter(produto => produto.Status === 'Ativo');
        setProdutos(produtosFormatados);
        const categoriasValidas = produtosFormatados
          .map(produto => produto.Categoria?.trim())
          .filter(categoria => categoria && categoria !== "");
        const categoriasUnicas = Array.from(new Set(categoriasValidas));
        setCategorias(["Todos", ...categoriasUnicas]);
      } catch (error) {
        console.error('Erro ao buscar produtos da Google Sheet:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarProdutos();
  }, []);

  const produtosFiltrados = categoriaSelecionada === "Todos"
    ? produtos
    : produtos.filter(p => p.Categoria === categoriaSelecionada);

  return (
    <section className="min-h-screen px-4 md:px-24 py-16">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1a1a1a] mb-4">
          Descubra o <span className="text-red-600">Melhor</span> do Nosso <span className="text-red-600">Cardápio</span>!
        </h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Escolha entre nossos produtos deliciosos e receba com qualidade e rapidez!
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="md:w-1/4 space-y-6">
          {/* A AnimatePresence aqui não é mais necessária, pois a animação pesada foi removida */}
          <motion.div
            // 👇 MUDANÇA: Removido 'layout' e 'layoutTransition' que são pesados.
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="origin-top bg-[#561c1c] text-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Categorias</h3>
            <div className="flex flex-col gap-4">
              {categorias.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }} // Efeito de clique mais sutil
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }} // Hover mais rápido
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`w-full px-5 py-3 rounded-xl text-lg font-semibold transition-colors duration-200 ${categoriaSelecionada === cat
                    ? "bg-white text-[#561c1c] shadow-md scale-105"
                    : "hover:bg-red-700"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 py-20">
              {/* SVG de loading */}
              <svg className="animate-spin h-8 w-8 text-red-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <p className="text-lg font-medium">Carregando cardápio...</p>
            </div>
          ) : (
            // 👇 MUDANÇA: Envolvemos a grid em um único motion.div para uma animação mais leve
            <motion.div
              key={categoriaSelecionada} // Isso faz a animação rodar a cada troca de categoria
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {produtosFiltrados.map((produto) => (
                // 👇 MUDANÇA: Simplificamos a animação do card para apenas um efeito de hover
                <motion.div
                  key={produto.ID}
                  whileHover={{ y: -5, scale: 1.03 }} // Um hover sutil e leve
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative rounded-3xl overflow-hidden bg-white shadow-lg flex flex-col items-center text-center group cursor-pointer"
                  onClick={() => {
                    setProdutoSelecionado(produto);
                    setMostrarModal(true);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProdutoSelecionado(produto);
                      setMostrarModal(true);
                    }}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2 rounded-full transition-all duration-300 shadow-md z-10"
                  >
                    <Plus className="text-white w-5 h-5" />
                  </button>
                  <div className="w-32 h-32 md:w-40 md:h-40">
                    <img src={produto.Imagem} alt={produto.Nome} className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <div className="flex flex-col mb-2">
                    <span className="text-lg font-bold text-[#561c1c]">{produto.Nome}</span>
                    <h4 className="text-gray-700 text-base font-semibold">
                      R$ {produto.Preço?.toFixed(2).replace('.', ',')}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal permanece o mesmo */}
      {mostrarModal && (
        <ModalProduto
          produto={produtoSelecionado}
          onClose={() => setMostrarModal(false)}
          onAdicionar={() => setMostrarModal(false)}
        />
      )}
    </section>
  );
}